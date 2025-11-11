import { Header } from "@/common/header";
import { MarketProvider } from "@/MarketProvider";
import { Stack } from "@chakra-ui/react";
import type { FC } from "react";
import { Outlet, useParams } from "react-router";

export const BaseUI: FC = () => {
  const { marketCode } = useParams();
  return (
    <MarketProvider marketCode={marketCode}>
      <Header />
      <Stack marginX={2} marginY={2} minHeight="calc(100vh - 9rem)">
        <Outlet />
      </Stack>
    </MarketProvider>
  );
};
