import React, { useContext, useRef, useState } from "react";
import FilterInfoContext from "@/contexts/FilterContext";
import Slider from "./Slider";
import TextInput from "@/components/TextInput";
import FontControls from "@/components/FontControls";
import { useFela } from "react-fela";
import FileInput from "@/components/FileInput";
import { urls } from "@/variables";
import axios from "axios";
import OutputFontContext from "@/contexts/OutputFontContext";
import InputMemoryContext from "@/contexts/InputMemoryContext";

const formRule = () => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, min-content)",
  gridAutoRows: "min-content",
  gridGap: "4px 1ch",
  alignItems: "center",
  "& > label": {
    whiteSpace: "nowrap",
  },
  "& > *": {
    width: "100%"
  }
});

const processingRule = () => ({
  gridColumn: "1/-1",
});

const downloadRule = () => ({
  marginTop: "1em",
  gridColumn: 2,
});

const wrapperRule = () => ({
  position: "fixed",
  bottom: 5,
  left: 5,
  zIndex: 100
});

let lastTimeStamp;
function Form() {
  const formRef = useRef();
  const { identifier, title, inputs } = useContext(FilterInfoContext);
  const { getInputMemory } = useContext(InputMemoryContext);
  const inputFile = getInputMemory(`${identifier}-fontfile`);
  const disabled = !Boolean(inputFile)
  const { setOutputFonts, setPreviewString } = useContext(OutputFontContext);
  const [processing, setProcessing] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  const { css } = useFela();

  function handleOnChange(e) {
    console.log(e)
    if (
      formRef.current.checkValidity() &&
      e.target.name?.length &&
      Boolean(inputFile)
    ) {
      const now = Date.now();
      lastTimeStamp = now;
      setTimeout(function () {
        if (now === lastTimeStamp) {
          const data = new FormData(formRef.current);
          data.append("font_file", inputFile);
          const url = urls.preview(identifier);
          setProcessing(true);
          axios
            .post(url, data, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
              setPreviewString(identifier, response.data.preview_string);
              setLogMessages(response.data.warnings);
              return response;
            })
            .then((response) => {
              const outputFontsArrays = response.data.fonts.map((fontBase64) =>
                Uint8Array.from(atob(fontBase64), (c) => c.charCodeAt(0))
              );
              return Promise.all([inputFile.arrayBuffer(), outputFontsArrays]);
            })
            .then(([inputFontBuffer, outputFontsArrays]) => [
              new FontFace(`preview-input-font-${Date.now()}`, inputFontBuffer),
              outputFontsArrays.map(
                (outputFontArray, index) =>
                  new FontFace(
                    `preview-output-font-${Date.now()}-${index}`,
                    outputFontArray
                  )
              ),
            ])
            .then(([inputFont, outputFonts]) => {
              outputFonts.forEach((outputFont) =>
                document.fonts.add(outputFont)
              );
              setOutputFonts(
                identifier,
                outputFonts.map((font) => font.family)
              );
            })
            .catch((response) => console.log(response))
            .finally((response) => {
              setProcessing(false);
            });
        }
      }, 500);
    }
  }

  function handleOnDownload(e) {
    e.preventDefault()
  }

  return (
    <div className={css(wrapperRule)}>
      {logMessages.length != 0 && (
        <ul>{logMessages.map((message) => message)}</ul>
      )}
      <form ref={formRef} className={css(formRule)} onChange={handleOnChange}>
        {processing && <div className={css(processingRule)}>processing...</div>}
        <FontControls></FontControls>
        <FileInput required={true} />
        {inputs.map((input, index) => {
          const { type, ...kwargs } = input;
          return (
            <Slider
              key={`${identifier}-${index}`}
              {...kwargs}
              required={true}
              disabled={disabled}
            />
          );
        })}
        <TextInput
          key={identifier}
          label="preview"
          name="preview_string"
          defaultValue={title}
          required={true}
          disabled={disabled}
        />
        <button className={css(downloadRule)} onClick={handleOnDownload}>download</button>
      </form>
    </div>
  );
}

export default Form;
