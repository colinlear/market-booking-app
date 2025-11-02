import type { BookingWithStall } from "@/types";
import {
  Button,
  CloseButton,
  Dialog,
  DownloadTrigger,
  Portal,
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

  const csv = useMemo(() => {
    const ret = convertArrayToCSV(
      bookings.map((b) => [
        b.stall.name,
        b.stall.email,
        b.status,
        b.cost <= 0 ? "free" : b.isPaid ? "paid" : "unpaid",
      ]),
    );
    return ret;
  }, [bookings]);

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
              <Stack gap={2}>
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
                <Button
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
                  <Button colorPalette="blue">Download CSV</Button>
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
