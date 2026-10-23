import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { headingFont, bodyFont } from "../../design/fonts";

export const IntroOutroSchema = z.object({
  channelName: z.string(),
  tagline: z.string(),
  type: z.enum(["intro", "outro"]),
  backgroundColor: zColor(),
  accentColor: zColor(),
});

type Props = z.infer<typeof IntroOutroSchema>;

const LogoScene = ({ accentColor }: { readonly accentColor: string }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#111111",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Interactive.Div
        name="Logo circle"
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: accentColor,
          scale: interpolate(frame, [0, fps * 0.5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      />
    </div>
  );
};

const NameScene = ({
  channelName,
  tagline,
  backgroundColor,
  accentColor,
}: {
  readonly channelName: string;
  readonly tagline: string;
  readonly backgroundColor: string;
  readonly accentColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Interactive.Div
        name="Channel name"
        style={{
          fontFamily: headingFont.fontFamily,
          fontSize: 96,
          fontWeight: 700,
          color: "white",
          opacity: interpolate(frame, [0, fps * 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [0, fps * 0.4],
            ["0px 40px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {channelName}
      </Interactive.Div>
      <Interactive.Div
        name="Tagline"
        style={{
          fontFamily: bodyFont.fontFamily,
          fontSize: 36,
          color: accentColor,
          marginTop: 16,
          opacity: interpolate(frame, [fps * 0.3, fps * 0.7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {tagline}
      </Interactive.Div>
    </div>
  );
};

const CTAScene = ({
  type,
  accentColor,
}: {
  readonly type: "intro" | "outro";
  readonly accentColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const text = type === "intro" ? "Let’s go!" : "Thanks for watching!";

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#111111",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Interactive.Div
        name="CTA text"
        style={{
          fontFamily: headingFont.fontFamily,
          fontSize: 84,
          fontWeight: 700,
          color: accentColor,
          scale: interpolate(frame, [0, fps * 0.5], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {text}
      </Interactive.Div>
    </div>
  );
};

export const IntroOutro = ({
  channelName,
  tagline,
  type,
  backgroundColor,
  accentColor,
}: Props) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Logo" durationInFrames={2 * fps}>
        <LogoScene accentColor={accentColor} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence name="Channel" durationInFrames={3 * fps}>
        <NameScene
          channelName={channelName}
          tagline={tagline}
          backgroundColor={backgroundColor}
          accentColor={accentColor}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence name="CTA" durationInFrames={2 * fps}>
        <CTAScene type={type} accentColor={accentColor} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
