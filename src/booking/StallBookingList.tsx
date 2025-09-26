import type { FC } from "react";
import { Heading, Box, Stack } from "@chakra-ui/react";

import type { Stall, Booking } from "@/types";
import { useBookingList } from "./useBookingList";

export const StallBookingList: FC<{
  stall: Stall;
}> = ({ stall }) => {
  const { bookings, loading, reload } = useBookingList(stall.id);

  return (
    <>
      <Heading size="sm" mt={3}>
        Dates Booked
      </Heading>
      {!!loading && !bookings?.length && (
        <Box fontStyle="italic" fontSize={12}>
          No Dates Booked
        </Box>
      )}
      <Stack gap={2}>
        {bookings?.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            reload={() => reload()}
          />
        ))}
      </Stack>
    </>
  );
};

export const BookingRow: FC<{ booking: Booking; reload: () => void }> = ({
  booking,
}) => {
  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Box flex="0 0 6rem">{booking.date}</Box>
      <Box flex="1" display="flex" justifyContent="flex-end">
        {booking.cost <= 0 ? (
          <Box color="blue.700">Free</Box>
        ) : booking.status == "credited" ? (
          <Box color="red.500">Credited</Box>
        ) : booking.status == "cancelled" ? (
          <Box color="red.500">Cancelled</Box>
        ) : booking.isPaid ? (
          <Box color="green.700">Paid</Box>
        ) : (
          "Unpaid"
        )}
      </Box>
    </Stack>
  );
};
