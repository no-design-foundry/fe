import React, { useEffect } from "react";
import rastrAnimationData from "@/lottie/rastr.json";
import rotorizerAnimationData from "@/lottie/rotorizer.json";
import dynamic from "next/dynamic";
import { useFela } from "react-fela";

const Lottie = dynamic(() => import("@/components/Lottie"), { ssr: false });

const lottieFileMapper = {
  rasterizer: rastrAnimationData,
  rotorizer: rotorizerAnimationData,
  extruder: rotorizerAnimationData,
};

const thumbnailRule = () => ({
  background: "black",
  // fontSize: 0,
  display: "flex",
  flexDirection: "column",
  "& > *": {
    filter: "invert(1)",
  },
});

const lottieRule = () => ({
  width: "100%",
  untilTabletS: {
    height: "100vw",
  },
})

function FilterThumbnail({slug}) {
  const { css } = useFela();

  return (
    <div className={css(thumbnailRule)}>
      <Lottie
        className={css(lottieRule)}
        animationData={lottieFileMapper[slug]}
        loop={false}
        autoplay={false}
      />
    </div>
  );
}

export default FilterThumbnail;
