import type { FC } from "react";
import { Heading, Box, Stack, Tag } from "@chakra-ui/react";

import type { Stall, Booking } from "@/types";
import { useBookingList } from "./useBookingList";

export const StallBookingList: FC<{
  stall: Stall;
}> = ({ stall }) => {
  const { bookings, loading, reload } = useBookingList(stall.id);

  return (
    <>
      <Heading size="sm" mt={3} mb={2}>
        Dates Booked
      </Heading>
      {!loading && !bookings?.length && (
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
          <Tag.Root colorPalette="blue" variant="solid" size="lg">
            <Tag.Label>Free</Tag.Label>
          </Tag.Root>
        ) : booking.status == "credited" ? (
          <Tag.Root colorPalette="red" variant="solid" size="lg">
            <Tag.Label>Credited</Tag.Label>
          </Tag.Root>
        ) : booking.status == "cancelled" ? (
          <Tag.Root colorPalette="red" variant="solid" size="lg">
            <Tag.Label>Cancelled</Tag.Label>
          </Tag.Root>
        ) : booking.isPaid ? (
          <Tag.Root colorPalette="green" variant="solid" size="lg">
            <Tag.Label>Paid</Tag.Label>
          </Tag.Root>
        ) : (
          <Tag.Root colorPalette="orange" variant="solid" size="lg">
            <Tag.Label>Unpaid</Tag.Label>
          </Tag.Root>
        )}
      </Box>
    </Stack>
  );
};
