import { Box, Heading } from "@chakra-ui/react";
import type { FC } from "react";

export const NotFound: FC = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      bgColor="green.500"
      color="white"
    >
      <Box mt="30%">
        <Heading size="3xl">Market not found</Heading>
      </Box>
    </Box>
  );
};
