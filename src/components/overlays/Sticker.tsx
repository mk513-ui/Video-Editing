import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { display, entri } from "../../design/entri";

type StickerProps = {
  readonly text: string;
  // How long the sticker is on screen, in frames (for the exit animation).
  readonly durationInFrames: number;
  readonly top?: number;
  readonly rotate?: number;
};

// A Lime text sticker that slaps on, wobbles, and pops off at the end.
// Place it inside a <Sequence from={...}> — frame 0 is when it appears.
export const Sticker = ({ text, durationInFrames, top = 900, rotate = -4 }: StickerProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 9, stiffness: 260 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", top }}>
      <div
        style={{
          ...display,
          fontSize: 96,
          color: entri.ink,
          backgroundColor: entri.lime,
          padding: "22px 34px 14px",
          borderRadius: 20,
          maxWidth: 900,
          textAlign: "center",
          textWrap: "balance",
          boxShadow: `0 12px 0 ${entri.ink}`,
          rotate: `${rotate}deg`,
          scale: interpolate(
            frame,
            [durationInFrames - 5, durationInFrames],
            [enter, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
