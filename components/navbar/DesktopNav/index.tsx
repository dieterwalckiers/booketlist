import {
    Box,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import DesktopSubNav from './DesktopSubNav';

const DesktopNav = ({ navItems }) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack
            id="desktop-nav"
            direction={'row'}
            height={{ base: "inherit", md: "50px" }}
            spacing={0}
        >
            {(navItems || []).map((navItem, i) => (
                <Box
                    key={navItem.label}
                    className="navbar-body-item"
                    borderLeft={{ base: 'none', md: i === 0 ? 'none' : '1px' }}
                    textAlign={{ base: "inherit", md: "center" }}
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
                                fontWeight={300}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}
                                textAlign={{ base: "inherit", md: "center" }}
                            >
                                {navItem.label}
                                {(navItem.children || []).length ? (<span> +</span>) : null}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={1}
                                borderStyle={'solid'}
                                boxShadow={"sm"}
                                bg={popoverContentBgColor}
                                p={4}
                                minW={'sm'}
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
            ))}
        </Stack>
    );
};

export default DesktopNav;