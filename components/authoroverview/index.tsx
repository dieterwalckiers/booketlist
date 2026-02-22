import { Box } from '@chakra-ui/react'
import React from 'react'
import { AuthorWithBooks } from 'shared/contract'

import AuthorBooks from './authorbooks'
import AuthorDetail from './authordetail'

interface IProps {
  author: AuthorWithBooks
}

const AuthorOverview: React.FC<IProps> = ({ author }) => {
  return (
    <Box id="author-overview">
      <AuthorDetail author={author} />
      <AuthorBooks author={author} />
    </Box>
  )
}

export default AuthorOverview
