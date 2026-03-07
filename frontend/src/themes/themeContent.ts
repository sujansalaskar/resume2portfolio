export type ThemeProject = {
  title: string;
  description: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export type ThemeExperience = {
  company: string;
  role: string;
  duration: string;
  description: string;
};

export type ThemeEducation = {
  institution: string;
  degree: string;
  year?: string;
};

export type ThemeSocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  other?: {
    label: string;
    url: string;
  }[];
};

export type ThemeContent = {
  name: string;
  summary?: string;
  email?: string;
  phone?: string;
  profilePictureUrl?: string;
  skills?: string[];
  projects?: ThemeProject[];
  experience?: ThemeExperience[];
  education?: ThemeEducation[];
  socialLinks?: ThemeSocialLinks;
};

