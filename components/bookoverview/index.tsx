import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { Book } from 'shared/contract'

import BookDetail from './bookdetail'
import BookImages from './bookimages/BookImages'

interface IProps {
  book: Book
}

const BookOverview: React.FC<IProps> = ({ book }) => {
  return (
    <Flex id="book-detail" direction={{ base: 'column', md: 'row' }}>
      <Box width={{ base: '100%', md: '50%' }}>
        <BookImages book={book} />
      </Box>
      <Flex
        maxWidth={{ base: 'auto', md: '50%' }}
        direction="column"
        justifyContent="center"
        ml={{ base: 0, md: 12 }}
      >
        <BookDetail book={book} />
      </Flex>
    </Flex>
  )
}

export default BookOverview
