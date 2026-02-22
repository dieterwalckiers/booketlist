import { Stack } from '@chakra-ui/react'
import Image from 'next/image'
import { useNextSanityImage } from 'next-sanity-image'
import React from 'react'

import { client } from '../../../sanity/lib/client'

interface IProps {
  logoData: any
  scrolled?: boolean
}

const Logo: React.FC<IProps> = ({ logoData, scrolled }) => {
  const logoImageProps: Record<string, any> = useNextSanityImage(
    client,
    logoData
  )

  const logoWidth = scrolled ? '200px' : '300px'

  return (
    <Stack
      id="logo"
      width={logoWidth}
      height="auto"
      transition="width 0.3s ease"
    >
      {logoData?.asset && (
        <Image
          {...(logoImageProps as any)}
          style={{
            width: '100%',
            height: 'auto',
            transition: 'all 0.3s ease',
          }}
          sizes="300px"
          placeholder="blur"
          blurDataURL={logoData.asset.metadata.lqip}
          alt="Booketlist"
        />
      )}
    </Stack>
  )
}

export default Logo
