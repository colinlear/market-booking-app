import { useMarket, useReloadMarket } from "@/MarketContext";
import { useMemo, useState, type FC } from "react";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useMarketDates } from "@/booking/useMarketDates";
import { addDays, addMonths, format, startOfWeek } from "date-fns";
import { useEditMarket } from "./useEditMarket";
import { useNavigate } from "react-router";
import { HiCalendar } from "react-icons/hi";
import type { Booking } from "@/types";
import { SubHeader } from "@/common/subheader";

export const ManageMarketDates: FC = () => {
  const navigate = useNavigate();
  const market = useMarket();
  const marketDates = useMarketDates();
  const reload = useReloadMarket();
  const { editMarket } = useEditMarket(() => reload());

  const groupDates = useMemo(() => {
    const ret: Record<string, Date[]> = {};
    for (const dts of marketDates) {
      const dt = new Date(dts);
      const month = format(dt, "yyyy-MM");
      ret[month] = [...(ret[month] ?? []), dt];
    }
    return ret;
  }, [marketDates]);

  return (
    <>
      <SubHeader>
        <HStack>
          <Heading size="md" flex={1}>
            Market Dates:
          </Heading>
          <AddDatesDialog
            onChange={async (dates) => {
              const olddates = new Set(market.dates);
              for (const dt of dates) {
                olddates.add(dt);
              }
              editMarket({ ...market, dates: [...olddates].sort() });
            }}
          />
        </HStack>
      </SubHeader>

      {Object.keys(groupDates)
        .sort()
        .map(
          (month) =>
            !!groupDates[month].length && (
              <Box key={month}>
                <Box fontWeight={600} my={1}>
                  {format(groupDates[month][0], "MMMM yyyy")}
                </Box>
                {groupDates[month].map((dt) => (
                  <HStack
                    marginBottom={2}
                    marginX={2}
                    borderRadius={6}
                    backgroundColor="rgba(69, 125, 21, 0.1)"
                    p={2}
                    gap={2}
                    maxWidth="30rem"
                    cursor="pointer"
                    _hover={{
                      backgroundColor: "rgba(69, 125, 21, 0.15)",
                    }}
                    onClick={() => {
                      navigate(
                        `/${market.code}/manage/date/${format(
                          dt,
                          "yyyy-MM-dd"
                        )}`
                      );
                    }}
                  >
                    <HiCalendar />
                    <Box flex="1">{format(dt, "cccc do")}</Box>
                  </HStack>
                ))}
              </Box>
            )
        )}
    </>
  );
};

export const AddDatesDialog: FC<{
  onChange: (dates: string[]) => Promise<void>;
}> = ({ onChange }) => {
  const [open, setOpen] = useState(false);

  const [weekday, setWeekday] = useState("0");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(
    format(addMonths(new Date(), 1), "yyyy-MM-dd")
  );

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button colorPalette="blue" size="sm">
          Add Dates
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Dates</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    onChange={(e) => {
                      setWeekday(e.target.value);
                    }}
                  >
                    <option value="0">Sundays</option>
                    <option value="1">Mondays</option>
                    <option value="2">Tuesdays</option>
                    <option value="3">Wednesdays</option>
                    <option value="4">Thursdays</option>
                    <option value="5">Fridays</option>
                    <option value="6">Saturdays</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <Field.Root required>
                  <Field.Label>
                    From Date <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="date"
                    defaultValue={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>
                    To Date <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="date"
                    defaultValue={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                </Field.Root>
              </Stack>
              <p></p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={async () => {
                  if (startDate && endDate && weekday) {
                    const ret: string[] = [];
                    const sd = new Date(startDate);
                    const ed = new Date(endDate);

                    const start = addDays(startOfWeek(sd), parseInt(weekday));
                    let ld = start > sd ? start : addDays(start, 7);
                    console.debug("Start Date", ld);
                    do {
                      ret.push(format(ld, "yyyy-MM-dd"));
                      ld = addDays(ld, 7);
                      console.debug("Next Date", ld);
                    } while (ld < ed);
                    console.debug("Dates", ret);
                    await onChange(ret);
                    setOpen(false);
                  }
                }}
              >
                Add Dates
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

export const DeleteMarketButton: FC<{
  date: string;
  bookings?: Booking[];
  onDone?: () => void;
}> = ({ date, bookings, onDone }) => {
  const market = useMarket();
  const reloadMarket = useReloadMarket();
  const { editMarket, loading } = useEditMarket(() => {
    reloadMarket();
    onDone?.();
  });

  const activeBookings = useMemo(() => {
    if (!bookings) return undefined;
    let ret = 0;
    for (const s of bookings) {
      if (s.status == "booked") ret++;
    }
    return ret;
  }, [bookings]);

  if (activeBookings == null || activeBookings > 0) return null;

  return (
    <Button
      colorPalette="red"
      disabled={activeBookings == null || activeBookings > 0}
      loading={loading}
      onClick={() => {
        editMarket({
          ...market,
          dates: market.dates.filter((d) => d != date),
        });
      }}
    >
      Cancel Market
    </Button>
  );
};
