import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
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
  const processFontPython = window.pyodide.globals.get("process_font");
  const fileContent = new Uint8Array(file);
  const result = processFontPython(fileContent);
  return result
}

async function exportFont(fontXml) {
  const exportFontPython = window.pyodide.globals.get("export_font");
  const result = exportFontPython(fontXml);
  return result
}

function filterAllXmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, '')
}

export const TTXContext = React.createContext();

function Explorer() {
  const { css } = useFela();
  const [output, setOutput] = useState(null);
  const rawXmlFont = useRef(null);

  async function handleOnChange(e) {
    const arrayBuffer = await e.target.files[0].arrayBuffer()
    const fontXml = await processFont(arrayBuffer);
    setOutput(fontXml)
    const parser = new DOMParser();
    const xmlData = parser.parseFromString(fontXml, "application/xml");
    rawXmlFont.current = xmlData
  }

  async function handleOnExport(e) {
    console.log(rawXmlFont.current)
    const rawXmlFontString = new XMLSerializer().serializeToString(rawXmlFont.current);
    exportFont(rawXmlFontString).then((base64Data) => {
      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${base64Data}`;
      link.download = "file.ttf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  useEffect(() => {
    (async () => {
    window.pyodide = await loadPyodide()
    await window.pyodide.loadPackage("fonttools");
    await window.pyodide.runPythonAsync(`
      import io
      import base64
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
        
      def export_font(font_xml):
        xml = io.StringIO(font_xml)
        tt_font = TTFont()
        tt_font.importXML(xml)
        bytes_output = io.BytesIO()
        tt_font.save(bytes_output)
        base64_output = base64.b64encode(bytes_output.getvalue())
        return base64_output.decode('utf-8')
    `);
    })()
  }, [])

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js"></script>
      </Head>
      <TTXContext.Provider value={{ rawXmlFont }}>
        <div className={css(explorerRule)}>
          <input type="file" onChange={handleOnChange} />
          <input type="button" value="Export" onClick={handleOnExport} />
          {output && <ReactJson src={filterAllXmlComments(output)}></ReactJson>}
        </div>
      </TTXContext.Provider>
    </>
  );
}

export default Explorer;
