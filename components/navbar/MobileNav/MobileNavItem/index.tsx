import {
    Collapse,
    Flex,
    Link,
    Stack,
    Text,
} from "@chakra-ui/react";
import { NavItem } from "components/navbar/contract";
import NextLink from "next/link";

type MobileNavItemProps = NavItem & {
    reqCloseMenu: () => void;
}

const MobileNavItem = ({ label, children, href, reqCloseMenu }: MobileNavItemProps) => {
    return (
        <Stack spacing={4}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color="gray.600"
                >
                    {label}
                </Text>
            </Flex>

            <Collapse in={true} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor="gray.200"
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.href} as={NextLink} color="black" onClick={reqCloseMenu}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

export default MobileNavItem;