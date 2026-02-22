import { Box, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  title?: string
  children: React.ReactNode
}

const FilterPanelSection: React.FC<Props> = ({ title, children }) => {
  return (
    <Box mt={4} mb={4} p={2} border="1px solid #ddd" borderRadius={4} px={2}>
      <Text p={1} fontSize="sm" fontWeight="medium">
        {title}
      </Text>
      {children}
    </Box>
  )
}

export default FilterPanelSection
