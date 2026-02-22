import { Heading } from '@chakra-ui/react'
import React from 'react'

interface IProps {
  children: React.ReactNode
}

const H3: React.FC<IProps> = ({ children }) => {
  return (
    <Heading as="h3" fontSize="xl" mb={4} color="#696969">
      {children}
    </Heading>
  )
}

export default H3
