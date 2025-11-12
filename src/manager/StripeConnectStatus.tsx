import { stripeAccountStatus, type StripeStatusResponse } from "@/stripe";
import { Box, HStack, Button, Spinner, Link } from "@chakra-ui/react";
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
  }, [account]);

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
      {status?.payments && status.status === "active" ? (
        <Box paddingX={4} paddingY={2} border="1px solid grey">
          <HStack
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
          <Box fontSize="sm" mt={2}>
            To send customer receipts, goto:{" "}
            <Link
              variant="underline"
              target="_blank"
              href={`https://dashboard.stripe.com/${account}/settings/emails`}
            >
              Stripe Email Settings
            </Link>{" "}
            and enable: "Payments - Successful Payments"
          </Box>
        </Box>
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
