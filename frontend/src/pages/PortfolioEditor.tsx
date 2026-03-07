import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, Save, Eye, Rocket, Monitor, Tablet, Smartphone, GripVertical, Globe, Copy, Share2, CheckCircle, X, Loader2 } from "lucide-react";
import { portfolio, upload } from "@/services/api";
import themeMap from "@/themes/themeMap";
import type { ThemeContent } from "@/themes/themeContent";

type EditorProject = {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
};

type EditorExperience = {
  company: string;
  role: string;
  duration: string;
  description: string;
};

type EditorEducation = {
  institution: string;
  degree: string;
  year: string;
};

type EditorSocialLinks = {
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  other: { label: string; url: string }[];
};

type EditorState = {
  name: string;
  headline: string;
  location: string;
  summary: string;
  email: string;
  phone: string;
  imageUrl: string;
  skills: string[];
  projects: EditorProject[];
  experience: EditorExperience[];
  education: EditorEducation[];
  socialLinks: EditorSocialLinks;
  theme: string;
};

const sectionDefaults = [
  { id: "header", title: "Header Info", enabled: true },
  { id: "about", title: "About", enabled: true },
  { id: "skills", title: "Skills", enabled: true },
  { id: "projects", title: "Projects", enabled: true },
  { id: "experience", title: "Experience", enabled: true },
  { id: "education", title: "Education", enabled: true },
  { id: "contact", title: "Contact", enabled: true },
];

const PortfolioEditor = () => {
  const { id: routeId } = useParams<{ id?: string }>();
  const [portfolioId, setPortfolioId] = useState<string | null>(routeId || null);
  const [sections, setSections] = useState(sectionDefaults);
  const [openSection, setOpenSection] = useState("header");
  const [device, setDevice] = useState("desktop");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [published, setPublished] = useState(false);
  const [username, setUsername] = useState(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.name) {
          return user.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        }
      }
    } catch { }
    return "";
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [editorState, setEditorState] = useState<EditorState>(() => {
    const selectedTheme = localStorage.getItem("selected_theme") || "minimal-light";
    return {
      name: "",
      headline: "",
      location: "",
      summary: "",
      email: "",
      phone: "",
      imageUrl: "",
      skills: [],
      projects: [],
      experience: [],
      education: [],
      socialLinks: {
        github: "",
        linkedin: "",
        twitter: "",
        website: "",
        other: [],
      },
      theme: selectedTheme,
    };
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // If we have a portfolio ID (editing existing), load from API
        if (routeId) {
          try {
            const res = await portfolio.getMyPortfolios();
            const existing = (res || []).find((p: any) => p._id === routeId);
            if (existing) {
              setPortfolioId(existing._id);
              setUsername(existing.username || "");
              setPublished(existing.isPublished || false);

              const c = existing.content || {};
              const mappedFromApi: EditorState = {
                name: c.name || "",
                headline: c.headline || "",
                location: c.location || "",
                summary: c.summary || "",
                email: c.email || "",
                phone: c.phone || "",
                imageUrl: existing.profilePictureUrl || c.profilePictureUrl || "",
                skills: Array.isArray(c.skills) ? c.skills : [],
                projects: Array.isArray(existing.projects) ? existing.projects.map((p: any) => ({
                  title: p.title || "",
                  description: p.description || "",
                  techStack: Array.isArray(p.techStack) ? p.techStack : [],
                  githubUrl: p.githubUrl || "",
                  liveUrl: p.liveUrl || "",
                })) : [],
                experience: Array.isArray(existing.experience) ? existing.experience.map((e: any) => ({
                  company: e.company || "",
                  role: e.role || "",
                  duration: e.duration || "",
                  description: e.description || "",
                })) : [],
                education: Array.isArray(existing.education) ? existing.education.map((edu: any) => ({
                  institution: edu.institution || "",
                  degree: edu.degree || "",
                  year: edu.year || "",
                })) : [],
                socialLinks: {
                  github: existing.socialLinks?.github || "",
                  linkedin: existing.socialLinks?.linkedin || "",
                  twitter: existing.socialLinks?.twitter || "",
                  website: existing.socialLinks?.website || "",
                  other: Array.isArray(existing.socialLinks?.other) ? existing.socialLinks.other : [],
                },
                theme: existing.theme || "minimal-light",
              };

              setEditorState(mappedFromApi);
              setLoading(false);
              return;
            }
          } catch {
            // Fall through to local data loading
          }
        }

        // 1) Parsed resume from UploadResume (takes priority — user just uploaded)
        const parsedRaw = localStorage.getItem("parsed_resume");
        if (parsedRaw) {
          try {
            const parsed = JSON.parse(parsedRaw);

            const projectsSource = Array.isArray(parsed.projects) ? parsed.projects : [];
            const experienceSource = Array.isArray(parsed.experience) ? parsed.experience : [];
            const educationSource = Array.isArray(parsed.education) ? parsed.education : [];

            const mappedFromParsed: EditorState = {
              name: parsed.name || "",
              headline: parsed.role || "",
              location: "",
              summary: parsed.summary || "",
              email: parsed.email || "",
              phone: parsed.phone || "",
              imageUrl: "",
              skills: Array.isArray(parsed.skills) ? parsed.skills : [],
              projects: projectsSource.map((p: any) => ({
                title: p.name || "",
                description: p.desc || "",
                techStack: Array.isArray(p.techStack) ? p.techStack : [],
                githubUrl: p.githubUrl || "",
                liveUrl: p.liveUrl || "",
              })),
              experience: experienceSource.map((e: any) => ({
                company: e.company || "",
                role: e.title || "",
                duration: e.period || "",
                description: e.description || "",
              })),
              education: educationSource.map((edu: any) => ({
                institution: edu.school || "",
                degree: edu.degree || "",
                year: edu.year || "",
              })),
              socialLinks: {
                github: "",
                linkedin: "",
                twitter: "",
                website: "",
                other: [],
              },
              theme: localStorage.getItem("selected_theme") || "minimal-light",
            };

            setEditorState((prev) => ({
              ...prev,
              ...mappedFromParsed,
            }));
          } catch {
            setError("Failed to load saved resume data. Try uploading your resume again.");
          }
        } else {
          // 2) Fallback: load from saved draft
          const draftRaw = localStorage.getItem("portfolio_draft");
          if (draftRaw) {
            try {
              const draft = JSON.parse(draftRaw);
              if (draft && draft.editorState) {
                setEditorState((prev) => ({
                  ...prev,
                  ...draft.editorState,
                  theme: draft.theme || prev.theme,
                }));
              }
              if (draft && draft.username) {
                setUsername(draft.username);
              }
            } catch {
              // ignore corrupted draft
            }
          }
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load data.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [routeId]);

  const toggleSection = (id: string) => {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setEditorState((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }));
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setEditorState((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addProject = () => {
    setEditorState((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: "", description: "", techStack: [], githubUrl: "", liveUrl: "" },
      ],
    }));
  };

  const updateProject = (index: number, patch: Partial<EditorProject>) => {
    setEditorState((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }));
  };

  const removeProject = (index: number) => {
    setEditorState((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setEditorState((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", duration: "", description: "" },
      ],
    }));
  };

  const updateExperience = (index: number, patch: Partial<EditorExperience>) => {
    setEditorState((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    }));
  };

  const removeExperience = (index: number) => {
    setEditorState((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setEditorState((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", year: "" },
      ],
    }));
  };

  const updateEducation = (index: number, patch: Partial<EditorEducation>) => {
    setEditorState((prev) => ({
      ...prev,
      education: prev.education.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    }));
  };

  const removeEducation = (index: number) => {
    setEditorState((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateSocialLinks = (patch: Partial<EditorSocialLinks>) => {
    setEditorState((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, ...patch },
    }));
  };

  const addOtherLink = () => {
    setEditorState((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        other: [...prev.socialLinks.other, { label: "", url: "" }],
      },
    }));
  };

  const updateOtherLink = (index: number, patch: { label?: string; url?: string }) => {
    setEditorState((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        other: prev.socialLinks.other.map((o, i) =>
          i === index ? { ...o, ...patch } : o
        ),
      },
    }));
  };

  const removeOtherLink = (index: number) => {
    setEditorState((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        other: prev.socialLinks.other.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSaveDraft = async () => {
    // If editing an existing portfolio, save to the database
    if (portfolioId) {
      setSaving(true);
      setError(null);
      try {
        // Upload profile picture if it's a new base64 image
        let profilePictureUrl = editorState.imageUrl;
        if (editorState.imageUrl && editorState.imageUrl.startsWith("data:")) {
          const uploadRes = await upload.image(editorState.imageUrl);
          profilePictureUrl = uploadRes.url;
        }

        const updatePayload = {
          content: {
            name: editorState.name,
            headline: editorState.headline,
            location: editorState.location,
            summary: editorState.summary,
            email: editorState.email,
            phone: editorState.phone,
            skills: editorState.skills,
            profilePictureUrl,
          },
          profilePictureUrl,
          socialLinks: editorState.socialLinks,
          projects: editorState.projects,
          experience: editorState.experience,
          education: editorState.education,
        };

        await portfolio.update(portfolioId, updatePayload);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err: any) {
        setError(err.message || "Failed to save changes.");
      } finally {
        setSaving(false);
      }
    } else {
      // No existing portfolio — save draft to localStorage
      try {
        const payload = {
          editorState,
          username,
          theme: editorState.theme,
        };
        localStorage.setItem("portfolio_draft", JSON.stringify(payload));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        // ignore storage errors
      }
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError(null);

      // 1. Upload profile picture to Cloudinary if it's a base64 data URL
      let profilePictureUrl = "";
      if (editorState.imageUrl && editorState.imageUrl.startsWith("data:")) {
        const uploadRes = await upload.image(editorState.imageUrl);
        profilePictureUrl = uploadRes.url;
      } else if (editorState.imageUrl) {
        profilePictureUrl = editorState.imageUrl;
      }

      // 2. Build the content payload
      const contentPayload = {
        content: {
          name: editorState.name,
          headline: editorState.headline,
          location: editorState.location,
          summary: editorState.summary,
          email: editorState.email,
          phone: editorState.phone,
          skills: editorState.skills,
          profilePictureUrl,
        },
        profilePictureUrl,
        socialLinks: editorState.socialLinks,
        projects: editorState.projects,
        experience: editorState.experience,
        education: editorState.education,
      };

      if (portfolioId) {
        // Editing existing portfolio — update then publish
        await portfolio.update(portfolioId, contentPayload);
        await portfolio.publish({ portfolioId });
        setPublished(true);
      } else {
        // New portfolio — create then publish
        const createPayload = {
          username,
          theme: editorState.theme,
          ...contentPayload,
        };

        let created;
        try {
          created = await portfolio.create(createPayload);
        } catch (err: any) {
          if (err.message === "Username already taken") {
            throw new Error("Username already taken. Please choose another one.");
          }
          throw err;
        }

        if (created && created._id) {
          setPortfolioId(created._id);
          await portfolio.publish({ portfolioId: created._id });
          setPublished(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  const devices = [
    { key: "desktop", icon: Monitor, width: "100%" },
    { key: "tablet", icon: Tablet, width: "768px" },
    { key: "mobile", icon: Smartphone, width: "375px" },
  ];

  // Build ThemeContent from editorState for live preview
  const previewContent: ThemeContent = useMemo(() => ({
    name: editorState.name || "Your Name",
    summary: editorState.summary,
    email: editorState.email,
    phone: editorState.phone,
    profilePictureUrl: editorState.imageUrl,
    skills: editorState.skills,
    projects: editorState.projects.map(p => ({
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
    })),
    experience: editorState.experience,
    education: editorState.education,
    socialLinks: {
      github: editorState.socialLinks.github,
      linkedin: editorState.socialLinks.linkedin,
      twitter: editorState.socialLinks.twitter,
      website: editorState.socialLinks.website,
      other: editorState.socialLinks.other,
    },
  }), [editorState]);

  const ThemeComponent = themeMap[editorState.theme];

  // Dynamic scale to fit preview in container
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.4);

  const computeScale = useCallback(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const contentWidth = device === "desktop" ? 1440 : device === "tablet" ? 768 : 375;
    const scale = Math.min(containerWidth / contentWidth, 1);
    setPreviewScale(scale);
  }, [device]);

  useEffect(() => {
    computeScale();
    const container = previewContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => computeScale());
    observer.observe(container);
    return () => observer.disconnect();
  }, [computeScale]);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-5rem)] flex flex-col">
        {/* Top controls */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h1 className="font-display font-bold text-xl">Portfolio Editor</h1>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-secondary rounded-lg p-1 gap-1">
              {devices.map(d => (
                <button
                  key={d.key}
                  onClick={() => setDevice(d.key)}
                  className={`p-1.5 rounded-md transition-colors ${device === d.key ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <d.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving}>
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
            </Button>
            <Button variant="outline" size="sm"><Eye className="w-3.5 h-3.5" /> Preview</Button>
            <Button variant="hero" size="sm" onClick={() => setShowPublishModal(true)}><Rocket className="w-3.5 h-3.5" /> Publish</Button>
          </div>
        </div>

        {loading && (
          <p className="text-xs text-muted-foreground mb-2">Loading resume data...</p>
        )}
        {error && (
          <p className="text-xs text-destructive mb-2">{error}</p>
        )}
        {saved && (
          <p className="text-xs text-success mb-2">{portfolioId ? "Changes saved to database." : "Draft saved locally."}</p>
        )}

        {/* Editor split */}
        <div className="flex-1 flex gap-4 min-h-0 flex-col lg:flex-row">
          {/* Left: Section editor */}
          <div className="lg:w-96 overflow-auto space-y-2 flex-shrink-0">
            {sections.map((sec) => (
              <div key={sec.id} className="rounded-xl bg-card border border-border/50 overflow-hidden">
                <div className="flex items-center gap-2 p-3 cursor-pointer" onClick={() => setOpenSection(openSection === sec.id ? "" : sec.id)}>
                  <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                  <span className="text-sm font-medium flex-1">{sec.title}</span>
                  <Switch checked={sec.enabled} onCheckedChange={() => toggleSection(sec.id)} onClick={(e) => e.stopPropagation()} />
                  {openSection === sec.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
                {openSection === sec.id && sec.enabled && (
                  <div className="p-4 pt-0 space-y-3 border-t border-border/30 animate-fade-in">
                    {sec.id === "header" && (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Full Name</Label>
                          <Input
                            value={editorState.name}
                            onChange={(e) =>
                              setEditorState((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="h-9 bg-secondary border-border/50 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Title / Role</Label>
                          <Input
                            value={editorState.headline}
                            onChange={(e) =>
                              setEditorState((prev) => ({
                                ...prev,
                                headline: e.target.value,
                              }))
                            }
                            className="h-9 bg-secondary border-border/50 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Location</Label>
                          <Input
                            value={editorState.location}
                            onChange={(e) =>
                              setEditorState((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            className="h-9 bg-secondary border-border/50 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Profile Image</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditorState((prev) => ({
                                    ...prev,
                                    imageUrl: reader.result as string,
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="h-9 bg-secondary border-border/50 text-sm file:text-sm file:font-medium file:text-foreground file:bg-primary/10 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-3 file:-ml-2 file:-mt-2"
                          />
                        </div>
                      </>
                    )}
                    {sec.id === "about" && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Bio</Label>
                        <textarea
                          value={editorState.summary}
                          onChange={(e) =>
                            setEditorState((prev) => ({
                              ...prev,
                              summary: e.target.value,
                            }))
                          }
                          className="w-full h-24 rounded-lg bg-secondary border border-border/50 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    )}
                    {sec.id === "skills" && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {editorState.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1"
                            >
                              {s}
                              <button
                                type="button"
                                onClick={() => removeSkill(s)}
                                className="text-[10px] text-primary/80 hover:text-primary"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addSkill()}
                            placeholder="Add a skill"
                            className="h-8 bg-secondary border-border/50 text-xs"
                          />
                          <Button variant="outline" size="sm" type="button" onClick={addSkill}>
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                    {sec.id === "projects" && (
                      <div className="space-y-3">
                        {editorState.projects.map((p, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-border/40 bg-secondary/40 p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <Label className="text-xs">Project {index + 1}</Label>
                              <button
                                type="button"
                                className="text-[11px] text-muted-foreground hover:text-destructive"
                                onClick={() => removeProject(index)}
                              >
                                Remove
                              </button>
                            </div>
                            <Input
                              value={p.title}
                              onChange={(e) =>
                                updateProject(index, { title: e.target.value })
                              }
                              placeholder="Project title"
                              className="h-8 bg-secondary border-border/50 text-xs"
                            />
                            <textarea
                              value={p.description}
                              onChange={(e) =>
                                updateProject(index, { description: e.target.value })
                              }
                              placeholder="Brief description"
                              className="w-full h-16 rounded-lg bg-secondary border border-border/50 p-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <div className="space-y-1">
                              <Label className="text-[10px]">Tech stack (comma separated)</Label>
                              <Input
                                value={p.techStack.join(", ")}
                                onChange={(e) =>
                                  updateProject(index, {
                                    techStack: e.target.value
                                      .split(",")
                                      .map((t) => t.trim())
                                      .filter(Boolean),
                                  })
                                }
                                placeholder="e.g. React, Node.js, PostgreSQL"
                                className="h-8 bg-secondary border-border/50 text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              <Input
                                value={p.githubUrl}
                                onChange={(e) =>
                                  updateProject(index, { githubUrl: e.target.value })
                                }
                                placeholder="GitHub URL"
                                className="h-8 bg-secondary border-border/50 text-xs"
                              />
                              <Input
                                value={p.liveUrl}
                                onChange={(e) =>
                                  updateProject(index, { liveUrl: e.target.value })
                                }
                                placeholder="Live URL"
                                className="h-8 bg-secondary border-border/50 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addProject}
                        >
                          Add project
                        </Button>
                      </div>
                    )}
                    {sec.id === "experience" && (
                      <div className="space-y-3">
                        {editorState.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-border/40 bg-secondary/40 p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <Label className="text-xs">Role {index + 1}</Label>
                              <button
                                type="button"
                                className="text-[11px] text-muted-foreground hover:text-destructive"
                                onClick={() => removeExperience(index)}
                              >
                                Remove
                              </button>
                            </div>
                            <Input
                              value={exp.role}
                              onChange={(e) =>
                                updateExperience(index, { role: e.target.value })
                              }
                              placeholder="Role / title"
                              className="h-8 bg-secondary border-border/50 text-xs"
                            />
                            <Input
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(index, { company: e.target.value })
                              }
                              placeholder="Company"
                              className="h-8 bg-secondary border-border/50 text-xs"
                            />
                            <Input
                              value={exp.duration}
                              onChange={(e) =>
                                updateExperience(index, { duration: e.target.value })
                              }
                              placeholder="Duration (e.g. Jan 2022 – Mar 2024)"
                              className="h-8 bg-secondary border-border/50 text-xs"
                            />
                            <textarea
                              value={exp.description}
                              onChange={(e) =>
                                updateExperience(index, { description: e.target.value })
                              }
                              placeholder="Key responsibilities and achievements"
                              className="w-full h-16 rounded-lg bg-secondary border border-border/50 p-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addExperience}
                        >
                          Add experience
                        </Button>
                      </div>
                    )}
                    {sec.id === "education" && (
                      <div className="space-y-3">
                        {editorState.education.map((edu, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-border/40 bg-secondary/40 p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <Label className="text-xs">Education {index + 1}</Label>
                              <button
                                type="button"
                                className="text-[11px] text-muted-foreground hover:text-destructive"
                                onClick={() => removeEducation(index)}
                              >
                                Remove
                              </button>
                            </div>
                            <Input
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(index, { institution: e.target.value })
                              }
                              placeholder="Institution"
                              className="h-8 bg-secondary border-border/50 text-xs"
                            />
                            <Input
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(index, { degree: e.target.value })
                              }
                              placeholder="Degree"
                              className="h-8 bg-secondary border-border/50 text-xs"
                            />
                            <Input
                              value={edu.year}
                              onChange={(e) =>
                                updateEducation(index, { year: e.target.value })
                              }
                              placeholder="Year"
                              className="h-8 bg-secondary border-border/50 text-xs"
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addEducation}
                        >
                          Add education
                        </Button>
                      </div>
                    )}
                    {sec.id === "contact" && (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Email</Label>
                          <Input
                            value={editorState.email}
                            onChange={(e) =>
                              setEditorState((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="h-9 bg-secondary border-border/50 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Phone</Label>
                          <Input
                            value={editorState.phone}
                            onChange={(e) =>
                              setEditorState((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="h-9 bg-secondary border-border/50 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">GitHub</Label>
                          <Input
                            value={editorState.socialLinks.github}
                            onChange={(e) =>
                              updateSocialLinks({ github: e.target.value })
                            }
                            className="h-8 bg-secondary border-border/50 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">LinkedIn</Label>
                          <Input
                            value={editorState.socialLinks.linkedin}
                            onChange={(e) =>
                              updateSocialLinks({ linkedin: e.target.value })
                            }
                            className="h-8 bg-secondary border-border/50 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Twitter</Label>
                          <Input
                            value={editorState.socialLinks.twitter}
                            onChange={(e) =>
                              updateSocialLinks({ twitter: e.target.value })
                            }
                            className="h-8 bg-secondary border-border/50 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Website</Label>
                          <Input
                            value={editorState.socialLinks.website}
                            onChange={(e) =>
                              updateSocialLinks({ website: e.target.value })
                            }
                            className="h-8 bg-secondary border-border/50 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Other Links</Label>
                          <div className="space-y-2">
                            {editorState.socialLinks.other.map((link, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={link.label}
                                  onChange={(e) =>
                                    updateOtherLink(index, { label: e.target.value })
                                  }
                                  placeholder="Label"
                                  className="h-8 bg-secondary border-border/50 text-xs"
                                />
                                <Input
                                  value={link.url}
                                  onChange={(e) =>
                                    updateOtherLink(index, { url: e.target.value })
                                  }
                                  placeholder="URL"
                                  className="h-8 bg-secondary border-border/50 text-xs flex-1"
                                />
                                <button
                                  type="button"
                                  className="text-[11px] text-muted-foreground hover:text-destructive"
                                  onClick={() => removeOtherLink(index)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addOtherLink}
                          >
                            Add link
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Live preview */}
          <div ref={previewContainerRef} className="flex-1 rounded-2xl bg-card border border-border/50 overflow-hidden min-h-[400px] relative">
            <div
              className="absolute inset-0 overflow-auto no-scrollbar"
            >
              <div
                style={{
                  width: device === "desktop" ? "1440px" : device === "tablet" ? "768px" : "375px",
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                {ThemeComponent ? (
                  <ThemeComponent content={previewContent} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-sm text-muted-foreground">Theme "{editorState.theme}" not found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setShowPublishModal(false); setPublished(false); }} />
          <div className="relative bg-card border border-border/50 rounded-2xl p-8 max-w-md w-full animate-slide-up">
            <button onClick={() => { setShowPublishModal(false); setPublished(false); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {!published ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-xl mb-1">Publish Portfolio</h2>
                  <p className="text-sm text-muted-foreground">Choose your portfolio URL and go live.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Portfolio URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">r2p.io/</span>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} className="h-9 bg-secondary border-border/50 text-sm" />
                  </div>
                  <p className="text-xs text-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Username available</p>
                </div>

                <Button variant="hero" className="w-full" size="lg" onClick={handlePublish} disabled={publishing}>
                  <Rocket className="w-4 h-4" /> {publishing ? "Publishing..." : "Publish Now"}
                </Button>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl mb-1">Your portfolio is live! 🎉</h2>
                  <p className="text-sm text-muted-foreground">Share it with the world.</p>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm flex-1 text-left">r2p.io/{username}</span>
                  <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${username}`); }}><Copy className="w-3.5 h-3.5" /></Button>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" size="lg" onClick={() => window.open(`/${username}`, '_blank')}><Eye className="w-4 h-4" /> View Site</Button>
                  <Button variant="hero" className="flex-1" size="lg"><Share2 className="w-4 h-4" /> Share</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PortfolioEditor;
