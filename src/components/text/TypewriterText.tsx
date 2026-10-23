import type React from "react";
import { Interactive, useCurrentFrame, useVideoConfig } from "remotion";

type TypewriterTextProps = {
  readonly children: React.ReactNode;
  readonly style: React.CSSProperties;
};

const TypewriterTextInner = ({ children, style }: TypewriterTextProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = typeof children === "string" ? children : "";
  const charsPerSecond = 20;
  const charsToShow = Math.min(
    Math.floor((frame / fps) * charsPerSecond),
    text.length,
  );
  const showCursor = frame % Math.round(fps / 2) < Math.round(fps / 4);

  return (
    <div style={style}>
      {text.slice(0, charsToShow)}
      {charsToShow < text.length && (
        <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
      )}
    </div>
  );
};

export const TypewriterText = Interactive.create({
  Component: TypewriterTextInner,
  layout: "none",
  schema: {
    ...Interactive.textSchema,
    ...Interactive.childrenSchema,
  },
});
