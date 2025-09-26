import type { FC } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  Tag,
} from "@chakra-ui/react";
import { HiCheck } from "react-icons/hi";

import { AvailableBookingList } from "@/booking/AvailableBookingList";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import { StallManagerForm } from "@/stall/StallManagerForm";
import { useStallStatus } from "@/stall/useMarketStatus";
import { useStall } from "@/stall/useStall";
import { LuMail, LuPhone } from "react-icons/lu";

export const StallRoute: FC = () => {
  const navigate = useNavigate();
  const market = useMarket();
  const isAdmin = useIsMarketAdmin();
  const { stallId } = useParams();

  const { stall } = useStall(stallId!);
  const {
    stallStatus,
    loading: statusLoading,
    reload,
  } = useStallStatus(stallId!);

  return (
    <>
      <Box
        marginBottom={2}
        borderRadius={6}
        backgroundColor="rgba(69, 125, 21, 0.1)"
        p={2}
      >
        <Heading size="lg" mb={2} display="flex" gap={2} alignItems="center">
          <Box>{stall?.name}</Box>
          <Box flex={1} />
          {statusLoading ? null : stallStatus?.status == "approved" ? (
            <Tag.Root colorPalette="green" variant="solid">
              <Tag.Label>Approved</Tag.Label>
              <Tag.EndElement>
                <HiCheck />
              </Tag.EndElement>
            </Tag.Root>
          ) : stallStatus?.status == "rejected" ? (
            <Tag.Root colorPalette="red" variant="solid">
              <Tag.Label>Rejected</Tag.Label>
              <Tag.EndElement>
                <Tag.CloseTrigger />
              </Tag.EndElement>
            </Tag.Root>
          ) : stallStatus?.status == "pending" ? (
            <Tag.Root colorPalette="yellow" variant="solid">
              <Tag.Label>Pending Approval</Tag.Label>
            </Tag.Root>
          ) : !stallStatus ? (
            <>
              <Tag.Root colorPalette="grey" variant="solid">
                <Tag.Label>Not registered</Tag.Label>
              </Tag.Root>
            </>
          ) : (
            ""
          )}
        </Heading>
        <HStack gap={2} justifyContent="space-between" mb={2}>
          {!!stall?.email?.trim() && (
            <Link
              variant="underline"
              colorPalette="blue"
              href={`mailto:${stall?.email}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon>
                <LuMail />
              </Icon>
              {stall?.email}
            </Link>
          )}
          {!!stall?.phone?.trim() && (
            <Link
              variant="underline"
              colorPalette="blue"
              href={`tel:${stall?.phone}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon>
                <LuPhone />
              </Icon>
              {stall?.phone}
            </Link>
          )}
        </HStack>

        <Box whiteSpace="pre" mb={2}>
          {stall?.description}
        </Box>

        {!!stall?.products.length && (
          <Box mb={3}>
            <Heading size="xs">Products</Heading>
            {stall?.products.map((p) => (
              <Box fontWeight={600} fontSize={12} key={p}>
                - {p}
              </Box>
            ))}
          </Box>
        )}
        {!!stall?.size && <Heading size="sm">Size: {stall?.size}</Heading>}
        {(stall?.requiresPower || !!stall?.requiresTent) && (
          <Heading size="sm" mb={2}>
            Requires: {stall?.requiresPower && "Power"}{" "}
            {stall?.requiresPower && stall?.requiresTent > 0 && " & "}
            {stall?.requiresTent > 0 &&
              `${
                stall.requiresTent == 1
                  ? "a tent"
                  : `${stall.requiresTent} tents`
              }`}
          </Heading>
        )}
        <HStack alignItems="flex-end">
          {stall?.isFoodStall && (
            <Tag.Root colorPalette="orange" variant="solid" size="lg">
              <Tag.Label>Food / Drink</Tag.Label>
            </Tag.Root>
          )}
          <Box flex={1} />
          <Button
            size="sm"
            colorPalette="blue"
            onClick={() => navigate("edit")}
          >
            Edit Stall
          </Button>
        </HStack>
      </Box>
      {isAdmin && !!stall && !!stallStatus && (
        <Box
          marginBottom={2}
          borderRadius={6}
          backgroundColor="yellow.500"
          _dark={{
            backgroundColor: "orange.700",
          }}
          p={2}
        >
          <StallManagerForm
            stall={stall}
            status={stallStatus}
            onChange={reload}
          />
        </Box>
      )}
      {stallStatus?.status == "approved" && (
        <Box
          marginBottom={2}
          borderRadius={6}
          backgroundColor="rgba(69, 125, 21, 0.1)"
          p={2}
        >
          <>
            <Heading size="lg">{market.name}</Heading>
            <Box fontWeight={800} fontSize={13} my={3}>
              Booking Cost: $
              {stallStatus.bookingCost?.toLocaleString() ?? "FREE"}
            </Box>
          </>

          {!!stall && stallStatus?.status == "approved" && (
            <AvailableBookingList stall={stall} />
          )}
        </Box>
      )}
    </>
  );
};
