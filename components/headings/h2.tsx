import { Heading } from '@chakra-ui/react'
import React from 'react'

interface IProps {
  children: React.ReactNode
  noMargin?: boolean
}

const H2: React.FC<IProps> = ({ children, noMargin }) => {
  return (
    <Heading
      as="h2"
      fontSize="xl"
      mb={4}
      color="#ef4e41"
      textTransform="uppercase"
      margin={noMargin ? 0 : undefined}
    >
      {children}
    </Heading>
  )
}

export default H2
