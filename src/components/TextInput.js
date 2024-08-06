import React from "react";
import Input from "@/components/Input";

function TextInput({
  label,
  name,
  defaultValue,
  required = false,
  disabled = true,
  hideOnMobile = false,
}) {
  return (
    <>
      <label
        htmlFor={name}
        data-disabled={disabled}
        data-hide-on-mobile={hideOnMobile}
      >
        {label}
      </label>
      <Input
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        data-hide-on-mobile={hideOnMobile}
      />
    </>
  );
}

export default TextInput;
