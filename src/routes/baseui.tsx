import { Header } from "@/common/header";
import { MarketProvider } from "@/MarketProvider";
import { Box } from "@chakra-ui/react/box";
import type { FC } from "react";
import { Outlet, useParams } from "react-router";

export const BaseUI: FC = () => {
  const { marketCode } = useParams();
  return (
    <MarketProvider marketCode={marketCode}>
      <Header />
      <Box marginX={2} marginY={2}>
        <Outlet />
      </Box>
    </MarketProvider>
  );
};
