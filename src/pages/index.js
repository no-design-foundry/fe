import data from '@/data'
import Link from 'next/link'
import React from 'react'
import { useFela } from 'react-fela'

const contentRule = () => ({
  marginTop: "3em"
})

const postUlRule = () => ({
  fontFamily: "cursive",
  listStyleType: "disc",
  marginLeft: "2.5ch",
})

function Index() {
  const { css } = useFela()

  return (
    <div className={css(contentRule)}>
      <div>Posts</div>
      <ul className={css(postUlRule)}>
        {data.filter(entry => entry.type === "post").map((entry) => (
          <li key={entry.slug}>
            <Link href={`post/${entry.slug}`}>
              {entry.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Index
