import React, { useContext, useEffect, useRef } from "react";
import FilterInfoContext from "@/contexts/FilterContext";
import InputMemoryContext from "@/contexts/InputMemoryContext";
import OutputFontContext from "@/contexts/OutputFontContext";
import Slider from "./Slider";
import Checkbox from "./Checkbox";

function FontControls() {
  const { previewRef, outputFonts } = useContext(OutputFontContext);
  const { variableFontControlSliders = [], identifier: filterIdentifier, opentypeFeatures } =
    useContext(FilterInfoContext);
  const currentOpentypeFeatures = useRef([])

  // const fontSizeIdentifier = `${filterIdentifier}-fontsize`;
  // const initialFontSize = getInputMemory(fontSizeIdentifier);
  const currentVariableSettings = useRef(
    variableFontControlSliders.reduce((collector, slider) => {
      collector[slider.tag] = slider.defaultValue;
      return collector;
    }, {})
  );

  function variableSettingsToString() {
    return Object.entries(currentVariableSettings.current)
      .map(([key_, value_]) => `"${key_}" ${value_}`)
      .join(", ");
  }


  function handleOnVariableInput({ tag, value }) {
    currentVariableSettings.current[tag] = parseFloat(value);
    previewRef.current.style.fontVariationSettings = variableSettingsToString();
  }

  function handleOnFeatureInput({ tag, checked }) {
    if (checked) {
      currentOpentypeFeatures.current.push(tag)
    }
    else {
      const index = currentOpentypeFeatures.current.indexOf(tag)
      currentOpentypeFeatures.current.splice(index, 1)
    }
    console.log(currentOpentypeFeatures)
    previewRef.current.style.fontFeatureSettings = currentOpentypeFeatures.current.map(tag => `"${tag}"`).join(", ");
  }


  useEffect(() => {
    if (previewRef?.current) {
      document.fonts.ready.then(() => {
        const preview = previewRef.current;
        preview.style.fontVariationSettings = variableSettingsToString();
        console.log(window.getComputedStyle(preview).fontFamily)
        const currentFontSize = parseInt(
          window.getComputedStyle(preview)["font-size"]
        );
        const scaleX = (window.innerHeight * .7) / preview.firstChild.offsetHeight;
        const scaleY = (window.innerWidth * .7) / preview.firstChild.offsetWidth;
        preview.style.fontSize = `${currentFontSize * Math.min(scaleX, scaleY)}px`;
      });
    }
  }, [filterIdentifier, previewRef?.current, outputFonts[filterIdentifier]]);

  return (
    <>
      {
        opentypeFeatures?.map((feature, index) => (
          <Checkbox
            key={`${filterIdentifier}-opentype-feature-${index}`}
            identifier={`${filterIdentifier}-${feature.tag}`}
            {...feature}
            handleOnInput={(e) => handleOnFeatureInput({ tag: feature.tag, checked: e.target.checked })}
          ></Checkbox>
        ))
      }
      {variableFontControlSliders.map((slider, index) => (
        <Slider
          identifier={`${filterIdentifier}-${slider.tag}`}
          key={`${filterIdentifier}-variable-font-slider-${index}`}
          {...slider}
          onInput={(e) =>
            handleOnVariableInput({ value: e.target.value, tag: slider.tag })
          }
        ></Slider>
      ))}
    </>
  );
}

export default FontControls;
