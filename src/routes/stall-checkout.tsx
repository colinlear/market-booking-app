import { useMemo, useState, type FC } from "react";
import { useParams } from "react-router";
import {
  Box,
  Button,
  Checkmark,
  Dialog,
  Heading,
  HStack,
  Portal,
  Spinner,
  Stack,
  Tag,
} from "@chakra-ui/react";
import { HiCheck } from "react-icons/hi";

import { useMarket } from "@/MarketContext";
import { useStallStatus } from "@/stall/useMarketStatus";
import { useStall } from "@/stall/useStall";
import { SubHeader } from "@/common/subheader";
import { BottomBar } from "@/common/bottom-bar";
import { useBookingList } from "@/booking/useBookingList";
import { LoadingPage } from "@/common/loading";
import type { Booking, Stall } from "@/types";
import { useCheckout } from "@/booking/useCheckout";

export const StallCheckoutRoute: FC = () => {
  const { stallId } = useParams();

  const { stall, loading: stallLoading } = useStall(stallId!);
  const { stallStatus, loading: stallStatusLoading } = useStallStatus(stallId!);

  const { unpaidBookings, creditedBookings, loading } = useBookingList(
    stallId!,
  );

  if (loading || stallStatusLoading || stallLoading) return <LoadingPage />;
  if (!stall) return "Access Denied";

  return (
    <>
      <SubHeader height="2.5rem">
        <Heading size="lg" mb={2} display="flex" gap={2} alignItems="center">
          <Box>{stall?.name}</Box>
          <Box flex={1} />
          {creditedBookings.length > 0 && (
            <Tag.Root colorPalette="green" variant="solid">
              <Tag.Label>
                {creditedBookings.length} credit
                {creditedBookings.length != 1 && "s"}
              </Tag.Label>
              <Tag.EndElement>
                <HiCheck />
              </Tag.EndElement>
            </Tag.Root>
          )}
        </Heading>
        <StallCheckoutBookings
          stall={stall}
          unpaidBookings={unpaidBookings}
          creditedBookings={creditedBookings}
          bookingCost={stallStatus?.bookingCost}
        />
      </SubHeader>
    </>
  );
};

export const StallCheckoutBookings: FC<{
  stall: Stall;
  unpaidBookings: Booking[];
  creditedBookings: Booking[];
  bookingCost?: number;
}> = ({ stall, unpaidBookings, creditedBookings, bookingCost }) => {
  const market = useMarket();
  const [selected, setSelected] = useState(unpaidBookings);
  const { checkout, loading } = useCheckout(market, stall);

  const selectedIds = useMemo(
    () => new Set(selected.map((b) => b.id)),
    [selected],
  );
  const payCount = useMemo(() => [...selected].length, [selected]);
  const useCredits = useMemo(
    () => Math.min(payCount, creditedBookings.length),
    [payCount, creditedBookings],
  );
  const cost = bookingCost ?? 0;

  return (
    <>
      <Dialog.Root lazyMount open={loading}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header justifyContent="center">
                <Dialog.Title fontSize={24}>Processing</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body textAlign="center">
                <Box mb={4}>
                  <Spinner
                    height="6rem"
                    width="6rem"
                    borderWidth={12}
                    animationDuration="1.8s"
                    color="blue.300"
                  />
                </Box>
                <Box fontSize={18}>
                  Please do not close the window or navigate away until payment
                  is processed.
                </Box>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Stack gap={2}>
        {unpaidBookings.map((b) => (
          <BookingRow
            key={b.id}
            booking={b}
            bookingCost={bookingCost}
            selected={selectedIds.has(b.id)}
            onSelect={() =>
              setSelected((s) =>
                s.includes(b) ? [...s].filter((a) => a != b) : [...s, b],
              )
            }
          />
        ))}
      </Stack>
      <BottomBar height={`${6 + (useCredits > 0 ? 4 : 0)}rem`}>
        <Stack maxWidth="30rem" alignItems="stretch" width="100%">
          {useCredits > 0 && (
            <HStack>
              <Box flex={1}>Total</Box>
              <Box>${payCount * cost}.00</Box>
            </HStack>
          )}
          {useCredits > 0 && (
            <HStack>
              <Box flex={1}>Credits</Box>
              <Box>
                -$
                {useCredits * cost}
                .00
              </Box>
            </HStack>
          )}
          <HStack fontWeight={700}>
            <Box flex={1}>Pay</Box>
            <Box>
              ${(payCount - useCredits) * cost}
              .00
            </Box>
          </HStack>
          <Button
            colorPalette="green"
            loading={loading}
            disabled={payCount < 1}
            onClick={async () => {
              await checkout(selected, creditedBookings);
            }}
          >
            {payCount > useCredits || !useCredits ? "Checkout" : "Use Credits"}
          </Button>
        </Stack>
      </BottomBar>
    </>
  );
};

export const BookingRow: FC<{
  booking: Booking;
  bookingCost?: number;
  selected: boolean;
  onSelect: () => void;
}> = ({ booking, bookingCost, selected, onSelect }) => {
  return (
    <Box
      borderRadius={6}
      backgroundColor={"rgba(69, 125, 21, 0.1)"}
      borderWidth={2}
      borderColor={selected ? "green.600" : "rgba(69, 125, 21, 0.1)"}
      borderStyle="solid"
      maxWidth="30rem"
      cursor="pointer"
      onClick={onSelect}
      p={2}
    >
      <HStack gap={4}>
        <Box
          background={selected ? "green.600" : "white"}
          borderColor={selected ? "green.600" : "black"}
          borderWidth={2}
          borderRadius={4}
        >
          <Checkmark
            checked={selected}
            color="white"
            height="1.5rem"
            unstyled
          />
        </Box>
        <Box flex={1}>{booking.date}</Box>
        <Box>${bookingCost}.00</Box>
      </HStack>
    </Box>
  );
};
