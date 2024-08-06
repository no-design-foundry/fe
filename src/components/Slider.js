import React from "react";

function Slider(props) {
  const {
    label,
    name,
    min,
    max,
    defaultValue,
    onInput,
    required = false,
    disabled = false,
    hideOnMobile = false,
    ...kwargs
  } = props;

  function handleOnInput(e) {
    if (onInput) {
      onInput(e);
    }
  }

  return (
    <>
      <label
        htmlFor={name}
        data-disabled={disabled}
        data-hide-on-mobile={hideOnMobile}
      >
        {label}
      </label>
      <input
        name={name}
        type="range"
        defaultValue={defaultValue}
        min={min}
        max={max}
        required={required}
        onInput={handleOnInput}
        disabled={disabled}
        data-hide-on-mobile={hideOnMobile}
        {...kwargs}
      />
    </>
  );
}

export default Slider;
