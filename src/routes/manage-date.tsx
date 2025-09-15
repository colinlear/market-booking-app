import { ManageMarketBookings } from "@/manager/ManageMarketBookings";
import { DeleteMarketButton } from "@/manager/ManageMarketDates";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import { Button, Heading, HStack } from "@chakra-ui/react";
import { format } from "date-fns";
import type { FC } from "react";
import { useNavigate, useParams } from "react-router";

export const ManageDateRoute: FC = () => {
  const navigate = useNavigate();
  const { date } = useParams();
  const market = useMarket();

  const isAdmin = useIsMarketAdmin();
  if (!isAdmin) return "Access Denied";

  const dt = new Date(date ?? NaN);

  if (isNaN(dt.getTime())) {
    <>
      <Heading size="lg">Invalid Date</Heading>
      <Button onClick={() => navigate(`/${market.code}`)}>Back</Button>
    </>;
  }
  return (
    <>
      <HStack justifyContent="space-between" mb={3}>
        <Heading size="lg">{format(dt, "do MMM yyyy")}</Heading>
        <DeleteMarketButton
          date={format(dt, "yyyy-MM-dd")}
          onDone={() => navigate(`/${market.code}`)}
        />
      </HStack>
      <Heading size="sm">Booked Stalls:</Heading>
      <ManageMarketBookings date={date!} />
    </>
  );
};
