import { Heading } from "@chakra-ui/react";
import React from "react";

interface IProps {
    children: React.ReactNode;
}

const H2: React.FC<IProps> = ({ children }) => {
    return (
        <Heading as="h2" fontSize="xl" mb={4} color="#ef4e41">
            {children}
        </Heading>
    )
}

export default H2