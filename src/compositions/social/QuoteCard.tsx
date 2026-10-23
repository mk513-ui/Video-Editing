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
import { safeArea } from "../../design/theme";

export const QuoteCardSchema = z.object({
  quote: z.string(),
  author: z.string(),
  backgroundColor: zColor(),
  accentColor: zColor(),
});

type Props = z.infer<typeof QuoteCardSchema>;

export const QuoteCard = ({ quote, author, backgroundColor, accentColor }: Props) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const safe = safeArea(width);
  const words = quote.split(" ");

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(135deg, ${backgroundColor}, ${accentColor}40)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: `${safe.vertical}px ${safe.horizontal}px`,
      }}
    >
      <Interactive.Div
        name="Quote mark"
        style={{
          fontSize: 160,
          color: accentColor,
          fontFamily: "Georgia, serif",
          lineHeight: 1,
          opacity: interpolate(frame, [0, fps * 0.3], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {"“"}
      </Interactive.Div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
          maxWidth: width - safe.horizontal * 2,
        }}
      >
        {words.map((word, i) => {
          const delay = fps * 0.3 + i * Math.round(fps * 0.12);
          return (
            <span
              key={`${i}-${word}`}
              style={{
                fontFamily: headingFont.fontFamily,
                fontSize: 72,
                fontWeight: 700,
                color: "white",
                opacity: interpolate(
                  frame,
                  [delay, delay + fps * 0.3],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
                translate: interpolate(
                  frame,
                  [delay, delay + fps * 0.3],
                  ["0px 30px", "0px 0px"],
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
      <Interactive.Div
        name="Author"
        style={{
          fontFamily: bodyFont.fontFamily,
          fontSize: 36,
          color: "#a0aec0",
          marginTop: 48,
          opacity: interpolate(
            frame,
            [fps * 2, fps * 2.5],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        {`— ${author}`}
      </Interactive.Div>
    </div>
  );
};
