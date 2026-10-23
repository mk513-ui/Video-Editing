// "Guess the course": one photo, a camera that zooms in on each clue, four
// options, a 3-2-1 countdown, then either the reveal or "comment your guess".
// Leave `answer` empty to hold the reveal back for a part 2.
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { z } from "zod";
import { Sfx } from "../../components/audio/Sfx";
import { CallToAction } from "../../components/overlays/CallToAction";
import { HookTitle } from "../../components/overlays/HookTitle";
import { Sticker } from "../../components/overlays/Sticker";
import { display, entri, mono } from "../../design/entri";
import { FORMATS } from "../../design/formats";

const clueSchema = z.object({
  label: z.string(),
  x: z.number().min(0).max(1), // where to zoom, as a fraction of the photo's
  y: z.number().min(0).max(1), // width (x) and height (y) — 0.5, 0.5 is the middle
  zoom: z.number().min(1).max(4),
});

export const GuessTheCourseSchema = z.object({
  tag: z.string(),
  title: z.string(),
  photo: z.string(), // path inside public/
  photoAspect: z.number(), // photo height ÷ width
  clues: z.array(clueSchema),
  options: z.array(z.string()),
  answer: z.string(),
  cta: z.string(),
});

type Props = z.infer<typeof GuessTheCourseSchema>;
type Clue = z.infer<typeof clueSchema>;

// Scene lengths in seconds.
const INTRO = 1.6;
const CLUE = 2;
const ZOOM_OUT = 0.6;
const BEFORE_COUNTDOWN = 0.6;
const COUNTDOWN = 3;
const OUTRO = 2.8;

const getTimeline = (clueCount: number, fps: number) => {
  const optionsAt = INTRO + clueCount * CLUE + ZOOM_OUT;
  const countdownAt = optionsAt + BEFORE_COUNTDOWN;
  const revealAt = countdownAt + COUNTDOWN;
  return {
    introEnd: Math.round(INTRO * fps),
    clueStart: (i: number) => Math.round((INTRO + i * CLUE) * fps),
    clueLength: Math.round(CLUE * fps),
    optionsAt: Math.round(optionsAt * fps),
    countdownAt: Math.round(countdownAt * fps),
    revealAt: Math.round(revealAt * fps),
    total: Math.round((revealAt + OUTRO) * fps),
  };
};

export const calculateGuessTheCourseMetadata: CalculateMetadataFunction<Props> = ({ props }) => ({
  durationInFrames: getTimeline(props.clues.length, FORMATS.tiktok.fps).total,
});

// The "camera": pans and zooms over the photo from clue to clue.
const PhotoCamera = ({ photo, photoAspect, clues }: Pick<Props, "photo" | "photoAspect" | "clues">) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = getTimeline(clues.length, fps);

  // Keyframes: hold wide, glide to each clue and hold, glide back out.
  const settle = Math.round(0.5 * fps);
  const wide = { x: 0.5, y: 0.5, zoom: 1 };
  const keys: { frame: number; at: Clue | typeof wide }[] = [
    { frame: 0, at: wide },
    { frame: t.introEnd, at: { ...wide, zoom: 1.05 } },
  ];
  clues.forEach((clue, i) => {
    keys.push({ frame: t.clueStart(i) + settle, at: clue });
    keys.push({ frame: t.clueStart(i) + t.clueLength, at: clue });
  });
  keys.push({ frame: t.optionsAt, at: wide });

  const ease = { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const frames = keys.map((k) => k.frame);
  const zoom = interpolate(frame, frames, keys.map((k) => k.at.zoom), ease);
  const x = interpolate(frame, frames, keys.map((k) => k.at.x), ease);
  const y = interpolate(frame, frames, keys.map((k) => k.at.y), ease);

  // Put the focus point in the middle of the screen, but never show past the photo's edges.
  const w = width * zoom;
  const h = w * photoAspect;
  const left = Math.min(0, Math.max(width - w, width / 2 - x * w));
  const top = Math.min(0, Math.max(height - h, height / 2 - y * h));

  return (
    <AbsoluteFill>
      <Img src={staticFile(photo)} style={{ position: "absolute", left, top, width: w, height: h }} />
      <AbsoluteFill
        style={{
          backgroundColor: entri.ink,
          opacity: interpolate(frame, [t.optionsAt - 6, t.optionsAt + 6], [0, 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};

// Sits under the title: the camera centres each clue, so the top of the
// screen is the one place a label never covers what's being zoomed on.
const ClueLabel = ({ index, count, label, durationInFrames }: { index: number; count: number; label: string; durationInFrames: number }) => (
  <>
    <AbsoluteFill style={{ alignItems: "center", top: 420 }}>
      <div
        style={{
          ...mono,
          fontSize: 30,
          letterSpacing: 3,
          color: entri.lime,
          backgroundColor: entri.ink,
          padding: "4px 14px",
          borderRadius: 8,
        }}
      >
        CLUE {index + 1}/{count}
      </div>
    </AbsoluteFill>
    <Sticker text={label} top={475} rotate={index % 2 === 0 ? -3 : 3} durationInFrames={durationInFrames} />
  </>
);

const Options = ({ options, answer, revealFrame }: { options: string[]; answer: string; revealFrame: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealed = answer !== "" && frame >= revealFrame;
  const reveal = spring({ frame: frame - revealFrame, fps, config: { damping: 11, stiffness: 240 } });
  const isAnswer = (option: string) => option.trim().toLowerCase() === answer.trim().toLowerCase();

  return (
    <AbsoluteFill style={{ top: 660, alignItems: "center", gap: 20 }}>
      {options.map((option, i) => {
        const enter = spring({ frame: frame - i * 4, fps, config: { damping: 14, stiffness: 200 } });
        const correct = revealed && isAnswer(option);
        return (
          <div
            key={option}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              width: 860,
              padding: "20px 34px",
              borderRadius: 22,
              backgroundColor: correct ? entri.lime : entri.paper,
              boxShadow: `0 10px 0 ${entri.ink}`,
              opacity: revealed && !correct ? interpolate(reveal, [0, 1], [1, 0.4]) : 1,
              scale: correct ? interpolate(reveal, [0, 1], [1, 1.06]) : 1,
              translate: interpolate(enter, [0, 1], ["0px 120px", "0px 0px"]),
            }}
          >
            <span style={{ ...mono, fontSize: 48, color: entri.moss }}>{"ABCD"[i]}</span>
            <span style={{ ...display, fontSize: 84, color: entri.ink, paddingTop: 8 }}>
              {correct ? `✓ ${option}` : option}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Countdown = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = 3 - Math.floor(frame / fps);
  const pop = spring({ frame: frame % fps, fps, config: { damping: 10, stiffness: 260 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", top: 430 }}>
      <div
        style={{
          ...display,
          fontSize: 200,
          color: entri.lime,
          paintOrder: "stroke fill",
          WebkitTextStroke: `24px ${entri.ink}`,
          scale: interpolate(pop, [0, 1], [1.6, 1]),
          opacity: pop,
        }}
      >
        {n}
      </div>
    </AbsoluteFill>
  );
};

export const GuessTheCourse = (props: Props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const t = getTimeline(props.clues.length, fps);
  const hasAnswer = props.answer.trim() !== "";

  return (
    <AbsoluteFill style={{ backgroundColor: entri.ink }}>
      <PhotoCamera photo={props.photo} photoAspect={props.photoAspect} clues={props.clues} />

      {props.clues.map((clue, i) => (
        <Sequence key={clue.label} name={`Clue ${i + 1}`} from={t.clueStart(i)} durationInFrames={t.clueLength}>
          <ClueLabel index={i} count={props.clues.length} label={clue.label} durationInFrames={t.clueLength} />
          <Sfx name="whoosh" from={0} volume={0.6} />
        </Sequence>
      ))}

      <Sequence name="Options" from={t.optionsAt}>
        <Options options={props.options} answer={props.answer} revealFrame={t.revealAt - t.optionsAt} />
      </Sequence>

      <Sequence name="Countdown" from={t.countdownAt} durationInFrames={t.revealAt - t.countdownAt}>
        <Countdown />
        {[0, 1, 2].map((s) => (
          <Sfx key={s} name="mouse-click" from={s * fps} volume={0.7} />
        ))}
      </Sequence>

      <HookTitle tag={props.tag} title={props.title} />
      <Sfx name="whoosh" from={0} volume={0.6} />

      <Sequence name={hasAnswer ? "Reveal" : "Call to action"} from={t.revealAt}>
        {hasAnswer ? (
          <>
            <Sticker text={`IT'S ${props.answer}!`} top={1330} durationInFrames={durationInFrames - t.revealAt + 10} />
            <Sfx name="ding" from={0} volume={0.5} />
          </>
        ) : (
          <>
            <CallToAction text={props.cta} top={1300} />
            <Sfx name="switch" from={0} volume={0.6} />
          </>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
