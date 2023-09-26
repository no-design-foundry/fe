import React, { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import FilterContext from "../contexts/FilterContext";
import InputMemoryContext from "../contexts/InputMemoryContext";

function Input(props) {
  const {
    identifier,
    type,
    name,
    onInput,
    defaultValue,
    getValueOnMount,
    ...kwargs
  } = props;
  const ref = useRef()
  const value = useRef()
  const {setInputMemory, getInputMemory} = useContext(InputMemoryContext)

  function handleOnInput(e) {
    value.current = e.target.value
    if (onInput) {
      onInput(e);
    }
  }

  useEffect(() => {
    return () => {
      if (identifier?.length && value.current) {
        let parsedValue
        switch(type) {
          case "range":
          case "number":
            parsedValue = parseFloat(value.current)
            break
          default:
            parsedValue = value.current
        }
        setInputMemory(identifier, parsedValue)
      }
    }
  }, [value])

  return (
    <input
      ref={ref}
      name={name}
      onInput={handleOnInput}
      type={type}
      defaultValue={getInputMemory(identifier) || defaultValue}
      {...kwargs}
    />
  );
}

export default Input;
