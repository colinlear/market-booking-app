import {
  ManageMarketStalls,
  type StatusFilter,
} from "@/manager/ManageMarketStalls";
import { useIsMarketAdmin } from "@/MarketContext";
import { Heading, HStack, SegmentGroup } from "@chakra-ui/react";
import { useState, type FC } from "react";

export const ManageStallsRoute: FC = () => {
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
    </>
  );
};
