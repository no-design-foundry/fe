import React from "react";
import { useFela } from "react-fela";

const inputRule = () => ({
  width: "100%",
});

function Checkbox({
  label,
  name,
  disabled,
  required,
  handleOnInput,
  hideOnMobile = false,
}) {
  const { css } = useFela();
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
        type="checkbox"
        className={css(inputRule)}
        required={required}
        onInput={handleOnInput}
        disabled={disabled}
        data-hide-on-mobile={hideOnMobile}
      />
    </>
  );
}

export default Checkbox;
