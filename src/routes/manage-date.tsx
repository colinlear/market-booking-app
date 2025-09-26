import { BottomBar } from "@/common/bottom-bar";
import { SubHeader } from "@/common/subheader";
import { BookingRow } from "@/manager/ManageMarketBookings";
import { DeleteMarketButton } from "@/manager/ManageMarketDates";
import { useMarketBookings } from "@/manager/useMarketBookings";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import {
  Box,
  Button,
  Heading,
  HStack,
  SegmentGroup,
  Stack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useMemo, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { SelectStallsDialog } from "../stall/SelectStallsDialog";
import { createBooking, getBooking } from "@/firebase/booking";
import { getStallStatus } from "@/firebase/stall-status";
import { ExportBookingsDialog } from "@/booking/ExportBookings";
import type { StatusFilter } from "@/manager/ManageMarketStalls";

export const ManageDateRoute: FC = () => {
  const navigate = useNavigate();
  const { date } = useParams();
  const market = useMarket();
  const { bookings, loading, reloadBookings } = useMarketBookings(date);
  const [filter, setFilter] = useState("all");

  const filteredBookings = useMemo(() => {
    if (filter == "all") return bookings;
    return bookings?.filter((b) =>
      filter === "booked"
        ? b.status == "booked"
        : b.status == "booked" && b.cost > 0 && !b.isPaid
    );
  }, [bookings, filter]);

  const isAdmin = useIsMarketAdmin();
  if (!isAdmin) return "Access Denied";

  const dt = new Date(date ?? NaN);

  if (isNaN(dt.getTime())) {
    <>
      <Heading size="lg">Invalid Date</Heading>
      <Button onClick={() => navigate(`/${market.code}`)}>Back</Button>
    </>;
  }
  return (
    <>
      <SubHeader height="3.5rem">
        <HStack justifyContent="space-between" mb={3}>
          <Heading size="lg">{format(dt, "do MMM yyyy")}</Heading>
          <SegmentGroup.Root
            size="xs"
            defaultValue={"All"}
            onValueChange={(e) =>
              setFilter((e.value?.toLocaleLowerCase() ?? "all") as StatusFilter)
            }
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={["All", "Booked", "Unpaid"]} />
          </SegmentGroup.Root>
        </HStack>
      </SubHeader>
      <Stack gap={2}>
        {!loading && !filteredBookings?.length && (
          <Box fontStyle="italic" fontSize={12}>
            No Bookings
          </Box>
        )}
        {filteredBookings?.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            reload={() => reloadBookings()}
          />
        ))}
        <DeleteMarketButton
          date={format(dt, "yyyy-MM-dd")}
          bookings={bookings}
          onDone={() => navigate(`/${market.code}`)}
        />
      </Stack>
      {!!date && (
        <BottomBar>
          <SelectStallsDialog
            label="Add Stalls"
            onSelect={async (stall) => {
              const approval = await getStallStatus(market.code, stall.id);
              if (!approval) return;
              const existing = await getBooking(market.code, stall.id, date);
              if (existing) {
                createBooking({
                  marketCode: existing.marketCode,
                  status: "booked",
                  cost: existing.cost,
                  stall: existing.stall,
                  date: existing.date,
                  isPaid: existing.status == "credited",
                });
              } else {
                createBooking({
                  marketCode: market.code,
                  status: "booked",
                  stall,
                  date,
                  cost: approval.bookingCost,
                  isPaid: false,
                });
              }
              reloadBookings();
            }}
            skip={new Set(bookings?.map((b) => b.stall.id))}
          />

          <Box flex={1} />
          {!!bookings?.length && (
            <ExportBookingsDialog
              bookings={bookings}
              filename={`${market.code}-${date}`}
            />
          )}
        </BottomBar>
      )}
    </>
  );
};
