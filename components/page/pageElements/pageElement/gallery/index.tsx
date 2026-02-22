import { Box, Flex } from '@chakra-ui/react'
import * as React from 'react'
import { useMemo } from 'react'

import { PageElementGallery } from '../../../../../shared/contract'
import GalleryCard from './GalleryCard'

interface IProps {
  element: PageElementGallery
}

const PageElement: React.FC<IProps> = ({ element }) => {
  const imageDatas = element?.value ? (element.value as Array<any>) : []

  const cardWidthMd = useMemo(() => {
    if (imageDatas.length === 1) {
      return '80%'
    }
    if (imageDatas.length === 2) {
      return '48%'
    }
    return '32%'
  }, [imageDatas.length])

  return (
    <Box w="100%">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        flexWrap="wrap"
        justifyContent={imageDatas.length === 1 ? 'center' : 'space-between'}
        className="flx"
      >
        {imageDatas.map((imageData, index) => {
          return (
            <GalleryCard
              key={`gallery${index}`}
              asset={imageData.value?.asset}
              link={imageData.link}
              cardWidthMd={cardWidthMd}
            />
          )
        })}
      </Flex>
    </Box>
  )
}

export default PageElement
