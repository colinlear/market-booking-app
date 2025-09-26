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
  Icon,
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
import { BsLightningChargeFill } from "react-icons/bs";
import { PiTent } from "react-icons/pi";

export const ManageDateRoute: FC = () => {
  const navigate = useNavigate();
  const { date } = useParams();
  const market = useMarket();
  const { bookings, loading, reloadBookings } = useMarketBookings(date);
  const [filter, setFilter] = useState("booked");

  const filteredBookings = useMemo(() => {
    if (filter == "all") return bookings;
    return bookings?.filter((b) =>
      filter === "booked"
        ? b.status == "booked"
        : b.status == "booked" && b.cost > 0 && !b.isPaid
    );
  }, [bookings, filter]);

  const [power, tents] = useMemo(() => {
    if (!bookings) return [0, 0];
    let power = 0;
    let tents = 0;
    for (const b of bookings) {
      if (b.stall.requiresPower) {
        power++;
      }
      if (b.stall.requiresTent > 0) {
        tents += b.stall.requiresTent;
      }
    }
    return [power, tents];
  }, [bookings]);

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
      <SubHeader height="4.5rem" backgroundColor="red">
        <Heading size="lg" mb={2}>
          {format(dt, "do MMM yyyy")}
        </Heading>
        <HStack justifyContent="space-between" mb={3} maxW="30rem">
          <Heading size="md">Bookings</Heading>
          <SegmentGroup.Root
            size="xs"
            defaultValue={"Booked"}
            onValueChange={(e) =>
              setFilter((e.value?.toLocaleLowerCase() ?? "all") as StatusFilter)
            }
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={["Booked", "Unpaid", "All"]} />
          </SegmentGroup.Root>
        </HStack>
      </SubHeader>
      <Stack gap={2}>
        {!loading && !filteredBookings?.length && (
          <Box fontStyle="italic" fontSize={12}>
            No Bookings
          </Box>
        )}
        <Box
          bgColor="yellow.300"
          fontStyle="italic"
          fontSize={12}
          fontWeight={600}
          maxWidth="30rem"
          _dark={{
            bgColor: "orange.500",
          }}
          borderRadius={6}
          padding={2}
        >
          {power > 0 && (
            <Box m={2}>
              <Icon size="lg" pr={2}>
                <BsLightningChargeFill />
              </Icon>{" "}
              {power} Bookings Require Power
            </Box>
          )}
          {tents > 0 && (
            <Box m={2}>
              <Icon size="lg" pr={2}>
                <PiTent />
              </Icon>{" "}
              {tents} Tents Required
            </Box>
          )}
        </Box>
        {filteredBookings?.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            reload={() => reloadBookings()}
          />
        ))}
        <Box height={20} />
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
