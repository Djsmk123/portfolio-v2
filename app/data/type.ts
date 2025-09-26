
export type adminUserType = {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
    refresh_token: string;
    user: {
        id: string;
        email: string;
    }
}


export type profileStatsType = {
    label: string;
    value: number | string;
    color: string;
    bgColor: string;
    description: string;
}

//thought of the day
export type thoughtOfTheDayType = {
    quote: string;
    author: string;
    url: string;
    authorImageUrl: string | null;
}

//home page data
export type homePageDataType = {
    stats: profileStatsType[];
    thoughtOfTheDay: thoughtOfTheDayType;
    skills: skillType[];
    projects: projectType[];
    blogs: postType[];
    experience: experienceType[];
}

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