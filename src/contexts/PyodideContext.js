import React, {createContext, useEffect, useState} from 'react'
import axios from "axios"
import test from "../python/test.py"

const PyodideContext = createContext()
export default PyodideContext


export function PyodideContextWrapper({children}) {
  const [pythonFunctions, setPythonFunctions] = useState({})

  useEffect(() => {
    // window.loadPyodide().then((pyodide) => {
    //   pyodide.runPython(test)
    //   const testFunc = pyodide.globals.get("test")
    //   setPythonFunctions({testFunc})
    // })
  }, [])
  return (
    <PyodideContext.Provider value={pythonFunctions}>
        {children}
    </PyodideContext.Provider>
  )
}


