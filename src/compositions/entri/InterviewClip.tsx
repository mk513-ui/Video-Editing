// A vertical street-interview clip, built entirely from data:
//   cuts    — which seconds of which filmed clip to keep, in order (jump cuts)
//   moments — stickers, £ stamps, this-or-that cards and punch-zooms, timed
//             in seconds of the *source* clip so they stay locked to the speech
//             however the cuts are trimmed.
// Each Entri teaser in Root.tsx is just a different set of props for this.
import { Video } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Freeze,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { z } from "zod";
import { Sfx, type SfxName } from "../../components/audio/Sfx";
import { EntriCaptions } from "../../components/captions/EntriCaptions";
import { CallToAction } from "../../components/overlays/CallToAction";
import { ChoiceCard } from "../../components/overlays/ChoiceCard";
import { HookTitle } from "../../components/overlays/HookTitle";
import { MoneyStamp } from "../../components/overlays/MoneyStamp";
import { Sticker } from "../../components/overlays/Sticker";
import { CLIP_IDS, clipCaptions, clipSrc, type ClipId } from "../../data/clips";
import { entri } from "../../design/entri";
import { FORMATS } from "../../design/formats";

const clip = z.enum(CLIP_IDS);

const cutSchema = z.object({
  clip,
  from: z.number().min(0), // seconds into the source clip
  to: z.number().min(0),
  zoom: z.number().min(1).max(2), // alternate 1 / 1.15 between cuts to hide the jump
  freeze: z.boolean().optional(), // hold the frame at `from` (muted) — for endings
});

// Every moment says which clip it belongs to and when (source seconds).
const moment = { clip, at: z.number(), until: z.number() };

const stickerSchema = z.object({ ...moment, text: z.string(), top: z.number().optional() });
const moneySchema = z.object({ ...moment, amount: z.number(), label: z.string() });
const choiceSchema = z.object({
  ...moment,
  left: z.string(),
  right: z.string(),
  pick: z.enum(["left", "right"]),
  pickAt: z.number(),
});
const punchSchema = z.object(moment);

export const InterviewClipSchema = z.object({
  tag: z.string(),
  title: z.string(),
  cta: z.string(),
  ctaSeconds: z.number().min(0), // usually the length of the closing freeze cut
  sfx: z.boolean(),
  cuts: z.array(cutSchema),
  stickers: z.array(stickerSchema),
  money: z.array(moneySchema),
  choices: z.array(choiceSchema),
  punches: z.array(punchSchema),
});

type Props = z.infer<typeof InterviewClipSchema>;
type Cut = z.infer<typeof cutSchema>;
type Timed = { clip: ClipId; at: number; until: number };

const cutFrames = (cut: Cut, fps: number) => Math.round((cut.to - cut.from) * fps);

// The video is as long as its cuts added together.
export const calculateInterviewClipMetadata: CalculateMetadataFunction<Props> = ({ props }) => ({
  durationInFrames: Math.max(
    1,
    props.cuts.reduce((sum, cut) => sum + cutFrames(cut, FORMATS.tiktok.fps), 0),
  ),
});

const overlaps = (cut: Cut, m: Timed) =>
  m.clip === cut.clip && m.at < cut.to && m.until > cut.from;

// The footage for one cut. Owns the frame so only the video re-renders for zooms.
const ShotVideo = ({ cut, punches }: { cut: Cut; punches: Timed[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // A punch-in snaps the camera closer on the punchline, then eases back out.
  const punch = Math.max(
    0,
    ...punches.map((p) =>
      Math.min(
        spring({ frame: frame - p.at * fps, fps, config: { damping: 15, stiffness: 320 } }),
        interpolate(frame, [p.until * fps, p.until * fps + 6], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    ),
  );

  const video = (
    <Video
      src={clipSrc(cut.clip)}
      muted={cut.freeze}
      objectFit="cover"
      style={{ width: "100%", height: "100%" }}
    />
  );

  return (
    <AbsoluteFill
      style={{
        scale: cut.zoom * (1 + 0.2 * punch),
        transformOrigin: "50% 36%",
        filter: "contrast(1.06) saturate(1.12)",
      }}
    >
      {cut.freeze ? <Freeze frame={Math.round(cut.from * fps)}>{video}</Freeze> : video}
    </AbsoluteFill>
  );
};

// Everything that belongs to one cut. Inside a trimmed sequence the frame
// counts from the start of the source clip, so `at * fps` is a source frame.
const Shot = ({ cut, props }: { cut: Cut; props: Props }) => {
  const { fps } = useVideoConfig();
  const frames = (m: Timed) => ({
    from: Math.round(m.at * fps),
    durationInFrames: Math.round((m.until - m.at) * fps),
  });
  const captions = cut.freeze
    ? []
    : clipCaptions[cut.clip].filter((c) => {
        const mid = (c.startMs + c.endMs) / 2000;
        return mid >= cut.from && mid < cut.to;
      });

  return (
    <AbsoluteFill>
      <ShotVideo cut={cut} punches={props.punches.filter((p) => overlaps(cut, p))} />

      {props.choices
        .filter((m) => overlaps(cut, m))
        .map((m) => (
          <Sequence key={`choice-${m.at}`} name={`Choice: ${m.left} / ${m.right}`} {...frames(m)}>
            <ChoiceCard
              left={m.left}
              right={m.right}
              pick={m.pick}
              pickFrame={Math.round((m.pickAt - m.at) * fps)}
              durationInFrames={frames(m).durationInFrames}
            />
          </Sequence>
        ))}

      {props.money
        .filter((m) => overlaps(cut, m))
        .map((m) => (
          <Sequence key={`money-${m.at}`} name={`£${m.amount}`} {...frames(m)}>
            <MoneyStamp amount={m.amount} label={m.label} durationInFrames={frames(m).durationInFrames} />
          </Sequence>
        ))}

      {props.stickers
        .filter((m) => overlaps(cut, m))
        .map((m) => (
          <Sequence key={`sticker-${m.at}`} name={`Sticker: ${m.text}`} {...frames(m)}>
            <Sticker text={m.text} top={m.top} durationInFrames={frames(m).durationInFrames} />
          </Sequence>
        ))}

      <EntriCaptions
        name="Captions"
        captions={captions}
        width={920}
        style={{ position: "absolute", top: 1230, left: 80 }}
      />
    </AbsoluteFill>
  );
};

export const InterviewClip = (props: Props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const ctaFrames = Math.round(props.ctaSeconds * fps);

  // Where each cut starts in the finished video, so sound effects (which live
  // outside the cuts, to keep their tails) can be placed at the right moment.
  const starts: number[] = [];
  props.cuts.reduce((at, cut) => {
    starts.push(at);
    return at + cutFrames(cut, fps);
  }, 0);
  const outputFrame = (clipId: ClipId, seconds: number) => {
    const i = props.cuts.findIndex(
      (c) => c.clip === clipId && seconds >= c.from && seconds < c.to,
    );
    return i === -1 ? null : starts[i] + Math.round((seconds - props.cuts[i].from) * fps);
  };

  const sounds: { name: SfxName; frame: number | null; volume: number }[] = [
    { name: "whoosh", frame: 0, volume: 0.6 },
    ...props.stickers.map((m) => ({ name: "switch" as const, frame: outputFrame(m.clip, m.at), volume: 0.6 })),
    ...props.money.map((m) => ({ name: "ding" as const, frame: outputFrame(m.clip, m.at + 0.6), volume: 0.35 })),
    ...props.choices.map((m) => ({ name: "whoosh" as const, frame: outputFrame(m.clip, m.at), volume: 0.45 })),
    ...props.choices.map((m) => ({ name: "ding" as const, frame: outputFrame(m.clip, m.pickAt), volume: 0.3 })),
    ...props.punches.map((m) => ({ name: "vine-boom" as const, frame: outputFrame(m.clip, m.at), volume: 0.4 })),
    { name: "switch", frame: props.cta ? durationInFrames - ctaFrames : null, volume: 0.6 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: entri.ink }}>
      <TransitionSeries name="Cuts">
        {props.cuts.map((cut, i) => (
          <TransitionSeries.Sequence
            key={`${cut.clip}-${cut.from}`}
            name={`Cut ${i + 1} (${cut.from}s–${cut.to}s)`}
            trimBefore={Math.round(cut.from * fps)}
            durationInFrames={cutFrames(cut, fps)}
          >
            <Shot cut={cut} props={props} />
          </TransitionSeries.Sequence>
        ))}
      </TransitionSeries>

      <HookTitle tag={props.tag} title={props.title} />

      {props.cta ? (
        <Sequence name="Call to action" from={durationInFrames - ctaFrames}>
          {/* Sits where the captions go: the closing freeze-frame has none. */}
          <CallToAction text={props.cta} top={1200} />
        </Sequence>
      ) : null}

      {props.sfx
        ? sounds.map((s, i) =>
            s.frame === null ? null : <Sfx key={i} name={s.name} from={s.frame} volume={s.volume} />,
          )
        : null}
    </AbsoluteFill>
  );
};
