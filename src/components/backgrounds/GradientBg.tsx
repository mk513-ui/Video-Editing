import type React from "react";
import {
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type GradientBgProps = {
  readonly style: React.CSSProperties;
};

const GradientBgInner = ({ style }: GradientBgProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const angle = interpolate(frame, [0, durationInFrames], [0, 360], {
    extrapolateRight: "clamp",
  });
  const colorStart = "#1a1a2e";
  const colorEnd = "#6c5ce7";

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(${angle}deg, ${colorStart}, ${colorEnd})`,
        ...style,
      }}
    />
  );
};

export const GradientBg = Interactive.create({
  Component: GradientBgInner,
  layout: "none",
  schema: {},
});
