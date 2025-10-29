import { useMarketStalls } from "@/manager/useMarketStalls";
import type { Stall } from "@/types";
import {
  Button,
  Portal,
  CloseButton,
  Dialog,
  HStack,
  Heading,
  Stack,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { type FC, useState, useMemo, useEffect } from "react";

export const SelectStallsDialog: FC<{
  label: string;
  onSelect: (stall: Stall) => Promise<void>;
  skip: Set<string>;
}> = ({ label, skip, onSelect }) => {
  const [open, setOpen] = useState(false);
  const { stalls, loading, reloadStalls } = useMarketStalls();

  const filteredStalls = useMemo(
    () =>
      stalls?.filter((s) => s.status.status == "approved" && !skip.has(s.id)),
    [stalls, skip],
  );

  useEffect(() => {
    if (open) {
      reloadStalls();
    }
  }, [open, reloadStalls]);

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button colorPalette="blue">{label}</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{label}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {!!loading && <Spinner size="xl" />}
              {!loading && filteredStalls?.length == 0 && (
                <Box fontStyle="italics">No Matching Stalls</Box>
              )}
              <Stack gap={2}>
                {filteredStalls?.map((fs) => (
                  <SelectStallDialogRow
                    key={fs.id}
                    stall={fs}
                    onSelect={async () => {
                      await onSelect(fs);
                    }}
                  />
                ))}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="blue">Done</Button>
              </Dialog.ActionTrigger>
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

export const SelectStallDialogRow: FC<{
  stall: Stall;
  onSelect: () => Promise<void>;
}> = ({ stall, onSelect }) => {
  const [loading, setLoading] = useState(false);
  return (
    <HStack justifyContent="space-between">
      <Heading size="md">{stall.name}</Heading>
      <Button
        loading={loading}
        colorPalette="green"
        onClick={async () => {
          setLoading(true);
          try {
            await onSelect();
          } finally {
            setLoading(false);
          }
        }}
      >
        Select
      </Button>
    </HStack>
  );
};
