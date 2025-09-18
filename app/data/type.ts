import { experienceType, postType, projectType, skillType } from "./mock";

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



// export type profileStatsType = {
//     experience: number;
//     projects: number;
//     articles: number;
//     commits: number;
//     views: number;
// }

// {
//     label: "Projects",
//     value: profileStats.totalProjects,
//     icon: Code2,
//     color: "text-blue-500",
//     bgColor: "bg-blue-500/10",
//     description: "Mobile & Web Apps",
//   },
//   {
//     label: "Experience",
//     value: `${profileStats.yearsOfExperience}+`,
//     icon: Calendar,
//     color: "text-green-500",
//     bgColor: "bg-green-500/10",
//     description: "Years in Tech",
//   },
//   {
//     label: "Articles",
//     value: profileStats.blogsWritten,
//     icon: FileText,
//     color: "text-purple-500",
//     bgColor: "bg-purple-500/10",
//     description: "Blog Posts",
//   },
//   {
//     label: "Commits",
//     value: profileStats.totalCommits.toLocaleString(),
//     icon: GitCommit,
//     color: "text-orange-500",
//     bgColor: "bg-orange-500/10",
//     description: "Git Contributions",
//   },
//   {
//     label: "Views",
//     value: `${(profileStats.websiteViews / 1000).toFixed(1)}K`,
//     icon: Eye,
//     color: "text-cyan-500",
//     bgColor: "bg-cyan-500/10",
//     description: "Website Visitors",
//   },
//   {
//     label: "Stars",
//     value: profileStats.githubStars,
//     icon: Star,
//     color: "text-yellow-500",
//     bgColor: "bg-yellow-500/10",
//     description: "GitHub Stars",
//   },

//   {
//     label: "Lines of Code",
//     value: `${(profileStats.linesOfCode / 1000).toFixed(0)}K`,
//     icon: Terminal,
//     color: "text-red-500",
//     bgColor: "bg-red-500/10",
//     description: "Code Written",
//   },