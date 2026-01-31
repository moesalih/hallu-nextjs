import fcsdk from '@farcaster/miniapp-sdk'
import LinkifyIt from 'linkify-it'
import { useMemo } from 'react'
import Link from 'next/link'

const linkify = new LinkifyIt()
linkify.add('@', {
  validate: /^([a-zA-Z0-9\.\-\_\/]*[a-zA-Z0-9\_])/,
})
linkify.add('/', {
  validate: /^([a-zA-Z0-9\.\-\_]*[a-zA-Z0-9\_])/,
})
// linkify.add('$', {
//   validate: /^([a-zA-Z][a-zA-Z]*[a-zA-Z])/,
// })

export const LinkedText = ({ children }) => {
  if (!children) return null
  const text = children

  const elements = useMemo(() => {
    return parseText({ text })
  }, [text])

  return <span>{elements}</span>
}

const parseText = ({ text }) => {
  const parts = linkify.match(text)
  if (!parts) return [text]

  const elementsArray = [] as any
  let lastIndex = 0
  parts.forEach((part, index) => {
    // Add the plain text before the link
    elementsArray.push(text.substring(lastIndex, part.index))
    // Add the link
    elementsArray.push(partLink({ index, part }))
    lastIndex = part.lastIndex
  })
  // Add the remaining text
  elementsArray.push(text.substring(lastIndex))

  return elementsArray
}

const partLink = ({ index, part }) => {
  // if (part.schema === '$')
  //   return (
  //     <Text key={index} color="$green9">
  //       {part.text}
  //     </Text>
  //   )

  const external = part.schema == 'https:' || part.schema == 'http:' || part.schema == ''

  let href = part.url
  let textSpan = <span className="text-blue-500 user-select-auto">{part.text}</span>
  // let action = undefined

  if (part.schema === '@') href = `/u/${part.text.substring(1)}`
  if (part.schema === '/') href = `/c/${part.text.substring(1)}`

  const onClick = (e) => {
    e.preventDefault()
    fcsdk?.context?.then((context) => {
      if (context) fcsdk?.actions.openUrl(href)
      else window.open(href, '_blank')
    })
  }

  return (
    <span key={index} onClick={(e) => e.stopPropagation()}>
      {external && (
        <a href={href} target={external ? '_blank' : ''} onClick={onClick}>
          {textSpan}
        </a>
      )}
      {!external && <Link href={href}>{textSpan}</Link>}
    </span>
  )
}
