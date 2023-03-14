import { Heading } from "@chakra-ui/react";
import React from "react";

interface IProps {
    children: React.ReactNode;
}

const H1: React.FC<IProps> = ({ children }) => {
    return (
        <Heading as="h1" fontSize="4xl" mb={4} color="#043b4b" fontWeight="thin">
            {children}
        </Heading>
    )
}

export default H1;