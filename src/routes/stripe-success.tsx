import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";

import { Heading, Button, Stack, Box } from "@chakra-ui/react";
import { useMarket } from "@/MarketContext";
import { getStripePayment } from "@/firebase/stripe-payment";

export const StripeSuccessRoute: FC = () => {
  const navigate = useNavigate();
  const market = useMarket();
  const { stallId } = useParams();
  const query = new URLSearchParams(window.location.search);
  const [completed, setCompleted] = useState(false);

  const session = query.get("session");

  useEffect(() => {
    if (completed || !session) {
      const timeout = window.setTimeout(() => {
        navigate(`/${market.code}/stall/${stallId}`);
      }, 2000);
      return () => window.clearTimeout(timeout);
    }
  }, [navigate, market, stallId, completed, session]);

  useEffect(() => {
    if (!completed && session) {
      const timeout = window.setInterval(async () => {
        const status = await getStripePayment(session);
        if (status == "paid") {
          setCompleted(true);
        }
      }, 1000);
      return () => window.clearInterval(timeout);
    }
  }, [session, completed]);

  if (!session) {
    return (
      <Stack gap={4}>
        <Heading textAlign="center" size="4xl" marginY={4}>
          Processing Error
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
  }

  if (!completed) {
    return (
      <Stack gap={4}>
        <Heading textAlign="center" size="4xl" marginY={4}>
          Processing Payment
        </Heading>
        <Box textAlign="center">Please wait for payment to complete...</Box>
      </Stack>
    );
  }

  return (
    <Stack gap={4}>
      <Heading textAlign="center" size="4xl" marginY={4}>
        Payment Successful
      </Heading>
      <Button
        variant="solid"
        colorPalette="blue"
        onClick={() =>
          navigate(`/${market.code}/stall/${stallId}`, { replace: true })
        }
      >
        Done
      </Button>
    </Stack>
  );
};
