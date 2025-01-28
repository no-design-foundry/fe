import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useFela } from "react-fela";
import dynamic from 'next/dynamic'
const ReactJson = dynamic(() => import('@/components/ReactJson'), {
  ssr: false
})
import { convertXML } from "simple-xml-to-json";

const explorerRule = () => ({
  marginTop: "5rem",
});

async function processFont(file) {
  // Load Pyodide
  const pyodide = await loadPyodide();
  await pyodide.loadPackage("fonttools");

  const fileContent = new Uint8Array(file);
  await pyodide.runPythonAsync(`
              import io
              from fontTools.ttLib import TTFont
              def process_font(file_content):
                  try:
                      bytes_data = bytes(file_content)
                      bytes_io = io.BytesIO(bytes_data)
                      tt_font = TTFont(bytes_io)
                      string_output = io.StringIO()
                      xml = tt_font.saveXML(string_output)
                      tt_font.close()
                      return string_output.getvalue()
                  except Exception as e:
                      return str(e)
          `);
  const greet = pyodide.globals.get("process_font");
  const result = greet(fileContent);
  return result
    
}

function filterAllXmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, '')
}

function Explorer() {
  const { css } = useFela();
  const [output, setOutput] = useState(null);

  async function handleOnChange(e) {
    const arrayBuffer = await e.target.files[0].arrayBuffer()
    const fontXml = await processFont(arrayBuffer);
    setOutput(fontXml)
    // setOutput(convertXML(fontXml)["ttFont"])
  }

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js"></script>
      </Head>
      <div className={css(explorerRule)}>
        <input type="file" onChange={handleOnChange} />
        {output && <ReactJson src={filterAllXmlComments(output)}></ReactJson>}
      </div>
    </>
  );
}

export default Explorer;
