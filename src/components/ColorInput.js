import React from "react";

function ColorInput({ label, name, disabled, defaultValue="#000000", onChange }) {
  return (
    <>
      {label && <label data-disabled={disabled}>{label}</label>}
      <input onChange={onChange} type="color" name={name} disabled={disabled} defaultValue={defaultValue}/>
    </>
  );
}

export default ColorInput;
