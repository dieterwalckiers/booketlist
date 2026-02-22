import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { PortableText } from '@portabletext/react'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import PageElementWrapper from 'components/page/pageElements/pageElement/wrapper'
import Image from 'next/image'
import { useNextSanityImage,UseNextSanityImageProps } from 'next-sanity-image'
import React from 'react'
import { BlogPost } from 'shared/contract'

import { client } from '../../sanity/lib/client'
import { formatBlogDate } from './helpers'
import { blogPortableTextComponents } from './portableTextComponents'

interface Props {
  post: BlogPost
}

const CoverImage: React.FC<{ post: BlogPost }> = ({ post }) => {
  const imageProps: UseNextSanityImageProps | null = useNextSanityImage(
    client,
    post.coverImage?.asset as SanityImageSource | null
  )

  if (!post.coverImage?.asset || !imageProps) return null

  return (
    <Box my={6} overflow="hidden" borderRadius="md">
      <Image
        src={imageProps.src}
        loader={imageProps.loader}
        width={imageProps.width}
        height={imageProps.height}
        style={{ width: '100%', height: 'auto' }}
        sizes="(max-width: 48em) 100vw, 900px"
        placeholder="blur"
        blurDataURL={post.coverImage.asset.metadata?.lqip as string}
        alt={`Cover for ${post.title}`}
      />
    </Box>
  )
}

const BlogPostDetail: React.FC<Props> = ({ post }) => {
  return (
    <PageElementWrapper>
      <Heading
        as="h1"
        fontSize="4xl"
        color="#043b4b"
        fontWeight="thin"
        mb={4}
        textAlign="center"
      >
        {post.title}
      </Heading>
      <Flex
        justify="center"
        gap={3}
        fontSize="sm"
        color="gray.500"
        mb={2}
        flexWrap="wrap"
      >
        <Text>{formatBlogDate(post.publishedAt)}</Text>
        {post.author && (
          <>
            <Text>{'·'}</Text>
            <Text color="#ef4e41">{post.author}</Text>
          </>
        )}
      </Flex>

      <CoverImage post={post} />

      <Box className="blog-body" lineHeight="1.8" fontSize="md">
        <PortableText
          value={post.body}
          components={blogPortableTextComponents}
        />
      </Box>

    </PageElementWrapper>
  )
}

export default BlogPostDetail
