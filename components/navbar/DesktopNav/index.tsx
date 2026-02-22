import {
  Box,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/react'
import { NavItem } from 'components/navbar/contract'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import DesktopSubNav from './DesktopSubNav'

interface Props {
  navItems: NavItem[]
}

const DesktopNav = ({ navItems }: Props) => {
  const router = useRouter()
  const currentPath = router.asPath || ''
  const linkColor = 'gray.600'
  const linkHoverColor = 'gray.800'
  const activeLinkColor = 'gray.900'

  const matchesPath = (href: string): boolean =>
    currentPath === href || currentPath.startsWith(href + '/')

  const isActive = (navItem: NavItem): boolean => {
    if (navItem.href && navItem.href !== '#' && matchesPath(navItem.href))
      return true
    return (
      navItem.children?.some(
        (child) => child.href && matchesPath(child.href)
      ) ?? false
    )
  }

  return (
    <Stack
      id="desktop-nav"
      direction={'row'}
      height={{ base: 'inherit', lg: '50px' }}
      spacing={0}
    >
      {(navItems || []).map((navItem, i) => {
        const active = isActive(navItem)

        return (
          <Box
            key={navItem.label}
            className="navbar-body-item"
            borderLeft={{ base: 'none', lg: i === 0 ? 'none' : '1px' }}
            textAlign={{ base: 'inherit', lg: 'center' }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            px={12}
          >
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  className="navbar-body-item-link"
                  href={navItem.href ?? '#'}
                  as={NextLink}
                  fontSize="lg"
                  fontWeight={active ? 500 : 300}
                  color={active ? activeLinkColor : linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}
                  textAlign={{ base: 'inherit', lg: 'center' }}
                >
                  {navItem.label}
                  {(navItem.children || []).length ? <span> +</span> : null}
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={1}
                  borderStyle={'solid'}
                  boxShadow={'lg'}
                  bg="white"
                  p={4}
                  minW={'sm'}
                  rounded="md"
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        )
      })}
    </Stack>
  )
}

export default DesktopNav
