import type { Stall } from "@/types";
import { Box, Button, Skeleton } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react/stack";
import { type FC } from "react";
import { useAddBooking, useRebook } from "./useAddBooking";
import { useCancelBooking } from "./useCancelBooking";
import { useBooking } from "./useBooking";
import { useMarket } from "@/MarketContext";
import { today } from "@/common/dates";

export const AvailableBookingList: FC<{
  stall: Stall;
}> = ({ stall }) => {
  const { dates } = useMarket();

  return (
    <>
      <Stack gap={2}>
        {dates
          .filter((dt) => dt >= today())
          .map((dt) => (
            <BookingDate key={dt} stall={stall} date={dt} />
          ))}
      </Stack>
    </>
  );
};

export const BookingDate: FC<{ stall: Stall; date: string }> = ({
  stall,
  date,
}) => {
  const { booking, loading, reload } = useBooking(stall.id, date);
  const { addBooking, loading: addLoading } = useAddBooking(() => reload());
  const { rebook, loading: rebookLoading } = useRebook(booking, () => reload());
  const { cancelBooking, loading: cancelLoading } = useCancelBooking(() =>
    reload()
  );

  return (
    <Skeleton loading={loading}>
      {!!booking && booking.status == "booked" ? (
        <Stack direction="row" gap={2} alignItems="center">
          <Box flex="0 0 6rem">{date}</Box>
          <Box flex={1} display="flex" justifyContent="flex-end">
            {booking.isPaid ? <Box color="green.600">Paid</Box> : "Unpaid"}
          </Box>
          <Box flex="0 0 5rem" display="flex" justifyContent="flex-end">
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
          </Box>
        </Stack>
      ) : !!booking && booking.status != "booked" ? (
        <Stack direction="row" gap={2} alignItems="center">
          <Box flex="0 0 6rem">{date}</Box>
          <Box flex={1} display="flex" justifyContent="flex-end">
            {booking.status == "credited" ? (
              <Box color="red.500">Cancelled with refund</Box>
            ) : (
              <Box color="red.500">Cancelled</Box>
            )}
          </Box>
          <Box flex="0 0 5rem" display="flex" justifyContent="flex-end">
            <Button
              colorPalette="teal"
              variant="solid"
              loading={rebookLoading}
              onClick={() => {
                rebook();
              }}
            >
              Book
            </Button>
          </Box>
        </Stack>
      ) : (
        <Stack direction="row" gap={2} alignItems="center">
          <Box flex="0 0 6rem">{date}</Box>
          <Box flex={1} display="flex" justifyContent="flex-end"></Box>
          <Box flex="0 0 5rem" display="flex" justifyContent="flex-end">
            <Button
              colorPalette="teal"
              variant="solid"
              loading={addLoading}
              onClick={() => {
                addBooking(stall, date);
              }}
            >
              Book
            </Button>
          </Box>
        </Stack>
      )}
    </Skeleton>
  );
};
