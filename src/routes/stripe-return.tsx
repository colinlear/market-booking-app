import React, { type FC } from "react";
import { useNavigate, useParams } from "react-router";

import { LoadingPage } from "@/common/loading";
import { updateMarket } from "@/firebase/market";
import { useMarket } from "@/MarketContext";

export const StripeReturnRoute: FC = () => {
  const navigate = useNavigate();
  const market = useMarket();
  const { stripeAccount } = useParams();

  React.useEffect(() => {
    if (stripeAccount) {
      updateMarket(market.code, { stripeAccount }).then(async () => {
        navigate(`/${market.code}/manage`);
      });
    }
  }, [navigate, market, stripeAccount]);

  return <LoadingPage />;
};
