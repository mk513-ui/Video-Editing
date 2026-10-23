import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { display, entri, mono, safe } from "../../design/entri";

type HookTitleProps = {
  readonly tag: string;
  readonly title: string;
};

// The question that stays pinned to the top for the whole clip, so someone
// who scrolls in halfway still knows what's being answered.
export const HookTitle = ({ tag, title }: HookTitleProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Starts a few frames "early" so the hook is already readable on frame 0 —
  // that's the frame the feed and the thumbnail show.
  const enter = spring({ frame: frame + 6, fps, config: { damping: 14, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: safe.top }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
          scale: interpolate(enter, [0, 1], [0.85, 1]),
          translate: interpolate(enter, [0, 1], ["0px -50px", "0px 0px"]),
        }}
      >
        {tag ? (
          <div
            style={{
              ...mono,
              fontSize: 30,
              letterSpacing: 3,
              color: entri.ink,
              backgroundColor: entri.lime,
              padding: "8px 20px",
              borderRadius: 999,
            }}
          >
            {tag.toUpperCase()}
          </div>
        ) : null}
        <div
          style={{
            ...display,
            fontSize: 88,
            color: entri.paper,
            backgroundColor: entri.ink,
            padding: "24px 34px 18px",
            borderRadius: 24,
            maxWidth: 960,
            textAlign: "center",
            textWrap: "balance",
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
