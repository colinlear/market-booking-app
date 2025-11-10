import type { FC } from "react";
import { useNavigate } from "react-router";
import { Box, Heading } from "@chakra-ui/react";

import type { Stall } from "@/types";
import { useStallStatus } from "./useMarketStatus";
import { StallBookingList } from "@/booking/StallBookingList";
import { useStallApply } from "./useStallApply";
import { useMarket } from "@/MarketContext";
import { StallStatusWidget } from "./StallStatus";
import { StallApplyDialog } from "./StallApplyDialog";

export const StallDetails: FC<{ stall: Stall }> = ({ stall }) => {
  const navigate = useNavigate();
  const market = useMarket();
  const { stallStatus, loading, reload } = useStallStatus(stall.id);
  return (
    <Box
      marginBottom={2}
      borderRadius={6}
      backgroundColor="rgba(69, 125, 21, 0.1)"
      p={2}
      maxWidth="30rem"
      cursor="pointer"
      _hover={{
        backgroundColor: "rgba(69, 125, 21, 0.15)",
      }}
      onClick={() => {
        navigate(`/${market.code}/stall/${stall.id}`);
      }}
    >
      <Heading size="lg" mb={2} display="flex" gap={2} alignItems="center">
        <Box>{stall.name}</Box>
        <Box flex={1} />
        {!loading && <StallStatusWidget status={stallStatus?.status} />}
      </Heading>

      {/* <Box whiteSpace="pre" mb={2}>
        {stall.description}
      </Box>
      <Box>
        <Heading size="xs">Products</Heading>
        {!stall.products.length && (
          <Box fontStyle="italic" fontSize={12}>
            No Products
          </Box>
        )}
        {stall.products.map((p) => (
          <Box fontWeight={600} fontSize={12} key={p}>
            - {p}
          </Box>
        ))}
      </Box> */}
      {/* {stallStatus?.status == "approved" && (
        <Box fontWeight={800} fontSize={13} mt={3}>
          Booking Cost: ${stallStatus.bookingCost?.toLocaleString() ?? "FREE"}
        </Box>
      )} */}
      {stallStatus?.status == "approved" ? (
        <StallBookingList stall={stall} />
      ) : (
        !loading &&
        !stallStatus && (
          <RegisterForm
            stall={stall}
            cb={() => {
              reload();
            }}
          />
        )
      )}
    </Box>
  );
};

const RegisterForm: FC<{ stall: Stall; cb: () => void }> = ({ stall, cb }) => {
  const { applyToMarket, loading } = useStallApply(stall, cb);

  return (
    <Box mt={4}>
      <p>
        This stall is not registered at this market. Register if you want to
        book dates at this market.
      </p>
      <p>
        Registration applications will be manually processed and the market
        manager will contact you with the outcome.
      </p>
      <Box mt={2} onClick={(e) => e.stopPropagation()}>
        <StallApplyDialog
          loading={loading}
          onApply={(requiresPower, requiresTent, size) => {
            applyToMarket(requiresPower, requiresTent, size);
          }}
        />
      </Box>
    </Box>
  );
};
