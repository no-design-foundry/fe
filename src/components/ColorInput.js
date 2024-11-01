import React from "react";

function ColorInput({ label, name, disabled, defaultValue="#000000" }) {
  return (
    <>
      {label && <label data-disabled={disabled}>{label}</label>}
      <input type="color" name={name} disabled={disabled} defaultValue={defaultValue}/>
    </>
  );
}

export default ColorInput;
