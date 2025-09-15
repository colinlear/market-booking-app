import { Stack, SkeletonText, Skeleton } from "@chakra-ui/react";
import type { FC } from "react";

export const LoadingPage: FC = () => {
  return (
    <>
      <Stack gap="6" maxW="xs">
        <Skeleton height="7.5rem" width="100vw" />
        <Stack gap={6} padding={2}>
          <SkeletonText noOfLines={4} width="100%" />
          <Skeleton height="150px" width="100%" />
          <Skeleton height="150px" width="100%" />
        </Stack>
      </Stack>
    </>
  );
};
