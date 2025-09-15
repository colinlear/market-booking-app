import type { Stall, StallStatus, StallStatusValues } from "@/types";
import {
  Button,
  Field,
  Stack,
  NativeSelect,
  NumberInput,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useState, type FC } from "react";
import { useSetStallStatus } from "./useStallApply";
import { useMarket } from "@/MarketContext";
import { LuMinus, LuPlus } from "react-icons/lu";

export const StallManagerForm: FC<{
  stall: Stall;
  status: StallStatus;
  onChange: () => void;
}> = ({ stall, status, onChange }) => {
  const market = useMarket();
  const { setStallStatus, loading } = useSetStallStatus(status, onChange);
  const [newStatus, setNewStatus] = useState<StallStatusValues>(
    status.status == "pending" ? "approved" : status.status
  );

  const [bookingCost, setBookingCost] = useState(
    25 +
      (stall.requiresPower ? 10 : 0) +
      (stall.requiresTent > 0 ? stall.requiresTent * 10 : 0)
  );

  return (
    <Stack gap={2}>
      <Field.Root required>
        <Field.Label>
          Set Status to: <Field.RequiredIndicator />
        </Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            value={newStatus}
            backgroundColor="#fff"
            onChange={(e) => setNewStatus(e.target.value as StallStatusValues)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>
      {newStatus == "approved" && (
        <Field.Root required>
          <Field.Label>
            Booking Cost <Field.RequiredIndicator />
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
            <HStack gap="2">
              <NumberInput.DecrementTrigger asChild>
                <IconButton variant="outline" size="sm" backgroundColor="white">
                  <LuMinus />
                </IconButton>
              </NumberInput.DecrementTrigger>
              <NumberInput.Input
                textAlign="center"
                backgroundColor="white"
                maxW="6rem"
                fontSize="lg"
                p={1}
              />
              <NumberInput.IncrementTrigger asChild>
                <IconButton variant="outline" size="sm" backgroundColor="white">
                  <LuPlus />
                </IconButton>
              </NumberInput.IncrementTrigger>
            </HStack>
          </NumberInput.Root>

          <Field.HelperText>
            Default: $25 (booking cost){" "}
            {stall.requiresPower && ` + $${market.powerCost} power`}{" "}
            {stall.requiresTent == 1
              ? ` + $${market.tentCost} tent`
              : stall.requiresTent > 1
              ? `${stall.requiresTent} x $${market.tentCost} tents`
              : ""}
          </Field.HelperText>
        </Field.Root>
      )}

      {(newStatus === status.status || newStatus == "pending") && (
        <Button
          onClick={() => {
            setStallStatus({ status: newStatus, bookingCost });
          }}
          loading={loading}
          colorPalette="blue"
        >
          Save
        </Button>
      )}
      {newStatus == "approved" && newStatus != status.status && (
        <Button
          onClick={() => {
            setStallStatus({ status: newStatus, bookingCost });
          }}
          loading={loading}
          colorPalette="green"
        >
          Approve Stall
        </Button>
      )}
      {newStatus == "rejected" && newStatus != status.status && (
        <Button
          onClick={() => {
            setStallStatus({ status: newStatus, bookingCost });
          }}
          loading={loading}
          colorPalette="red"
        >
          Reject Stall
        </Button>
      )}
    </Stack>
  );
};
