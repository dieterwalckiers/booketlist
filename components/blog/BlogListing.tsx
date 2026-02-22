import { Flex } from '@chakra-ui/react'
import H1 from 'components/headings/h1'
import React from 'react'
import { BlogPostSummary } from 'shared/contract'

import BlogCard from './BlogCard'

interface Props {
  posts: BlogPostSummary[]
}

const BlogListing: React.FC<Props> = ({ posts }) => {
  return (
    <Flex
      direction="column"
      w={{ base: '100%', lg: '900px' }}
      p="3"
      boxSizing="content-box"
    >
      <H1>Blog</H1>
      <Flex flexWrap="wrap" gap={6} mt={4}>
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </Flex>
    </Flex>
  )
}

export default BlogListing
