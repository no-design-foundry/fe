import Markdown from '@/components/Markdown_2'
import React from 'react'
const foundryMarkdown = require("@/abouts/foundry.md")

function about() {
  return (
    <Markdown markdown={foundryMarkdown}/>
  )
}

export default about