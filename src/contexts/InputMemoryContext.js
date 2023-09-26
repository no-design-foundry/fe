import React, { createContext, useState } from "react";

const InputMemoryContext = createContext();
export default InputMemoryContext;

export function InputMemoryContextWrapper({ children }) {
  const [ data, setData ] = useState({});
  function setInputMemory(identifier, value) {
    let collector = {};
    collector[identifier] = value;
    setData({ ...data, ...collector });
  }
  function getInputMemory(identifier) {
    return data[identifier];
  }
  return (
    <InputMemoryContext.Provider value={{ setInputMemory, getInputMemory }}>
      {children}
    </InputMemoryContext.Provider>
  );
}
