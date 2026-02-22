import { Box, Container, Flex, Link, Show, Stack } from '@chakra-ui/react'

import AtIcon from './AtIcon'

interface Props {}

export default function SmallCentered({}) {
  return (
    <Box bg="#003e45" color="gray.100">
      <Flex
        justify={'center'}
        align={'center'}
        py={8}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box mr={6}>BOOKETLIST agency by Sarah Claeys</Box>
        <Show above="md">
          <Box mr={6}>|</Box>
        </Show>
        <a href="mailto:hello@booketlistagency.com">
          <Flex mr={6} alignItems="center">
            hello
            <AtIcon />
            booketlistagency.com
          </Flex>
        </a>
        <Stack direction={'row'} spacing={6}>
          <Link href={'/books'}>Books</Link>
          <Link href={'/blog'}>Blog</Link>
          <Link href={'/page/about'}>About</Link>
        </Stack>
      </Flex>
    </Box>
  )
}
