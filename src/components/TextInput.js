import React from "react";
import Input from "@/components/Input";

function TextInput(props) {
  const { label, name, defaultValue, required = false, disabled=true } = props;
  return (
    <>
      <label htmlFor={name} data-disabled={disabled}>
        {label}
      </label>
      <Input
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
      />
    </>
  );
}

export default TextInput;
