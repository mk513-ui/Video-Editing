import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type FadeInTextProps = {
  readonly children: React.ReactNode;
  readonly style: React.CSSProperties;
};

const FadeInTextInner = ({ children, style }: FadeInTextProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, ...style }}>
      {words.map((word, i) => {
        const delay = i * Math.round(fps * 0.15);
        return (
          <span
            key={`${i}-${word}`}
            style={{
              opacity: interpolate(frame, [delay, delay + fps * 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [delay, delay + fps * 0.4],
                ["0px 20px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const FadeInText = Interactive.create({
  Component: FadeInTextInner,
  layout: "none",
  schema: {
    ...Interactive.textSchema,
    ...Interactive.childrenSchema,
  },
});
