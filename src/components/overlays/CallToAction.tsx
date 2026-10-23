import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { display, entri } from "../../design/entri";

type CallToActionProps = {
  readonly text: string;
  readonly top?: number;
};

// End-of-clip prompt ("COMMENT YOURS 👇"). Comments are the strongest signal
// to TikTok/Reels, so every clip ends by asking for one.
// Place it inside a <Sequence from={...}> — frame 0 is when it appears.
export const CallToAction = ({ text, top = 930 }: CallToActionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", top }}>
      <div
        style={{
          ...display,
          fontSize: 100,
          color: entri.ink,
          backgroundColor: entri.lime,
          padding: "26px 44px 16px",
          borderRadius: 24,
          boxShadow: `0 14px 0 ${entri.ink}`,
          textAlign: "center",
          maxWidth: 920,
          // Slap in, then a gentle pulse to keep the eye on it.
          scale: enter * (1 + 0.03 * Math.sin((frame / fps) * Math.PI * 3)),
          rotate: "-2deg",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
