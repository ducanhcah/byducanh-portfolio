"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Copy, Facebook, Github, Mail, Menu, Moon, Sun, X } from "lucide-react";

const email = "nguyenducanh132005@gmail.com";
const phone = "0983153216";

function AudioAndEffects() {
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const lastHoverRef = useRef(0);

  useEffect(() => {
    try {
      const savedSfx = localStorage.getItem("bda-sfx");
      const savedMusic = localStorage.getItem("bda-music");
      if (savedSfx !== null) setSfxOn(savedSfx === "on");
      if (savedMusic !== null) setMusicOn(savedMusic === "on");
    } catch { /* storage can be unavailable */ }
  }, []);

  function tone(kind: "tick" | "click" | "pop" | "off" | "whoosh" | "impact" | "chime", note = 0) {
    if (!sfxOn) return;
    try {
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return;
      const ctx = ctxRef.current ?? new AudioCtx(); ctxRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator(); const gain = ctx.createGain(); const now = ctx.currentTime;
      const base: Record<string, number> = { tick: 760, click: 480, pop: 620, off: 260, whoosh: 330, impact: 190, chime: 880 };
      const frequency = base[kind] * (note ? Math.pow(2, note / 12) : 1);
      osc.type = kind === "whoosh" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(90, frequency * (kind === "off" ? .72 : 1.22)), now + (kind === "whoosh" ? .13 : .055));
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(kind === "impact" ? .028 : .014, now + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + (kind === "whoosh" ? .15 : .09));
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + .16);
    } catch { /* Sound is progressive enhancement. */ }
  }

  useEffect(() => {
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const hit = target?.closest("a, button, .skill-card, .project-panel, .title-char");
      if (!hit) return;
      const now = performance.now(); if (now - lastHoverRef.current < 55) return;
      lastHoverRef.current = now;
      if (target?.closest(".title-char")) { const chars = Array.from(document.querySelectorAll(".title-char")); tone("tick", chars.indexOf(target.closest(".title-char") as HTMLElement) % 5 * 2); } else tone("tick");
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("a")) tone("whoosh"); else if (target?.closest("button")) tone("click");
    };
    const onScroll = () => {
      document.querySelectorAll<HTMLElement>(".section-label").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top > 0 && rect.top < 28 && !el.dataset.impact) { el.dataset.impact = "1"; tone("impact"); }
        if (rect.top > 80 || rect.bottom < 0) delete el.dataset.impact;
      });
    };
    document.addEventListener("pointerover", onPointerOver); document.addEventListener("click", onClick); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { document.removeEventListener("pointerover", onPointerOver); document.removeEventListener("click", onClick); window.removeEventListener("scroll", onScroll); };
  }, [sfxOn]);

  function toggleSfx() {
    const next = !sfxOn; setSfxOn(next);
    try { localStorage.setItem("bda-sfx", next ? "on" : "off"); } catch { /* ignore */ }
    if (next) tone("pop");
  }
  function toggleMusic() {
    const next = !musicOn; setMusicOn(next);
    try { localStorage.setItem("bda-music", next ? "on" : "off"); } catch { /* ignore */ }
    if (next) iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "unMute", args: [] }), "*");
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: next ? "playVideo" : "pauseVideo", args: [] }), "*");
    tone(next ? "pop" : "off");
  }
  return <>
    <iframe ref={iframeRef} className="music-frame" title="Color Your Night music player" src="https://www.youtube-nocookie.com/embed/j9Sn1nFGQQ8?enablejsapi=1&autoplay=1&controls=0&loop=1&playlist=j9Sn1nFGQQ8&playsinline=1&mute=1" allow="autoplay; encrypted-media" tabIndex={-1} />
    <aside className="audio-dock" aria-label="Điều khiển âm thanh">
      <button className="dock-button" onClick={toggleMusic} aria-pressed={musicOn}><span className={musicOn ? "equalizer playing" : "equalizer"} aria-hidden="true"><i/><i/><i/></span>{musicOn ? "PHÁT NHẠC" : "NHẠC TẮT"}</button>
      <button className="dock-button" onClick={toggleSfx} aria-pressed={sfxOn}><span className="tiny-dot"/>{sfxOn ? "SFX BẬT" : "SFX TẮT"}</button>
    </aside>
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
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const start = performance.now(); let frame = 0;
    const tick = (now: number) => {
      const value = Math.min(100, Math.round(((now - start) / 620) * 100)); setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick); else window.setTimeout(() => setLoading(false), 180);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let raf = 0; let current = 1;
    const update = () => {
      const target = 1 + Math.min(Math.max(window.scrollY, 0), 300) / 300 * .16;
      current += (target - current) * .12;
      if (headerRef.current) headerRef.current.style.setProperty("--header-scale", current.toFixed(4));
      if (Math.abs(target - current) > .001) raf = requestAnimationFrame(update);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); }), { threshold: .35 });
    sections.forEach((section) => observer.observe(section));
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .section-label"));
    revealNodes.forEach((node) => node.classList.add("reveal-ready"));
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); } }), { threshold: .1 });
    revealNodes.forEach((node) => revealObserver.observe(node));
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); observer.disconnect(); revealObserver.disconnect(); };
  }, []);

  function toggleTheme() {
    const apply = () => { setLight((v) => !v); document.documentElement.classList.toggle("light-mode"); };
    if (document.startViewTransition) document.startViewTransition(apply); else apply();
  }
  const nav = [{ label: "Giới thiệu", href: "#about" }, { label: "Kỹ năng", href: "#skills" }, { label: "Dự án", href: "#projects" }, { label: "Liên hệ", href: "#contact" }];

  return <main id="top">
    {loading && <div className="preloader" aria-label="Đang tải trang"><div className="preloader-brand">byducanh<span>.</span></div><div className="loader-track"><span style={{ width: `${progress}%` }}/></div><div className="loader-bottom"><span>ĐANG TẢI TRẢI NGHIỆM</span><span>{String(progress).padStart(3, "0")}%</span></div></div>}
    <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
    <div className="pixel-field" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div>
    <header className="site-header" ref={headerRef}>
      <a className="wordmark" href="#top" translate="no" aria-label="byducanh, về đầu trang">byducanh<span>.</span></a>
      <nav className="desktop-nav" aria-label="Điều hướng chính">{nav.map((item) => <a key={item.href} className={activeSection === item.href.slice(1) ? "nav-active" : ""} href={item.href}>{item.label}</a>)}</nav>
      <div className="header-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label={light ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}>{light ? <Moon size={16}/> : <Sun size={16}/>}</button><a className="header-cta" href="#contact">Liên hệ <ArrowUpRight size={15}/></a><button className="menu-toggle" aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button></div>
    </header>
    {menuOpen && <nav className="mobile-nav" aria-label="Điều hướng di động">{nav.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={16}/></a>)}</nav>}

    <div id="main-content">
      <section className="hero section-wrap" id="hero">
        <div className="hero-topline"><span className="eyebrow"><span className="status-dot"/> ĐANG TÌM CƠ HỘI THỰC TẬP</span><span className="hero-location">ĐÀ NẴNG, VIỆT NAM <span>↗</span></span></div>
        <div className="hero-main reveal">
          <p className="hero-kicker">SOFTWARE ENGINEERING INTERN / IT INTERN</p>
          <h1 className="name-title" aria-label="Nguyễn Đức Anh"><span className="title-char">Nguyễn</span> <span className="title-char">Đức</span><br/><span className="title-char">Anh</span><span className="accent-period">.</span></h1>
          <div className="hero-bottom"><p className="hero-description">Sinh viên năm cuối ngành Kỹ thuật Phần mềm tại Đại học Duy Tân. Đã học nền tảng về C# (.NET) và Web (Node.js, SQL); mong muốn học hỏi thực tế và tích lũy kinh nghiệm làm việc.</p><a href="#about" className="round-link" aria-label="Cuộn tới phần giới thiệu"><ArrowDownRight size={24}/></a></div>
        </div>
        <div className="hero-footer"><span>KỸ THUẬT PHẦN MỀM</span><span className="footer-mark">/</span><span>ĐẠI HỌC DUY TÂN</span><span className="footer-mark">/</span><span>ĐÀ NẴNG, VIỆT NAM</span><span className="hero-footer-note">ĐANG HỌC HỎI.</span></div>
      </section>

      <section className="intro section-wrap" id="about"><div className="section-label"><span>01 / GIỚI THIỆU</span><span className="label-line"/></div><div className="intro-content reveal"><h2>Sẵn sàng học hỏi.<br/><span className="muted-heading">Từng bước xây nền tảng.</span></h2><div className="intro-copy"><p>Sinh viên năm cuối ngành Kỹ thuật Phần mềm tại Đại học Duy Tân. Đã được học nền tảng về C# (.NET) và Web (Node.js, SQL).</p><p>Rất mong muốn tìm kiếm vị trí Thực tập sinh IT để được học hỏi thực tế, rèn luyện kỹ năng lập trình và tích lũy thêm kinh nghiệm làm việc.</p><a className="text-link" href="#education">Xem học vấn <ArrowUpRight size={16}/></a></div></div><div className="principles"><div><span>01</span><strong>Chủ động học hỏi</strong></div><div><span>02</span><strong>Rèn luyện kỹ năng lập trình</strong></div><div><span>03</span><strong>Tích lũy kinh nghiệm thực tế</strong></div></div></section>

      <section className="education section-wrap" id="education"><div className="section-label"><span>02 / HỌC VẤN</span><span className="label-line"/></div><div className="education-panel reveal"><div className="education-date">2023 — 2026 <span>(HIỆN TẠI)</span></div><div><h2>Đại học Duy Tân</h2><p className="education-degree">Kỹ thuật Phần mềm <span>(Software Engineering)</span></p><p className="body-copy">Kiến thức đã học: Cấu trúc dữ liệu &amp; Giải thuật; Quy trình phát triển phần mềm (TSP, Agile/Scrum); Thiết kế Cơ sở dữ liệu.</p></div></div></section>

      <section className="skills section-wrap" id="skills"><div className="section-label"><span>03 / KỸ NĂNG CHUYÊN MÔN</span><span className="label-line"/></div><div className="section-heading-row reveal"><h2>Nền tảng<br/><span className="serif-word accent-word">đang phát triển.</span></h2><p>Giữ đúng mức độ kỹ năng được ghi trong CV.</p></div><div className="skills-grid"><article className="skill-card"><span className="skill-level">NỀN TẢNG</span><h3>Ngôn ngữ &amp; Framework</h3><div className="tag-list"><span>C#</span><span>.NET (WPF)</span><span>JavaScript</span><span>Node.js</span><span>HTML/CSS</span></div></article><article className="skill-card"><span className="skill-level">CƠ BẢN</span><h3>Cơ sở dữ liệu</h3><div className="tag-list"><span>SQL Server</span><span>PostgreSQL</span></div></article><article className="skill-card"><span className="skill-level">ĐÃ SỬ DỤNG</span><h3>Công cụ</h3><div className="tag-list"><span>Git</span><span>Visual Studio</span><span>VS Code</span></div></article><article className="skill-card"><span className="skill-level">KỸ NĂNG KHÁC</span><h3>Học hỏi &amp; thiết kế</h3><div className="tag-list"><span>Đọc hiểu tài liệu Tiếng Anh</span><span>Chủ động học công nghệ mới</span><span>UI/UX Design</span></div></article></div></section>

      <section className="projects section-wrap" id="projects"><div className="section-label"><span>04 / DỰ ÁN</span><span className="label-line"/></div><div className="section-heading-row projects-heading reveal"><h2>PCSTORE<br/><span className="muted-heading">E-commerce Website.</span></h2><span className="project-date">08/2026 — 10/2026</span></div><article className="project-panel reveal"><div className="project-visual" aria-hidden="true"><div className="visual-frame"><span className="visual-brand">PC<span>STORE</span></span><div className="visual-line"/><div className="visual-chip">HARDWARE COMPATIBILITY</div><div className="visual-orbit orbit-a"/><div className="visual-orbit orbit-b"/></div></div><div className="project-info"><span className="project-type">NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ</span><h3>Nền tảng E-commerce bán linh kiện PC</h3><p>Xây dựng hệ thống website thương mại điện tử tích hợp thuật toán kiểm tra tương thích phần cứng và tư vấn cấu hình PC.</p><div className="project-detail"><span>CÔNG NGHỆ</span><p>Node.js, Express, React, Vite, PostgreSQL / SQL Server, npm.</p></div><div className="project-detail"><span>VAI TRÒ</span><p>Lập trình Frontend, xử lý cấu hình gói và kết nối API hệ thống.</p></div></div></article></section>

      <section className="statement section-wrap" aria-label="Thông điệp"><p className="statement-main reveal">Và những hệ thống<br/><span className="muted-heading">mở rộng được.</span></p></section>

      <section className="contact section-wrap" id="contact"><div className="section-label"><span>06 / ĐẾN LƯỢT BẠN</span><span className="label-line"/></div><div className="contact-main reveal"><p className="eyebrow">BẠN ĐANG CÓ Ý TƯỞNG?</p><h2>Cùng tạo ra điều gì đó<br/><span className="serif-word accent-word">ý nghĩa.</span></h2><div className="contact-details"><div className="contact-row"><span>EMAIL</span><strong>{email}</strong><CopyButton value={email}/></div><div className="contact-row"><span>ĐIỆN THOẠI</span><strong>{phone}</strong><CopyButton value={phone}/></div></div><a className="contact-button" href={`mailto:${email}`}><span>Gửi email trực tiếp</span><ArrowUpRight size={20}/></a></div><div className="contact-note"><span>Luôn sẵn lòng với những bài toán thú vị, hợp tác và những cuộc trò chuyện hay.</span></div></section>

      <footer className="site-footer section-wrap"><a className="wordmark" href="#top" translate="no">byducanh<span>.</span></a><span className="copyright">© {new Date().getFullYear()} Nguyễn Đức Anh.</span><div className="social-links"><a href="https://github.com/ducanhcah" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={17}/></a><a href="https://www.facebook.com/duahn.22" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={17}/></a><a href={`mailto:${email}`} aria-label="Email"><Mail size={17}/></a></div><a className="back-top" href="#top">VỀ ĐẦU TRANG ↑</a></footer>
    </div>
    <AudioAndEffects />
  </main>;
}
