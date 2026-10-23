import { Composition, Folder } from "remotion";
import { FORMATS } from "./design/formats";
import { QuoteCard, QuoteCardSchema } from "./compositions/social/QuoteCard";
import {
  IntroOutro,
  IntroOutroSchema,
} from "./compositions/youtube/IntroOutro";
import {
  ChapterCard,
  ChapterCardSchema,
} from "./compositions/youtube/ChapterCard";
import {
  StepByStep,
  StepByStepSchema,
} from "./compositions/explainer/StepByStep";
import {
  StatHighlight,
  StatHighlightSchema,
} from "./compositions/explainer/StatHighlight";
import { TitleScene } from "./components/scenes/TitleScene";
import { LowerThird } from "./components/overlays/LowerThird";
import {
  InterviewClip,
  InterviewClipSchema,
  calculateInterviewClipMetadata,
} from "./compositions/entri/InterviewClip";
import {
  GuessTheCourse,
  GuessTheCourseSchema,
  calculateGuessTheCourseMetadata,
} from "./compositions/entri/GuessTheCourse";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Pre-launch teasers for Entri. Cut times are seconds into each source
          clip — see the transcripts in src/data/captions/. */}
      <Folder name="Entri-Teasers">
        <Composition
          id="WorstConfession"
          component={InterviewClip}
          schema={InterviewClipSchema}
          calculateMetadata={calculateInterviewClipMetadata}
          durationInFrames={600}
          {...FORMATS.tiktok}
          defaultProps={{
            tag: "Asking Exeter",
            title: "Worst drunken confession? 💀",
            cta: "Comment yours 👇",
            ctaSeconds: 1.6,
            sfx: true,
            cuts: [
              { clip: "20261021-153753", from: 0.45, to: 5.05, zoom: 1 },
              { clip: "20261021-153753", from: 5.45, to: 7.95, zoom: 1.15 },
              { clip: "20261021-142322", from: 3.9, to: 7.55, zoom: 1 },
              { clip: "20261021-142322", from: 7.9, to: 9.95, zoom: 1.15 },
              { clip: "20261021-142322", from: 12.25, to: 13.45, zoom: 1 },
              { clip: "20261021-142322", from: 15.3, to: 16.45, zoom: 1.15 },
              { clip: "20261021-142322", from: 17.32, to: 20.5, zoom: 1 },
              { clip: "20261021-142322", from: 20.75, to: 22.0, zoom: 1.15 },
              { clip: "20261021-142322", from: 22.6, to: 23.4, zoom: 1.15 },
              { clip: "20261021-142322", from: 23.4, to: 25.0, zoom: 1.15, freeze: true },
            ],
            stickers: [
              { clip: "20261021-153753", at: 0.5, until: 3.2, text: "We asked a shark 🦈" },
            ],
            money: [],
            choices: [],
            punches: [
              { clip: "20261021-153753", at: 7.0, until: 7.95 },
              { clip: "20261021-142322", at: 22.7, until: 25.0 },
            ],
          }}
        />
        <Composition
          id="NightOutSpend"
          component={InterviewClip}
          schema={InterviewClipSchema}
          calculateMetadata={calculateInterviewClipMetadata}
          durationInFrames={600}
          {...FORMATS.tiktok}
          defaultProps={{
            tag: "Asking Exeter",
            title: "Most you've spent on one night out? 💸",
            cta: "How much was yours? 👇",
            ctaSeconds: 1.6,
            sfx: true,
            cuts: [
              { clip: "20261021-152555", from: 44.7, to: 46.95, zoom: 1 },
              { clip: "20261021-152555", from: 48.12, to: 49.6, zoom: 1.15 },
              { clip: "20261021-152555", from: 50.62, to: 51.35, zoom: 1.3 },
              { clip: "20261021-152555", from: 51.75, to: 54.15, zoom: 1 },
              { clip: "20261021-142532", from: 9.9, to: 11.05, zoom: 1.15 },
              { clip: "20261021-142532", from: 11.55, to: 12.45, zoom: 1 },
              { clip: "20261021-142532", from: 13.1, to: 13.9, zoom: 1.15 },
              { clip: "20261021-142532", from: 14.75, to: 19.6, zoom: 1 },
              { clip: "20261021-142532", from: 19.95, to: 20.6, zoom: 1.15 },
              { clip: "20261021-142532", from: 20.6, to: 22.2, zoom: 1.15, freeze: true },
            ],
            stickers: [],
            money: [
              { clip: "20261021-152555", at: 50.72, until: 54.15, amount: 100, label: "One night" },
              { clip: "20261021-142532", at: 10.72, until: 12.45, amount: 220, label: "One night 😳" },
            ],
            choices: [],
            punches: [{ clip: "20261021-142532", at: 20.0, until: 22.2 }],
          }}
        />
        <Composition
          id="ThisOrThat"
          component={InterviewClip}
          schema={InterviewClipSchema}
          calculateMetadata={calculateInterviewClipMetadata}
          durationInFrames={600}
          {...FORMATS.tiktok}
          defaultProps={{
            tag: "Asking Exeter",
            title: "This or that: Exeter edition 🍻",
            cta: "What would you pick? 👇",
            ctaSeconds: 1.6,
            sfx: true,
            cuts: [
              { clip: "20261021-152555", from: 69.25, to: 70.75, zoom: 1 },
              { clip: "20261021-152555", from: 71.68, to: 72.95, zoom: 1.15 },
              { clip: "20261021-152555", from: 73.1, to: 73.95, zoom: 1 },
              { clip: "20261021-152555", from: 75.1, to: 75.6, zoom: 1.15 },
              { clip: "20261021-152555", from: 76.36, to: 77.45, zoom: 1 },
              { clip: "20261021-152555", from: 77.75, to: 78.8, zoom: 1.15 },
              { clip: "20261021-152555", from: 79.52, to: 80.95, zoom: 1 },
              { clip: "20261021-152555", from: 82.48, to: 84.95, zoom: 1.15 },
              { clip: "20261021-152555", from: 85.75, to: 86.9, zoom: 1 },
              { clip: "20261021-152555", from: 87.15, to: 87.75, zoom: 1.15 },
              { clip: "20261021-152555", from: 88.95, to: 90.4, zoom: 1 },
              { clip: "20261021-152555", from: 91.0, to: 91.95, zoom: 1.15 },
              { clip: "20261021-152555", from: 92.45, to: 93.55, zoom: 1 },
              { clip: "20261021-152555", from: 93.78, to: 95.8, zoom: 1.15 },
              { clip: "20261021-152555", from: 95.8, to: 97.4, zoom: 1.15, freeze: true },
            ],
            stickers: [],
            money: [],
            choices: [
              { clip: "20261021-152555", at: 69.3, until: 72.95, left: "Timepiece", right: "Vaults", pick: "right", pickAt: 71.9 },
              { clip: "20261021-152555", at: 73.1, until: 75.6, left: "Imp", right: "Chefs", pick: "left", pickAt: 75.16 },
              { clip: "20261021-152555", at: 76.36, until: 78.8, left: "VK", right: "Jägerbomb", pick: "right", pickAt: 77.8 },
              { clip: "20261021-152555", at: 79.52, until: 84.95, left: "MyNightOut", right: "Overheard", pick: "right", pickAt: 82.54 },
              { clip: "20261021-152555", at: 85.75, until: 87.75, left: "FAs", right: "Maccies", pick: "left", pickAt: 87.22 },
              { clip: "20261021-152555", at: 88.95, until: 91.95, left: "Rumours", right: "Old Firehouse", pick: "right", pickAt: 91.06 },
              { clip: "20261021-152555", at: 92.45, until: 95.8, left: "House party", right: "Club", pick: "left", pickAt: 93.84 },
            ],
            punches: [],
          }}
        />
        <Composition
          id="FiverEater"
          component={InterviewClip}
          schema={InterviewClipSchema}
          calculateMetadata={calculateInterviewClipMetadata}
          durationInFrames={600}
          {...FORMATS.tiktok}
          defaultProps={{
            tag: "Asking Exeter",
            title: "Worst thing you've seen on a night out? 😭",
            cta: "Worst you've seen? 👇",
            ctaSeconds: 1.6,
            sfx: true,
            cuts: [
              { clip: "20261021-152555", from: 17.6, to: 19.4, zoom: 1 },
              { clip: "20261021-152555", from: 20.9, to: 25.3, zoom: 1.15 },
              { clip: "20261021-152555", from: 25.6, to: 26.15, zoom: 1 },
              { clip: "20261021-152555", from: 26.85, to: 30.6, zoom: 1.15 },
              { clip: "20261021-152555", from: 30.8, to: 33.05, zoom: 1 },
              { clip: "20261021-152555", from: 33.2, to: 35.95, zoom: 1.15 },
              { clip: "20261021-152555", from: 36.6, to: 37.3, zoom: 1.3 },
              { clip: "20261021-152555", from: 37.3, to: 38.9, zoom: 1.3, freeze: true },
            ],
            stickers: [
              { clip: "20261021-152555", at: 22.25, until: 24.4, text: "A fiver?! 💷" },
            ],
            money: [],
            choices: [],
            punches: [{ clip: "20261021-152555", at: 32.55, until: 33.05 }],
          }}
        />
        <Composition
          id="TPTicket"
          component={InterviewClip}
          schema={InterviewClipSchema}
          calculateMetadata={calculateInterviewClipMetadata}
          durationInFrames={600}
          {...FORMATS.tiktok}
          defaultProps={{
            tag: "Asking Exeter",
            title: "Most you've paid for a TP ticket? 🎟️",
            cta: "Ever been scammed? 👇",
            ctaSeconds: 1.8,
            sfx: true,
            cuts: [
              { clip: "20261021-152555", from: 1.0, to: 2.85, zoom: 1 },
              { clip: "20261021-152555", from: 3.6, to: 4.45, zoom: 1.15 },
              { clip: "20261021-152555", from: 5.0, to: 7.35, zoom: 1 },
              { clip: "20261021-152555", from: 7.6, to: 9.42, zoom: 1.15 },
              { clip: "20261021-152555", from: 9.45, to: 10.65, zoom: 1 },
              { clip: "20261021-152555", from: 11.08, to: 12.25, zoom: 1.15 },
              { clip: "20261021-152555", from: 12.75, to: 13.5, zoom: 1 },
              { clip: "20261021-152555", from: 14.1, to: 14.65, zoom: 1.15 },
              { clip: "20261021-152555", from: 14.72, to: 15.28, zoom: 1.3 },
              { clip: "20261021-152555", from: 15.28, to: 17.1, zoom: 1.3, freeze: true },
            ],
            stickers: [
              { clip: "20261021-152555", at: 15.3, until: 17.1, text: "…yet 👀" },
            ],
            money: [
              { clip: "20261021-152555", at: 3.95, until: 7.35, amount: 25, label: "TP Wednesday" },
            ],
            choices: [],
            punches: [{ clip: "20261021-152555", at: 14.75, until: 17.1 }],
          }}
        />
        <Composition
          id="GuessTheCourse"
          component={GuessTheCourse}
          schema={GuessTheCourseSchema}
          calculateMetadata={calculateGuessTheCourseMetadata}
          durationInFrames={600}
          {...FORMATS.tiktok}
          defaultProps={{
            tag: "Exeter edition",
            title: "Guess the course 👀",
            photo: "images/guess-course-upright.jpg",
            photoAspect: 2.1648,
            clues: [
              { label: "The hair 💙", x: 0.5, y: 0.3, zoom: 2.6 },
              { label: "The tee 🏎️", x: 0.51, y: 0.45, zoom: 2.4 },
              { label: "Roller skates?! 🛼", x: 0.47, y: 0.53, zoom: 2.4 },
              { label: "The trainers 👟", x: 0.53, y: 0.9, zoom: 2.6 },
            ],
            options: ["Fine Art", "Computer Science", "Drama", "Engineering"],
            answer: "",
            cta: "Comment your guess 👇",
          }}
        />
      </Folder>
      <Folder name="Social">
        <Composition
          id="QuoteCard"
          component={QuoteCard}
          schema={QuoteCardSchema}
          durationInFrames={150}
          {...FORMATS.tiktok}
          defaultProps={{
            quote: "The best way to predict the future is to create it.",
            author: "Peter Drucker",
            backgroundColor: "#1a1a2e",
            accentColor: "#e94560",
          }}
        />
      </Folder>
      <Folder name="YouTube">
        <Composition
          id="IntroOutro"
          component={IntroOutro}
          schema={IntroOutroSchema}
          durationInFrames={180}
          {...FORMATS.youtube}
          defaultProps={{
            channelName: "My Channel",
            tagline: "Creating awesome content",
            type: "intro",
            backgroundColor: "#1a1a2e",
            accentColor: "#0b84f3",
          }}
        />
        <Composition
          id="ChapterCard"
          component={ChapterCard}
          schema={ChapterCardSchema}
          durationInFrames={90}
          {...FORMATS.youtube}
          defaultProps={{
            chapterNumber: 1,
            chapterTitle: "Getting Started",
            backgroundColor: "#1a1a2e",
            accentColor: "#0b84f3",
          }}
        />
      </Folder>
      <Folder name="Explainer">
        <Composition
          id="StepByStep"
          component={StepByStep}
          schema={StepByStepSchema}
          durationInFrames={300}
          {...FORMATS.youtube}
          defaultProps={{
            title: "How It Works",
            steps: [
              {
                title: "Sign Up",
                description: "Create your free account in seconds",
              },
              {
                title: "Choose a Plan",
                description: "Pick the plan that fits your needs",
              },
              {
                title: "Start Creating",
                description: "Begin making amazing content right away",
              },
            ],
            backgroundColor: "#1a1a2e",
            accentColor: "#0b84f3",
          }}
        />
        <Composition
          id="StatHighlight"
          component={StatHighlight}
          schema={StatHighlightSchema}
          durationInFrames={120}
          {...FORMATS.youtube}
          defaultProps={{
            targetNumber: 500,
            prefix: "",
            suffix: "K+",
            label: "Active Users",
            backgroundColor: "#1a1a2e",
            accentColor: "#00b894",
          }}
        />
      </Folder>
      <Folder name="Scenes">
        <Composition
          id="TitleScene"
          component={TitleScene}
          durationInFrames={90}
          {...FORMATS.youtube}
          defaultProps={{
            title: "Your Title Here",
            style: {
              backgroundColor: "#1a1a2e",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        />
      </Folder>
      <Folder name="Elements">
        <Composition
          id="LowerThird"
          component={LowerThird}
          durationInFrames={120}
          {...FORMATS.youtube}
          defaultProps={{
            style: {},
          }}
        />
      </Folder>
    </>
  );
};
