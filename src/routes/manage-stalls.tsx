import {
  ManageMarketStalls,
  type StatusFilter,
} from "@/manager/ManageMarketStalls";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import { Box, Button, Heading, HStack, SegmentGroup } from "@chakra-ui/react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";

export const ManageStallsRoute: FC = () => {
  const market = useMarket();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const isAdmin = useIsMarketAdmin();
  if (!isAdmin) return "Access Denied";

  return (
    <>
      <HStack mt={3} mb={2} justifyContent="space-between">
        <Heading size="sm">Market Stalls:</Heading>
        <SegmentGroup.Root
          size="xs"
          defaultValue={"All"}
          onValueChange={(e) =>
            setFilter((e.value?.toLocaleLowerCase() ?? "all") as StatusFilter)
          }
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={["All", "Pending", "Rejected"]} />
        </SegmentGroup.Root>
      </HStack>
      <ManageMarketStalls status={filter} />
      <Box height={14} />
      <HStack
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        height={14}
        background="white"
        p={2}
        alignItems="center"
      >
        <Button
          onClick={() => navigate(`/${market.code}/stall/add`)}
          colorPalette="blue"
        >
          Add New Stall
        </Button>
      </HStack>
    </>
  );
};
