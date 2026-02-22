import { Box, Input } from '@chakra-ui/react'
import React from 'react'

interface Props {}

const SearchBox: React.FC<Props> = () => {
  return (
    <Box>
      <Input border="1px solid black" h={10} placeholder="Search" p={3} />
    </Box>
  )
}

export default SearchBox
