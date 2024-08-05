import React from 'react'
import { useFela } from 'react-fela'

const inputRule = () => ({
  width: "100%"
})

function Checkbox({
    label,
    name,
    disabled,
    required,
    handleOnInput
}) {
    const {css} = useFela()
  return (
    <>
    <label htmlFor={name} data-disabled={disabled}>
      {label}
    </label>
    <input
      name={name}
      type="checkbox"
      className={css(inputRule)}
      required={required}
      onInput={handleOnInput}
      disabled={disabled}
    />
  </>
  )
}

export default Checkbox