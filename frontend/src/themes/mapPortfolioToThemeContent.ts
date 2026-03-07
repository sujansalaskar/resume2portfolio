import { ThemeContent } from "./themeContent";

// Very lightweight mapper from backend Portfolio document shape to ThemeContent.
// Assumes `portfolio.content` already contains most resume-derived fields.

export type PortfolioDocument = {
  content?: any;
  projects?: {
    title?: string;
    description?: string;
    techStack?: string[] | string;
    githubUrl?: string;
    liveUrl?: string;
    screenshotUrl?: string;
  }[];
  experience?: {
    company?: string;
    role?: string;
    duration?: string;
    description?: string;
  }[];
  education?: {
    institution?: string;
    degree?: string;
    year?: string;
  }[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    other?: { label?: string; url?: string }[];
  };
  profilePictureUrl?: string;
};

export function mapPortfolioToThemeContent(
  portfolio: PortfolioDocument | null | undefined
): ThemeContent | null {
  if (!portfolio) return null;

  const base = portfolio.content || {};

  // Normalize projects
  const projects =
    portfolio.projects ||
    base.projects ||
    [];

  const normalizedProjects = projects.map((p: any) => {
    const techSource = p.techStack ?? p.tech_stack ?? p.stack ?? p.technologies;
    let techStack: string[] | undefined;
    if (Array.isArray(techSource)) {
      techStack = techSource;
    } else if (typeof techSource === "string") {
      techStack = techSource
        .split(/[,|]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return {
      title: p.title || p.name || "",
      description: p.description || p.desc || "",
      techStack,
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
    };
  });

  // Normalize experience
  const experienceSource = portfolio.experience || base.experience || [];
  const normalizedExperience = experienceSource.map((e: any) => ({
    company: e.company || "",
    role: e.role || "",
    duration: e.duration || "",
    description: e.description || "",
  }));

  // Normalize education — check top-level portfolio.education first, then base.education
  const educationSource = portfolio.education || base.education || [];
  const normalizedEducation = educationSource.map((edu: any) => ({
    institution: edu.institution || "",
    degree: edu.degree || "",
    year: edu.year || "",
  }));

  const social = portfolio.socialLinks || base.socialLinks || {};

  const themeContent: ThemeContent = {
    name: base.name || "",
    summary: base.summary || "",
    email: base.email || "",
    phone: base.phone || "",
    profilePictureUrl: portfolio.profilePictureUrl || base.profilePictureUrl,
    skills: base.skills || [],
    projects: normalizedProjects,
    experience: normalizedExperience,
    education: normalizedEducation,
    socialLinks: {
      github: social.github || "",
      linkedin: social.linkedin || "",
      twitter: social.twitter || "",
      website: social.website || "",
      other:
        Array.isArray(social.other) ?
          social.other
            .filter((o: any) => o && (o.label || o.url))
            .map((o: any) => ({
              label: o.label || "",
              url: o.url || "",
            })) :
          [],
    },
  };

  return themeContent;
}

