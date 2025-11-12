import { payBooking } from "@/firebase/booking";
import type { BookingWithStall } from "@/types";
import {
  Dialog,
  Button,
  Portal,
  Stack,
  CloseButton,
  HStack,
  NumberInput,
  Field,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { useState, type FC } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

export const BookingPaymentDialog: FC<{
  booking: BookingWithStall;
  onDone: () => void;
}> = ({ booking, onDone }) => {
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [bookingCost, setBookingCost] = useState(booking.cost);
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button colorPalette="blue" size="xs">
          Add Payment
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Take Cash Payment</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={2}>
                <Field.Root required>
                  <Field.Label>
                    Stall holder has paid: <Field.RequiredIndicator />
                  </Field.Label>
                  <NumberInput.Root
                    unstyled
                    allowMouseWheel
                    defaultValue={`${bookingCost}`}
                    formatOptions={{
                      style: "currency",
                      currency: "AUD",
                      currencyDisplay: "symbol",
                      currencySign: "accounting",
                    }}
                    onValueChange={(e) => {
                      setBookingCost(e.valueAsNumber);
                    }}
                    min={0}
                  >
                    <HStack gap="4">
                      <NumberInput.DecrementTrigger asChild>
                        <IconButton
                          variant="outline"
                          size="sm"
                          backgroundColor="bg.panel"
                        >
                          <LuMinus />
                        </IconButton>
                      </NumberInput.DecrementTrigger>
                      <NumberInput.Input
                        textAlign="center"
                        backgroundColor="bg.panel"
                        maxW="6rem"
                        fontSize="lg"
                        p={1}
                      />
                      <NumberInput.IncrementTrigger asChild>
                        <IconButton
                          variant="outline"
                          size="sm"
                          backgroundColor="bg.panel"
                        >
                          <LuPlus />
                        </IconButton>
                      </NumberInput.IncrementTrigger>
                    </HStack>
                  </NumberInput.Root>
                </Field.Root>
                <Box>
                  For the date:{" "}
                  <Box as="span" fontWeight={800}>
                    {new Date(booking.date).toLocaleDateString()}
                  </Box>
                </Box>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="red">Cancel</Button>
              </Dialog.ActionTrigger>

              <Button
                colorPalette="green"
                loading={paying}
                onClick={async (e) => {
                  setPaying(true);
                  try {
                    await payBooking(booking, bookingCost, "cash");
                    onDone();
                    setOpen(false);
                  } finally {
                    setPaying(false);
                  }
                  e.stopPropagation();
                }}
              >
                Record Payment
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
