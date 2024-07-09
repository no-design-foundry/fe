import React, { useEffect } from "react";
import rastrAnimationData from "@/lottie/rastr.json";
import rotorizerAnimationData from "@/lottie/rotorizer.json";
import panAnimationData from "@/lottie/pan.json";
import extruderAnimationData from "@/lottie/extruder.json";
import dynamic from "next/dynamic";
import { useFela } from "react-fela";

const Lottie = dynamic(() => import("@/components/Lottie"), { ssr: false });

const lottieFileMapper = {
  rasterizer: rastrAnimationData,
  rotorizer: rotorizerAnimationData,
  extruder: extruderAnimationData,
  pan: panAnimationData
};

const thumbnailRule = () => ({
  background: "black",
  display: "flex",
  flexDirection: "column",
  "& > *": {
    filter: "invert(1)",
  },
  untilTabletS: {
    height: "100vw",
  },
});

function FilterThumbnail({slug}) {
  const { css } = useFela();

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
