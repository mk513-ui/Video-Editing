import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { display, entri, mono } from "../../design/entri";

type MoneyStampProps = {
  readonly amount: number;
  readonly label: string;
  readonly durationInFrames: number;
  readonly top?: number;
};

// A price that counts up from £0 like a till, then sits there judging you.
// Place it inside a <Sequence from={...}> — frame 0 is when it appears.
export const MoneyStamp = ({ amount, label, durationInFrames, top = 910 }: MoneyStampProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 10, stiffness: 220 } });
  const shown = Math.round(
    interpolate(frame, [0, 0.6 * fps], [0, amount], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  return (
    <AbsoluteFill style={{ alignItems: "center", top }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rotate: "-5deg",
          scale: interpolate(
            frame,
            [durationInFrames - 5, durationInFrames],
            [enter, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        <div
          style={{
            ...mono,
            fontSize: 170,
            lineHeight: 1,
            color: entri.ink,
            backgroundColor: entri.lime,
            padding: "18px 40px",
            borderRadius: 24,
            boxShadow: `0 14px 0 ${entri.ink}`,
          }}
        >
          £{shown}
        </div>
        {label ? (
          <div
            style={{
              ...display,
              fontSize: 60,
              color: entri.paper,
              backgroundColor: entri.ink,
              padding: "14px 26px 8px",
              borderRadius: 16,
              marginTop: 24,
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
