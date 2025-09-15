import { useMarket } from "@/MarketContext";
import { StallForm } from "@/stall/StallForm";
import type { FC } from "react";
import { useNavigate } from "react-router";

export const AddStallRoute: FC = () => {
  const market = useMarket();
  const navigate = useNavigate();
  return (
    <StallForm
      onSave={(s) => {
        navigate(`/${market.code}/stall/${s.id}`, { replace: true });
      }}
    />
  );
};
