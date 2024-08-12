import React, { useEffect } from "react";
import rastrAnimationData from "@/lottie/rastr.json";
import rotorizerAnimationData from "@/lottie/rotorizer.json";
import panAnimationData from "@/lottie/pan.json";
import xRayAnimationData from "@/lottie/xray.json";
import extruderAnimationData from "@/lottie/extruder.json";
import dynamic from "next/dynamic";
import { useFela } from "react-fela";

const Lottie = dynamic(() => import("@/components/Lottie"), { ssr: false });

const lottieFileMapper = {
  rasterizer: rastrAnimationData,
  rotorizer: rotorizerAnimationData,
  extruder: extruderAnimationData,
  pan: panAnimationData,
  "x-ray": xRayAnimationData,
};

const thumbnailRule = ({ isPreview, scaleThumbnailOnMobile }) => ({
  background: isPreview ? "silver" : "black",
  display: "flex",
  flexDirection: "column",
  "& > *": {
    filter: "invert(1)",
  },
  "untilTabletS,noHover": {
    overflow: "hidden",
    height: "100vw",
    alignItems: "center",
    justifyContent: "center",
    "& > *": {
      height: "100%",
      extend: [
        {
          condition: scaleThumbnailOnMobile,
          style: {
            "& > *": {
            transform: "scale(1.3)",
            }
          },
        },
      ],
    },
  },
  "& *": {
    clipPath: "none !important",
  },
});

function FilterThumbnail({ slug, isPreview, scaleThumbnailOnMobile }) {
  const { css } = useFela({ isPreview, scaleThumbnailOnMobile });

  return (
    <div className={css(thumbnailRule)}>
      <Lottie
        animationData={lottieFileMapper[slug]}
        loop={false}
        autoplay={false}
      />
    </div>
  );
}

export default FilterThumbnail;
