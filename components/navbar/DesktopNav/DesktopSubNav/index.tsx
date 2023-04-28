import {
    ChevronRightIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Flex,
    Icon,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import { NavItem } from 'components/navbar/contract';
import NextLink from 'next/link';

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            as={NextLink}
        >
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .1s ease'}
                        _groupHover={{ color: 'orange.400' }}
                        fontWeight={500}
                    >
                        {label}
                    </Text>
                    {subLabel && (<Text fontSize={'sm'}>{subLabel}</Text>)}
                </Box>
                <Flex
                    transition={'all .1s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'orange.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    );
};
export default DesktopSubNav;