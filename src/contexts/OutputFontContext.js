import React, { createContext, useRef, useState } from "react";

const OutputFontContext = createContext();
export default OutputFontContext;

export function OutputFontContextWrapper({ children }) {
  const [previewRef, setPreviewRef] = useState()
  const [outputFonts, _setOutputFonts] = useState({});
  const [previewStrings, _setPreviewStrings] = useState({});
  const outputFontArrays = useRef([])

  function setOutputFonts(identifier, familyNames) {
    let collector = { ...outputFonts };
    collector[identifier] = familyNames;
    _setOutputFonts(collector);
  }
  function setPreviewString(identifier, outputString) {
    let collector = { ...previewStrings };
    collector[identifier] = outputString;
    _setPreviewStrings(collector);
  }
  return (
    <OutputFontContext.Provider
      value={{ outputFontArrays, setOutputFonts, outputFonts, previewStrings, setPreviewString, previewRef, setPreviewRef }}
    >
      {children}
    </OutputFontContext.Provider>
  );
}
