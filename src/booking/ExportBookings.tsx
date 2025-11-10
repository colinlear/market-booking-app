import type { BookingWithStall } from "@/types";
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  DownloadTrigger,
  HStack,
  Portal,
  Separator,
  Stack,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useMemo, useState, type FC } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { convertArrayToCSV } from "convert-array-to-csv";

export const ExportBookingsDialog: FC<{
  bookings: BookingWithStall[];
  filename: string;
}> = ({ bookings, filename }) => {
  const [, copy] = useCopyToClipboard();
  const [open, setOpen] = useState(false);

  const [exportPayment, setExportPayment] = useState(false);
  const [exportSetup, setExportSetup] = useState(false);

  const csv = useMemo(() => {
    const ret = convertArrayToCSV([
      [
        "Stall",
        "Email",
        "Phone",
        "Booking Status",
        "Paid",
        ...(exportPayment ? ["Payment Reference"] : []),
        ...(exportSetup
          ? ["Stall Size", "Requires Power", "Requires Tents", "Notes"]
          : []),
      ],
      ...bookings.map((b) => [
        b.stall.name,
        b.stall.email ?? "-",
        b.stall.phone ?? "-",
        b.status,
        b.cost <= 0 ? "free" : b.isPaid ? "paid" : "unpaid",
        ...(exportPayment ? [b.paymentId ?? "-"] : []),
        ...(exportSetup
          ? [
              b.stallStatus?.size ?? "-",
              b.stallStatus?.requiresPower ? "powered" : "-",
              b.stallStatus?.requiresTent
                ? `${b.stallStatus?.requiresTent} X tent`
                : "-",
              b.stallStatus?.notes ?? "-",
            ]
          : []),
      ]),
    ]);
    return ret;
  }, [bookings, exportPayment, exportSetup]);

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button colorPalette="blue">Export List</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Export Bookings</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                <Button
                  colorPalette="yellow"
                  onClick={() => {
                    copy(bookings.map((b) => b.stall.name).join("\n") + "\n");
                    toaster.create({
                      description: "Copy List to clipboard",
                      type: "success",
                      closable: true,
                      duration: 2000,
                    });
                    setOpen(false);
                  }}
                >
                  Copy List to Clipboard
                </Button>

                <HStack marginY={4}>
                  <Separator flex={1} />
                  <Box color="fg.subtle">OR</Box>
                  <Separator flex={1} />
                </HStack>

                <Checkbox.Root defaultChecked={exportSetup}>
                  <Checkbox.HiddenInput
                    onChange={(e) => setExportSetup(e.currentTarget.checked)}
                  />
                  <Checkbox.Control />
                  <Checkbox.Label>Export Stall Setup Details</Checkbox.Label>
                </Checkbox.Root>
                <Checkbox.Root defaultChecked={exportPayment}>
                  <Checkbox.HiddenInput
                    onChange={(e) => setExportPayment(e.currentTarget.checked)}
                  />
                  <Checkbox.Control />
                  <Checkbox.Label>Export Payment Details</Checkbox.Label>
                </Checkbox.Root>
                <Button
                  mt={4}
                  colorPalette="yellow"
                  onClick={() => {
                    copy(csv);
                    toaster.create({
                      description: "Copy CSV to clipboard",
                      type: "success",
                      closable: true,
                      duration: 2000,
                    });
                    setOpen(false);
                  }}
                >
                  Copy CSV to Clipboard
                </Button>
                <DownloadTrigger
                  colorPalette="blue"
                  data={csv}
                  fileName={`${filename}.csv`}
                  mimeType="application/csv"
                  asChild
                >
                  <Button colorPalette="blue">Download CSV File</Button>
                </DownloadTrigger>
              </Stack>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
