import type { FC } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Stack,
  Tag,
} from "@chakra-ui/react";
import type { Booking } from "@/types";
import { useRebook } from "@/booking/useAddBooking";
import { useCancelBooking } from "@/booking/useCancelBooking";
import { useNavigate } from "react-router";
import { useMarket } from "@/MarketContext";
import { BookingPaymentDialog } from "./BookingPaymentDialog";
import { BsLightningChargeFill } from "react-icons/bs";
import { Tooltip } from "@/components/ui/tooltip";
import { PiTent } from "react-icons/pi";

export const BookingRow: FC<{ booking: Booking; reload: () => void }> = ({
  booking,
  reload,
}) => {
  const navigate = useNavigate();
  const market = useMarket();
  const { rebook, loading: rebookLoading } = useRebook(booking, () => reload());
  const { cancelBooking, loading: cancelLoading } = useCancelBooking(() =>
    reload(),
  );

  return (
    <Stack
      gap={2}
      borderRadius={6}
      backgroundColor="rgba(69, 125, 21, 0.1)"
      p={3}
      maxWidth="30rem"
      _hover={{
        backgroundColor: "rgba(69, 125, 21, 0.15)",
      }}
      onClick={() => navigate(`/${market.code}/stall/${booking.stall.id}`)}
    >
      <HStack gap={2} alignItems="center" mb={2}>
        <Heading size="md">{booking.stall.name}</Heading>
        <Box>
          {!!booking.stall.requiresPower && (
            <Tooltip content="Requires Power">
              <Icon size="lg">
                <BsLightningChargeFill />
              </Icon>
            </Tooltip>
          )}
          {booking.stall.requiresTent > 0 && (
            <Tooltip
              content={
                booking.stall.requiresTent > 1
                  ? `Requires ${booking.stall.requiresTent} tents`
                  : "Requires Tent"
              }
            >
              <span>
                {booking.stall.requiresTent > 1
                  ? `${booking.stall.requiresTent} x`
                  : ""}
                <Icon size="lg">
                  <PiTent />
                </Icon>
              </span>
            </Tooltip>
          )}
        </Box>
        <Box flex={1} />

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
      {/* <HStack gap={2} justifyContent="space-between" marginY={4}>
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
            <PhoneNumber phone={booking.stall.phone} />
          </LinkTo>
        )}
      </HStack> */}
      <HStack>
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
        {booking.status == "booked" && !booking.isPaid && booking.cost > 0 && (
          <Box onClick={(e) => e.stopPropagation()}>
            <BookingPaymentDialog booking={booking} onDone={() => reload()} />
          </Box>
        )}
      </HStack>
    </Stack>
  );
};
