import { LargeTitle } from "./components/section";
import { Section, SmallTitle } from "./components/section";
import Link from "next/link";
import {ProjectList} from "./projects/page";
import ExperienceList from "./components/experience/experence-list";
import BlogComponent from "./components/blogs/blog-list";
import ContactPage from "./contact/page";

function ProjectsSection() {
    return (
      <Section id="projects">
         <div className="space-y-2">
            <LargeTitle>Projects</LargeTitle>
            <SmallTitle>Selected work</SmallTitle>
         </div>
        <ProjectList />
        <div className="mt-6">
          <Link href="/projects" className="inline-flex h-10 items-center rounded-md border px-4">Show all projects</Link>
        </div>
      </Section>
    );
  }

  
  function BlogsSection() {
    return (
      <Section id="blogs">
        <BlogComponent fromHome={true} />
      </Section>
    );
  }
  
  function ExperienceSection() {
    return (
      <Section id="experience">
        <div className="space-y-2">
          <LargeTitle>Experience</LargeTitle>
          <SmallTitle>Timeline</SmallTitle>
        </div>
        <ExperienceList />
       
      </Section>
    );
  }
  

  function ContactSection() {
    return (
      <Section id="contact">
       <ContactPage fromHome={true} />
      </Section>
    );
  }

export { ProjectsSection, ExperienceSection, BlogsSection, ContactSection };