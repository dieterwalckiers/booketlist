import { Box, Text } from '@chakra-ui/react'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import { useNextSanityImage, UseNextSanityImageProps } from 'next-sanity-image'
import React from 'react'

import { client } from '../../sanity/lib/client'
import { sanityImageBuilder } from '../../sanity/lib/image'

interface BlogImageProps {
  value: {
    asset: SanityImageSource
    alt?: string
    caption?: string
  }
}

const BlogImage: React.FC<BlogImageProps> = ({ value }) => {
  const imageProps: UseNextSanityImageProps | null = useNextSanityImage(
    client,
    value.asset,
    { imageBuilder: sanityImageBuilder() }
  )

  if (!imageProps) return null

  return (
    <Box my={8}>
      <Image
        src={imageProps.src}
        loader={imageProps.loader}
        width={imageProps.width}
        height={imageProps.height}
        style={{ width: '100%', height: 'auto' }}
        sizes="(max-width: 48em) 100vw, 900px"
        alt={value.alt || ''}
      />
      {value.caption && (
        <Text
          mt={2}
          fontSize="sm"
          color="gray.500"
          textAlign="center"
          fontStyle="italic"
        >
          {value.caption}
        </Text>
      )}
    </Box>
  )
}

interface LinkProps {
  value?: {
    href?: string
    blank?: boolean
  }
  children: React.ReactNode
}

const BlogLink: React.FC<LinkProps> = ({ value, children }) => {
  const href = value?.href || '#'
  const isExternal = /^https?:\/\//i.test(href)
  const openInNewTab = value?.blank ?? isExternal
  return (
    <a
      href={href}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      style={{ color: '#ef4e41', textDecoration: 'underline' }}
    >
      {children}
    </a>
  )
}

export const blogPortableTextComponents = {
  types: {
    image: BlogImage,
  },
  marks: {
    link: BlogLink,
  },
}
