import type { FC } from "react";
import { useMarketBookings } from "./useMarketBookings";
import { Box, Button, Stack } from "@chakra-ui/react";
import type { Booking } from "@/types";
import { useRebook } from "@/booking/useAddBooking";
import { useCancelBooking } from "@/booking/useCancelBooking";
import { Link } from "react-router";
import { useMarket } from "@/MarketContext";

export const ManageMarketBookings: FC<{ date: string }> = ({ date }) => {
  const { stalls, loading, reloadStalls } = useMarketBookings(date);

  return (
    <>
      <Stack gap={2}>
        {!loading && !stalls?.length && (
          <Box fontStyle="italic" fontSize={12}>
            No Bookings
          </Box>
        )}
        {stalls?.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            reload={() => reloadStalls()}
          />
        ))}
      </Stack>
    </>
  );
};

export const BookingRow: FC<{ booking: Booking; reload: () => void }> = ({
  booking,
  reload,
}) => {
  const market = useMarket();
  const { rebook, loading: rebookLoading } = useRebook(booking, () => reload());
  const { cancelBooking, loading: cancelLoading } = useCancelBooking(() =>
    reload()
  );

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Box flex="0 0 6rem">
        <Link to={`/${market.code}/stall/${booking.stall.id}`}>
          {booking.stall.name}
        </Link>
      </Box>
      <Box flex="1" display="flex" justifyContent="flex-end">
        {booking.status == "credited" ? (
          <Box color="red.500">Cancelled with refund</Box>
        ) : booking.status == "cancelled" ? (
          <Box color="red.500">Cancelled</Box>
        ) : booking.isPaid ? (
          <Box color="green.700">Paid</Box>
        ) : (
          "Unpaid"
        )}
      </Box>

      <Box flex="0 0 5rem">
        {booking.status == "booked" && (
          <Button
            colorPalette="red"
            variant="solid"
            loading={cancelLoading}
            onClick={() => {
              cancelBooking(booking);
            }}
          >
            Cancel
          </Button>
        )}
        {(booking.status == "cancelled" || booking.status == "credited") && (
          <Button
            colorPalette="teal"
            variant="solid"
            loading={rebookLoading}
            onClick={() => {
              rebook();
            }}
          >
            Rebook
          </Button>
        )}
      </Box>
    </Stack>
  );
};
