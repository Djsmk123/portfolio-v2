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
          <div className="mt-12 flex justify-center">
            <a
              href="https://www.buymeacoffee.com/smkwinner"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=smkwinner&button_colour=FF0000&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                alt="Buy me a coffee"
              />
            </a>
          </div>
          {/* <GameModal isOpen={isGameOpen} onClose={handleCloseGame} />
          <ScrollGameInvite onStartGame={handleStartGame} /> */}
        </div>
      </BootSequence>
    </main>
  );
}

