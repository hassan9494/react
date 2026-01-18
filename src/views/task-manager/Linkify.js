// src/components/Linkify.js
import React from 'react'

const Linkify = ({ text, className = '' }) => {
  if (!text) return null

  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g
  
  // Split text into parts (text and URLs)
  const parts = text.split(urlRegex)
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a 
              key={index}
              href={part} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary text-decoration-underline"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          )
        }
        return part
      })}
    </span>
  )
}

export default Linkify