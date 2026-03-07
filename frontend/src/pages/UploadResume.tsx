import { useState, useRef } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle, ArrowRight, ArrowLeft, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { resume } from "@/services/api";

type ParsedExperience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

type ParsedProject = {
  name: string;
  desc: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  screenshotUrl: string;
};

type ParsedEducation = {
  degree: string;
  school: string;
  year: string;
};

type ParsedData = {
  name: string;
  role: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: ParsedExperience[];
  education: ParsedEducation[];
  projects: ParsedProject[];
};

const UploadResume = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const [parsedData, setParsedData] = useState<ParsedData>({
    name: "John Doe",
    role: "Full Stack Developer",
    email: "john.doe@example.com",
    phone: "+1 555-123-4567",
    summary: "Full-stack developer with 5+ years of experience building scalable web applications.",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "PostgreSQL"],
    experience: [
      {
        title: "Senior Developer",
        company: "TechCorp",
        period: "2022 - Present",
        description:
          "Led a cross-functional team building scalable web applications, improved system reliability, and optimized performance across key services.",
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        period: "2020 - 2022",
        description:
          "Developed and maintained responsive user interfaces, collaborated closely with designers, and implemented best practices for accessibility.",
      },
    ],
    education: [{ degree: "B.S. Computer Science", school: "MIT", year: "2020" }],
    projects: [
      {
        name: "E-Commerce Platform",
        desc: "Built a full-stack e-commerce platform with React and Node.js.",
        techStack: ["React", "Node.js", "PostgreSQL"],
        githubUrl: "",
        liveUrl: "",
        screenshotUrl: "",
      },
      {
        name: "AI Chat Bot",
        desc: "Developed an AI-powered customer support chatbot.",
        techStack: ["Python", "FastAPI", "PostgreSQL"],
        githubUrl: "",
        liveUrl: "",
        screenshotUrl: "",
      },
    ],
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type === "application/pdf" || f.name.endsWith(".docx"))) {
      setFile(f);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setError(null);
    setUploading(true);
    try {
      const data = await resume.upload(file);
      const resumeData = (data && (data.resume || data)) || {};

      const rawExperience = resumeData.experience;
      const experienceArray = Array.isArray(rawExperience)
        ? rawExperience
        : rawExperience
          ? [rawExperience]
          : [];

      const rawProjects =
        resumeData.projects ||
        resumeData.Projects ||
        resumeData.project ||
        resumeData.Project;
      const projectsArray = Array.isArray(rawProjects)
        ? rawProjects
        : rawProjects
          ? [rawProjects]
          : [];

      const rawEducation = resumeData.education;
      const educationArray = Array.isArray(rawEducation)
        ? rawEducation
        : rawEducation
          ? [rawEducation]
          : [];

      const mapped: ParsedData = {
        name: resumeData.name || "",
        role: resumeData.role || "",
        email: resumeData.email || "",
        phone: resumeData.phone || "",
        summary: resumeData.summary || "",
        skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
        experience: experienceArray.map((exp) => ({
          title: exp.role || "",
          company: exp.company || "",
          period: exp.duration || "",
          description: exp.description || "",
        })),
        projects: projectsArray.map((proj) => {
          const techStackSource =
            proj.techStack ||
            proj.tech_stack ||
            proj.stack ||
            proj.technologies;
          let techStack: string[] = [];

          if (Array.isArray(techStackSource)) {
            techStack = techStackSource;
          } else if (typeof techStackSource === "string") {
            techStack = techStackSource
              .split(/[,|]/)
              .map((t) => t.trim())
              .filter(Boolean);
          }

          const name = proj.title || proj.name || "";
          const desc =
            proj.description ||
            proj.desc ||
            proj.summary ||
            "";

          return {
            name: proj.title || "",
            desc,
            techStack,
            githubUrl: proj.githubUrl || "",
            liveUrl: proj.liveUrl || "",
            screenshotUrl: proj.screenshotUrl || "",
          };
        }),
        education: educationArray.map((edu) => ({
          degree: edu.degree || "",
          school: edu.institution || "",
          year: edu.year || "",
        })),
      };

      setParsedData(mapped);
      setStep(2);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to upload and parse resume. Please try again.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const removeSkill = (s: string) => {
    setParsedData(p => ({ ...p, skills: p.skills.filter(sk => sk !== s) }));
  };

  const [newSkill, setNewSkill] = useState("");
  const addSkill = () => {
    if (newSkill.trim()) {
      setParsedData(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {["Upload Resume", "Review Data", "Choose Theme"].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${step > i + 1 ? "bg-success text-primary-foreground" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < 2 && <div className={`flex-1 h-px ${step > i + 1 ? "bg-success" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-xl mb-1">Upload Your Resume</h2>
              <p className="text-sm text-muted-foreground">We'll extract your information automatically using AI.</p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragOver ? "border-primary bg-primary/5" : file ? "border-success bg-success/5" : "border-border hover:border-primary/50"
                }`}
            >
              <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileSelect} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-success" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-muted-foreground hover:text-foreground ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium text-sm mb-1">Drop your resume here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports PDF and DOCX (max 10MB)</p>
                </>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "70%" }} />
                </div>
                <p className="text-xs text-muted-foreground text-center">Parsing resume...</p>
              </div>
            )}

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}

            <Button variant="hero" size="lg" className="w-full" disabled={!file || uploading} onClick={handleUpload}>
              {uploading ? "Processing..." : "Upload & Parse"}
              {!uploading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-xl mb-1">Review Parsed Data</h2>
              <p className="text-sm text-muted-foreground">Edit any information before building your portfolio.</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-card border border-border/50 space-y-4">
                <h3 className="font-semibold text-sm">Personal Info</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Name</Label>
                    <Input value={parsedData.name} onChange={(e) => setParsedData(p => ({ ...p, name: e.target.value }))} className="h-9 bg-secondary border-border/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input
                      type="email"
                      value={parsedData.email || ""}
                      onChange={(e) => setParsedData(p => ({ ...p, email: e.target.value }))}
                      className="h-9 bg-secondary border-border/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Phone</Label>
                    <Input
                      value={parsedData.phone || ""}
                      onChange={(e) => setParsedData(p => ({ ...p, phone: e.target.value }))}
                      className="h-9 bg-secondary border-border/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Role / Title</Label>
                    <Input
                      value={parsedData.role || ""}
                      onChange={(e) => setParsedData(p => ({ ...p, role: e.target.value }))}
                      className="h-9 bg-secondary border-border/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Summary</Label>
                  <textarea value={parsedData.summary} onChange={(e) => setParsedData(p => ({ ...p, summary: e.target.value }))} className="w-full h-20 rounded-lg bg-secondary border border-border/50 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border/50 space-y-3">
                <h3 className="font-semibold text-sm">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {s}
                      <button onClick={() => removeSkill(s)} className="hover:text-foreground"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} placeholder="Add skill" className="h-8 bg-secondary border-border/50 text-xs" />
                  <Button variant="outline" size="sm" onClick={addSkill}><Plus className="w-3 h-3" /></Button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border/50 space-y-3">
                <h3 className="font-semibold text-sm">Experience</h3>
                {parsedData.experience.map((exp, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                    <p className="font-medium text-sm">{exp.title}</p>
                    <p className="text-xs text-muted-foreground">{exp.company} · {exp.period}</p>
                    {exp.description && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border/50 space-y-3">
                <h3 className="font-semibold text-sm">Projects</h3>
                {parsedData.projects.map((proj, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                    <p className="font-medium text-sm">{proj.name}</p>
                    <p className="text-xs text-muted-foreground">{proj.desc}</p>
                    {Array.isArray(proj.techStack) && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/5 text-xs text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border/50 space-y-3">
                <h3 className="font-semibold text-sm">Education</h3>
                {parsedData.education.map((edu, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                    <p className="font-medium text-sm">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.school} · {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4" /> Back</Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={() => {
                  try {
                    localStorage.setItem("parsed_resume", JSON.stringify(parsedData));
                  } catch {
                    // ignore storage errors
                  }
                  setStep(3);
                }}
              >
                Confirm & Choose Theme <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="text-center space-y-6 animate-fade-in py-12">
            <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl mb-2">Resume Parsed Successfully!</h2>
              <p className="text-muted-foreground">Now let's pick a beautiful theme for your portfolio.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="lg" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4" /> Edit Data</Button>
              <Link to="/dashboard/themes">
                <Button variant="hero" size="lg">
                  Choose Theme <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadResume;
