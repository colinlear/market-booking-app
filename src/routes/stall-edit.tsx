import { LoadingPage } from "@/common/loading";
import { useMarket } from "@/MarketContext";
import { StallForm } from "@/stall/StallForm";
import { useStallStatus } from "@/stall/useMarketStatus";
import { useStall } from "@/stall/useStall";
import { Button, Heading } from "@chakra-ui/react";
import type { FC } from "react";
import { useNavigate, useParams } from "react-router";

export const EditStallRoute: FC = () => {
  const market = useMarket();
  const navigate = useNavigate();
  const { stallId } = useParams();
  const { stall, loading } = useStall(stallId);
  const { stallStatus, loading: statusLoading } = useStallStatus(stallId!);

  if (loading || statusLoading) {
    return <LoadingPage />;
  }

  if (!stall) {
    return (
      <>
        <Heading size="lg">Stall Not Found</Heading>
        <Button
          colorPalette="black"
          onClick={() => navigate(`/${market.code}`)}
        >
          Back
        </Button>
      </>
    );
  }

  return (
    <StallForm
      stall={stall}
      stallStatus={stallStatus}
      onSave={(s) => {
        navigate(`/${market.code}/stall/${s.id}`, { replace: true });
      }}
    />
  );
};
