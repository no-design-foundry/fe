import data from '@/data'
import Link from 'next/link'
import React from 'react'


function Index() {
  return (
    <div>
      <div>Posts</div>
      <ul>
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
