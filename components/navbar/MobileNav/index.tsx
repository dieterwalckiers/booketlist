import {
    Stack,
} from '@chakra-ui/react';

import MobileNavItem from "./MobileNavItem";

const MobileNav = ({ navItems, reqCloseMenu }) => {
    return (
        <Stack
            bg="white"
            p={4}
            display={{ md: 'none' }}>
            {(navItems || []).map((navItem) => (
                <MobileNavItem
                    key={navItem.label}
                    {...navItem}
                    reqCloseMenu={reqCloseMenu}
                />
            ))}
        </Stack>
    );
};

export default MobileNav;