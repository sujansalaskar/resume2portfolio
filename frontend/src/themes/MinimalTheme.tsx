import type { ThemeContent } from "./themeContent";
import useScrollReveal from "@/hooks/useScrollReveal";

interface Props {
  content: ThemeContent;
}

/* ═══════════════════════════════════════════════════════════════════════
   MINIMAL THEME v3 — Premium editorial, luxury magazine aesthetic
   Design language: Swiss typography · Generous whitespace · Monochrome
   Color palette: Warm white #fafaf8 · Rich near-black #0f0f0d · Stone
   ═══════════════════════════════════════════════════════════════════════ */

const MinimalTheme: React.FC<Props> = ({ content }) => {
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

  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div ref={scrollRef} className="min-h-screen font-jakarta" style={{ background: "#fafaf8", color: "#0f0f0d" }}>

      {/* Subtle noise texture for premium paper feel */}
      <div className="fixed inset-0 -z-10 opacity-[0.015] noise-overlay pointer-events-none" />

      {/* Subtle color wash */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(215,195,250,0.3), transparent)"
      }} />

      {/* ─────── NAV ──────────────────────────────────────────────────── */}
      <nav className="animate-slide-down" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,250,248,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,15,13,0.06)",
        padding: "18px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span className="font-grotesk" style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.02em" }}>
          {firstName}{lastName ? ` ${lastName}` : ""}
        </span>
        <div style={{ display: "flex", gap: "32px", fontSize: "12px", color: "rgba(15,15,13,0.8)" }}>
          {email && (
            <a href={`mailto:${email}`} style={{ transition: "color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#0f0f0d"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(15,15,13,0.4)"; }}>
              {email}
            </a>
          )}
          {phone && <span>{phone}</span>}
        </div>
      </nav>

      {/* ─────── HERO ─────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 48px 100px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: profilePictureUrl ? "1fr auto" : "1fr", alignItems: "center", gap: "64px" }}>
          <div>
            {/* Overline */}
            <p className="animate-fade-up" style={{
              fontSize: "11px", letterSpacing: "0.35em", textTransform: "uppercase",
              color: "rgba(15,15,13,0.35)", marginBottom: "20px", fontFamily: "Space Grotesk, sans-serif"
            }}>
              Portfolio · {new Date().getFullYear()}
            </p>

            {/* Giant name */}
            <h1 className="animate-fade-up delay-100 font-grotesk" style={{
              fontSize: "clamp(3.5rem, 8vw, 8rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              color: "#0f0f0d",
            }}>
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span style={{ color: "rgba(15,15,13,0.25)" }}>{lastName}</span>
                </>
              )}
            </h1>

            {/* Animated underline */}
            <div className="animate-fade-in delay-300" style={{ overflow: "hidden", marginTop: "24px", marginBottom: "28px" }}>
              <div className="animate-line-grow" style={{
                height: "4px", width: "100%", maxWidth: "120px",
                background: "#0f0f0d", borderRadius: "2px"
              }} />
            </div>

            {summary && (
              <p className="animate-fade-up delay-200" style={{
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                color: "#2c2c28",
                maxWidth: "560px",
                lineHeight: 1.8,
                fontWeight: 400,
              }}>
                {summary}
              </p>
            )}
          </div>

          {/* Right column: photo + social links */}
          <div className="animate-fade-right delay-200" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flexShrink: 0 }}>
            {/* Profile photo */}
            {profilePictureUrl && (
              <div style={{
                width: "180px", height: "180px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid rgba(15,15,13,0.1)",
                boxShadow: "0 20px 60px rgba(15,15,13,0.1), 0 4px 16px rgba(15,15,13,0.05)",
              }}>
                <img src={profilePictureUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {/* Social links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch", width: "100%" }}>
              {socialLinks?.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" style={{
                  fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "rgba(15,15,13,0.35)", textDecoration: "none",
                  padding: "8px 16px", borderRadius: "100px",
                  border: "1px solid rgba(15,15,13,0.1)",
                  transition: "all 0.25s", textAlign: "center",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#0f0f0d"; el.style.color = "#fafaf8"; el.style.borderColor = "#0f0f0d";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent"; el.style.color = "rgba(15,15,13,0.35)"; el.style.borderColor = "rgba(15,15,13,0.1)";
                  }}>
                  GitHub
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" style={{
                  fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "rgba(15,15,13,0.35)", textDecoration: "none",
                  padding: "8px 16px", borderRadius: "100px",
                  border: "1px solid rgba(15,15,13,0.1)",
                  transition: "all 0.25s", textAlign: "center",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#0f0f0d"; el.style.color = "#fafaf8"; el.style.borderColor = "#0f0f0d";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent"; el.style.color = "rgba(15,15,13,0.35)"; el.style.borderColor = "rgba(15,15,13,0.1)";
                  }}>
                  LinkedIn
                </a>
              )}
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" style={{
                  fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "rgba(15,15,13,0.35)", textDecoration: "none",
                  padding: "8px 16px", borderRadius: "100px",
                  border: "1px solid rgba(15,15,13,0.1)",
                  transition: "all 0.25s", textAlign: "center",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#0f0f0d"; el.style.color = "#fafaf8"; el.style.borderColor = "#0f0f0d";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent"; el.style.color = "rgba(15,15,13,0.35)"; el.style.borderColor = "rgba(15,15,13,0.1)";
                  }}>
                  Twitter
                </a>
              )}
              {socialLinks?.website && (
                <a href={socialLinks.website} target="_blank" rel="noreferrer" style={{
                  fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "#fafaf8", background: "#0f0f0d", textDecoration: "none",
                  padding: "8px 16px", borderRadius: "100px",
                  border: "1px solid #0f0f0d",
                  transition: "all 0.25s", textAlign: "center",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(15,15,13,0.8)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0f0f0d"; }}>
                  Website ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────── EXPERIENCE ───────────────────────────────────── */}
      {experience.length > 0 && (
        <section style={{
          borderTop: "1px solid rgba(15,15,13,0.07)",
          padding: "80px 48px",
          maxWidth: "1200px", margin: "0 auto"
        }}>
          <div data-reveal="fade" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "56px" }}>
            <span className="font-grotesk" style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#0f0f0d"
            }}>Experience</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(15,15,13,0.07)" }} />
            <span style={{ fontSize: "10px", color: "rgba(15,15,13,0.2)", fontFamily: "JetBrains Mono, monospace" }}>
              {String(experience.length).padStart(2, "0")}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {experience.map((item, i) => (
              <div key={`${item.company}-${i}`} data-reveal style={{
                display: "grid", gridTemplateColumns: "180px 1fr",
                gap: "0 40px", padding: "40px 0",
                borderBottom: i < experience.length - 1 ? "1px solid rgba(15,15,13,0.06)" : "none",
                transitionDelay: `${i * 80}ms`,
                position: "relative",
              }}>
                {/* Left: company + date */}
                <div>
                  <p style={{ fontSize: "12px", color: "#2c2c28", lineHeight: 1.6 }}>{item.company}</p>
                  {item.duration && (
                    <p style={{
                      fontSize: "11px", color: "#555550", marginTop: "6px",
                      fontFamily: "JetBrains Mono, monospace"
                    }}>{item.duration}</p>
                  )}
                </div>

                {/* Right: role + description */}
                <div>
                  <h3 className="font-grotesk" style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 600,
                    color: "#0f0f0d", letterSpacing: "-0.02em", lineHeight: 1.2
                  }}>
                    {item.role}
                  </h3>
                  {item.description && (
                    <p style={{
                      fontSize: "14px", color: "#2c2c28",
                      lineHeight: 1.8, marginTop: "12px", maxWidth: "600px"
                    }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────── PROJECTS ─────────────────────────────────────── */}
      {projects.length > 0 && (
        <section style={{
          borderTop: "1px solid rgba(15,15,13,0.07)",
          padding: "80px 48px",
          maxWidth: "1200px", margin: "0 auto"
        }}>
          <div data-reveal="fade" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "56px" }}>
            <span className="font-grotesk" style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#0f0f0d"
            }}>Projects</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(15,15,13,0.07)" }} />
            <span style={{ fontSize: "10px", color: "rgba(15,15,13,0.2)", fontFamily: "JetBrains Mono, monospace" }}>
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {projects.map((project, i) => (
              <article key={project.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <div style={{
                  background: "white", borderRadius: "20px",
                  padding: "32px", height: "100%",
                  border: "1px solid rgba(15,15,13,0.06)",
                  boxShadow: "0 1px 3px rgba(15,15,13,0.04)",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  position: "relative", overflow: "hidden",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 20px 60px rgba(15,15,13,0.1)";
                    el.style.transform = "translateY(-6px)";
                    el.style.borderColor = "rgba(15,15,13,0.12)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 1px 3px rgba(15,15,13,0.04)";
                    el.style.transform = "";
                    el.style.borderColor = "rgba(15,15,13,0.06)";
                  }}>
                  {/* Index number */}
                  <span style={{
                    position: "absolute", top: "24px", right: "24px",
                    fontSize: "52px", fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 800, color: "rgba(15,15,13,0.04)",
                    lineHeight: 1, userSelect: "none"
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{
                        fontSize: "11px", padding: "5px 14px", borderRadius: "100px",
                        border: "1px solid rgba(15,15,13,0.1)",
                        color: "rgba(15,15,13,0.4)", textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "#0f0f0d"; el.style.color = "#fafaf8";
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "transparent"; el.style.color = "rgba(15,15,13,0.4)";
                        }}>
                        GitHub ↗
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{
                        fontSize: "11px", padding: "5px 14px", borderRadius: "100px",
                        background: "#0f0f0d",
                        color: "#fafaf8", textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#333"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0f0f0d"; }}>
                        Live ↗
                      </a>
                    )}
                  </div>

                  <h3 className="font-grotesk" style={{
                    fontSize: "19px", fontWeight: 700,
                    color: "#0f0f0d", letterSpacing: "-0.02em", marginBottom: "10px"
                  }}>
                    {project.title}
                  </h3>

                  {project.description && (
                    <p style={{
                      fontSize: "13.5px", color: "#2c2c28",
                      lineHeight: 1.75, marginBottom: "18px"
                    }}>
                      {project.description}
                    </p>
                  )}

                  {project.techStack && project.techStack.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {project.techStack.map(tech => (
                        <span key={tech} style={{
                          fontSize: "11px", padding: "3px 12px", borderRadius: "100px",
                          background: "rgba(15,15,13,0.04)",
                          border: "1px solid rgba(15,15,13,0.06)",
                          color: "#555550",
                          fontFamily: "JetBrains Mono, monospace"
                        }}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ─────── SKILLS ───────────────────────────────────────── */}
      {skills.length > 0 && (
        <section style={{
          borderTop: "1px solid rgba(15,15,13,0.07)",
          padding: "80px 48px",
          maxWidth: "1200px", margin: "0 auto"
        }}>
          <div data-reveal="fade" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "48px" }}>
            <span className="font-grotesk" style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#0f0f0d"
            }}>Skills &amp; Expertise</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(15,15,13,0.07)" }} />
          </div>
          <div data-reveal style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {skills.map((skill, i) => (
              <span key={skill} style={{
                padding: "10px 22px",
                borderRadius: "100px",
                fontSize: "13px", fontWeight: 500,
                border: "1px solid rgba(15,15,13,0.1)",
                color: "rgba(15,15,13,0.6)",
                background: "white",
                transition: "all 0.25s",
                cursor: "default",
                animationDelay: `${i * 40}ms`,
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "#0f0f0d";
                  el.style.color = "#fafaf8";
                  el.style.borderColor = "#0f0f0d";
                  el.style.transform = "scale(1.05)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "white";
                  el.style.color = "rgba(15,15,13,0.6)";
                  el.style.borderColor = "rgba(15,15,13,0.1)";
                  el.style.transform = "";
                }}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ─────── EDUCATION ────────────────────────────────────── */}
      {education.length > 0 && (
        <section style={{
          borderTop: "1px solid rgba(15,15,13,0.07)",
          padding: "80px 48px",
          maxWidth: "1200px", margin: "0 auto"
        }}>
          <div data-reveal="fade" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "48px" }}>
            <span className="font-grotesk" style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#0f0f0d"
            }}>Education</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(15,15,13,0.07)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {education.map((edu, i) => (
              <div key={`${edu.institution}-${i}`} data-reveal style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                padding: "28px 0", borderBottom: i < education.length - 1 ? "1px solid rgba(15,15,13,0.06)" : "none",
                transitionDelay: `${i * 70}ms`, gap: "20px"
              }}>
                <div>
                  <h3 className="font-grotesk" style={{ fontSize: "17px", fontWeight: 600, color: "#0f0f0d", letterSpacing: "-0.02em" }}>
                    {edu.degree}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#2c2c28", marginTop: "4px" }}>{edu.institution}</p>
                </div>
                {edu.year && (
                  <span style={{
                    fontSize: "11px", color: "#555550",
                    fontFamily: "JetBrains Mono, monospace", flexShrink: 0
                  }}>{edu.year}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────── FOOTER ───────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(15,15,13,0.07)",
        padding: "48px",
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "16px"
      }}>
        <p className="font-grotesk" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em", color: "#0f0f0d" }}>
          {name}
        </p>
        <p style={{ fontSize: "10px", letterSpacing: "0.25em", color: "rgba(15,15,13,0.2)", textTransform: "uppercase" }}>
          Built with Mimni
        </p>
      </footer>
    </div>
  );
};

export default MinimalTheme;