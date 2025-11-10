import type { StallStatus, StallStatusValues } from "@/types";
import {
  Button,
  Field,
  Stack,
  NativeSelect,
  NumberInput,
  HStack,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { useState, type FC } from "react";
import { useSetStallStatus } from "./useStallApply";
import { useMarket } from "@/MarketContext";
import { LuMinus, LuPlus } from "react-icons/lu";

export const StallManagerForm: FC<{
  status: StallStatus;
  onChange: () => void;
}> = ({ status, onChange }) => {
  const market = useMarket();
  const { setStallStatus, loading } = useSetStallStatus(status, onChange);
  const [newStatus, setNewStatus] = useState<StallStatusValues>(
    status.status == "pending" ? "approved" : status.status
  );
  const [editing, setEditing] = useState(status.status == "pending");

  const [bookingCost, setBookingCost] = useState(
    25 +
      (status.requiresPower ? 10 : 0) +
      (status.requiresTent > 0 ? status.requiresTent * 10 : 0)
  );

  return (
    <Box>
      {!editing && (
        <HStack justifyContent="space-between">
          <Box fontWeight={600} textTransform="uppercase">
            STATUS: {status.status}
          </Box>
          <Button onClick={() => setEditing(true)} colorPalette="blue">
            Edit
          </Button>
        </HStack>
      )}
      {!!editing && (
        <Stack gap={2}>
          <Field.Root required>
            <Field.Label>
              Set Status to: <Field.RequiredIndicator />
            </Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={newStatus}
                backgroundColor="bg.panel"
                onChange={(e) =>
                  setNewStatus(e.target.value as StallStatusValues)
                }
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

              <Field.HelperText>
                Default: $25 (booking cost){" "}
                {status.requiresPower && ` + $${market.powerCost} power`}{" "}
                {status.requiresTent == 1
                  ? ` + $${market.tentCost} tent`
                  : status.requiresTent > 1
                  ? `${status.requiresTent} x $${market.tentCost} tents`
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
      )}
    </Box>
  );
};
