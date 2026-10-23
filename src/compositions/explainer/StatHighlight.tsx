import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { headingFont, bodyFont } from "../../design/fonts";

export const StatHighlightSchema = z.object({
  targetNumber: z.number(),
  prefix: z.string(),
  suffix: z.string(),
  label: z.string(),
  backgroundColor: zColor(),
  accentColor: zColor(),
});

type Props = z.infer<typeof StatHighlightSchema>;

export const StatHighlight = ({
  targetNumber,
  prefix,
  suffix,
  label,
  backgroundColor,
  accentColor,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const current = Math.round(
    interpolate(frame, [fps * 0.3, fps * 2], [0, targetNumber], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

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
        name="Stat number"
        style={{
          fontFamily: headingFont.fontFamily,
          fontSize: 180,
          fontWeight: 700,
          color: "white",
          scale: interpolate(frame, [fps * 0.3, fps * 0.6], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {`${prefix}${current}${suffix}`}
      </Interactive.Div>
      <Interactive.Div
        name="Label"
        style={{
          fontFamily: bodyFont.fontFamily,
          fontSize: 44,
          color: accentColor,
          marginTop: 16,
          opacity: interpolate(frame, [fps * 1.5, fps * 2], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {label}
      </Interactive.Div>
    </div>
  );
};
