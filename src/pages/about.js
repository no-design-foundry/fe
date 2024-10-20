import Markdown from '@/components/Markdown'
import React from 'react'
const foundryMarkdown = require("@/abouts/foundry.md")

function about() {
  return (
    <Markdown markdown={foundryMarkdown}/>
  )
}

export default about