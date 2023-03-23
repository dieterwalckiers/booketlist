import {
    CloseIcon,
    HamburgerIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Collapse,
    Flex,
    IconButton,
    Link,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import SearchBox from 'components/searchbox';
import NextLink from 'next/link';

import { NavItem } from './contract';
import DesktopNav from './DesktopNav';
import Logo from './Logo';
import MobileNav from "./MobileNav";


interface Props {
    navItems: NavItem[];
    logoData: any;
}

export default function NavBar<Props>({ navItems, logoData }) {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box
            id="navbar"
            width="100%"
            mt={{ base: 0, md: 6 }}
        >
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                pt={{ base: 2 }}
                pb={{ base: 4 }}
                borderTop={1}
                borderBottom={1}
                borderStyle={'solid'}
                // borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}
                id="navbar-inner"
            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    // ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                    id="navbar-menu-trigger"
                >
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                        }
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex
                    flex={{ base: 1 }}
                    justify={{ base: 'center' }}
                    id="navbar-body-items"
                >
                    <Link
                        href="/"
                        as={NextLink}
                    >
                        <Logo logoData={logoData} />
                    </Link>
                    <Flex
                        display={{ base: 'none', md: 'flex' }}
                        ml={10}
                        flex={{ base: "auto", md: 1 }}
                        justifyContent={{ base: "auto", md: "flex-end" }}
                        alignItems="center"
                    >
                        <DesktopNav navItems={navItems} />
                        {/* <SearchBox /> */}
                    </Flex>
                </Flex>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav navItems={navItems} />
            </Collapse>
        </Box>
    );
}
