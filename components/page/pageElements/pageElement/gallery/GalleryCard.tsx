import {
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import Image from 'next/image'
import { useNextSanityImage } from 'next-sanity-image'
import React from 'react'

import { client } from '../../../../../sanity/lib/client'

interface Props {
  asset: any
  cardWidthMd: string
  link?: string
}

const GalleryCard: React.FC<Props> = ({ asset, cardWidthMd, link }) => {
  const imageProps: Record<string, any> = useNextSanityImage(client, asset)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const onClickImage = () => {
    if (link) {
      window.open(link, '_blank')
      return
    }
    onOpen()
  }

  return (
    <>
      <Flex
        width={{ base: '100%', md: cardWidthMd }}
        direction="column"
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
      >
        <Image
          {...(imageProps as any)}
          style={{ width: '100%', height: 'auto' }}
          sizes="(max-width: 768px) 100vw, 50vw, 33vw"
          placeholder="blur"
          blurDataURL={asset.metadata.lqip}
          alt="" // TODO add alt text to cms
          onClick={onClickImage}
        />
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <Image
            {...(imageProps as any)}
            style={{ width: '100%', height: 'auto' }}
            sizes="(max-width: 768px) 98vw, 1152px"
            placeholder="blur"
            blurDataURL={asset.metadata.lqip}
            alt="" // TODO add alt text to cms
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export default GalleryCard
