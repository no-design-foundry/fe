import React, { useContext, useEffect, useRef, useState } from "react";
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
import Log from "./Log";
import Checkbox from "./Checkbox";
import ColorInput from "./ColorInput";
import ColorsInput from "./ColorsInput";

const formRule = () => ({
  display: "grid",
  gridTemplateColumns: "min-content 1fr",
  gridAutoRows: "min-content",
  gridGap: "3px 1ch",
  noHover: {
    gridGap: ".5em 1ch",
  },
  alignItems: "center",
  "& > label": {
    whiteSpace: "nowrap",
  },
  "& > *": {
    width: "100%",
  },
});

const logRule = () => ({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: 0,
  transform: "translateY(-100%)",
});

const errorRule = () => ({
  color: "red",
});

const processingRule = () => ({
  gridColumn: "1/-1",
});

const downloadRule = () => ({
  marginTop: ".5em",
  gridColumn: 2,
});

const wrapperRule = () => ({
  position: "fixed",
  // position: "relative",
  bottom: 14,
  left: 14,
  zIndex: 100,
  right: 14,
  fromMobileL: {
    maxWidth: 400,
  },
});

function saveFile(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const a = document.createElement("a");
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }
}

let lastTimeStamp;
function Form() {
  const formRef = useRef();
  const { identifier, title, inputs } = useContext(FilterInfoContext);
  const { getInputMemory } = useContext(InputMemoryContext);
  const inputFile = getInputMemory(`${identifier}-fontfile`);
  const [errors, setErrors] = useState([]);
  const disabled = !Boolean(inputFile);
  const { outputFontArrays, setOutputFonts, setPreviewString, previewStrings } =
    useContext(OutputFontContext);
  const [processing, setProcessing] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  const logRemovingInterval = useRef();
  const { css } = useFela();

  function handleOnSubmit(e) {
    e.preventDefault();
  }

  function handleOnChange(e) {
    if (e.target.type == "color") {
      return
    }
    if (e.target.name == "font_file") {
      formRef.current
        .querySelectorAll("[data-hide-on-mobile='true'")
        .forEach((element) => {
          element.dataset.hideOnMobile = false;
        });
    }
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
          data.delete("font_file");
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
                (outputFontArray, index) => {
                  outputFontArrays.current.push(outputFontArray);
                  return new FontFace(
                    `preview-output-font-${Date.now()}-${index}`,
                    outputFontArray
                  )
                }
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
            .catch((response) =>
              setErrors([
                ...errors,
                { ...response, timeStamp: new Date().getTime() },
              ])
            )
            .finally((response) => {
              setProcessing(false);
            });
        }
      }, 500);
    }
  }

  function handleOnDownload(e) {
    e.preventDefault();
    if (formRef.current.checkValidity() && Boolean(inputFile)) {
      const data = new FormData(formRef.current);
      data.append("font_file", inputFile);
      const url = urls.get(identifier);
      setProcessing(true);
      axios
        .post(url, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          response.data.fonts.forEach((font) => {
            const fileRule =
              "data:" + response.headers["content-type"] + ";base64," + font;
            fetch(fileRule)
              .then((blobResponse) => blobResponse.blob())
              .then((blob) => {
                saveFile(blob, `no-design-foundry-${identifier}.ttf`);
              });
          });
        })
        .catch((response) =>
          setErrors([
            ...errors,
            { ...response, timeStamp: new Date().getTime() },
          ])
        )
        .finally((response) => {
          console.log("finished");
          setProcessing(false);
        });
    }
  }

  useEffect(() => {
    if (errors.length) {
      logRemovingInterval.current = setInterval(() => {
        setErrors((currentErrors) => {
          const [_, ...otherErrors] = currentErrors;
          return otherErrors;
        });
      }, 10000);
    } else {
      clearInterval(logRemovingInterval.current);
    }
    return () => {
      clearInterval(logRemovingInterval.current);
    };
  }, [errors.length]);

  return (
    <div className={css(wrapperRule)}>
      <div className={css(logRule)}>
        {errors.map((error) => (
          <div key={error.timeStamp} className={css(errorRule)}>
            {(error?.response?.data?.warnings ?? error?.response?.data?.detail ??
              "😭, maybe the font was too big? I am working on it") + " 😥 mail@nodesignfoundry.com"}              
          </div>
        ))}
        {logMessages.map((message, index) => (
          <Log key={index} message={message} />
        ))}
        {processing && <div className={css(processingRule)}>Processing...</div>}
      </div>
      <form
        ref={formRef}
        className={css(formRule)}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
      >
        <FontControls></FontControls>
        <FileInput required={true} disabled={processing} />
        {inputs.map((input, index) => {
          const { type, ...kwargs } = input;
          switch (type) {
            case "range":
              return (
                <Slider
                  key={`${identifier}-${index}`}
                  {...kwargs}
                  required={true}
                  disabled={disabled || processing}
                  hideOnMobile={true}
                />
              );
            case "checkbox":
              return (
                <Checkbox
                  key={`${identifier}-${index}`}
                  {...kwargs}
                  required={false}
                  disabled={disabled || processing}
                  hideOnMobile={true}
                />
              );
            case "color":
              return (
                <ColorInput
                  key={`${identifier}-${index}`}
                  {...kwargs}
                  required={true}
                  disabled={disabled || processing}
                  hideOnMobile={true}
                />
              );
            case "colors":
              return (
                <ColorsInput
                  key={`${identifier}-${index}`}
                  {...kwargs}
                  required={true}
                  disabled={disabled || processing}
                  hideOnMobile={true}
                />
              );
            default:
              return <code>"{type}" is not defined</code>;
          }
        })}
        <TextInput
          key={identifier}
          label="Preview"
          name="preview_string"
          defaultValue={previewStrings?.[identifier] ?? title}
          required={true}
          disabled={!inputFile}
          hideOnMobile={true}
        />
        <button
          className={css(downloadRule)}
          onClick={handleOnDownload}
          disabled={processing || !inputFile}
          data-hide-on-mobile="true"
        >
          Download (Limited Set)
        </button>
      </form>
    </div>
  );
}

export default Form;
