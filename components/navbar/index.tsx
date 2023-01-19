import {
    CloseIcon,
    HamburgerIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Button,
    Collapse,
    Flex,
    IconButton,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';

import { client } from "../../sanity/lib/client";
import { NavItem } from './contract';
import DesktopNav from './DesktopNav';
import { buildNavItems } from './helpers';
import MobileNav from "./MobileNav";

interface Props {
    navItems: NavItem[];
}

export default function NavBar<Props>({ navItems }) {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box
            id="navbar"
            width={{ base: "auto", md: "80vw" }}
        >
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}
                id="navbar-inner"
            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
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
                    <Text
                        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                        fontFamily={'heading'}
                        color={useColorModeValue('gray.800', 'white')}>
                        Logo
                    </Text>
                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav navItems={navItems} />
                    </Flex>
                </Flex>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav navItems={navItems} />
            </Collapse>
        </Box>
    );
}