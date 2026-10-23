import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { display, entri } from "../../design/entri";

type ChoiceCardProps = {
  readonly left: string;
  readonly right: string;
  readonly pick: "left" | "right";
  // Frames after the card appears when the answer is said.
  readonly pickFrame: number;
  readonly durationInFrames: number;
  readonly top?: number;
};

// "This or that": two options slide in, then the one they pick lights up Lime.
// Place it inside a <Sequence from={...}> — frame 0 is when it appears.
export const ChoiceCard = ({
  left,
  right,
  pick,
  pickFrame,
  durationInFrames,
  top = 905,
}: ChoiceCardProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const picked = spring({ frame: frame - pickFrame, fps, config: { damping: 11, stiffness: 240 } });
  const exit = interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const option = (text: string, side: "left" | "right", index: number) => {
    const enter = spring({ frame: frame - index * 3, fps, config: { damping: 14, stiffness: 200 } });
    const isPick = side === pick && frame >= pickFrame;
    const isLoser = side !== pick && frame >= pickFrame;
    const from = side === "left" ? "-700px 0px" : "700px 0px";

    return (
      <div
        style={{
          ...display,
          fontSize: 86,
          padding: "22px 40px 14px",
          borderRadius: 22,
          minWidth: 560,
          textAlign: "center",
          color: isPick ? entri.ink : entri.paper,
          backgroundColor: isPick ? entri.lime : entri.ink,
          opacity: isLoser ? interpolate(picked, [0, 1], [1, 0.45]) : 1,
          translate: interpolate(enter, [0, 1], [from, "0px 0px"]),
          scale: isPick ? interpolate(picked, [0, 1], [1, 1.08]) : 1,
          boxShadow: isPick ? `0 12px 0 ${entri.ink}` : "none",
        }}
      >
        {isPick ? "✓ " : ""}
        {text}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ alignItems: "center", top, scale: String(exit) }}>
      {option(left, "left", 0)}
      <div
        style={{
          ...display,
          fontSize: 54,
          color: entri.lime,
          margin: "10px 0",
          paintOrder: "stroke fill",
          WebkitTextStroke: `10px ${entri.ink}`,
        }}
      >
        OR
      </div>
      {option(right, "right", 1)}
    </AbsoluteFill>
  );
};
