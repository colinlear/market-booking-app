import { useMarket } from "@/MarketContext";
import {
  Button,
  Stack,
  CloseButton,
  Checkbox,
  Field,
  NumberInput,
  HStack,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { Dialog } from "@chakra-ui/react/dialog";
import { Portal } from "@chakra-ui/react/portal";
import { type FC, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

export const StallApplyDialog: FC<{
  loading?: boolean;
  onApply: (requiresPower: boolean, requiresTent: number) => void;
}> = ({ loading, onApply }) => {
  const market = useMarket();
  const [open, setOpen] = useState(false);
  const [requiresPower, setRequiresPower] = useState(false);
  const [requiresTent, setRequiresTent] = useState(0);

  if (!market.tentCost && !market.powerCost) {
    return (
      <Button
        colorPalette="black"
        loading={loading}
        onClick={() => onApply(false, 0)}
      >
        Register
      </Button>
    );
  }
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button colorPalette="black" loading={loading}>
          Register
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Register with Market</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={2}>
                {!!market.tentCost && (
                  <>
                    <Box marginBottom={4} fontWeight={600}>
                      This market provides tents to rent for{" "}
                      {market.tentCost > 0 ? (
                        <span>${market.tentCost}.00 per booking</span>
                      ) : (
                        <span>free</span>
                      )}
                    </Box>
                    <Field.Root>
                      <Field.Label>Requires Tent(s)</Field.Label>
                      <NumberInput.Root
                        unstyled
                        spinOnPress={false}
                        allowMouseWheel
                        value={`${requiresTent}`}
                        onValueChange={(e) => {
                          setRequiresTent(e.valueAsNumber);
                        }}
                        min={0}
                        max={2}
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
                            maxW="3rem"
                            fontSize="lg"
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
                  </>
                )}

                {market.powerCost && (
                  <>
                    <Box marginY={4} fontWeight={600}>
                      This market can provide access to mains electricity for{" "}
                      {market.powerCost > 0 ? (
                        <span>${market.powerCost}.00 per booking</span>
                      ) : (
                        <span>free</span>
                      )}
                    </Box>
                    <Checkbox.Root defaultChecked={requiresPower}>
                      <Checkbox.HiddenInput
                        onChange={(e) =>
                          setRequiresPower(e.currentTarget.checked)
                        }
                      />
                      <Checkbox.Control />
                      <Checkbox.Label>
                        This stall requires electricity
                      </Checkbox.Label>
                    </Checkbox.Root>
                  </>
                )}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                colorPalette="green"
                loading={loading}
                onClick={() => {
                  onApply(requiresPower, requiresTent);
                }}
              >
                Register
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
