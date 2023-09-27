import React, { useEffect } from 'react'
import { useFela } from 'react-fela'

const logRule = () => ({
  color: "red",
  gridColumn: "1 / 2 span"
})

function Log({error, removeSelf}) {
  const {css} = useFela()
  return (
    <div className={css(logRule)}>{error.response.data.detail}</div>
  )
}

export default Log