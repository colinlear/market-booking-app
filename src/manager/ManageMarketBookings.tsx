import type { FC } from "react";
import {
  Box,
  Button,
  HStack,
  Icon,
  Link as LinkTo,
  Stack,
} from "@chakra-ui/react";
import type { Booking } from "@/types";
import { useRebook } from "@/booking/useAddBooking";
import { useCancelBooking } from "@/booking/useCancelBooking";
import { Link } from "react-router";
import { useMarket } from "@/MarketContext";
import { LuMail, LuPhone } from "react-icons/lu";
import { BookingPaymentDialog } from "./BookingPaymentDialog";

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
    <Stack
      gap={2}
      borderRadius={6}
      backgroundColor="rgba(69, 125, 21, 0.1)"
      p={2}
      maxWidth="30rem"
      _hover={{
        backgroundColor: "rgba(69, 125, 21, 0.15)",
      }}
    >
      <HStack gap={2} alignItems="center">
        <Box flex={1}>
          <LinkTo asChild variant="underline">
            <Link to={`/${market.code}/stall/${booking.stall.id}`}>
              {booking.stall.name}
            </Link>
          </LinkTo>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          {booking.cost <= 0 ? (
            <Box color="blue.700">Free</Box>
          ) : booking.status == "credited" ? (
            <Box color="red.500">Cancelled with refund</Box>
          ) : booking.status == "cancelled" ? (
            <Box color="red.500">Cancelled</Box>
          ) : booking.isPaid ? (
            <Box color="green.700">Paid</Box>
          ) : (
            "Unpaid"
          )}
        </Box>
      </HStack>
      <HStack gap={2} justifyContent="space-between">
        {!!booking.stall.email?.trim() && (
          <LinkTo
            variant="underline"
            colorPalette="blue"
            href={`mailto:${booking.stall.email}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon>
              <LuMail />
            </Icon>
            {booking.stall.email}
          </LinkTo>
        )}
        {!!booking.stall.phone?.trim() && (
          <LinkTo
            variant="underline"
            colorPalette="blue"
            href={`tel:${booking.stall.phone}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon>
              <LuPhone />
            </Icon>
            {booking.stall.phone}
          </LinkTo>
        )}
      </HStack>
      <HStack>
        {booking.status == "booked" && !booking.isPaid && booking.cost > 0 && (
          <BookingPaymentDialog booking={booking} onDone={() => reload()} />
        )}
        <Box flex={1} />
        <Box>
          {booking.status == "booked" && (
            <Button
              size="xs"
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
              size="xs"
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
      </HStack>
    </Stack>
  );
};
