import { useEffect, type FC } from "react";
import { useNavigate, useParams } from "react-router";

import { Button, Heading, Stack } from "@chakra-ui/react";
import { useMarket } from "@/MarketContext";

export const StripeCancelRoute: FC = () => {
  const market = useMarket();
  const { stallId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigate(`/${market.code}/stall/${stallId}`);
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [navigate, market, stallId]);

  return (
    <Stack gap={4}>
      <Heading textAlign="center" size="4xl" marginY={4}>
        Payment Cancelled
      </Heading>
      <Button
        variant="solid"
        colorPalette="blue"
        onClick={() =>
          navigate(`/${market.code}/stall/${stallId}`, { replace: true })
        }
      >
        Back
      </Button>
    </Stack>
  );
};
