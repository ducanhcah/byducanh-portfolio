"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Copy, Facebook, Github, Mail, Menu, Moon, Pause, Play, Sun, X } from "lucide-react";

const email = "nguyenducanh132005@gmail.com";
const phone = "0983153216";
const youtubeOrigin = "https://www.youtube-nocookie.com";
const heroNameLines = ["Xin chào!", "tôi là,", "Nguyễn Đức Anh"];
const heroNameLength = heroNameLines.reduce((length, line) => length + line.length, 0);

function sendMusicCommand(iframe: HTMLIFrameElement | null, command: "unMute" | "playVideo" | "pauseVideo") {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), youtubeOrigin);
}

function MusicWidget({ isHeroActive }: { isHeroActive: boolean }) {
  const [musicOn, setMusicOn] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    try {
      const savedMusic = localStorage.getItem("bda-music");
      if (savedMusic !== null) setMusicOn(savedMusic === "on");
    } catch { /* Storage can be unavailable. */ }
  }, []);

  function toggleMusic() {
    const next = !musicOn; setMusicOn(next);
    try { localStorage.setItem("bda-music", next ? "on" : "off"); } catch { /* ignore */ }
    if (next) sendMusicCommand(iframeRef.current, "unMute");
    sendMusicCommand(iframeRef.current, next ? "playVideo" : "pauseVideo");
  }
  const playButton = (
    <button className="music-toggle" onClick={toggleMusic} aria-label={musicOn ? "Tạm dừng nhạc" : "Phát nhạc"} aria-pressed={musicOn}>
      {musicOn ? <Pause size={15}/> : <Play size={15}/>}
    </button>
  );

  return <>
    <iframe ref={iframeRef} className="music-frame" title="Color Your Night music player" src="https://www.youtube-nocookie.com/embed/j9Sn1nFGQQ8?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=j9Sn1nFGQQ8&playsinline=1&mute=0" allow="autoplay; encrypted-media" tabIndex={-1} onLoad={() => {
      if (musicOn) {
        sendMusicCommand(iframeRef.current, "unMute");
        sendMusicCommand(iframeRef.current, "playVideo");
      } else {
        sendMusicCommand(iframeRef.current, "pauseVideo");
      }
    }} />
    <aside className={`music-widget${isHeroActive ? " music-widget--hero" : ""}`} aria-label="Trình phát nhạc">
      <div className="album-cover" aria-hidden="true" />
      <div className="music-details">
        <span className="music-kicker">{musicOn ? "ĐANG PHÁT" : "ĐÃ TẠM DỪNG"}</span>
        <strong>Color Your Night</strong>
        <span className="music-artist">Azumi Takahashi, Lotus Juice</span>
      </div>
      <div className="music-controls">
        <span className={musicOn ? "equalizer playing" : "equalizer"} aria-label={musicOn ? "Đang phát" : "Đã tạm dừng"}><i/><i/><i/><i/></span>
        {playButton}
      </div>
    </aside>
    <div className="music-mobile-control">{playButton}</div>
  </>;
}

function CopyButton({ value, label = "Sao chép" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
    catch { window.prompt("Sao chép nội dung này:", value); }
  }
  return <button className="copy-button" onClick={copy} aria-label={`${label}: ${value}`}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? "Đã sao chép" : label}</button>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rulerTitle, setRulerTitle] = useState("byducanh.");
  const [typedNameLength, setTypedNameLength] = useState(0);
  const rulerTrackRef = useRef<HTMLDivElement>(null);
  const draggingRuler = useRef(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setLoading(false);
      return;
    }

    const start = performance.now(); let frame = 0;
    const tick = (now: number) => {
      const value = Math.min(100, Math.round(((now - start) / 620) * 100)); setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick); else window.setTimeout(() => setLoading(false), 180);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)").matches) {
      setTypedNameLength(heroNameLength);
      return;
    }

    let typingTimeout = 0;
    const typeName = () => {
      window.clearTimeout(typingTimeout);
      let length = 0;
      setTypedNameLength(0);
      const typeNextCharacter = () => {
        length += 1;
        setTypedNameLength(length);
        if (length < heroNameLength) typingTimeout = window.setTimeout(typeNextCharacter, 85);
      };
      typingTimeout = window.setTimeout(typeNextCharacter, 160);
    };

    typeName();
    const repeatTyping = window.setInterval(typeName, 15000);
    return () => {
      window.clearInterval(repeatTyping);
      window.clearTimeout(typingTimeout);
    };
  }, []);

  useEffect(() => {
    let raf = 0; let current = 1;
    let progressFrame = 0;
    const update = () => {
      const target = 1 + Math.min(Math.max(window.scrollY, 0), 300) / 300 * .16;
      current += (target - current) * .12;
      if (headerRef.current) headerRef.current.style.setProperty("--header-scale", current.toFixed(4));
      if (Math.abs(target - current) > .001) raf = requestAnimationFrame(update);
    };
    const updateRuler = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.round((window.scrollY / maxScroll) * 100) : 0);
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[data-ruler-title], main footer[data-ruler-title]"));
      const viewportCenter = window.innerHeight * .45;
      const active = sections.reduce<HTMLElement | null>((closest, section) => {
        if (!closest) return section;
        const sectionCenter = section.getBoundingClientRect().top + section.getBoundingClientRect().height / 2;
        const closestCenter = closest.getBoundingClientRect().top + closest.getBoundingClientRect().height / 2;
        return Math.abs(sectionCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter) ? section : closest;
      }, null);
      if (active?.dataset.rulerTitle) setRulerTitle(active.dataset.rulerTitle);
      progressFrame = 0;
    };
    const onScroll = () => {
      if (!window.matchMedia("(max-width: 760px)").matches) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(update);
      }
      if (!progressFrame) progressFrame = requestAnimationFrame(updateRuler);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); }), { threshold: .35 });
    sections.forEach((section) => observer.observe(section));
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .section-label"));
    revealNodes.forEach((node) => node.classList.add("reveal-ready"));
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); } }), { threshold: .1 });
    revealNodes.forEach((node) => revealObserver.observe(node));
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); cancelAnimationFrame(progressFrame); observer.disconnect(); revealObserver.disconnect(); };
  }, []);

  useEffect(() => {
    if (loading || window.matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)").matches) return;

    const groups = new Map<HTMLElement, Text[]>();
    const excludedSelector = ".name-title, .ruler-title, .music-widget, .pixel-field, .preloader, [aria-hidden='true'], [role='img']";
    const roots = document.querySelectorAll<HTMLElement>("#main-content, .site-header, .mobile-nav");

    roots.forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node as Text;
        const parent = text.parentElement;
        if (!parent || !text.data.trim() || !/[A-Za-zÀ-ỹ0-9]/.test(text.data) || parent.closest(excludedSelector)) continue;
        const group = groups.get(parent) ?? [];
        group.push(text);
        groups.set(parent, group);
      }
    });

    const intervals = new Set<number>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        const textNodes = groups.get(element);
        if (!textNodes) return;
        const original = textNodes.map((node) => node.data);
        let step = 0;
        const interval = window.setInterval(() => {
          step += 1;
          const progress = step / 8;
          textNodes.forEach((node, nodeIndex) => {
            if (!node.isConnected) return;
            const source = original[nodeIndex];
            const letterCount = Array.from(source).filter((character) => /[A-Za-zÀ-ỹ0-9]/.test(character)).length;
            let characterIndex = 0;
            node.data = Array.from(source, (character) => {
              if (!/[A-Za-zÀ-ỹ0-9]/.test(character)) return character;
              const currentIndex = characterIndex++;
              if (currentIndex / Math.max(1, letterCount) < progress || step >= 8) return character;
              const pool = character === character.toUpperCase() ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "abcdefghjkmnpqrstuvwxyz";
              return pool[Math.floor(Math.random() * pool.length)];
            }).join("");
          });
          if (step >= 8) {
            window.clearInterval(interval);
            intervals.delete(interval);
          }
        }, 42);
        intervals.add(interval);
        observer.unobserve(element);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -6% 0px" });

    groups.forEach((_textNodes, element) => observer.observe(element));
    return () => {
      observer.disconnect();
      intervals.forEach((interval) => window.clearInterval(interval));
    };
  }, [loading]);

  function toggleTheme() {
    const apply = () => { setLight((v) => !v); document.documentElement.classList.toggle("light-mode"); };
    if (window.matchMedia("(max-width: 760px)").matches || !document.startViewTransition) apply();
    else document.startViewTransition(apply);
  }
  function scrollFromRuler(clientY: number, behavior: ScrollBehavior) {
    const track = rulerTrackRef.current;
    if (!track) return;
    const { top, height } = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - top) / height));
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * ratio, behavior });
  }
  function handleRulerKeyDown(event: KeyboardEvent<HTMLElement>) {
    const pageStep = window.innerHeight * .2;
    let target: number | undefined;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") target = window.scrollY + pageStep;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") target = window.scrollY - pageStep;
    else if (event.key === "PageDown") target = window.scrollY + window.innerHeight;
    else if (event.key === "PageUp") target = window.scrollY - window.innerHeight;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = document.documentElement.scrollHeight;
    if (target === undefined) return;
    event.preventDefault();
    window.scrollTo({ top: target, behavior: window.matchMedia("(max-width: 760px)").matches ? "auto" : "smooth" });
  }
  const nav = [{ label: "Giới thiệu", href: "#about" }, { label: "Kỹ năng", href: "#skills" }, { label: "Dự án", href: "#projects" }, { label: "Liên hệ", href: "#contact" }];

  return <main id="top">
    {loading && <div className="preloader" aria-label="Đang tải trang"><div className="preloader-brand">byducanh<span>.</span></div><div className="loader-track"><span style={{ width: `${progress}%` }}/></div><div className="loader-bottom"><span>ĐANG TẢI TRẢI NGHIỆM</span><span>{String(progress).padStart(3, "0")}%</span></div></div>}
    <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
    <div className="pixel-field" aria-hidden="true">{Array.from({ length: 72 }, (_, index) => {
      const edge = index % 4;
      const offset = (Math.floor(index / 4) * 23 + index * 11) % 92 + 4;
      const depth = (index * 17) % 18 + 2;
      const position = edge === 0 ? { left: `${offset}%`, top: `${depth}%` } : edge === 1 ? { right: `${offset}%`, top: `${depth}%` } : edge === 2 ? { left: `${offset}%`, bottom: `${depth}%` } : { right: `${offset}%`, bottom: `${depth}%` };
      return <span key={index} style={{ ...position, animationDelay: `${(index * .37) % 5}s` }} />;
    })}</div>
    <aside
      className="scroll-ruler"
      aria-label={`Vị trí cuộn ${scrollProgress}%`}
      aria-controls="main-content"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={scrollProgress}
      aria-valuetext={`${scrollProgress}% — ${rulerTitle}`}
      role="scrollbar"
      tabIndex={0}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        draggingRuler.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        scrollFromRuler(event.clientY, "auto");
      }}
      onPointerMove={(event) => {
        if (draggingRuler.current) scrollFromRuler(event.clientY, "auto");
      }}
      onPointerUp={(event) => {
        draggingRuler.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => { draggingRuler.current = false; }}
      onLostPointerCapture={() => { draggingRuler.current = false; }}
      onKeyDown={handleRulerKeyDown}
    >
      <div className="ruler-track" ref={rulerTrackRef}>
        {Array.from({ length: 21 }, (_, index) => index * 5).map((mark) => <span className={`ruler-mark${mark % 10 === 0 ? " ruler-mark--major" : ""}`} key={mark} style={{ top: `${mark}%` }}><i/>{mark % 10 === 0 && String(mark).padStart(2, "0")}</span>)}
        <div className="ruler-indicator" style={{ top: `${Math.min(97, Math.max(3, scrollProgress))}%` }}><span key={rulerTitle} className="ruler-title">{Array.from(rulerTitle).map((character, index) => <span className={rulerTitle === "byducanh." && index === rulerTitle.length - 1 ? "ruler-title-char ruler-title-char--accent" : "ruler-title-char"} key={`${character}-${index}`} style={{ animationDelay: `${index * 24}ms` }}>{character === " " ? "\u00a0" : character}</span>)}</span><i/></div>
      </div>
    </aside>
    <header className="site-header" ref={headerRef}>
      <a className="wordmark" href="#top" translate="no" aria-label="byducanh, về đầu trang">byducanh<span>.</span></a>
      <nav className="desktop-nav" aria-label="Điều hướng chính">{nav.map((item) => <a key={item.href} className={activeSection === item.href.slice(1) ? "nav-active" : ""} href={item.href}>{item.label}</a>)}</nav>
      <div className="header-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label={light ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}>{light ? <Moon size={16}/> : <Sun size={16}/>}</button><a className="header-cta" href="#contact">Liên hệ <ArrowUpRight size={15}/></a><button className="menu-toggle" aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button></div>
    </header>
    {menuOpen && <nav className="mobile-nav" aria-label="Điều hướng di động">{nav.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={16}/></a>)}</nav>}

    <div id="main-content">
      <section className="hero section-wrap" id="hero" data-ruler-title="byducanh.">
        <div className="hero-topline"><span className="eyebrow"><span className="status-dot"/> ĐANG TÌM CƠ HỘI THỰC TẬP</span><span className="hero-location">ĐÀ NẴNG, VIỆT NAM <span>↗</span></span></div>
        <div className="hero-main reveal">
          <h1 className="name-title" aria-label="Xin chào! Tôi là, Nguyễn Đức Anh">{heroNameLines.map((line, lineIndex) => {
            const previousLength = heroNameLines.slice(0, lineIndex).reduce((length, previousLine) => length + previousLine.length, 0);
            const visibleLength = Math.max(0, Math.min(line.length, typedNameLength - previousLength));
            return <span className={`title-line${lineIndex === heroNameLines.length - 1 ? " title-line--name" : " title-line--intro"}`} key={line}>{line.slice(0, visibleLength)}{lineIndex === heroNameLines.length - 1 && <span className="typing-caret" aria-hidden="true"/>}</span>;
          })}</h1>
          <div className="hero-bottom"><p className="hero-kicker">SOFTWARE ENGINEERING<br/>INTERN / IT INTERN</p><a href="#about" className="round-link" aria-label="Cuộn tới phần giới thiệu"><ArrowDownRight size={24}/></a></div>
        </div>
        <div className="hero-footer"><span>KỸ THUẬT PHẦN MỀM</span><span className="footer-mark">/</span><span>ĐẠI HỌC DUY TÂN</span><span className="footer-mark">/</span><span>ĐÀ NẴNG, VIỆT NAM</span><span className="hero-footer-note">ĐANG HỌC HỎI.</span></div>
      </section>

      <section className="intro section-wrap" id="about" data-ruler-title="GIỚI THIỆU & HỌC VẤN">
        <div className="section-label"><span>01 / GIỚI THIỆU &amp; HỌC VẤN</span><span className="label-line"/></div>
        <div className="intro-content reveal"><h2>Sẵn sàng học hỏi.<br/><span className="muted-heading">Từng bước xây nền tảng.</span></h2><div className="intro-copy"><p>Sinh viên năm cuối ngành Kỹ thuật Phần mềm tại Đại học Duy Tân. Đã được học nền tảng về C# (.NET) và Web (Node.js, SQL).</p><p>Rất mong muốn tìm kiếm vị trí Thực tập sinh IT để được học hỏi thực tế, rèn luyện kỹ năng lập trình và tích lũy thêm kinh nghiệm làm việc.</p></div></div>
        <div className="principles"><div><span>01</span><strong>Chủ động học hỏi</strong></div><div><span>02</span><strong>Rèn luyện kỹ năng lập trình</strong></div><div><span>03</span><strong>Tích lũy kinh nghiệm thực tế</strong></div></div>
        <div className="education-panel reveal"><div className="education-date">2023 — 2026 <span>(HIỆN TẠI)</span></div><div><h2>Đại học Duy Tân</h2><p className="education-degree">Kỹ thuật Phần mềm <span>(Software Engineering)</span></p><p className="body-copy">Kiến thức đã học: Cấu trúc dữ liệu &amp; Giải thuật; Quy trình phát triển phần mềm (TSP, Agile/Scrum); Thiết kế Cơ sở dữ liệu.</p></div></div>
      </section>

      <section className="skills section-wrap" id="skills" data-ruler-title="KỸ NĂNG"><div className="section-label"><span>02 / KỸ NĂNG CHUYÊN MÔN</span><span className="label-line"/></div><div className="section-heading-row reveal"><h2>Nền tảng<br/><span className="serif-word accent-word">đang phát triển.</span></h2></div><div className="skills-grid"><article className="skill-card"><span className="skill-level">NỀN TẢNG</span><h3>Ngôn ngữ &amp; Framework</h3><div className="tag-list"><span>C#</span><span>.NET (WPF)</span><span>JavaScript</span><span>Node.js</span><span>HTML/CSS</span></div></article><article className="skill-card"><span className="skill-level">CƠ BẢN</span><h3>Cơ sở dữ liệu</h3><div className="tag-list"><span>SQL Server</span><span>PostgreSQL</span></div></article><article className="skill-card"><span className="skill-level">ĐÃ SỬ DỤNG</span><h3>Công cụ</h3><div className="tag-list"><span>Git</span><span>Visual Studio</span><span>VS Code</span></div></article><article className="skill-card"><span className="skill-level">KỸ NĂNG KHÁC</span><h3>Học hỏi &amp; thiết kế</h3><div className="tag-list"><span>Đọc hiểu tài liệu Tiếng Anh</span><span>Chủ động học công nghệ mới</span><span>UI/UX Design</span></div></article></div></section>

      <section className="projects section-wrap" id="projects" data-ruler-title="DỰ ÁN"><div className="section-label"><span>03 / DỰ ÁN</span><span className="label-line"/></div><div className="section-heading-row projects-heading reveal"><h2>PCSTORE<br/><span className="muted-heading">E-commerce Website.</span></h2><span className="project-date">08/2026 — 10/2026</span></div><article className="project-panel reveal"><div className="project-visual" aria-hidden="true"><div className="visual-frame"><span className="visual-brand">PC<span>STORE</span></span><div className="visual-line"/><div className="visual-chip">HARDWARE COMPATIBILITY</div><div className="visual-orbit orbit-a"/><div className="visual-orbit orbit-b"/></div></div><div className="project-info"><span className="project-type">NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ</span><h3>Nền tảng E-commerce bán linh kiện PC</h3><p>Xây dựng hệ thống website thương mại điện tử tích hợp thuật toán kiểm tra tương thích phần cứng và tư vấn cấu hình PC.</p><div className="project-detail"><span>CÔNG NGHỆ</span><p>Node.js, Express, React, Vite, PostgreSQL / SQL Server, npm.</p></div><div className="project-detail"><span>VAI TRÒ</span><p>Lập trình Frontend, xử lý cấu hình gói và kết nối API hệ thống.</p></div></div></article></section>

      <section className="statement section-wrap" id="statement" aria-label="Thông điệp"><p className="statement-main reveal">Và những hệ thống<br/><span className="muted-heading">mở rộng được.</span></p></section>

      <section className="contact section-wrap" id="contact" data-ruler-title="LIÊN HỆ"><div className="section-label"><span>04 / LIÊN HỆ</span><span className="label-line"/></div><div className="contact-main reveal"><div className="contact-heading"><p className="eyebrow">BẠN ĐANG CÓ Ý TƯỞNG?</p><h2>Cùng kết nối.<br/><span className="serif-word accent-word">Tạo giá trị.</span></h2></div><div className="contact-information"><div className="contact-details"><div className="contact-row"><span>EMAIL</span><strong>{email}</strong><CopyButton value={email}/></div><div className="contact-row"><span>ĐIỆN THOẠI</span><strong>{phone}</strong><CopyButton value={phone}/></div></div><a className="contact-button" href={`mailto:${email}`}><span>Gửi email trực tiếp</span><ArrowUpRight size={20}/></a></div></div></section>

      <footer className="site-footer section-wrap" id="footer" data-ruler-title="KẾT NỐI">
        <div className="footer-main">
          <h2>SOMETHING<br/><span>IN MIND?</span></h2>
          <nav className="footer-links" aria-label="Liên kết cá nhân">
            <span className="footer-links-label">KẾT NỐI VỚI TÔI</span>
            <a href="https://github.com/ducanhcah" target="_blank" rel="noopener noreferrer"><Github size={17}/> GitHub <ArrowUpRight size={15}/></a>
            <a href="https://www.facebook.com/duahn.22" target="_blank" rel="noopener noreferrer"><Facebook size={17}/> Facebook <ArrowUpRight size={15}/></a>
            <a href={`mailto:${email}`}><Mail size={17}/> {email} <ArrowUpRight size={15}/></a>
          </nav>
        </div>
        <div className="footer-bottom">
          <a className="wordmark" href="#top" translate="no">byducanh<span>.</span></a>
          <span className="copyright">© {new Date().getFullYear()} Nguyễn Đức Anh.</span>
          <a className="back-top" href="#top">VỀ ĐẦU TRANG ↑</a>
        </div>
      </footer>
    </div>
    <MusicWidget isHeroActive={activeSection === "hero"} />
  </main>;
}
