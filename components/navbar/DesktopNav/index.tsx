import {
    Box,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';

import DesktopSubNav from './DesktopSubNav';

const DesktopNav = ({ navItems }) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction={'row'} spacing={4}>
            {(navItems || []).map((navItem, i) => (
                <Box
                    key={navItem.label}
                    className="navbar-body-item"
                    borderLeft={{ base: 'none', md: i === 0 ? 'none' : '1px' }}
                >
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                className="navbar-body-item-link"
                                p={2}
                                href={navItem.href ?? '#'}
                                fontSize={'sm'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}
                                pr={4}
                                pl={8}
                            >
                                {navItem.label}
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