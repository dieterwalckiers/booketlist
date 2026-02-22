import { Box } from '@chakra-ui/react'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import { useNextSanityImage } from 'next-sanity-image'
import React from 'react'
import { SanityImage } from 'shared/contract'

import { client } from '../../../sanity/lib/client'

interface Props {
  bookTitle: string
  image: SanityImage
  index: number
  onClick: (index: number) => void
  isActive?: boolean
}

const BookImageThumb: React.FC<Props> = ({
  bookTitle,
  image,
  index,
  onClick,
  isActive,
}) => {
  const imageProps = useNextSanityImage(
    client,
    image as unknown as SanityImageSource
  )
  if (!imageProps || !image.asset) return null

  return (
    <Box
      position="relative"
      w="80px"
      h="80px"
      flexShrink={0}
      overflow="hidden"
      borderRadius="sm"
      border="2px solid"
      borderColor={isActive ? '#ef4e41' : 'gray.200'}
      cursor="pointer"
      transition="border-color 0.15s ease"
      bg="gray.50"
      _hover={{ borderColor: isActive ? '#ef4e41' : 'gray.400' }}
      onClick={() => onClick(index)}
    >
      <Image
        src={imageProps.src}
        loader={imageProps.loader}
        fill
        sizes="80px"
        placeholder="blur"
        blurDataURL={image.asset.metadata.lqip as string}
        alt={`Image for ${bookTitle}`}
        style={{ objectFit: 'contain' }}
      />
    </Box>
  )
}

export default BookImageThumb
