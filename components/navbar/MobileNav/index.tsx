import { Stack } from '@chakra-ui/react'
import { NavItem } from 'components/navbar/contract'

import MobileNavItem from './MobileNavItem'

interface Props {
  navItems: NavItem[]
  reqCloseMenu: () => void
  menuOpen: boolean
}

const MobileNav = ({ navItems, reqCloseMenu, menuOpen }: Props) => {
  return (
    <Stack
      bg="white"
      p={4}
      spacing={8}
      display={{ lg: 'none' }}
      maxH="calc(100vh - 60px)"
      overflowY="auto"
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      {(navItems || []).map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          {...navItem}
          reqCloseMenu={reqCloseMenu}
          menuOpen={menuOpen}
        />
      ))}
    </Stack>
  )
}

export default MobileNav
