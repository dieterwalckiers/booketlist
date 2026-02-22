import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import Image from 'next/image'
import Link from 'next/link'
import { useNextSanityImage,UseNextSanityImageProps } from 'next-sanity-image'
import React from 'react'
import { BlogPostSummary } from 'shared/contract'

import { client } from '../../sanity/lib/client'
import { formatBlogDate } from './helpers'

interface Props {
  post: BlogPostSummary
}

const CoverImage: React.FC<{
  coverImage: BlogPostSummary['coverImage']
  title: string
}> = ({ coverImage, title }) => {
  const imageProps: UseNextSanityImageProps | null = useNextSanityImage(
    client,
    coverImage?.asset as SanityImageSource | null
  )

  if (!coverImage?.asset || !imageProps) return null

  return (
    <Box h="180px" overflow="hidden" position="relative">
      <Image
        src={imageProps.src}
        loader={imageProps.loader}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 48em) 100vw, 280px"
        placeholder="blur"
        blurDataURL={coverImage.asset.metadata?.lqip as string}
        alt={`Cover for ${title}`}
      />
    </Box>
  )
}

const BlogCard: React.FC<Props> = ({ post }) => {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <Box
        borderRadius="md"
        overflow="hidden"
        boxShadow="md"
        transition="all 0.2s"
        _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
        bg="white"
        w={{ base: '100%', md: '280px' }}
        cursor="pointer"
      >
        <CoverImage coverImage={post.coverImage} title={post.title} />
        <Box p={4}>
          <Heading as="h3" fontSize="lg" color="#043b4b" mb={2} noOfLines={2}>
            {post.title}
          </Heading>
          {post.excerpt && (
            <Text fontSize="sm" color="gray.600" noOfLines={3} mb={3}>
              {post.excerpt}
            </Text>
          )}
          <Flex fontSize="xs" color="gray.500" mb={2} gap={1} flexWrap="wrap">
            <Text>{formatBlogDate(post.publishedAt)}</Text>
            {post.author && (
              <>
                <Text>{'·'}</Text>
                <Text>{post.author}</Text>
              </>
            )}
          </Flex>
        </Box>
      </Box>
    </Link>
  )
}

export default BlogCard
