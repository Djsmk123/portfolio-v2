export type postType = {
  title: string;
  description: string;
  date: string | Date | number;
  slug: string;
  tags: string[];
  link: string;
  image?: string;
  featuredArticle?: boolean;
  likes?: number;
  featuredOnGoogleDevLibrary?: boolean;
};



//types

export type projectType = {
  "id": string;
  "name": string;
  "desc": string;
  "tags": string[];
  "images": string[];
  "links"?: {
    "playstore": string;
    "appstore": string;
    "website": string;
  },
  "github"?: string;
  "org"?: {
    "name": string;
    "logo": string;
    "url": string;
  };
  "createdAt": string | Date | number;
  "updatedAt": string | Date | number;
  "isActive"?: boolean; 
}



export enum ExperienceType {
  FullTime = "Full-time",
  Internship = "Internship",
  Contract = "Contract",
}

export type experienceType = {
  "id": string;
  "title": string;
  "company": string;
  "location": string;
  "date": string;
  "description": string;
  "type": ExperienceType;
  "isActive"?: boolean;
  "createdAt": string | Date | number;
  "updatedAt": string | Date | number;
}



// Skill primitives
export type skillType = {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'mobile' | 'design' | 'cloud' | 'other'
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  yearsOfExperience: number
  icon?: string
  color?: string
}

export const skillColors: Record<string, string> = {
  React: '#61DAFB',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  NextJS: '#000000',
  TailwindCSS: '#06B6D4',
  NodeJS: '#339933',
  Express: '#000000',
  PostgreSQL: '#336791',
  Supabase: '#3ECF8E',
  Flutter: '#02569B',
  Dart: '#0175C2',
  AWS: '#FF9900',
  GCP: '#4285F4',
  Figma: '#F24E1E',
  Docker: '#2496ED',
}
