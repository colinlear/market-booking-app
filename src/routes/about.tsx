import { BottomBar } from "@/common/bottom-bar";
import { useMarket } from "@/MarketContext";
import { Box, Heading, HStack, Link, Stack } from "@chakra-ui/react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";

export const AboutRoute: FC = () => {
  const market = useMarket();
  return (
    <Stack gap={2} height="100%">
      <Heading size="xl">{market.name}</Heading>
      <Box whiteSpace="pre-wrap">{market.description}</Box>
      <BottomBar>
        <HStack alignItems="flex-start" width="100vw">
          <HStack
            fontSize="sm"
            smDown={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "1px",
            }}
          >
            <Box>
              &copy;2025{" "}
              <Link
                variant="underline"
                href="https://helppo.au"
                target="_blank"
              >
                Helppo Solutions
              </Link>
              .
            </Box>
            <Box>All rights reserved</Box>
          </HStack>
          <Box flex={1} />
          <Link variant="underline" asChild>
            <RouterLink to="../privacy">Privacy Policy</RouterLink>
          </Link>
        </HStack>
      </BottomBar>
    </Stack>
  );
};
