import { BookingRow } from "@/manager/ManageMarketBookings";
import { DeleteMarketButton } from "@/manager/ManageMarketDates";
import { useMarketBookings } from "@/manager/useMarketBookings";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import { Box, Button, Heading, HStack, Stack } from "@chakra-ui/react";
import { format } from "date-fns";
import { type FC } from "react";
import { useNavigate, useParams } from "react-router";

export const ManageDateRoute: FC = () => {
  const navigate = useNavigate();
  const { date } = useParams();
  const market = useMarket();
  const { bookings, loading, reloadBookings } = useMarketBookings(date);

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
          bookings={bookings}
          onDone={() => navigate(`/${market.code}`)}
        />
      </HStack>
      <Heading size="sm">Booked Stalls:</Heading>
      <Stack gap={2}>
        {!loading && !bookings?.length && (
          <Box fontStyle="italic" fontSize={12}>
            No Bookings
          </Box>
        )}
        {bookings?.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            reload={() => reloadBookings()}
          />
        ))}
      </Stack>
    </>
  );
};
