import type { FC } from "react";
import { useNavigate } from "react-router";
import { Button, Stack, Heading } from "@chakra-ui/react";

import { useStallList } from "./useStallList";
import { StallForm } from "./StallForm";
import { StallDetails } from "./StallDetails";
import { useMarket } from "@/MarketContext";

export const StallList: FC = () => {
  const navigate = useNavigate();
  const market = useMarket();
  const { stalls, loading, reload } = useStallList();

  if (loading) return "Loading Stalls...";

  if (!loading && !stalls?.length) {
    return (
      <>
        <StallForm onSave={() => reload()} />
      </>
    );
  }

  return (
    <>
      <Stack gap={2}>
        <Heading size="md">Your Stalls</Heading>
        {stalls?.map((stall) => (
          <StallDetails key={stall.id} stall={stall} />
        ))}
      </Stack>
      <Button
        colorPalette="blue"
        onClick={() => {
          navigate(`/${market.code}/stall/add`);
        }}
      >
        Add Stall
      </Button>
    </>
  );
};
