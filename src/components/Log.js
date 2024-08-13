import React, { useEffect } from 'react'
import { useFela } from 'react-fela'

const logRule = () => ({
  color: "red",
  gridColumn: "1 / 2 span"
})

function Log({message}) {
  const {css} = useFela()
  return (
    <div className={css(logRule)}>{message}</div>
  )
}

export default Log