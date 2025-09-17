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

export const posts: postType[] = [
  {
    slug: "flutter-performance-guide",
    title: "Flutter performance guide",
    description: "Practical steps to keep 60fps on complex screens.",
    date: "2025-07-12",
    tags: ["Flutter", "Performance"],
    link: "https://flutter.dev/performance",
    image: "https://github.githubassets.com/images/modules/open_graph/github-mark.png",
    featuredArticle: true,
    likes: 1247,
    featuredOnGoogleDevLibrary: true,
  },
  {
    slug: "react-native-animations",
    title: "React Native animations that feel right",
    description: "From reanimated to simple easing tricks.",
    date: "2025-05-20",
    tags: ["React Native", "Animations"],
    link: "https://reactnative.dev/animations",
    image: "https://github.githubassets.com/images/modules/open_graph/github-mark.png",
    featuredArticle: false,
    featuredOnGoogleDevLibrary: true,
  },
  {
    slug: "nextjs-seo-best-practices",
    title: "Next.js SEO best practices",
    description: "How to structure metadata, sitemaps, and canonical URLs.",
    date: "2025-03-02",
    tags: ["Next.js", "SEO"],
    link: "https://nextjs.org/docs/app/building-your-application/optimizing/seo",
    image: "https://github.githubassets.com/images/modules/open_graph/github-mark.png",
    featuredArticle: false,
  },
  {
    slug: "tailwind-design-system",
    title: "Building a design system with Tailwind",
    description: "Component-driven workflows and theme tokens.",
    date: "2025-02-15",
    tags: ["TailwindCSS", "Design System"],
    link: "https://tailwindcss.com/docs/installation",
    image: "https://tailwindcss.com/_next/static/media/social-card-large.a6e71726.jpg",
    featuredArticle: true,
  },
  {
    slug: "ai-coding-companions",
    title: "AI-powered coding companions",
    description: "Exploring GitHub Copilot, ChatGPT, and beyond.",
    date: "2025-01-05",
    tags: ["AI", "Developer Tools"],
    link: "https://github.blog/copilot/",
    image: "https://github.githubassets.com/images/modules/open_graph/github-mark.png",
    featuredArticle: false,
  },
  {
    slug: "graphql-vs-rest",
    title: "GraphQL vs REST: When to choose what?",
    description: "Tradeoffs between flexibility and simplicity.",
    date: "2024-12-20",
    tags: ["GraphQL", "REST", "API"],
    link: "https://graphql.org/learn/",
    image: "https://graphql.org/img/og-image.png",
    featuredArticle: false,
  },
  {
    slug: "docker-for-developers",
    title: "Docker for developers",
    description: "Simplifying dev environments with containers.",
    date: "2024-11-11",
    tags: ["Docker", "DevOps"],
    link: "https://www.docker.com/101-tutorial/",
    image: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png",
    featuredArticle: false,
  },
  {
    slug: "kubernetes-essentials",
    title: "Kubernetes essentials",
    description: "Scaling apps with pods, services, and deployments.",
    date: "2024-10-05",
    tags: ["Kubernetes", "Cloud"],
    link: "https://kubernetes.io/docs/tutorials/",
    image: "https://kubernetes.io/images/kubernetes-horizontal-color.png",
    featuredArticle: true,
  },
  {
    slug: "sveltekit-intro",
    title: "Getting started with SvelteKit",
    description: "Fast, minimal, and fun web apps.",
    date: "2024-08-25",
    tags: ["Svelte", "Web Development"],
    link: "https://kit.svelte.dev/docs/introduction",
    image: "https://svelte.dev/images/svelte-logo.svg",
    featuredArticle: false,
  },
  {
    slug: "deno-vs-node",
    title: "Deno vs Node.js: The future of JavaScript runtimes?",
    description: "Secure-by-default vs battle-tested ecosystem.",
    date: "2024-07-12",
    tags: ["Deno", "Node.js", "JavaScript"],
    link: "https://deno.land/manual",
    image: "https://deno.land/logo.svg",
    featuredArticle: false,
  },
];



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

export const projects: projectType[] = [
  {
    id: "habits",
    name: "HabitFlow",
    desc: "A cross‑platform habit tracker with offline sync.",
    tags: ["Flutter", "Riverpod", "SQLite"],
    images: ["https://cdn.shopify.com/s/files/1/0070/7032/files/ux_design.png?v=1728675736"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "finance",
    name: "Pennywise",
    desc: "Personal finance dashboard and budgeting app. You can track your income, expenses, and savings. Built with React Native and Reanimated. Personal finance dashboard and budgeting app. You can track your income, expenses, and savings. Built with React Native and Reanimated Personal finance dashboard and budgeting app. You can track your income, expenses, and savings. Built with React Native and Reanimated",
    tags: ["React Native", "Reanimated"],
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/mobile-app-interface-eco-tracking-jAScnLk2oE5P8u6oOU6nSTzVKubfRm.jpg", "https://uizard.io/static/2b12b4964dcde0c9a5e164698bd77f79/a8e47/114e4f2e9bc8c445213e504231ffb79ca627d84f-1440x835.png", "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/payment-app-ios-interface-pRSNuB6mmvp0rOY9LZtCOkOzQOyHVT.jpg", "https://img.freepik.com/free-vector/various-screens-violet-public-transport-mobile-app_23-2148704862.jpg"],
    createdAt: Date.now(),
    updatedAt: "Date.now()"
  },
  {
    id: "fitness",
    name: "PulseFit",
    desc: "Workout planner with wearable integrations. You can track your workouts, exercises, and progress. Built with Flutter and BLE.",
    tags: ["Flutter", "BLE"],
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/payment-app-ios-interface-pRSNuB6mmvp0rOY9LZtCOkOzQOyHVT.jpg", "https://img.freepik.com/free-vector/various-screens-violet-public-transport-mobile-app_23-2148704862.jpg", "https://www.smartsight.in/wp-content/uploads/2022/01/Best-Mobile-App-UI-UX-Design-Trends-in-2022.jpg"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "music",
    name: "Music Player",
    desc: "Music player app.",
    tags: ["Flutter", "BLE"],
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/ecommerce-mobile-app-interface-eoSpNP84RSFJPg3TanmT3nuB7PNlx1.jpg", "https://cdn.dribbble.com/userupload/16763407/file/original-c5acca252aebee50333ebef892a52f09.png?format=webp&resize=400x300&vertical=center", "https://existek3-838c.kxcdn.com/wp-content/uploads/2022/08/6-6.webp"],
    createdAt: Date.now(),
    links: {
      "playstore": "https://play.google.com/store/apps/details?id=com.music",
      "appstore": "https://apps.apple.com/us/app/music/id1234567890",
      "website": "https://music.com",
    },
    github: "https://github.com/music",
    updatedAt: Date.now(),
    org: {
      "name": "Google",
      "logo": "https://icon2.cleanpng.com/20240216/sqo/transparent-google-logo-google-logo-in-black-circle-colorful-1710875294177.webp",
      "url": "https://google.com",
    },
  },
];



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

export type profileStatsType = {
  totalProjects: number
  totalExperience: number
  blogsWritten: number
  totalCommits: number
  websiteViews: number
  githubStars: number
  yearsOfExperience: number
  clientsServed: number
  linesOfCode: number
  technologiesUsed: number
}

export const profileStats: profileStatsType = {
  totalProjects: 24,
  totalExperience: 5,
  blogsWritten: 12,
  totalCommits: 2847,
  websiteViews: 15600,
  githubStars: 342,
  yearsOfExperience: 5,
  clientsServed: 18,
  linesOfCode: 125000,
  technologiesUsed: 15
}

export const experience: experienceType[] = [
  {
    id: "1",
    title: "Senior Mobile Engineer",
    company: "XYZ",
    location: "New York",
    date: "2023-01-01",
    description: "Leading Flutter feature teams and performance efforts.",
    type: ExperienceType["FullTime"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "2",
    title: "Mobile Engineer",
    company: "ABC",
    location: "Los Angeles",
    date: "2021-01-01",
    description: "Shipped multiple cross‑platform apps with CI/CD.",
    type: ExperienceType["Internship"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "3",
    title: "Mobile Engineer",
    company: "ABC",
    location: "Los Angeles",
    date: "2021-01-01",
    description: "Shipped multiple cross‑platform apps with CI/CD.",
    type: ExperienceType["Contract"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
];

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
