import { useMarket } from "@/MarketContext";
import { stripeAccountSetup, stripeConnectSetup } from "@/stripe";
import { Button } from "@chakra-ui/react/button";
import { useState, type FC } from "react";

export const StripeConnectButton: FC = () => {
  const market = useMarket();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      loading={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const account = await stripeAccountSetup();
          const url = await stripeConnectSetup(market.code, account);
          if (url) {
            location.href = url;
          } else {
            alert("An Error occurred. Try again later");
          }
        } catch {
          alert("An Error occurred. Try again later");
        } finally {
          setLoading(false);
        }
      }}
    >
      Setup Stripe
    </Button>
  );
};
