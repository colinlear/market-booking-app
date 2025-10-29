import React, { type FC } from "react";
import { useNavigate, useParams } from "react-router";

import { useMarket } from "@/MarketContext";
import { stripeConnectSetup } from "@/stripe";
import { LoadingPage } from "@/common/loading";

export const StripeRefreshRoute: FC = () => {
  const navigate = useNavigate();
  const market = useMarket();
  const { stripeAccount } = useParams();

  React.useEffect(() => {
    if (market && stripeAccount) {
      stripeConnectSetup(market.code, stripeAccount)
        .then((url) => {
          if (url) {
            location.href = url;
          }
        })
        .catch(() => {
          navigate(`/${market.code}/manage`);
        });
    }
  }, [market, navigate, stripeAccount]);

  return <LoadingPage />;
};
