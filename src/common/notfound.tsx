import { Box, Heading, HStack, Link, Stack } from "@chakra-ui/react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";

export const NotFound: FC = () => {
  return (
    <Stack
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgColor="green.500"
      color="white"
    >
      <Box mt="30%">
        <Heading size="3xl">Market not found</Heading>
      </Box>
      <Box flex={1}></Box>
      <HStack
        flex={0}
        width="100%"
        px={2}
        bgColor="white"
        color="black"
        alignItems="flex-start"
      >
        <HStack
          smDown={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1px",
          }}
        >
          <Box>
            &copy;2025{" "}
            <Link variant="underline" href="https://helppo.au" target="_blank">
              Helppo Solutions
            </Link>
            .
          </Box>
          <Box>All rights reserved</Box>
        </HStack>
        <Box flex={1} />
        <Link variant="underline" asChild>
          <RouterLink to="/privacy">Privacy Policy</RouterLink>
        </Link>
      </HStack>
    </Stack>
  );
};
