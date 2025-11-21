import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import {
  Dialog,
  Portal,
  Box,
  List,
  Button,
  CloseButton,
} from "@chakra-ui/react";
import type { FC } from "react";
import { PiWarningOctagonFill } from "react-icons/pi";

export interface BookingRestrictionsDialogProps {
  loading: boolean;
  onCancel: () => void;
  onBookAnyway: () => void;
  restrictions: string[];
}

export const BookingRestrictionsDialog: FC<BookingRestrictionsDialogProps> = ({
  loading,
  onCancel,
  onBookAnyway,
  restrictions,
}) => {
  const market = useMarket();
  const isMarketAdmin = useIsMarketAdmin();

  return (
    <Dialog.Root
      lazyMount
      open={restrictions.length > 0}
      onOpenChange={(e) => {
        if (!e.open) {
          onCancel();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Booking Limits</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box fontWeight={600} fontSize="md">
                Exceeding market restrictions:
              </Box>
              <List.Root
                marginY={3}
                fontWeight={600}
                fontSize="md"
                variant="plain"
                gap={2}
              >
                {restrictions.map((req) => (
                  <List.Item>
                    <List.Indicator asChild color="red.500">
                      <PiWarningOctagonFill />
                    </List.Indicator>
                    {req}
                  </List.Item>
                ))}
                {!isMarketAdmin && !market.enforceQuotas && (
                  <Box fontWeight={600} fontSize="md">
                    You may book anyway but management may contact you and
                    cancel your booking.
                  </Box>
                )}
                {!isMarketAdmin && market.enforceQuotas && (
                  <Box fontWeight={600} fontSize="md">
                    Please contact market management to discuss limits.
                  </Box>
                )}
              </List.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              {(isMarketAdmin || !market.enforceQuotas) && (
                <Button
                  colorPalette="green"
                  loading={loading}
                  onClick={() => {
                    onBookAnyway();
                  }}
                >
                  Book Anyway
                </Button>
              )}
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
