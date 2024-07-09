import React from 'react'
import { useFela } from 'react-fela'

const _404Rule = () => ({
  marginTop: "1em"
})

function _404() {
  const { css } = useFela()
  return (
    <div className={css(_404Rule)}>404 – Page Not Found</div>
  )
}

export default _404