import { Box, Heading } from '@chakra-ui/react'
import BooksOverview from 'components/booksoverview'
import H2 from 'components/headings/h2'
import React from 'react'
import { AuthorWithBooks } from 'shared/contract'

interface IProps {
  author: AuthorWithBooks
}

const AuthorBooks: React.FC<IProps> = ({ author }) => {
  return (
    author.books && (
      <Box id="author-books">
        <BooksOverview books={author.books} title={`Books by ${author.name}`} />
      </Box>
    )
  )
}

export default AuthorBooks
