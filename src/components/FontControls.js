import React, { useContext, useEffect, useRef } from "react";
import FilterInfoContext from "@/contexts/FilterContext";
import InputMemoryContext from "@/contexts/InputMemoryContext";
import OutputFontContext from "@/contexts/OutputFontContext";
import Slider from "./Slider";

function FontControls() {
  const { previewRef } = useContext(OutputFontContext);
  const { variableFontControlSliders = [], identifier: filterIdentifier } =
    useContext(FilterInfoContext);

  const { getInputMemory } = useContext(InputMemoryContext);
  const fontSizeIdentifier = `${filterIdentifier}-fontsize`;
  const initialFontSize = getInputMemory(fontSizeIdentifier);
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

  function handleOnFontSizeInput(e) {
    previewRef.current.style.fontSize = `${e.target.value}px`;
  }

  function handleOnVariableInput({ tag, value }) {
    currentVariableSettings.current[tag] = parseFloat(value);
    previewRef.current.style.fontVariationSettings = variableSettingsToString();
  }

  useEffect(() => {
    if (previewRef?.current) {
      document.fonts.ready.then(() => {
        const preview = previewRef.current;
        preview.style.fontVariationSettings = variableSettingsToString();
        const currentFontSize = parseInt(
          window.getComputedStyle(preview)["font-size"]
        );
        const scale = window.innerWidth / preview.firstChild.offsetWidth;
        preview.style.fontSize = `${currentFontSize * scale}px`;
      });
    }
  }, [filterIdentifier, previewRef?.current]);

  return (
    <>
      <Slider
        key={filterIdentifier}
        label={"font size"}
        min={10}
        max={100} // window.innerHeight
        defaultValue={500}
        onInput={handleOnFontSizeInput}
        identifier={fontSizeIdentifier}
      ></Slider>
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
