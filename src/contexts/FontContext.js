import React, {createContext} from 'react'

const FontContext = createContext()
export default FontContext

export function FontContextWrapper({children}) {
  const [fontSize, setFontSize] = useState()
  return (
    <FontContext.Provider value={{fontSize, setFontSize}}>
        {children}
    </FontContext.Provider>
  )
}


