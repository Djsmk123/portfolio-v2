// import { NextRequest, NextResponse } from 'next/server';

// // Define the data structures for clarity
// type GithubData = {
//   followers: number;
//   totalRepos: number;
//   totalStars: number;
//   totalForks: number;
//   topRepos: TopRepo[];
// };

// type TopRepo = {
//   name: string;
//   description: string;
//   url: string;
//   languages: string[];
//   stars: number;
//   forks: number;
//   issues: number;
//   pullRequests: number;
//   commits: number;
//   lastUpdated: string;
// };

// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
// const USERNAME = "djsmk123";

// /**
//  * Fetches all pages for a paginated GitHub API endpoint.
//  */
// async function fetchAllPages(url: string, headers: HeadersInit) {
//   let results: any[] = [];
//   let nextUrl: string | null = url;
//   while (nextUrl) {
//     const response: Response = await fetch(nextUrl, { headers })
//     if (!response.ok) {
//       throw new Error(`GitHub API request failed: ${response.statusText}`)
//     }
//     results = results.concat(await response.json());
    
//     const linkHeader = response.headers.get('Link');
//     const nextLink = linkHeader?.split(',').find(s => s.includes('rel="next"'));
//     nextUrl = nextLink ? nextLink.match(/<(.+)>/)?.[1] || null : null;
//   }
  
//   return results;
// }


// export async function GET(request: NextRequest) {
//   try {
//     if (!GITHUB_TOKEN) {
//         throw new Error("GITHUB_TOKEN is not set in environment variables.");
//     }

//     const headers = {
//       Authorization: `token ${GITHUB_TOKEN}`,
//       Accept: "application/vnd.github.v3+json",
//       'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
//     };

//     // 1️⃣ Get user profile data
//     const userRes = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
//     if (!userRes.ok) throw new Error("Failed to fetch user data");
//     const user = await userRes.json();

//     // 2️⃣ Get all repositories to calculate total stars and forks accurately
//     const allRepos = await fetchAllPages(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, headers);

//     let totalStars = 0;
//     let totalForks = 0;
//     for (const repo of allRepos) {
//       totalStars += repo.stargazers_count;
//       totalForks += repo.forks_count;
//     }

//     // 3️⃣ Determine the top 10 repositories based on stars
//     const sortedRepos = [...allRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);
//     const top10ReposData = sortedRepos.slice(0, 10);

//     // 4️⃣ Enrich the top 10 repos with additional data in parallel
//     const topRepos: TopRepo[] = await Promise.all(
//       top10ReposData.map(async (repo: any) => {
//         // Fetch languages
//         const langRes = await fetch(repo.languages_url, { headers });
//         const langData = langRes.ok ? await langRes.json() : {};
//         const languages = Object.keys(langData);

//         // Fetch user's commit count for this specific repo
//         // This gives a more accurate count of the user's own contributions.
//         let commitCount = 0;
//         const contributorsRes = await fetch(`${repo.url}/stats/contributors`, { headers });
//         if (contributorsRes.ok) {
//           const contributors = await contributorsRes.json();
//           const userContribution = contributors.find((c: any) => c.author.login === USERNAME);
//           if (userContribution) {
//             commitCount = userContribution.total;
//           }
//         }
        
//         // Fetch user's pull request count for this specific repo
//         let prCount = 0;
//         const prSearchRes = await fetch(`https://api.github.com/search/issues?q=repo:${repo.full_name}+is:pr+author:${USERNAME}`, { headers });
//         if (prSearchRes.ok) {
//             const prSearchResult = await prSearchRes.json();
//             prCount = prSearchResult.total_count;
//         }

//         return {
//           name: repo.name,
//           description: repo.description,
//           url: repo.html_url,
//           languages,
//           stars: repo.stargazers_count,
//           forks: repo.forks_count,
//           issues: repo.open_issues_count,
//           pullRequests: prCount,
//           commits: commitCount,
//           lastUpdated: repo.updated_at,
//         };
//       })
//     );
    
//     // 5️⃣ Assemble the final data object
//     const data: GithubData = {
//       followers: user.followers,
//       totalRepos: user.public_repos,
//       totalStars,
//       totalForks,
//       topRepos,
//     };

//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     console.error("API Error:", errorMessage);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: errorMessage },
//       { status: 500 }
//     );
//   }
// }