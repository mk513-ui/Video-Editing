// TikTok-style captions in the Entri brand: a few words at a time, the spoken
// word lit up in Lime and popping slightly. Adapted from Remotion's "Word
// Highlight Captions" element (remotion.dev/elements/captions).
import type { Caption, TikTokPage } from "@remotion/captions";
import { createTikTokStyleCaptions } from "@remotion/captions";
import { fitTextOnNLines } from "@remotion/layout-utils";
import React, { useEffect, useMemo, useState } from "react";
import {
  cancelRender,
  Interactive,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type InteractiveTransformProps,
  type InteractivitySchema,
  type SequenceProps,
} from "remotion";
import { display, entri, waitForDisplayFont } from "../../design/entri";

type EntriCaptionsProps = InteractiveTransformProps &
  Pick<SequenceProps, "width"> & {
    readonly captions: Caption[];
    readonly combineTokensWithinMilliseconds?: number;
  };

const maxFontSize = 112;
const activeWordScale = 1.1;
const defaultCombineTokensWithinMilliseconds = 900;
const defaultWidth = 900;

const entriCaptionsSchema = {
  ...Interactive.captionsSchema,
  width: {
    type: "number",
    min: 1,
    step: 1,
    default: undefined,
    description: "Caption area width",
    hiddenFromList: false,
  },
  combineTokensWithinMilliseconds: {
    type: "number",
    min: 0,
    step: 50,
    default: defaultCombineTokensWithinMilliseconds,
    description: "Time between caption pages",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

const CaptionPage: React.FC<{
  readonly width: number;
  readonly currentTimeMs: number;
  readonly page: TikTokPage;
}> = ({ width, currentTimeMs, page }) => {
  const { fps } = useVideoConfig();
  const fontSize = useMemo(
    () =>
      fitTextOnNLines({
        text: page.text.trim(),
        maxLines: 2,
        maxBoxWidth: width,
        maxFontSize,
        fontFamily: display.fontFamily,
        fontWeight: display.fontWeight,
        textTransform: "uppercase",
        additionalStyles: { fontStretch: display.fontStretch },
      }).fontSize,
    [page.text, width],
  );

  return (
    <div
      style={{
        ...display,
        fontSize,
        lineHeight: 1.02,
        // The condensed face has a thin space and the outline eats into it.
        wordSpacing: "0.2em",
        color: entri.paper,
        textAlign: "center",
        paintOrder: "stroke fill",
        WebkitTextStroke: `${fontSize / 6}px ${entri.ink}`,
        textShadow: `0 ${fontSize / 14}px 0 ${entri.ink}`,
        width: "100%",
      }}
    >
      {page.tokens.map((token, i) => {
        const isActive =
          currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
        // Spring in over ~4 frames when the word starts being spoken.
        const pop = isActive
          ? spring({
              fps,
              frame: ((currentTimeMs - token.fromMs) / 1000) * fps,
              config: { damping: 12, stiffness: 300 },
              durationInFrames: 6,
            })
          : 0;

        return (
          <React.Fragment key={`${page.startMs}-${token.fromMs}-${i}`}>
            {i > 0 ? " " : null}
            <span
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                color: isActive ? entri.lime : entri.paper,
                scale: String(1 + pop * (activeWordScale - 1)),
              }}
            >
              {token.text.trim()}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const EntriCaptionsContent: React.FC<EntriCaptionsProps> = ({
  captions,
  combineTokensWithinMilliseconds = defaultCombineTokensWithinMilliseconds,
  style,
  width = defaultWidth,
}) => {
  // fitText measures with the real font, so wait for it before laying out.
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    waitForDisplayFont()
      .then(() => setFontLoaded(true))
      .catch((err) => cancelRender(err));
  }, []);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Start a new page at the end of each sentence and after a pause, so a
  // question and its answer never share a page.
  const pages = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: captions.map((c) => ({
          ...c,
          pageBreakAfter: c.pageBreakAfter ?? /[.?!]$/.test(c.text.trim()),
        })),
        combineTokensWithinMilliseconds,
        breakOnSilenceAfterMilliseconds: 450,
      }).pages,
    [captions, combineTokensWithinMilliseconds],
  );

  // Inside a trimmed <Sequence> the frame counts from the source file's start,
  // so it lines up with the caption timestamps directly.
  const currentTimeMs = (frame / fps) * 1000;
  const page = pages.find(
    (p) =>
      currentTimeMs >= p.startMs && currentTimeMs < p.startMs + p.durationMs,
  );

  return (
    <div style={{ width, ...style }}>
      {fontLoaded && page ? (
        <CaptionPage
          width={width}
          currentTimeMs={currentTimeMs}
          page={page}
        />
      ) : null}
    </div>
  );
};

export const EntriCaptions = Interactive.create({
  Component: EntriCaptionsContent,
  componentName: "<EntriCaptions>",
  schema: entriCaptionsSchema,
});
