import React, { useContext } from "react";
import { useFela } from "react-fela";
import ColorInput from "./ColorInput";
import OutputFontContext from "@/contexts/OutputFontContext";
import recolorize from "@/utils/recolorize";

const colorsWrapper = () => ({
  display: "flex",
  gap: 10,
});

function ColorsInput({ label, disabled, defaultValues, processing, names }) {
  const { css } = useFela();
  const { outputFontArrays, setOutputFonts } = useContext(OutputFontContext);

  function handleOnChange(event) {
    const form = event.target.closest("form");
    const colors = ["outline_color", "line_color", "point_color"].map(name => form[name].value);
    const colorsAsRGB = colors.map(color => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return [r, g, b, 255];
    }
  )
    event.preventDefault();
    const lastFont = outputFontArrays.current[outputFontArrays.current.length - 1];
    const lastFontColorized = recolorize(lastFont, [...colorsAsRGB, [0, 0, 0, 255]]);
    const familyName = `preview-input-font-colorized-${Date.now()}`
    const fontFace = new FontFace(familyName, lastFontColorized)
    fontFace.load().then(function (loadedFontFace) {
      document.fonts.add(loadedFontFace);
      setOutputFonts("x_ray", [familyName]);
    });
    
  }
  return (
    <>
      <label data-disabled={disabled}>{label}</label>
      <div className={css(colorsWrapper)}>
        {names.map((name, index) => (
          <ColorInput
            key={`${index}`}
            name={name}
            disabled={disabled || processing}
            defaultValue={defaultValues[index]}
            onChange={handleOnChange}
          />
        ))}
      </div>
    </>
  );
}

export default ColorsInput;
