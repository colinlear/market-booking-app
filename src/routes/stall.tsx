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
import { PhoneNumber } from "@/common/phone-number";
import { SubHeader } from "@/common/subheader";
import { BottomBar } from "@/common/bottom-bar";
import { FoodStallRequirements } from "@/stall/FoodStallRequirements";

export const StallRoute: FC = () => {
  const navigate = useNavigate();
  const market = useMarket();
  const isAdmin = useIsMarketAdmin();
  const { stallId } = useParams();

  const { stall, reload: reloadStall } = useStall(stallId!);
  const {
    stallStatus,
    loading: statusLoading,
    reload,
  } = useStallStatus(stallId!);

  return (
    <>
      <SubHeader height="4.5rem">
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
              <PhoneNumber phone={stall?.phone} />
            </Link>
          )}
        </HStack>
      </SubHeader>

      {isAdmin && !!stall && !!stallStatus && (
        <Box
          maxWidth="30rem"
          marginBottom={2}
          borderRadius={6}
          backgroundColor={
            stallStatus.status == "pending"
              ? "yellow.500"
              : stallStatus.status == "approved"
                ? "blue.300"
                : "red.300"
          }
          _dark={{
            backgroundColor:
              stallStatus.status == "pending"
                ? "yellow.500"
                : stallStatus.status == "approved"
                  ? "blue.600"
                  : "red",
          }}
          p={2}
        >
          <StallManagerForm status={stallStatus} onChange={reload} />
        </Box>
      )}

      <Box
        marginBottom={2}
        borderRadius={6}
        backgroundColor="rgba(69, 125, 21, 0.1)"
        p={2}
        maxWidth="30rem"
      >
        <Heading size="sm">Description:</Heading>
        <Box whiteSpace="pre-wrap" mb={2}>
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
        {(stallStatus?.requiresPower || !!stallStatus?.requiresTent) && (
          <Heading size="sm" mb={2}>
            Requires: {stallStatus?.requiresPower && "Power"}{" "}
            {stallStatus?.requiresPower &&
              stallStatus?.requiresTent > 0 &&
              " & "}
            {stallStatus?.requiresTent > 0 &&
              `${
                stallStatus.requiresTent == 1
                  ? "a tent"
                  : `${stallStatus.requiresTent} tents`
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
        </HStack>
        {!!stall && (
          <FoodStallRequirements stall={stall} onChange={() => reloadStall()} />
        )}
      </Box>

      {stallStatus?.status == "approved" && (
        <Box
          marginBottom={2}
          borderRadius={6}
          backgroundColor="rgba(69, 125, 21, 0.1)"
          p={2}
          maxWidth="30rem"
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
      <Box height={10} />
      <BottomBar>
        <Button
          width="100%"
          colorPalette="blue"
          onClick={() => navigate("edit")}
        >
          Edit Stall
        </Button>
      </BottomBar>
    </>
  );
};
