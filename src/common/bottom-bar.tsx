import { Box, HStack, type BoxProps } from "@chakra-ui/react";
import type { FC } from "react";

export const BottomBar: FC<BoxProps> = ({
  children,
  height = "2.75rem",
  padding = 2,
}) => {
  return (
    <>
      <HStack
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        height={height}
        backgroundColor="bg.panel"
        zIndex={10}
        padding={padding}
        gap={2}
      >
        {children}
      </HStack>
      <Box height={height} />
    </>
  );
};
