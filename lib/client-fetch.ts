//fetch with cache first
//query perameters

import { fromDb as fromDbProjects } from "@/app/admin/components/projects/utils"
import { fromDb as fromDbExperience } from "@/app/admin/components/experience/utils"
import { experienceType, postType, projectType, skillType } from "@/app/data/type"
import { profileStatsType, thoughtOfTheDayType } from "@/app/data/type"


type QueryParameters = {
  [key: string]: string | number | boolean | undefined
}

//is dev 
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

export async function clientFetch<T>(url: string, queryParameters?: QueryParameters): Promise<T> {
  let queryString = ''
  if (queryParameters) {
    const params = Object.entries(queryParameters)
      .filter(([, value]) => value !== undefined)
      .reduce((acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      }, {} as Record<string, string>)
    queryString = `?${new URLSearchParams(params).toString()}`
  }
  const fullUrl = `${url}${queryString}`
  
  try {
    const enableCache = isDev ? 'no-store' : 'force-cache'
    const revalidate = isDev ? 0 : 3600
    const res = await fetch(fullUrl, {
      cache: enableCache,
      next: { revalidate: revalidate } // Revalidate every hour
    })
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${fullUrl}: ${res.status} ${res.statusText}`)
    }
    
    return await res.json() as T
  } catch (error) {
    console.error(`Error fetching ${fullUrl}:`, error)
    throw error
  }
}
//fetch stats

export async function fetchStats(): Promise<profileStatsType[]> {
   const stats = await clientFetch<profileStatsType[]>('/api/public/stats')
   //normalize "Loc" -> "LOC"
   stats.forEach((stat) => {
    if (stat.label === "Loc") stat.label = "LOC"
   })
   return stats
}

//fetch thought of the day

export async function fetchThoughtOfTheDay(): Promise<thoughtOfTheDayType> {
   const thoughtOfTheDay = await clientFetch<thoughtOfTheDayType>('/api/public/tod')
   return thoughtOfTheDay
}



//fetch skills

export async function fetchSkills(): Promise<skillType[]> {
   const skills = await clientFetch<skillType[]>('/api/public/skills')
   return skills
}


//fetch projects


type ProjectResponse = {
  projects: []
  total: number
}

type PaginationParams = {
  page?: number
  limit?: number
}



export async function fetchProjects(pagination?: PaginationParams): Promise<{ projects: projectType[], total: number }> {
  const res = await clientFetch<ProjectResponse>('/api/public/projects', pagination)
  const projects: projectType[] = []
  for (const project of res.projects) {
    projects.push(fromDbProjects(project))
  }
  return {
    projects,
    total: res.total
  }
}

//fetch experience

type ExperienceResponse = {
  experiences: []
  total: number
}

export async function fetchExperience(pagination?: PaginationParams): Promise<{ experiences: experienceType[], total: number }> {
  const res = await clientFetch<ExperienceResponse>('/api/public/experience', pagination)
  const experiences: experienceType[] = []
  for (const experience of res.experiences) {
    experiences.push(fromDbExperience(experience))
  }
  return {
    experiences,
    total: res.total
  }
}

//fetch blogs
export async function fetchBlogs (): Promise<postType[]> {
  try {
    const blogs = await clientFetch<[]>('https://dev.to/api/articles?username=djsmk123')
    return blogs.map((blog: {
        title: string | null,
        description: string,
        published_at: string,
        slug: string | null,
        tag_list: string[] | null,
        url: string | null,
        cover_image: string,
        public_reactions_count: number
    }): postType => ({
        title: blog.title ?? '',
        description: blog.description ?? '',
        date: blog.published_at,
        slug: blog.slug ?? '',
        tags: blog.tag_list ?? [],
        link: blog.url ?? '',
        image: blog.cover_image,
        likes: blog.public_reactions_count,
        featuredOnGoogleDevLibrary: false
    }))
  } catch (err) {
    console.error('Error fetching blogs:', err)
    return []
  }
}

