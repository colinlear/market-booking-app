import { stripeAccountStatus, type StripeStatusResponse } from "@/stripe";
import { Box, HStack, Button, Spinner } from "@chakra-ui/react";
import { useEffect, useState, type FC } from "react";
import { StripeConnectButton } from "./StripeConnectButton";
import { useNavigate } from "react-router";
import { useMarket } from "@/MarketContext";

export const StripeAccountStatus: FC<{ account?: string }> = ({ account }) => {
  const navigate = useNavigate();
  const market = useMarket();
  const [loading, setLoading] = useState(!!account?.trim());
  const [status, setStatus] = useState<StripeStatusResponse>();

  useEffect(() => {
    if (account) {
      stripeAccountStatus(account)
        .then((s) => setStatus(s))
        .finally(() => setLoading(false));
    }
  });

  if (loading) {
    return (
      <HStack
        paddingX={4}
        paddingY={2}
        border="1px solid grey"
        justifyContent="space-between"
        alignItems="center"
        fontWeight="700"
      >
        <Box>Online Payments</Box> <Spinner />
      </HStack>
    );
  }

  if (!account?.trim() || !status) {
    return (
      <HStack
        paddingX={4}
        paddingY={2}
        border="1px solid grey"
        justifyContent="space-between"
        alignItems="center"
        fontWeight="700"
      >
        <Box>Online Payments are disabled.</Box> <StripeConnectButton />
      </HStack>
    );
  }

  return (
    <>
      {status?.enabled && status.status === "active" ? (
        <HStack
          paddingX={4}
          paddingY={2}
          border="1px solid grey"
          justifyContent="space-between"
          alignItems="center"
          fontWeight="700"
        >
          <Box>Online Payments are configured</Box>
          <Button
            colorPalette="red"
            variant="solid"
            onClick={() =>
              navigate(`/${market.code}/stripeConnect/${account}/refresh`)
            }
          >
            Refresh
          </Button>
        </HStack>
      ) : (
        <HStack
          paddingX={4}
          paddingY={2}
          borderWidth="1px"
          borderColor="fg.warning"
          color="fg.warning"
          justifyContent="space-between"
          alignItems="center"
          fontWeight="700"
        >
          <Box>Online Payments are temporarily disabled</Box>
          <Button
            colorPalette="red"
            variant="solid"
            onClick={() =>
              navigate(`/${market.code}/stripeConnect/${account}/refresh`)
            }
          >
            Update
          </Button>
        </HStack>
      )}
    </>
  );
};
