"use client";

import { BlogsSection, ContactSection, ExperienceSection, ProjectsSection, GithubStats, Hero } from "./home-sections";

import { BootSequence } from "./components/boot-sequence";
import { ThoughtOfTheDay } from "./components/tod/tod-section";
import { StackShowcase } from "./components/skills/skills-showcase";

export default function Home() {
  // const [isGameOpen, setIsGameOpen] = useState(false);

  // const handleStartGame = () => {
  //   setIsGameOpen(true);
  // };

  // const handleCloseGame = () => {
  //   setIsGameOpen(false);
  // };

  return (
    <main>
      <BootSequence>
        <div className="py-12">
          <Hero/>
          <ThoughtOfTheDay />
          <StackShowcase />
          <GithubStats />
          <ProjectsSection />
          <ExperienceSection />
          <BlogsSection />
          <ContactSection />
          {/* <GameModal isOpen={isGameOpen} onClose={handleCloseGame} />
          <ScrollGameInvite onStartGame={handleStartGame} /> */}
        </div>
      </BootSequence>
    </main>
  );
}

