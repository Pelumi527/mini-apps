import { Button } from "@/src/components/ui/button";
import { CommonPageHeader } from "@/src/components/CommonPageHeader";
import { type StaticImageData } from "next/image";
import FurImg from "@/public/assets/compose/fur.png";
import BackgroundImg from "@/public/assets/compose/background.png";
import ClothingImg from "@/public/assets/compose/clothing.png";
import EyesImg from "@/public/assets/compose/eyes.png";
import HatImg from "@/public/assets/compose/hat.png";
import MouthImg from "@/public/assets/compose/mouth.png";
import { ComposeSloth } from "./ComposeSloth";

export type SlothItem = {
  id: string;
  img: StaticImageData;
  type: SlothItemType;
};
export enum SlothItemType {
  Fur = "Fur",
  Eyes = "Eyes",
  Mouth = "Mouth",
  Clothing = "Clothing",
  Hat = "Hat",
  Background = "Background",
}

export default function ComposePage() {
  const slothItems: SlothItem[] = [
    { id: "1", img: FurImg, type: SlothItemType.Fur },
    { id: "2", img: EyesImg, type: SlothItemType.Eyes },
    { id: "3", img: MouthImg, type: SlothItemType.Mouth },
    { id: "4", img: ClothingImg, type: SlothItemType.Clothing },
    { id: "5", img: HatImg, type: SlothItemType.Hat },
    { id: "6", img: BackgroundImg, type: SlothItemType.Background },
    { id: "7", img: BackgroundImg, type: SlothItemType.Background },
  ];
  return (
    <>
      <CommonPageHeader className="z-20" />
      <main
        style={{
          background:
            "radial-gradient(circle closest-side at 50% 40%,#5776b1 8%, #516aa2 60%, #3e4878 172%)",
        }}
        className="relative min-h-screen px-8 pt-20 pb-32"
      >
        <p className="mt-2 mb-3 text-3xl font-extrabold text-white">
          Evolve and compose your Sloth!
        </p>

        <ComposeSloth slothItems={slothItems} />
      </main>
    </>
  );
}
