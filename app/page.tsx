"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Terminal,
  BrainCircuit,
  Code2,
  Globe2,
  Sparkles,
} from "lucide-react";

const projects = [
  {
    number: "01",
    name: "Project Atlas",
    type: "AI ENGINEERING",
    description:
      "An AI-powered knowledge workflow designed to turn scattered information into useful answers.",
    stack: ["Python", "LLM", "RAG"],
    href: "https://github.com/",
    mark: "A",
    tone: "violet",
  },
  {
    number: "02",
    name: "Cloud Native Lab",
    type: "DEVOPS / INFRASTRUCTURE",
    description:
      "A reproducible deployment workflow with containerized services, automated delivery, and observability.",
    stack: ["Docker", "CI/CD", "Linux"],
    href: "https://github.com/",
    mark: "⌘",
    tone: "green",
  },
  {
    number: "03",
    name: "Interface Studio",
    type: "FRONTEND ENGINEERING",
    description:
      "A responsive digital experience built around clarity, thoughtful details, and accessible interactions.",
    stack: ["Next.js", "TypeScript", "CSS"],
    href: "https://github.com/",
    mark: "↗",
    tone: "orange",
  },
];

const disciplines = [
  {
    icon: BrainCircuit,
    index: "01",
    title: "AI Engineering",
    description:
      "Building practical AI experiences with LLMs, retrieval workflows, and thoughtful product integration.",
    tags: ["LLMs", "RAG", "Python"],
  },
  {
    icon: Terminal,
    index: "02",
    title: "DevOps & Infrastructure",
    description:
      "Making software easier to ship, operate, monitor, and scale through reliable automation.",
    tags: ["Linux", "Docker", "CI/CD"],
  },
  {
    icon: Code2,
    index: "03",
    title: "Frontend Engineering",
    description:
      "Turning product ideas into fast, accessible interfaces with a strong eye for visual detail.",
    tags: ["React", "Next.js", "TypeScript"],
  },
];

const navItems = [
  ["About", "#about"],
  ["Expertise", "#expertise"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
];

function InteractionLayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".hero-main, .section-label, .intro-content, .discipline-card, .project-row, .approach-content, .contact-main"));
    nodes.forEach((node) => node.classList.add("reveal-ready"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); observer.unobserve(entry.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    nodes.forEach((node) => observer.observe(node));
    const onClick = (event: Event) => { if (sfxOn && (event.target as HTMLElement | null)?.closest("a, button")) playTone("click"); };
    const onPointerOver = (event: Event) => { if (sfxOn && (event.target as HTMLElement | null)?.closest("a, button, .discipline-card, .project-row")) playTone("hover"); };
    document.addEventListener("click", onClick); document.addEventListener("pointerover", onPointerOver);
    return () => { observer.disconnect(); document.removeEventListener("click", onClick); document.removeEventListener("pointerover", onPointerOver); };
  }, [sfxOn]);

  function playTone(kind: "hover" | "click") {
    try {
      const Ctx = window.AudioContext; if (!Ctx) return;
      const ctx = audioContextRef.current ?? new Ctx(); audioContextRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator(), gain = ctx.createGain(), now = ctx.currentTime;
      osc.type = "sine"; osc.frequency.setValueAtTime(kind === "click" ? 680 : 420, now);
      osc.frequency.exponentialRampToValueAtTime(kind === "click" ? 940 : 560, now + 0.045);
      gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(kind === "click" ? 0.035 : 0.012, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "click" ? 0.075 : 0.045));
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + 0.08);
    } catch { /* Audio is optional; the interface works without it. */ }
  }
  function toggleMusic() {
    const next = !musicOn; setMusicOn(next);
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: next ? "playVideo" : "pauseVideo", args: [] }), "*");
  }
  return <>
    <iframe ref={iframeRef} className="music-frame" title="Color Your Night background music" src="https://www.youtube-nocookie.com/embed/j9Sn1nFGQQ8?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=j9Sn1nFGQQ8&playsinline=1" allow="autoplay; encrypted-media" tabIndex={-1} />
    <div className="sound-controls" aria-label="Audio controls">
      <button className={musicOn ? "sound-control is-on" : "sound-control"} onClick={toggleMusic} aria-pressed={musicOn} title={musicOn ? "Pause background music" : "Play background music"}>
        <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>{musicOn ? "MUSIC ON" : "PLAY MUSIC"}
      </button>
      <button className={sfxOn ? "sound-control is-on" : "sound-control"} onClick={() => setSfxOn((value) => !value)} aria-pressed={sfxOn} title={sfxOn ? "Turn interface sounds off" : "Turn interface sounds on"}>
        <span aria-hidden="true">{sfxOn ? "♪" : "♫"}</span>SFX {sfxOn ? "ON" : "OFF"}
      </button>
    </div>
  </>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filters = ["ALL", "AI", "DEVOPS", "FRONTEND"];
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "AI") return project.type.includes("AI");
    if (activeFilter === "DEVOPS") return project.type.includes("DEVOPS");
    return project.type.includes("FRONTEND");
  });

  return (
    <main>
      <InteractionLayer />
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="byducanh home">
          byducanh<span>.</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a href={href} key={label}>
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#contact">
          Let&apos;s talk <ArrowUpRight size={15} strokeWidth={1.8} />
        </a>

        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([label, href]) => (
            <a href={href} key={label} onClick={() => setMenuOpen(false)}>
              {label} <ArrowUpRight size={16} />
            </a>
          ))}
        </nav>
      )}

      <section className="hero section-wrap" id="top">
        <div className="hero-topline">
          <span className="eyebrow"><span className="status-dot" /> AVAILABLE FOR SELECT PROJECTS</span>
          <span className="hero-location">BASED IN VIETNAM <span>↗</span></span>
        </div>

        <div className="hero-main">
          <p className="hero-kicker">SOFTWARE ENGINEER / DIGITAL BUILDER</p>
          <h1>
            I build things
            <br />
            that <span className="serif-word">work.</span>
            <br />
            And systems
            <br />
            that <span className="serif-word accent-word">scale.</span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-description">
              I&apos;m Đức Anh — exploring the intersection of AI, infrastructure,
              and thoughtful digital experiences.
            </p>
            <a href="#projects" className="round-link" aria-label="Explore selected projects">
              <ArrowDownRight size={23} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="hero-footer">
          <span>AI ENGINEERING</span>
          <span className="footer-cross">✳</span>
          <span>DEVOPS & INFRASTRUCTURE</span>
          <span className="footer-cross">✳</span>
          <span>FRONTEND</span>
          <span className="hero-footer-note">CURIOUS BY DEFAULT.</span>
        </div>
      </section>

      <section className="intro section-wrap" id="about">
        <div className="section-label">
          <span>01 / A LITTLE ABOUT ME</span>
          <span className="label-line" />
        </div>
        <div className="intro-content">
          <h2>
            Technical by nature.
            <br />
            <span className="muted-heading">Curious about everything.</span>
          </h2>
          <div className="intro-copy">
            <p>
              I enjoy working across the stack — from shaping interfaces people
              love to use, to building the systems that keep them running, to
              exploring how AI can make them more useful.
            </p>
            <p>
              My approach is simple: stay curious, sweat the details, and build
              things that solve real problems.
            </p>
            <a className="text-link" href="#expertise">
              More about my approach <ArrowRight size={16} />
            </a>
          </div>
        </div>
        <div className="principles">
          <div><span>01</span><strong>Clarity over complexity</strong></div>
          <div><span>02</span><strong>Systems over shortcuts</strong></div>
          <div><span>03</span><strong>Craft in every detail</strong></div>
        </div>
      </section>

      <section className="expertise section-wrap" id="expertise">
        <div className="section-label">
          <span>02 / WHAT I DO</span>
          <span className="label-line" />
        </div>
        <div className="section-heading-row">
          <h2>Areas of <span className="serif-word">focus.</span></h2>
          <p>Three disciplines. One goal: build better digital products.</p>
        </div>

        <div className="discipline-grid">
          {disciplines.map(({ icon: Icon, index, title, description, tags }) => (
            <article className="discipline-card" key={title}>
              <div className="discipline-card-top">
                <span className="card-index">{index}</span>
                <Icon size={22} strokeWidth={1.35} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="tag-list">
                {tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projects section-wrap" id="projects">
        <div className="section-label">
          <span>03 / SELECTED WORK</span>
          <span className="label-line" />
        </div>
        <div className="section-heading-row projects-heading">
          <h2>Things I&apos;ve <span className="serif-word">built.</span></h2>
          <span className="project-count">03 — SELECTED PROJECTS</span>
        </div>
        <div className="project-toolbar">
          <p>A selection of experiments, systems, and interfaces.</p>
          <div className="filter-list" aria-label="Filter projects">
            {filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "filter active" : "filter"}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="project-list">
          {filteredProjects.map((project) => (
            <article className="project-row" key={project.number}>
              <span className="project-number">{project.number}</span>
              <div className={`project-art ${project.tone}`} aria-hidden="true">
                <span>{project.mark}</span>
                <div className="art-orbit orbit-one" />
                <div className="art-orbit orbit-two" />
              </div>
              <div className="project-info">
                <span className="project-type">{project.type}</span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <a
                className="project-arrow"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.name}`}
              >
                <ArrowUpRight size={20} strokeWidth={1.5} />
              </a>
            </article>
          ))}
          {filteredProjects.length === 0 && (
            <p className="empty-state">No projects in this category yet.</p>
          )}
        </div>
        <p className="project-disclaimer">
          Project names and descriptions are starter placeholders. Replace them with your real work before publishing.
        </p>
      </section>

      <section className="approach section-wrap">
        <div className="section-label">
          <span>04 / HOW I THINK</span>
          <span className="label-line" />
        </div>
        <div className="approach-content">
          <div>
            <Sparkles size={23} strokeWidth={1.4} />
            <h2>Good work is invisible in all the right ways.</h2>
          </div>
          <p>
            The best engineering doesn&apos;t call attention to itself. It feels
            intuitive on the surface because the thinking underneath is
            deliberate — from architecture and reliability to the smallest
            interaction.
          </p>
        </div>
        <div className="approach-stats">
          <div><span>01</span><strong>Understand the problem</strong><p>Ask better questions before writing code.</p></div>
          <div><span>02</span><strong>Build with intention</strong><p>Choose the simplest solution that holds up.</p></div>
          <div><span>03</span><strong>Improve continuously</strong><p>Measure, learn, refine, repeat.</p></div>
        </div>
      </section>

      <section className="contact section-wrap" id="contact">
        <div className="section-label">
          <span>05 / YOUR TURN</span>
          <span className="label-line" />
        </div>
        <div className="contact-main">
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2>
            Let&apos;s make
            <br />
            something <span className="serif-word accent-word">meaningful.</span>
          </h2>
          <a className="contact-button" href="mailto:hello@byducanh.id.vn">
            <span>hello@byducanh.id.vn</span>
            <ArrowUpRight size={20} />
          </a>
        </div>
        <div className="contact-note">
          <Globe2 size={16} strokeWidth={1.5} />
          <span>Open to interesting problems, collaborations, and good conversations.</span>
        </div>
      </section>

      <footer className="site-footer section-wrap">
        <a className="wordmark" href="#top">byducanh<span>.</span></a>
        <span className="copyright">© {new Date().getFullYear()} Đức Anh. Built with intention.</span>
        <div className="social-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
          <a href="mailto:hello@byducanh.id.vn" aria-label="Email"><Mail size={17} /></a>
        </div>
        <a className="back-top" href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
