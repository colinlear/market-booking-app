import type { Booking, Stall, StallStatus } from "@/types";
import { Box, Button, Tag } from "@chakra-ui/react";
import { HStack, Stack } from "@chakra-ui/react/stack";
import { useMemo, type FC } from "react";
import { useAddBooking, useRebook } from "./useAddBooking";
import { useCancelBooking } from "./useCancelBooking";
import { useStallStatus } from "@/stall/useMarketStatus";
import { LoadingPage } from "@/common/loading";
import { useMarketDates } from "./useMarketDates";
import { useBookingList } from "./useBookingList";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";

export const AvailableBookingList: FC<{
  stall: Stall;
}> = ({ stall }) => {
  const navigate = useNavigate();
  const market = useMarket();
  const isMarketAdmin = useIsMarketAdmin();
  const dates = useMarketDates();
  const { stallStatus, loading } = useStallStatus(stall.id);
  const {
    bookings,
    unpaidBookings,
    creditedBookings,
    loading: loadingBookings,
    reload,
  } = useBookingList(stall.id);

  const indexedBookings = useMemo(() => {
    const ret: Record<string, Booking> = {};
    if (bookings) {
      for (const b of bookings) {
        ret[b.date] = b;
      }
    }
    return ret;
  }, [bookings]);

  const visibleOldBookings = useMemo(() => {
    const yesterday = format(new Date(), "yyyy-MM-dd");
    const ret = [
      ...unpaidBookings.filter((b) => b.date <= yesterday),
      ...creditedBookings.filter((b) => b.date <= yesterday),
    ];
    ret.sort((a, b) => a.date.localeCompare(b.date));
    return ret;
  }, [unpaidBookings, creditedBookings]);

  if (loading || loadingBookings)
    return (
      <Box maxWidth="30rem">
        <LoadingPage />
      </Box>
    );
  if (!stallStatus) return null;

  return (
    <>
      <Stack gap={2}>
        {!isMarketAdmin &&
          !!market.stripeAccount?.trim() &&
          unpaidBookings.length > 0 && (
            <HStack
              justifyContent="space-between"
              alignItems="center"
              paddingX={4}
              paddingY={2}
              borderRadius={7}
              borderColor="red.500"
              borderWidth={2}
              color="red.500"
              fontWeight={700}
              fontSize={18}
            >
              <Box>
                {unpaidBookings.length} unpaid booking
                {unpaidBookings.length > 1 && "s"}
              </Box>
              <Button
                colorPalette="red"
                variant="solid"
                onClick={() =>
                  navigate(`/${market.code}/stall/${stall.id}/checkout`)
                }
              >
                Checkout
              </Button>
            </HStack>
          )}
        {visibleOldBookings.map((ob) => (
          <BookingDate
            key={ob.date}
            stall={stall}
            stallStatus={stallStatus}
            date={ob.date}
            booking={ob}
            reload={reload}
            canEdit={false}
          />
        ))}
        {dates.map((dt) => (
          <BookingDate
            key={dt}
            stall={stall}
            stallStatus={stallStatus}
            date={dt}
            booking={indexedBookings[dt]}
            reload={reload}
          />
        ))}
      </Stack>
    </>
  );
};

export const BookingDate: FC<{
  stall: Stall;
  stallStatus: StallStatus;
  date: string;
  booking?: Booking;
  reload: () => void;
  canEdit?: boolean;
}> = ({ stall, stallStatus, date, booking, reload, canEdit = true }) => {
  const { addBooking, loading: addLoading } = useAddBooking(() => reload());
  const { rebook, loading: rebookLoading } = useRebook(booking, () => reload());
  const { cancelBooking, loading: cancelLoading } = useCancelBooking(() =>
    reload()
  );

  if (!booking) {
    return (
      <Stack direction="row" gap={2} alignItems="center">
        <Box flex="0 0 6rem">{date}</Box>
        <Box flex={1} display="flex"></Box>
        <Box flex="0 0 5rem" display="flex" justifyContent="flex-end">
          <Button
            colorPalette="teal"
            variant="solid"
            loading={addLoading}
            onClick={() => {
              addBooking(stall, stallStatus, date);
            }}
          >
            Book
          </Button>
        </Box>
      </Stack>
    );
  }

  if (booking?.status == "booked") {
    return (
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        minHeight="var(--chakra-sizes-10)"
      >
        <Box flex="0 0 6rem">{date}</Box>
        <Box flex={1} display="flex">
          {booking.cost <= 0 ? (
            <Tag.Root colorPalette="blue" variant="solid" size="lg">
              <Tag.Label>Free</Tag.Label>
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
        <Box flex="0 0 5rem" display="flex" justifyContent="flex-end">
          {canEdit && (
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
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      gap={2}
      alignItems="center"
      minHeight="var(--chakra-sizes-10)"
    >
      <Box flex="0 0 6rem">{date}</Box>
      <Box flex={1} display="flex">
        {booking.status == "credited" ? (
          <Tag.Root colorPalette="red" variant="solid" size="lg">
            <Tag.Label>Credited</Tag.Label>
          </Tag.Root>
        ) : (
          <Tag.Root colorPalette="red" variant="solid" size="lg">
            <Tag.Label>Cancelled</Tag.Label>
          </Tag.Root>
        )}
      </Box>
      <Box flex="0 0 5rem" display="flex" justifyContent="flex-end">
        {canEdit && (
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
        )}
      </Box>
    </Stack>
  );
};
