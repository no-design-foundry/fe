import React, { useContext, useEffect, useRef, useState } from "react";
import { useFela } from "react-fela";
import InputMemoryContext from "@/contexts/InputMemoryContext";

const borderRadius = "14px";

const inputRule = ({ position }) => {
  const scaledPosition = position * 100
  return {
  appearance: "none",
  "-webkit-appearance": "none",
  height: "3px",
  borderRadius,
  // boxShadow: "inset 0 2px 2px #00000066",
  "&::-webkit-slider-thumb, &::-moz-range-thumb": {
    appearance: "none",
    "-webkit-appearance": "none",
    height: "1em",
    width: "1em",
    background: "#000",
    borderRadius: "100%",
    // filter: "drop-shadow(0 2px 3px #00000066)",
    border: "none",
    outline: "none",
    cursor: "pointer",
  },

  background: "#EEE",
  "&::-moz-range-progress": {
    // boxShadow: "inset 0 2px 2px #00000066",
    background: "#CCC",
    height: "100%",
    borderRadius,
  },
  "@supports not selector(::-moz-range-progress)": {
    // background: "red",
    background: `linear-gradient(to right, #999 0%, #999 ${scaledPosition}%, #EEE ${scaledPosition}%, #EEE 100%)`,
    "&:disabled": {
      background: `linear-gradient(to right, #DDD 0%, #DDD ${scaledPosition}%, #EEE ${scaledPosition}%, #EEE 100%) !important`,
    },
  },
  "&:disabled": {
    "&::-webkit-slider-thumb, &::-moz-range-thumb": {
      background: "#EEE",
    },
  },
}}

function Slider(props) {
  const {
    identifier,
    label,
    name,
    min,
    max,
    defaultValue,
    onInput,
    required = false,
    disabled = false,
  } = props;
  const {getInputMemory} = useContext(InputMemoryContext)
  const [position, setPosition] = useState(getInputMemory(identifier) || defaultValue)
  const { css } = useFela({
    position: (position - min) / (max - min)
  });
  function handleOnInput(e) {
    if (onInput) {
      onInput(e);
    }
    setPosition(e.target.value);
  }


  return (
    <>
      <label htmlFor={name} disabled={disabled}>
        {label}
      </label>
      <input
        name={name}
        type="range"
        className={css(inputRule)}
        defaultValue={defaultValue}
        min={min}
        max={max}
        required={required}
        onInput={handleOnInput}
        disabled={disabled}
      />
    </>
  );
}

export default Slider;
