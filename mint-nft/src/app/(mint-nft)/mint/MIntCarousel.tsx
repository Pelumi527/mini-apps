import sothballs from "@/public/assets/home/sloth_left2.png";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import unknownSothballs from "@/public/assets/unknown_sothballs.png";
export interface MintData {
  mintID: string;
  mintImg: StaticImageData;
}
export const MintCarousel: React.FC = () => {
  const mintList: MintData[] = [
    { mintID: "666", mintImg: sothballs },
    { mintID: "667", mintImg: sothballs },
    { mintID: "668", mintImg: sothballs },
  ];
  const hasNoneNft = mintList.length <= 0;
  return (
    <div className="carousel carousel-center rounded-box pb-5">
      <div className="carousel-item">
        <div className="h-[108px] w-[100px]" />
      </div>
      {hasNoneNft ? (
        <div className="carousel-item flex flex-col">
          <Image
            className="mx-auto"
            src={unknownSothballs}
            width={205}
            height={219}
            alt="unknown_sothballs"
          />
          <div className="flex h-6 w-full justify-center">
            <span className="text-base font-medium" />
          </div>
        </div>
      ) : (
        mintList.map((mintData, i) => {
          return (
            <div key={i} className="carousel-item flex flex-col">
              <Image
                className="mx-auto"
                src={mintData.mintImg}
                width={205}
                height={219}
                alt="sothball"
              />
              <div className="flex h-6 w-full justify-center">
                <span className="text-base font-medium">
                  Slothball #{mintData.mintID}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
