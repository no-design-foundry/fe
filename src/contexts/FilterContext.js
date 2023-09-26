import React, {createContext, useState} from 'react'

const FilterContext = createContext()
export default FilterContext

export function FilterContextWrapper({data, children}) {
  return (
    <FilterContext.Provider value={data}>
        {children}
    </FilterContext.Provider>
  )
}


