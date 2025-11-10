import type { FC } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  Separator,
  Stack,
  Tag,
} from "@chakra-ui/react";
import type { BookingWithStall } from "@/types";
import { useRebook } from "@/booking/useAddBooking";
import { useCancelBooking } from "@/booking/useCancelBooking";
import { Link as RouterLink } from "react-router";
import { useMarket } from "@/MarketContext";
import { BookingPaymentDialog } from "./BookingPaymentDialog";
import { BsLightningChargeFill } from "react-icons/bs";
import { Tooltip } from "@/components/ui/tooltip";
import { PiTent } from "react-icons/pi";
import { LuMail, LuPhone } from "react-icons/lu";
import { PhoneNumber } from "@/common/phone-number";

export const BookingRow: FC<{
  booking: BookingWithStall;
  reload: () => void;
}> = ({ booking, reload }) => {
  const market = useMarket();
  const { rebook, loading: rebookLoading } = useRebook(booking, () => reload());
  const { cancelBooking, loading: cancelLoading } = useCancelBooking(() =>
    reload()
  );

  return (
    <>
      <Stack maxWidth="30rem">
        <HStack gap={2} alignItems="center">
          <Link asChild>
            <RouterLink to={`/${market.code}/stall/${booking.stall.id}`}>
              <Heading size="md">{booking.stall.name}</Heading>
            </RouterLink>
          </Link>
          <Box flex={1} />
          <Box>
            {booking.stallStatus?.size}
            {!!booking.requiresPower && (
              <Tooltip content="Requires Power">
                <Icon size="lg">
                  <BsLightningChargeFill />
                </Icon>
              </Tooltip>
            )}
            {booking.requiresTent && (
              <Tooltip
                content={
                  booking.requiresTent > 1
                    ? `Requires ${booking.requiresTent} tents`
                    : "Requires Tent"
                }
              >
                <span>
                  {booking.requiresTent > 1 ? `${booking.requiresTent} x` : ""}
                  <Icon size="lg">
                    <PiTent />
                  </Icon>
                </span>
              </Tooltip>
            )}
          </Box>

          <Box display="flex" justifyContent="flex-end">
            {booking.cost <= 0 ? (
              <Tag.Root colorPalette="blue" variant="solid">
                <Tag.Label>Free</Tag.Label>
              </Tag.Root>
            ) : booking.status == "credited" ? (
              <Tag.Root colorPalette="red" variant="solid">
                <Tag.Label>Credited</Tag.Label>
              </Tag.Root>
            ) : booking.status == "cancelled" ? (
              <Tag.Root colorPalette="red" variant="solid">
                <Tag.Label>Cancelled</Tag.Label>
              </Tag.Root>
            ) : booking.isPaid ? (
              <Tag.Root colorPalette="green" variant="solid">
                <Tag.Label>Paid</Tag.Label>
              </Tag.Root>
            ) : (
              <Tag.Root colorPalette="purple" variant="solid">
                <Tag.Label>Unpaid</Tag.Label>
              </Tag.Root>
            )}
          </Box>
        </HStack>
        {!!booking.stallStatus?.notes?.trim() && (
          <Box whiteSpace="pre-wrap" mb={2} fontSize="90%">
            {booking.stallStatus?.notes}
          </Box>
        )}
        <HStack gap={2} justifyContent="space-between" marginBottom={4}>
          {!!booking.stall.email?.trim() && (
            <Link
              variant="underline"
              colorPalette="blue"
              href={`mailto:${booking.stall.email}`}
              onClick={(e) => e.stopPropagation()}
              fontSize="80%"
            >
              <Icon>
                <LuMail />
              </Icon>
              {booking.stall.email}
            </Link>
          )}
          {!!booking.stall.phone?.trim() && (
            <Link
              variant="underline"
              colorPalette="blue"
              href={`tel:${booking.stall.phone}`}
              onClick={(e) => e.stopPropagation()}
              fontSize="80%"
            >
              <Icon>
                <LuPhone />
              </Icon>
              <PhoneNumber phone={booking.stall.phone} />
            </Link>
          )}
        </HStack>
        <HStack justifyContent="flex-end" gap={2}>
          {booking.status == "booked" && (
            <Button
              size="xs"
              colorPalette="red"
              variant="solid"
              loading={cancelLoading}
              onClick={(e) => {
                cancelBooking(booking);
                e.stopPropagation();
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
              onClick={(e) => {
                rebook();
                e.stopPropagation();
              }}
            >
              Rebook
            </Button>
          )}
          {booking.status == "booked" &&
            !booking.isPaid &&
            booking.cost > 0 && (
              <Box onClick={(e) => e.stopPropagation()}>
                <BookingPaymentDialog
                  booking={booking}
                  onDone={() => reload()}
                />
              </Box>
            )}
        </HStack>
      </Stack>
      <Separator marginBottom={4} marginTop={2} maxWidth="30rem" />
    </>
  );
};
