import { LinkedinIcon,GithubIcon,XIcon } from "lucide-react"
import Link from "next/link"

export function SocialLinks() {
    const links = [
      {
        href: "https://www.linkedin.com/in/md-mobin-bb928820b/",
        label: "LinkedIn",
        icon: LinkedinIcon,
      },
      {
        href: "https://github.com/djsmk123",
        label: "GitHub",
        icon: GithubIcon,
      },
      {
        href: "https://x.com/Smkwinner",
        label: "X (Twitter)",
        icon: XIcon,
      },
    ]
  
    return (
      <div className="mt-6 flex items-center gap-3 text-muted-foreground">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className="inline-flex size-9 items-center justify-center rounded-md border hover:bg-muted transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="size-4" />
          </Link>
        ))}
      </div>
    )
  }