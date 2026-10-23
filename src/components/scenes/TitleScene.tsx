import { Interactive, useVideoConfig } from "remotion";
import { headingFont } from "../../design/fonts";
import { safeArea } from "../../design/theme";
import { GradientBg } from "../backgrounds/GradientBg";
import { FadeInText } from "../text/FadeInText";

type TitleSceneProps = {
  readonly title: string;
};

const TitleSceneInner = ({ title }: TitleSceneProps) => {
  const { width } = useVideoConfig();
  const safe = safeArea(width);

  return (
    <>
      <GradientBg name="Background" style={{}} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: `${safe.vertical}px ${safe.horizontal}px`,
        }}
      >
        <FadeInText
          name="Title text"
          style={{
            fontFamily: headingFont.fontFamily,
            fontSize: 96,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {title}
        </FadeInText>
      </div>
    </>
  );
};

export const TitleScene = Interactive.create({
  Component: TitleSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
    title: { type: "string", default: "Your Title Here", description: "Title" },
  },
});
