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

export const ChapterCardSchema = z.object({
  chapterNumber: z.number(),
  chapterTitle: z.string(),
  backgroundColor: zColor(),
  accentColor: zColor(),
});

type Props = z.infer<typeof ChapterCardSchema>;

export const ChapterCard = ({
  chapterNumber,
  chapterTitle,
  backgroundColor,
  accentColor,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const current = Math.round(
    interpolate(frame, [0, fps * 0.8], [0, chapterNumber], {
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
        name="Chapter number"
        style={{
          fontFamily: bodyFont.fontFamily,
          fontSize: 44,
          fontWeight: 700,
          color: accentColor,
          letterSpacing: 4,
          opacity: interpolate(frame, [0, fps * 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {`CHAPTER ${String(current).padStart(2, "0")}`}
      </Interactive.Div>
      <Interactive.Div
        name="Chapter title"
        style={{
          fontFamily: headingFont.fontFamily,
          fontSize: 96,
          fontWeight: 700,
          color: "white",
          marginTop: 16,
          opacity: interpolate(frame, [fps * 0.4, fps * 0.8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [fps * 0.4, fps * 0.8],
            ["0px 40px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {chapterTitle}
      </Interactive.Div>
      <div
        style={{
          width: 80,
          height: 4,
          backgroundColor: accentColor,
          marginTop: 32,
          opacity: interpolate(frame, [fps * 0.6, fps * 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [fps * 0.6, fps * 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
          }),
        }}
      />
    </div>
  );
};
