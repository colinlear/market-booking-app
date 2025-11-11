import type { FC } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  Separator,
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
              fontSize="80%"
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
              fontSize="80%"
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
          marginBottom={4}
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

      <Box maxWidth="30rem">
        <Heading size="sm">Description:</Heading>
        <Box whiteSpace="pre-wrap" mb={2} fontSize="90%">
          {stall?.description}
        </Box>

        {!!stall?.products.length && (
          <Box>
            <Heading size="sm">Products:</Heading>
            {stall?.products.map((p) => (
              <Box fontWeight={600} fontSize={12} key={p}>
                - {p}
              </Box>
            ))}
          </Box>
        )}

        {!!stall && (
          <FoodStallRequirements stall={stall} onChange={() => reloadStall()} />
        )}
      </Box>

      {stallStatus?.status == "approved" && (
        <>
          <Separator marginY={4} maxWidth="30rem" />
          <Box marginBottom={2} borderRadius={6} maxWidth="30rem">
            <Heading size="lg" color="fg.primary">
              Bookings: {market.name}
            </Heading>
            <Heading size="sm" mt={3}>
              <HStack>
                <Box>Booking Cost:</Box>
                <Box flex={1} />
                <Box>
                  {stallStatus.bookingCost > 0
                    ? `$${stallStatus.bookingCost?.toLocaleString()}`
                    : "FREE"}
                </Box>
              </HStack>
            </Heading>
            {!!stallStatus?.size && (
              <Heading size="sm">
                <HStack>
                  <Box>Size:</Box>
                  <Box flex={1} />
                  <Box>{stallStatus?.size}</Box>
                </HStack>
              </Heading>
            )}
            {(stallStatus?.requiresPower || !!stallStatus?.requiresTent) && (
              <Heading size="sm" mb={2}>
                <HStack>
                  <Box>Requirements</Box>
                  <Box flex={1} />
                  <Box>
                    {stallStatus?.requiresPower && "Power"}{" "}
                    {stallStatus?.requiresPower &&
                      stallStatus?.requiresTent > 0 &&
                      " & "}
                    {stallStatus?.requiresTent > 0 &&
                      `${
                        stallStatus.requiresTent == 1
                          ? "a tent"
                          : `${stallStatus.requiresTent} tents`
                      }`}
                  </Box>
                </HStack>
              </Heading>
            )}
            {!!stallStatus?.notes?.trim() && (
              <>
                <Heading size="sm" mt={2}>
                  Special Requirements:
                </Heading>
                <Box whiteSpace="pre-wrap" mb={2} fontSize="90%">
                  {stallStatus?.notes}
                </Box>
              </>
            )}
            <Box mt={4} />
            {!!stall && stallStatus?.status == "approved" && (
              <AvailableBookingList stall={stall} />
            )}
          </Box>
        </>
      )}
      <Box height={10} />
      <BottomBar>
        <Button
          width="100%"
          colorPalette="blue"
          onClick={() => navigate("edit")}
        >
          Edit Stall {isAdmin && !stall?.marketCode && "Status"}
        </Button>
      </BottomBar>
    </>
  );
};
