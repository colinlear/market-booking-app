import { ManageMarketDates } from "@/manager/ManageMarketDates";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import { StallList } from "@/stall/StallList";
import { Box, Separator } from "@chakra-ui/react";
import type { FC } from "react";

export const HomeRoute: FC = () => {
  const market = useMarket();
  const isAdmin = useIsMarketAdmin();

  if (isAdmin) {
    return <ManageMarketDates />;
  }

  return (
    <>
      {!!market.description.trim() && (
        <>
          <Box mb={4} mt={4}>
            {market.description}
          </Box>
          <Separator mb={4} />
        </>
      )}
      <StallList />
    </>
  );
};
