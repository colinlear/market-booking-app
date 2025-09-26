import { Box, type BoxProps } from "@chakra-ui/react";
import type { FC } from "react";

export const SubHeader: FC<BoxProps> = ({
  children,
  height = "2.75rem",
  padding = 2,
}) => {
  return (
    <>
      <Box
        position="fixed"
        top="7rem"
        left={0}
        right={0}
        height={height}
        backgroundColor="bg.panel"
        zIndex={10}
        padding={padding}
      >
        {children}
      </Box>
      <Box height={height} />
    </>
  );
};
