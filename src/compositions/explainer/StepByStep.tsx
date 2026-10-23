import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  Easing,
  Interactive,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { headingFont, bodyFont } from "../../design/fonts";
import { safeArea } from "../../design/theme";

export const StepByStepSchema = z.object({
  title: z.string(),
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
  backgroundColor: zColor(),
  accentColor: zColor(),
});

type Props = z.infer<typeof StepByStepSchema>;

const StepItem = ({
  stepNumber,
  title,
  description,
  accentColor,
}: {
  readonly stepNumber: number;
  readonly title: string;
  readonly description: string;
  readonly accentColor: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 32,
        opacity: interpolate(frame, [0, fps * 0.4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(
          frame,
          [0, fps * 0.4],
          ["40px 0px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: accentColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: headingFont.fontFamily,
          fontSize: 32,
          fontWeight: 700,
          color: "white",
          flexShrink: 0,
        }}
      >
        {stepNumber}
      </div>
      <div>
        <div
          style={{
            fontFamily: headingFont.fontFamily,
            fontSize: 48,
            fontWeight: 700,
            color: "white",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: bodyFont.fontFamily,
            fontSize: 32,
            color: "#a0aec0",
            marginTop: 8,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export const StepByStep = ({
  title,
  steps,
  backgroundColor,
  accentColor,
}: Props) => {
  const { fps, width, height } = useVideoConfig();
  const safe = safeArea(width);
  const framesPerStep = fps * 3;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        padding: `${safe.vertical}px ${safe.horizontal}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Interactive.Div
        name="Section title"
        style={{
          fontFamily: headingFont.fontFamily,
          fontSize: 64,
          fontWeight: 700,
          color: accentColor,
          marginBottom: 48,
        }}
      >
        {title}
      </Interactive.Div>
      {steps.map((step, i) => (
        <Sequence key={i} from={i * framesPerStep} layout="none">
          <div style={{ marginBottom: 40 }}>
            <StepItem
              stepNumber={i + 1}
              title={step.title}
              description={step.description}
              accentColor={accentColor}
            />
          </div>
        </Sequence>
      ))}
    </div>
  );
};
