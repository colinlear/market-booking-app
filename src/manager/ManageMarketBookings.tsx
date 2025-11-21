import type { FC } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  LinkBox,
  LinkOverlay,
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
import { BookingRestrictionsDialog } from "@/booking/BookingRestrictionsDialog";

export const BookingRow: FC<{
  booking: BookingWithStall;
  reload: () => void;
}> = ({ booking, reload }) => {
  const market = useMarket();
  const {
    rebook,
    loading: rebookLoading,
    requiresConfirmRebook,
    cancelRebook,
  } = useRebook(booking.stall, booking.stallStatus, booking, () => reload());
  const { cancelBooking, loading: cancelLoading } = useCancelBooking(() =>
    reload()
  );

  return (
    <>
      <BookingRestrictionsDialog
        restrictions={requiresConfirmRebook}
        onBookAnyway={() => rebook(false)}
        onCancel={() => cancelRebook()}
        loading={rebookLoading}
      />
      <LinkBox
        as={Stack}
        maxWidth="30rem"
        gap={1}
        _hover={{ bgColor: "#00000020" }}
        p={2}
      >
        <HStack gap={2} alignItems="center">
          <LinkOverlay asChild>
            <RouterLink to={`/${market.code}/stall/${booking.stall.id}`}>
              <Heading size="md">{booking.stall.name}</Heading>
            </RouterLink>
          </LinkOverlay>
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
            {!!booking.requiresTent && (
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
          <Box whiteSpace="pre-wrap" fontSize="sm" px={2}>
            {booking.stallStatus?.notes}
          </Box>
        )}
        <HStack gap={4}>
          {!!booking.stall.email?.trim() && (
            <IconButton size="xs" colorPalette="blue" variant="solid" asChild>
              <Link href={`mailto:${booking.stall.email}`} rounded="full">
                <LuMail />
              </Link>
            </IconButton>
          )}
          {!!booking.stall.phone?.trim() && (
            <IconButton size="xs" colorPalette="green" variant="solid" asChild>
              <Link href={`tel:${booking.stall.phone}`} rounded="full">
                <LuPhone color="white" />
              </Link>
            </IconButton>
          )}

          <Box flex={1} />
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
      </LinkBox>
      <Separator marginY={2} maxWidth="30rem" />
    </>
  );
};
