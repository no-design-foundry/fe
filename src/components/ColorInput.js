import React from "react";

function ColorInput({ label, name, disabled }) {
  return (
    <>
      <label data-disabled={disabled}>{label}</label>
      <input type="color" name={name} disabled={disabled} />
    </>
  );
}

export default ColorInput;
