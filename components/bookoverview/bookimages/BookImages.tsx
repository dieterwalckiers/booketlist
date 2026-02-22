import { AspectRatio, Box, Flex } from '@chakra-ui/react'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import { useNextSanityImage } from 'next-sanity-image'
import React from 'react'
import { Book, BookMediaItem } from 'shared/contract'

import { extractYouTubeId } from '../../../helpers/youtube'
import { client } from '../../../sanity/lib/client'
import BookImageThumb from './BookImageThumb'
import BookVideoThumb from './BookVideoThumb'

interface Props {
  book: Book
}

const BookImages: React.FC<Props> = ({ book }) => {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const additionalMedia: BookMediaItem[] = book.additionalMedia || []
  const allMedia: BookMediaItem[] = [
    ...(book.cover ? [book.cover] : []),
    ...additionalMedia,
  ]

  const activeItem = allMedia[activeIndex]
  const isActiveYouTube = activeItem?._type === 'youtube'

  const imageForHook = isActiveYouTube ? null : activeItem
  const activeImageProps = useNextSanityImage(
    client,
    imageForHook as SanityImageSource | null
  )

  const activeVideoId =
    activeItem?._type === 'youtube' ? extractYouTubeId(activeItem.url) : null

  return (
    <Box>
      <Box overflow="hidden" bg="gray.50" borderRadius="md">
        {activeItem?._type === 'youtube' && activeVideoId ? (
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideoId}`}
              title={`Video for ${book.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%' }}
            />
          </AspectRatio>
        ) : (
          activeItem &&
          activeItem._type !== 'youtube' &&
          activeItem.asset &&
          activeImageProps && (
            <Image
              src={activeImageProps.src}
              loader={activeImageProps.loader}
              width={activeImageProps.width}
              height={activeImageProps.height}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
              sizes="(max-width: 48em) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={activeItem.asset.metadata.lqip as string}
              alt={`Cover for ${book.title}`}
            />
          )
        )}
      </Box>
      {allMedia.length > 1 && (
        <Flex mt={3} gap={2} flexWrap="wrap">
          {allMedia.map((item, index) => {
            if (item._type === 'youtube') {
              return (
                <BookVideoThumb
                  key={`bm${index}`}
                  url={item.url}
                  bookTitle={book.title}
                  index={index}
                  onClick={setActiveIndex}
                  isActive={index === activeIndex}
                />
              )
            }
            return (
              <BookImageThumb
                key={`bm${index}`}
                image={item}
                bookTitle={book.title}
                index={index}
                onClick={setActiveIndex}
                isActive={index === activeIndex}
              />
            )
          })}
        </Flex>
      )}
    </Box>
  )
}

export default BookImages
