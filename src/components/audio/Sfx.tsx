import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

// Sound effects downloaded from remotion.media into public/sfx/.
export const SFX_NAMES = [
  "whoosh",
  "vine-boom",
  "ding",
  "mouse-click",
  "switch",
  "record-scratch",
] as const;

export type SfxName = (typeof SFX_NAMES)[number];

type SfxProps = {
  readonly name: SfxName;
  readonly from: number;
  readonly volume?: number;
};

// One sound effect, starting at frame `from` of the parent timeline.
export const Sfx = ({ name, from, volume = 0.5 }: SfxProps) => {
  return (
    <Sequence name={`SFX: ${name}`} from={from} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};
