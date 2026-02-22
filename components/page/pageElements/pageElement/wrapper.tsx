import { Box } from '@chakra-ui/react'
import React from 'react'

interface IProps {
  children: React.ReactNode
}

const PageElementWrapper: React.FC<IProps> = ({ children }) => {
  return (
    <Box w={{ base: '100%', lg: '900px' }} p="3" boxSizing="content-box">
      {children}
    </Box>
  )
}

export default PageElementWrapper
