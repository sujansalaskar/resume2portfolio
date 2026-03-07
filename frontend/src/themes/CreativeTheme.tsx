import type React from "react";
import type { ThemeContent } from "./themeContent";
import useScrollReveal from "@/hooks/useScrollReveal";

interface Props {
  content: ThemeContent;
}

/* ═══════════════════════════════════════════════════════════════════════
   CREATIVE THEME v3 — Award-winning gradient portfolio
   Design language: Mesh gradients · Glassmorphism · Bold typography
   Color palette: Deep violet → electric purple → neon pink → warm orange
   ═══════════════════════════════════════════════════════════════════════ */

const CreativeTheme: React.FC<Props> = ({ content }) => {
  const {
    name = "Your Name",
    summary,
    email,
    phone,
    profilePictureUrl,
    skills = [],
    projects = [],
    experience = [],
    education = [],
    socialLinks,
  } = content;

  const scrollRef = useScrollReveal({ staggerMs: 90 });

  // Split name for big typography treatment
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div ref={scrollRef} className="min-h-screen font-jakarta text-white overflow-x-hidden" style={{ background: "#09090f" }}>

      {/* ─────── MESH GRADIENT BACKGROUND ─────────────────────────────── */}
      <div className="fixed inset-0 -z-30" style={{
        background: "radial-gradient(ellipse 80% 50% at 0% 0%, rgba(124,58,237,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 100% 0%, rgba(219,39,119,0.3) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(249,115,22,0.2) 0%, transparent 60%), #09090f"
      }} />

      {/* Animated orbs */}
      <div className="fixed -z-20 pointer-events-none" style={{
        top: "10%", left: "5%", width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)",
        animation: "orb 14s ease-in-out infinite",
      }} />
      <div className="fixed -z-20 pointer-events-none" style={{
        top: "30%", right: "5%", width: "400px", height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(219,39,119,0.12), transparent 70%)",
        animation: "orb 18s ease-in-out infinite reverse",
        animationDelay: "-6s",
      }} />
      <div className="fixed -z-20 pointer-events-none" style={{
        bottom: "10%", left: "30%", width: "600px", height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)",
        animation: "orb 20s ease-in-out infinite",
        animationDelay: "-10s",
      }} />

      {/* Noise texture */}
      <div className="fixed inset-0 -z-10 opacity-[0.04] noise-overlay pointer-events-none" />

      {/* ─────── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-16 md:mb-24 animate-slide-down">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <span className="text-[11px] tracking-[0.4em] uppercase text-white/40 font-grotesk">Portfolio</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-white/30 font-mono-jb">
            {email && <a href={`mailto:${email}`} className="hover:text-white/70 transition-colors">{email}</a>}
            {phone && <span>{phone}</span>}
          </div>
        </div>

        {/* Hero — name left, photo right */}
        <div style={{ display: "grid", gridTemplateColumns: profilePictureUrl ? "1fr auto" : "1fr", gap: "48px", alignItems: "center" }}>
          <div className="space-y-2">

            <div className="overflow-hidden">
              <h1 className="font-syne font-extrabold leading-[0.9] tracking-[-0.04em] animate-fade-up delay-100"
                style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
                <span className="block text-white">{firstName}</span>
                {lastName && (
                  <span className="block" style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                  }}>{lastName}</span>
                )}
                {!lastName && (
                  <span className="block" style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                  }}>Portfolio</span>
                )}
              </h1>
            </div>

            {summary && (
              <p className="mt-8 text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed animate-fade-up delay-300 font-light">
                {summary}
              </p>
            )}

            {/* Social links row */}
            <div className="flex flex-wrap items-center gap-3 mt-10 animate-fade-up delay-400">
              {socialLinks?.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "100px", padding: "10px 22px", fontSize: "13px", fontWeight: 500,
                  transition: "all 0.3s", display: "inline-flex", alignItems: "center", gap: "6px",
                  backdropFilter: "blur(10px)"
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                  GitHub
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "100px", padding: "10px 22px", fontSize: "13px", fontWeight: 500,
                  transition: "all 0.3s", display: "inline-flex", alignItems: "center", gap: "6px",
                  backdropFilter: "blur(10px)"
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  LinkedIn
                </a>
              )}
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "100px", padding: "10px 22px", fontSize: "13px", fontWeight: 500,
                  backdropFilter: "blur(10px)", transition: "all 0.3s"
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}>Twitter</a>
              )}
              {socialLinks?.website && (
                <a href={socialLinks.website} target="_blank" rel="noreferrer" style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))",
                  border: "1px solid rgba(168,85,247,0.4)",
                  borderRadius: "100px", padding: "10px 22px", fontSize: "13px", fontWeight: 600,
                  backdropFilter: "blur(10px)", transition: "all 0.3s"
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(168,85,247,0.5), rgba(236,72,153,0.5))"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))"; }}>
                  Website ↗
                </a>
              )}
            </div>
          </div>

          {/* Profile photo — right side, large circular */}
          {profilePictureUrl && (
            <div className="animate-scale-in delay-200 hidden md:flex" style={{ flexShrink: 0, alignItems: "center", justifyContent: "center" }}>
              <div style={{
                width: "220px", height: "220px",
                borderRadius: "50%",
                padding: "3px",
                background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)",
                boxShadow: "0 0 60px rgba(168,85,247,0.4), 0 0 120px rgba(236,72,153,0.2)",
                animation: "float 6s ease-in-out infinite",
              }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "3px solid #09090f" }}>
                  <img src={profilePictureUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float-slow flex flex-col items-center gap-2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/20 font-grotesk">Scroll</span>
        </div>
      </section>

      {/* ─────── SKILLS ───────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <section className="px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12" data-reveal="fade">
              <span className="text-[11px] tracking-[0.35em] uppercase font-grotesk text-white/30">Skills & Technologies</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-3" data-reveal="fade">
              {skills.map((skill, i) => (
                <span key={skill} style={{
                  background: `rgba(${[80, 100, 120, 140, 90][i % 5]},${[50, 80, 60, 70, 90][i % 5]},${[200, 180, 220, 190, 160][i % 5]},0.12)`,
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px", padding: "8px 18px",
                  fontSize: "13px", fontWeight: 500,
                  transition: "all 0.3s",
                  cursor: "default",
                  animationDelay: `${i * 40}ms`,
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.2)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.4)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = `rgba(${[80, 100, 120, 140, 90][i % 5]},${[50, 80, 60, 70, 90][i % 5]},${[200, 180, 220, 190, 160][i % 5]},0.12)`;
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.transform = "";
                  }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────── PROJECTS ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12" data-reveal="fade">
            <span className="text-[11px] tracking-[0.35em] uppercase font-grotesk text-white/30">Selected Projects</span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
              {projects.map((project, i) => (
                <article key={project.title} data-reveal style={{ transitionDelay: `${i * 100}ms` }}>
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "20px",
                    padding: "32px",
                    height: "100%",
                    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(168,85,247,0.06)";
                      el.style.borderColor = "rgba(168,85,247,0.25)";
                      el.style.transform = "translateY(-6px)";
                      el.style.boxShadow = "0 30px 80px rgba(168,85,247,0.15), 0 0 0 1px rgba(168,85,247,0.1)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.03)";
                      el.style.borderColor = "rgba(255,255,255,0.07)";
                      el.style.transform = "";
                      el.style.boxShadow = "";
                    }}>
                    {/* Gradient glow top */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                      background: `linear-gradient(90deg, transparent, ${["rgba(168,85,247", "rgba(236,72,153", "rgba(249,115,22"][i % 3]},0.8), transparent)`,
                    }} />

                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        background: `linear-gradient(135deg, ${["rgba(168,85,247,0.3),rgba(236,72,153,0.2)", "rgba(236,72,153,0.3),rgba(249,115,22,0.2)", "rgba(59,130,246,0.3),rgba(168,85,247,0.2)"][i % 3]})`,
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", flexShrink: 0,
                      }}>
                        {["⚡", "🛠", "🔮", "✦", "◈"][i % 5]}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{
                            width: "32px", height: "32px", borderRadius: "8px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s", fontSize: "14px"
                          }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{
                            width: "32px", height: "32px", borderRadius: "8px",
                            background: "rgba(168,85,247,0.15)",
                            border: "1px solid rgba(168,85,247,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s", fontSize: "12px"
                          }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.3)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.15)"; }}>
                            ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="font-grotesk font-bold text-xl text-white mb-2">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm text-white/45 leading-relaxed mb-5 line-clamp-3">{project.description}</p>
                    )}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => (
                          <span key={tech} style={{
                            padding: "3px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontFamily: "JetBrains Mono, monospace",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.5)"
                          }}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{
              padding: "60px 40px", textAlign: "center",
              background: "rgba(255,255,255,0.02)", borderRadius: "20px",
              border: "1px dashed rgba(255,255,255,0.06)"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.3 }}>◈</div>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>Projects will appear here</p>
            </div>
          )}
        </div>
      </section>

      {/* ─────── EXPERIENCE ───────────────────────────────────────────── */}
      {experience.length > 0 && (
        <section className="px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12" data-reveal="fade">
              <span className="text-[11px] tracking-[0.35em] uppercase font-grotesk text-white/30">Experience</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="space-y-4">
              {experience.map((item, i) => (
                <div key={`${item.company}-${i}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <div style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px", padding: "28px 32px",
                    display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "start",
                    transition: "all 0.3s",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.2)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    }}>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #a855f7, #ec4899)"
                        }} />
                        <span style={{ fontSize: "12px", color: "rgba(168,85,247,0.8)", fontWeight: 500, letterSpacing: "0.05em" }}>
                          {item.company}
                        </span>
                      </div>
                      <h3 className="font-grotesk font-bold text-lg text-white mt-1">{item.role}</h3>
                      {item.description && (
                        <p className="text-sm text-white/40 leading-relaxed mt-3">{item.description}</p>
                      )}
                    </div>
                    {item.duration && (
                      <span style={{
                        fontSize: "11px", color: "rgba(255,255,255,0.25)",
                        fontFamily: "JetBrains Mono, monospace",
                        whiteSpace: "nowrap", paddingTop: "2px"
                      }}>{item.duration}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────── EDUCATION ────────────────────────────────────────────── */}
      {education.length > 0 && (
        <section className="px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12" data-reveal="fade">
              <span className="text-[11px] tracking-[0.35em] uppercase font-grotesk text-white/30">Education</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {education.map((edu, i) => (
                <div key={`${edu.institution}-${i}`} data-reveal="scale" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px", padding: "24px",
                    borderLeft: `2px solid ${["rgba(168,85,247,0.6)", "rgba(236,72,153,0.6)", "rgba(249,115,22,0.6)"][i % 3]}`,
                    transition: "all 0.3s",
                  }}>
                    <p className="font-grotesk font-semibold text-white text-base">{edu.degree}</p>
                    <p className="text-sm text-white/40 mt-1">{edu.institution}</p>
                    {edu.year && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace", marginTop: "8px" }}>{edu.year}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────── FOOTER ───────────────────────────────────────────────── */}
      <footer className="px-6 md:px-16 lg:px-24 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-syne font-bold text-2xl" style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>{name}</p>
            {email && <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", marginTop: "4px" }}>{email}</p>}
          </div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.2em" }}>BUILT WITH MIMNI</p>
        </div>
      </footer>
    </div>
  );
};

export default CreativeTheme;