import type React from "react";
import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type CountUpNumberProps = {
  readonly style: React.CSSProperties;
};

const CountUpNumberInner = ({ style }: CountUpNumberProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const targetNumber = 100;
  const current = Math.round(
    interpolate(frame, [0, durationInFrames * 0.7], [0, targetNumber], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return <div style={style}>{current}</div>;
};

export const CountUpNumber = Interactive.create({
  Component: CountUpNumberInner,
  layout: "none",
  schema: {
    ...Interactive.textSchema,
  },
});
