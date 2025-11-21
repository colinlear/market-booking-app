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
import { BookingRestrictionsDialog } from "./BookingRestrictionsDialog";

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
    const ret: Record<string, Booking> = {};
    for (const b of [
      ...unpaidBookings.filter((b) => b.date <= yesterday),
      ...creditedBookings.filter((b) => b.date <= yesterday),
    ]) {
      ret[b.date] = b;
    }
    return ret;
  }, [unpaidBookings, creditedBookings]);

  const visibleDates = useMemo(
    () => [...Object.keys(visibleOldBookings), ...dates].sort(),
    [visibleOldBookings, dates]
  );

  const groupDates = useMemo(() => {
    const ret: Record<string, string[]> = {};
    for (const dts of visibleDates) {
      const dt = new Date(dts);
      const month = format(dt, "yyyy-MM");
      ret[month] = [...(ret[month] ?? []), dts];
    }
    return ret;
  }, [visibleDates]);

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
        {Object.keys(groupDates)
          .sort()
          .map(
            (month) =>
              !!groupDates[month].length && (
                <Box key={month}>
                  <Box fontWeight={600} my={1}>
                    {format(groupDates[month][0], "MMMM yyyy")}
                  </Box>
                  <Stack gap={2} ml={2}>
                    {groupDates[month].map((dt) => (
                      <BookingDate
                        key={dt}
                        stall={stall}
                        stallStatus={stallStatus}
                        date={dt}
                        booking={visibleOldBookings[dt] ?? indexedBookings[dt]}
                        reload={reload}
                        canEdit={!visibleOldBookings[dt]}
                      />
                    ))}
                  </Stack>
                </Box>
              )
          )}
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
  const {
    addBooking,
    loading: addLoading,
    requiresConfirm,
    cancelAddBooking,
  } = useAddBooking(() => reload());
  const {
    rebook,
    loading: rebookLoading,
    requiresConfirmRebook,
    cancelRebook,
  } = useRebook(stall, stallStatus, booking, () => reload());
  const { cancelBooking, loading: cancelLoading } = useCancelBooking(() =>
    reload()
  );

  if (!booking) {
    return (
      <Stack direction="row" gap={2} alignItems="center">
        <Box flex="0 0 6rem">{format(new Date(date), "ccc do")}</Box>
        <Box flex={1} display="flex"></Box>
        <Box flex="0 0 5rem" display="flex" justifyContent="flex-end">
          <BookingRestrictionsDialog
            restrictions={requiresConfirm}
            onBookAnyway={() => addBooking(stall, stallStatus, date, false)}
            onCancel={() => cancelAddBooking()}
            loading={addLoading}
          />
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
        <Box flex="0 0 6rem">{format(new Date(date), "ccc do")}</Box>
        <Box flex={1} display="flex">
          <Tag.Root colorPalette="green" variant="solid" size="lg" mr={2}>
            <Tag.Label>Booked</Tag.Label>
          </Tag.Root>
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
      <Box flex="0 0 6rem">{format(new Date(date), "ccc do")}</Box>
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
          <>
            <BookingRestrictionsDialog
              restrictions={requiresConfirmRebook}
              onBookAnyway={() => rebook(false)}
              onCancel={() => cancelRebook()}
              loading={rebookLoading}
            />

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
          </>
        )}
      </Box>
    </Stack>
  );
};
