import React, { useContext, useState } from "react";
import { useFela } from "react-fela";
import FilterContext from "@/contexts/FilterContext";
import InputMemoryContext from "@/contexts/InputMemoryContext";

const inputWrapperRule = () => ({
  position: "relative",
});

const masterRule = () => ({
  top: 0,
  left: 0,
  whiteSpace: "nowrap",
  height: "100%",
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "block",
});

const puppetRule = () => ({
  opacity: "0 !important",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
});

function FileInput({disabled, onChange}) {
  const { css } = useFela({disabled});
  const { identifier: filterIdentifier } = useContext(FilterContext);
  const identifier = `${filterIdentifier}-fontfile`;
  const { setInputMemory, getInputMemory } = useContext(InputMemoryContext);
  const inputFile = getInputMemory(identifier);
  function handleOnInput(e) {
    console.log(e)
    console.log(e.target.files)
    if (e.target.files.length === 1) {
      setInputMemory(identifier, e.target.files[0]);
    } else {
    }
  }
  return (
    <>
      <label htmlFor="font_file" data-disabled={disabled}>Font</label>
      <span className={css(inputWrapperRule)}>
        <button className={css(masterRule)} disabled={disabled}>
          {inputFile?.name ?? "Upload a font"}
        </button>
        <input
          key={identifier}
          className={css(puppetRule)}
          onInput={handleOnInput}
          disabled={disabled}
          name="font_file"
          type="file"
          accept=".ttf, .otf"
          {...onChange ? {onChange} : {}}
        ></input>
      </span>
    </>
  );
}

export default FileInput;
