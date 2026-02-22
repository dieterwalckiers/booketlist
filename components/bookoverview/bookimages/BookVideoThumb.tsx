import { Box } from '@chakra-ui/react'
import React from 'react'

import { extractYouTubeId } from '../../../helpers/youtube'

interface Props {
  url: string
  bookTitle: string
  index: number
  onClick: (index: number) => void
  isActive?: boolean
}

const BookVideoThumb: React.FC<Props> = ({
  url,
  bookTitle,
  index,
  onClick,
  isActive,
}) => {
  const videoId = extractYouTubeId(url)
  if (!videoId) return null

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt={`Video for ${bookTitle}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="28px"
        h="28px"
        bg="rgba(0,0,0,0.65)"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          as="span"
          style={{
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: '9px solid white',
            marginLeft: '2px',
          }}
        />
      </Box>
    </Box>
  )
}

export default BookVideoThumb
