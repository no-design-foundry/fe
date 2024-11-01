import React, { useContext, useEffect, useRef, useState } from "react";
import { useFela } from "react-fela";
import FilterContext from "@/contexts/FilterContext";
import OutputFontContext from "@/contexts/OutputFontContext";

const duration = 500;


const layerWrapperRule = () => ({
  position: "relative",
  paddingBottom: 100
})

const getLayerRule =
  (index) =>
  ({ identifier, layerColors, fontFamilies = [], opacity = 1 }) => ({
    filter: opacity ? "blur(0px)" : "blur(10px)",
    opacity,
    transitionProperty: "opacity, filter",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "ease-in",
    textRendering: "optimizeSpeed",
    lineHeight: "1em",
    color: layerColors[index],
    extend: [
      {
        condition: index !== 0,
        style: {
          position: "absolute",
          top: 0,
        },
      },
      {
        condition: fontFamilies?.length,
        style: {
          fontFamily: fontFamilies[index],
        },
      },
      {
        condition: !fontFamilies?.length,
        style: {
          fontFamily: `${identifier}-${index}`,
        },
      },
    ],
  });

function FontPreview({ children, className }) {
  const { identifier, layerColors } = useContext(FilterContext);
  const ref = useRef();
  const { outputFonts, setPreviewRef } = useContext(OutputFontContext);
  const fontFamilies = outputFonts?.[identifier];
  const { css } = useFela({
    layerColors,
    identifier,
    fontFamilies,
  });

  useEffect(() => {
    setPreviewRef(ref);
  }, [ref]);

  return (
    <div className={className}>
      <div ref={ref} className={css(layerWrapperRule)}>
        {layerColors.map((color, index) => (
          <div
            key={`${identifier}-${color}`}
            className={css(getLayerRule(index))}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FontPreview;
