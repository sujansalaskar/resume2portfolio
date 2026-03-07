import type { ThemeContent } from "./themeContent";
import useScrollReveal from "@/hooks/useScrollReveal";

interface Props {
  content: ThemeContent;
}

/* ═══════════════════════════════════════════════════════════════════════
   DEVELOPER THEME v3 — Terminal-grade dark aesthetic
   Design language: IDE/terminal · Matrix grid · Monospace · Neon green
   Color palette: Near-black bg · Emerald/cyan · Electric green accents
   ═══════════════════════════════════════════════════════════════════════ */

const DeveloperTheme: React.FC<Props> = ({ content }) => {
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

  const scrollRef = useScrollReveal({ staggerMs: 80 });

  // Generate a deterministic "commit hash" from a string
  const hash = (s: string) =>
    Array.from(s)
      .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xffffffff, 0)
      .toString(16)
      .replace("-", "")
      .slice(0, 7)
      .padStart(7, "a");

  return (
    <div className="min-h-screen font-mono-jb text-slate-100 overflow-x-hidden" style={{ background: "#070c12" }}>

      {/* ─────── ANIMATED GRID BACKGROUND ─────────────────────────────── */}
      <div className="fixed inset-0 -z-20 grid-pattern animate-grid opacity-60" />

      {/* Vignette overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(7,12,18,0.85) 100%)"
      }} />

      {/* Scanlines */}
      <div className="fixed inset-0 -z-10 pointer-events-none scanline-overlay opacity-100" />

      {/* Corner glow */}
      <div className="fixed -z-10 pointer-events-none" style={{
        top: 0, left: 0, width: "600px", height: "600px",
        background: "radial-gradient(ellipse at top left, rgba(52,211,153,0.06), transparent 70%)"
      }} />

      {/* ─────── TOP NAV BAR ──────────────────────────────────────────── */}
      <nav className="animate-slide-down" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(7,12,18,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(52,211,153,0.08)",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#28c940" }} />
          </div>
          <span style={{ fontSize: "11px", color: "rgba(52,211,153,0.4)", marginLeft: "10px", letterSpacing: "0.15em" }}>
            {name.toLowerCase().replace(/\s+/g, "-")}.portfolio
          </span>
        </div>
        <div className="flex items-center gap-6" style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
          {email && <span>{email}</span>}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "rgba(52,211,153,0.6)" }}>AVAILABLE</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        {/* ─────── HERO (SIDEBAR + MAIN) ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "100vh" }}>

          {/* SIDEBAR */}
          <aside style={{
            borderRight: "1px solid rgba(52,211,153,0.08)",
            padding: "40px 24px",
            display: "flex", flexDirection: "column", gap: "32px",
            alignSelf: "flex-start",
            position: "sticky", top: "52px",
          }}>
            {/* Profile photo */}
            {profilePictureUrl && (
              <div className="animate-fade-in" style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                <div style={{
                  width: "96px", height: "96px",
                  borderRadius: "50%",
                  padding: "2px",
                  background: "linear-gradient(135deg, rgba(52,211,153,0.8), rgba(6,182,212,0.6))",
                  boxShadow: "0 0 24px rgba(52,211,153,0.25), 0 0 60px rgba(52,211,153,0.08)",
                }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "2px solid #070c12" }}>
                    <img src={profilePictureUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Name + Prompt */}
            <div className="animate-fade-up">
              <p style={{ fontSize: "10px", letterSpacing: "0.3em", color: "rgba(52,211,153,0.5)", marginBottom: "8px" }}>
                $ whoami
              </p>
              <h1 className="font-grotesk font-bold" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#f0fff4", lineHeight: 1.1 }}>
                {name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", color: "rgba(52,211,153,0.5)" }}>~/portfolio</span>
                <span className="animate-blink" style={{ color: "rgba(52,211,153,0.7)", fontSize: "14px" }}>▊</span>
              </div>
            </div>

            {/* About */}
            {summary && (
              <div className="animate-fade-up delay-200">
                <p style={{ fontSize: "10px", letterSpacing: "0.3em", color: "rgba(52,211,153,0.4)", marginBottom: "10px" }}>
                  $ cat about.md
                </p>
                <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", lineHeight: "1.85" }}>{summary}</p>
              </div>
            )}

            {/* Contact */}
            {(email || phone) && (
              <div className="animate-fade-up delay-300">
                <p style={{ fontSize: "10px", letterSpacing: "0.3em", color: "rgba(52,211,153,0.4)", marginBottom: "10px" }}>
                  $ cat contact.json
                </p>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "2.2", fontFamily: "JetBrains Mono, monospace" }}>
                  {email && (
                    <p>
                      <span style={{ color: "#c084fc" }}>"email"</span>
                      <span style={{ color: "rgba(255,255,255,0.2)" }}>: </span>
                      <span style={{ color: "#fde68a" }}>"{email}"</span>
                    </p>
                  )}
                  {phone && (
                    <p>
                      <span style={{ color: "#c084fc" }}>"phone"</span>
                      <span style={{ color: "rgba(255,255,255,0.2)" }}>: </span>
                      <span style={{ color: "#fde68a" }}>"{phone}"</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {socialLinks && (
              <div className="animate-fade-up delay-400">
                <p style={{ fontSize: "10px", letterSpacing: "0.3em", color: "rgba(52,211,153,0.4)", marginBottom: "10px" }}>
                  $ ls -la links/
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noreferrer" style={{
                      display: "flex", alignItems: "center", gap: "8px", fontSize: "12px",
                      color: "rgba(125,211,252,0.7)", transition: "color 0.2s"
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#34d399"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(125,211,252,0.7)"; }}>
                      <span style={{ color: "rgba(52,211,153,0.5)" }}>→</span> github.com
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" style={{
                      display: "flex", alignItems: "center", gap: "8px", fontSize: "12px",
                      color: "rgba(125,211,252,0.7)", transition: "color 0.2s"
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#34d399"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(125,211,252,0.7)"; }}>
                      <span style={{ color: "rgba(52,211,153,0.5)" }}>→</span> linkedin.com
                    </a>
                  )}
                  {socialLinks.website && (
                    <a href={socialLinks.website} target="_blank" rel="noreferrer" style={{
                      display: "flex", alignItems: "center", gap: "8px", fontSize: "12px",
                      color: "rgba(125,211,252,0.7)", transition: "color 0.2s"
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#34d399"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(125,211,252,0.7)"; }}>
                      <span style={{ color: "rgba(52,211,153,0.5)" }}>→</span> website
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="animate-fade-up delay-500">
                <p style={{ fontSize: "10px", letterSpacing: "0.3em", color: "rgba(52,211,153,0.4)", marginBottom: "10px" }}>
                  $ skill --list
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {skills.map((skill, i) => (
                    <span key={skill} style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "10.5px",
                      fontFamily: "JetBrains Mono, monospace",
                      background: `rgba(52,211,153,${0.05 + (i % 4) * 0.02})`,
                      border: "1px solid rgba(52,211,153,0.12)",
                      color: "rgba(52,211,153,0.7)",
                      transition: "all 0.2s",
                      cursor: "default",
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.15)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.4)";
                        (e.currentTarget as HTMLElement).style.color = "#34d399";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = `rgba(52,211,153,${0.05 + (i % 4) * 0.02})`;
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.12)";
                        (e.currentTarget as HTMLElement).style.color = "rgba(52,211,153,0.7)";
                      }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(52,211,153,0.06)" }}>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>
                <span style={{ color: "rgba(52,211,153,0.4)" }}>$</span> echo "Built with Mimni"
              </p>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main ref={scrollRef as any} style={{ padding: "40px 40px", minHeight: "calc(100vh - 52px)" }}>

            {/* Projects — IDE Card style */}
            <section style={{ marginBottom: "64px" }}>
              <p className="animate-fade-left" style={{
                fontSize: "10px", letterSpacing: "0.3em", color: "rgba(52,211,153,0.4)",
                marginBottom: "24px"
              }}>
                $ ls projects/ --verbose
              </p>

              {projects.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                  {projects.map((project, i) => (
                    <article key={project.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                      <div style={{
                        background: "#0d1620",
                        border: "1px solid rgba(52,211,153,0.1)",
                        borderRadius: "10px",
                        overflow: "hidden",
                        height: "100%",
                        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                      }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = "rgba(52,211,153,0.3)";
                          el.style.boxShadow = "0 0 0 1px rgba(52,211,153,0.05), 0 20px 50px rgba(0,0,0,0.3)";
                          el.style.transform = "translateY(-4px)";
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = "rgba(52,211,153,0.1)";
                          el.style.boxShadow = "";
                          el.style.transform = "";
                        }}>
                        {/* File tab bar */}
                        <div style={{
                          background: "#080f18",
                          borderBottom: "1px solid rgba(52,211,153,0.06)",
                          padding: "10px 16px",
                          display: "flex", alignItems: "center", gap: "10px"
                        }}>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,95,87,0.6)" }} />
                            <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,189,46,0.6)" }} />
                            <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "rgba(40,201,64,0.6)" }} />
                          </div>
                          <span style={{
                            fontSize: "10px", color: "rgba(52,211,153,0.35)",
                            fontFamily: "JetBrains Mono, monospace"
                          }}>
                            {project.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md
                          </span>
                        </div>

                        <div style={{ padding: "20px 20px 20px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                            <h3 className="font-grotesk" style={{ fontSize: "15px", fontWeight: 700, color: "#f0fff4" }}>{project.title}</h3>
                            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                              {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noreferrer"
                                  style={{
                                    fontSize: "10px", color: "rgba(52,211,153,0.5)",
                                    background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.1)",
                                    borderRadius: "5px", padding: "3px 8px", transition: "all 0.2s"
                                  }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#34d399"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.3)"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(52,211,153,0.5)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.1)"; }}>
                                  repo ↗
                                </a>
                              )}
                              {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noreferrer"
                                  style={{
                                    fontSize: "10px", color: "rgba(125,211,252,0.6)",
                                    background: "rgba(125,211,252,0.05)", border: "1px solid rgba(125,211,252,0.1)",
                                    borderRadius: "5px", padding: "3px 8px", transition: "all 0.2s"
                                  }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#7dd3fc"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(125,211,252,0.6)"; }}>
                                  live ↗
                                </a>
                              )}
                            </div>
                          </div>
                          {project.description && (
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: "1.75", marginBottom: "14px" }}>
                              {project.description}
                            </p>
                          )}
                          {project.techStack && project.techStack.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                              {project.techStack.map(tech => (
                                <span key={tech} style={{
                                  fontSize: "10px", padding: "2px 8px", borderRadius: "4px",
                                  background: "rgba(125,211,252,0.06)", border: "1px solid rgba(125,211,252,0.1)",
                                  color: "rgba(125,211,252,0.55)",
                                  fontFamily: "JetBrains Mono, monospace"
                                }}>{tech}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: "40px", borderRadius: "10px",
                  background: "#0d1620", border: "1px dashed rgba(52,211,153,0.08)",
                  color: "rgba(52,211,153,0.2)", fontSize: "12px", textAlign: "center"
                }}>
                  <p>// No projects found in this directory</p>
                  <p style={{ opacity: 0.6, marginTop: "4px", fontSize: "10px" }}>$ touch projects/my-first-project.md</p>
                </div>
              )}
            </section>

            {/* Experience — git log */}
            {experience.length > 0 && (
              <section style={{ marginBottom: "64px" }}>
                <p className="animate-fade-left" style={{
                  fontSize: "10px", letterSpacing: "0.3em", color: "rgba(52,211,153,0.4)",
                  marginBottom: "24px"
                }}>
                  $ git log --oneline --all experience
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {experience.map((item, i) => {
                    const commitId = hash(item.role + item.company);
                    return (
                      <div key={`${item.company}-${i}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                        <div style={{
                          background: "#0d1620",
                          border: "1px solid rgba(52,211,153,0.07)",
                          borderRadius: "8px",
                          padding: "20px 24px",
                          transition: "all 0.3s",
                        }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = "#111b27";
                            el.style.borderColor = "rgba(52,211,153,0.2)";
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = "#0d1620";
                            el.style.borderColor = "rgba(52,211,153,0.07)";
                          }}>
                          {/* Commit header */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ fontSize: "10px", color: "#fbbf24", fontFamily: "JetBrains Mono, monospace" }}>
                                commit {commitId}
                              </span>
                              <span style={{
                                fontSize: "10px", padding: "1px 8px", borderRadius: "4px",
                                background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)",
                                color: "rgba(52,211,153,0.7)"
                              }}>HEAD</span>
                            </div>
                            {item.duration && (
                              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>
                                {item.duration}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", marginBottom: "6px" }}>
                            <span style={{ color: "#c084fc" }}>Author: </span>{item.company}
                          </div>
                          <p className="font-grotesk" style={{ fontSize: "15px", fontWeight: 600, color: "#e2e8f0" }}>
                            {item.role}
                          </p>
                          {item.description && (
                            <p style={{
                              fontSize: "12px", color: "rgba(255,255,255,0.35)",
                              lineHeight: "1.75", marginTop: "10px",
                              borderLeft: "2px solid rgba(52,211,153,0.15)",
                              paddingLeft: "14px"
                            }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <p className="animate-fade-left" style={{
                  fontSize: "10px", letterSpacing: "0.3em", color: "rgba(52,211,153,0.4)",
                  marginBottom: "24px"
                }}>
                  $ cat education.log
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                  {education.map((edu, i) => (
                    <div key={`${edu.institution}-${i}`} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                      <div style={{
                        background: "#0d1620",
                        border: "1px solid rgba(52,211,153,0.08)",
                        borderLeft: "2px solid rgba(52,211,153,0.4)",
                        borderRadius: "8px",
                        padding: "18px 20px",
                        transition: "all 0.3s",
                      }}>
                        <p className="font-grotesk" style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>{edu.degree}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{edu.institution}</p>
                        {edu.year && <p style={{ fontSize: "10px", color: "rgba(52,211,153,0.4)", marginTop: "6px", fontFamily: "JetBrains Mono, monospace" }}>{edu.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTheme;