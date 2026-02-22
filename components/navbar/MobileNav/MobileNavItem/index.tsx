import { Box, Flex, Link, Stack, Text } from '@chakra-ui/react'
import { NavItem } from 'components/navbar/contract'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

type MobileNavItemProps = NavItem & {
  reqCloseMenu: () => void
  menuOpen: boolean
}

const MobileNavItem = ({
  label,
  children,
  href,
  reqCloseMenu,
  menuOpen,
}: MobileNavItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = children && children.length > 0

  useEffect(() => {
    if (!menuOpen) setIsOpen(false)
  }, [menuOpen])

  if (!hasChildren) {
    return (
      <Box py={3}>
        <Link
          href={href ?? '#'}
          as={NextLink}
          onClick={reqCloseMenu}
          _hover={{ textDecoration: 'none' }}
        >
          <Text fontWeight={600} color="gray.600" fontSize="xl">
            {label}
          </Text>
        </Link>
      </Box>
    )
  }

  return (
    <Box py={3}>
      <Flex
        justify={'space-between'}
        align={'center'}
        cursor="pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        aria-expanded={isOpen}
        _hover={{ color: 'gray.800' }}
      >
        <Text fontWeight={600} color="gray.600" fontSize="xl">
          {label}
        </Text>
        <Text color="gray.500" fontSize="xl" userSelect="none">
          {isOpen ? '–' : '+'}
        </Text>
      </Flex>

      {isOpen && (
        <Stack
          mt={2}
          pl={4}
          borderLeft={2}
          borderStyle={'solid'}
          borderColor="gray.200"
          align={'start'}
          spacing={0}
        >
          {children.map((child) => (
            <Link
              key={child.label}
              py={2}
              href={child.href}
              as={NextLink}
              color="gray.600"
              fontSize="xl"
              onClick={reqCloseMenu}
              _hover={{ color: 'gray.800', textDecoration: 'none' }}
            >
              {child.label}
            </Link>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default MobileNavItem
