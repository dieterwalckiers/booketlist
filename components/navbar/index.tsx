import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Link,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { NavItem } from './contract'
import DesktopNav from './DesktopNav'
import Logo from './Logo'
import MobileNav from './MobileNav'

interface Props {
  navItems: NavItem[]
  logoData: any
}

export default function NavBar({ navItems, logoData }: Props) {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const [scrolled, setScrolled] = useState(false)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Box
        id="navbar"
        as="nav"
        aria-label="Main navigation"
        width="100%"
        mt={{ base: 0, lg: 6 }}
        position="sticky"
        top={0}
        zIndex={1100}
        bg="white"
      >
        <Flex
          color="gray.600"
          minH={scrolled ? '40px' : '60px'}
          pt={scrolled ? 1 : 2}
          pb={scrolled ? 2 : 4}
          borderTop={1}
          borderBottom={1}
          borderStyle={'solid'}
          align={'center'}
          id="navbar-inner"
          transition="all 0.3s ease"
        >
          <Flex
            flex={{ base: 1, lg: 'auto' }}
            display={{ base: 'flex', lg: 'none' }}
            id="navbar-menu-trigger"
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={'ghost'}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            />
          </Flex>
          <Flex
            flex={{ base: 1 }}
            justify={{ base: 'center' }}
            id="navbar-body-items"
          >
            <Link href="/" as={NextLink}>
              <Logo logoData={logoData} scrolled={scrolled} />
            </Link>
            <Flex
              display={{ base: 'none', lg: 'flex' }}
              ml={10}
              flex={{ base: 'auto', lg: 1 }}
              justifyContent={{ base: 'auto', lg: 'flex-end' }}
              alignItems="center"
            >
              <DesktopNav navItems={navItems} />
            </Flex>
          </Flex>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav navItems={navItems} reqCloseMenu={onClose} menuOpen={isOpen} />
        </Collapse>
      </Box>

      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.400"
          zIndex={1099}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}
