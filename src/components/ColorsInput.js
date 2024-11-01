import React from "react";
import { useFela } from "react-fela";
import ColorInput from "./ColorInput";

const colorsWrapper = () => ({
    display: "flex",
    gap: 10,
})

function ColorsInput({ label,  disabled, defaultValues, processing, names }) {
    const {css} = useFela()
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
          />
        ))}
      </div>
    </>
  );
}

export default ColorsInput;
