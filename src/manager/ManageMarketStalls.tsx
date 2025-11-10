import { useMemo, useState, type FC } from "react";
import { useMarketStalls, type StallWithStatus } from "./useMarketStalls";
import {
  Box,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  Link as LinkTo,
  Separator,
  Stack,
} from "@chakra-ui/react";
import { Link } from "react-router";
import { useMarket } from "@/MarketContext";
import { StallStatusWidget } from "@/stall/StallStatus";
import { HiSearch } from "react-icons/hi";
import { LuMail, LuPhone } from "react-icons/lu";

export type StatusFilter = "all" | "pending";

export const ManageMarketStalls: FC<{ status: StatusFilter }> = ({
  status,
}) => {
  const { stalls, loading, reloadStalls } = useMarketStalls();
  const [filterName, setFilterName] = useState("");

  const filteredStalls = useMemo(() => {
    let ret =
      status == "all"
        ? stalls
        : stalls?.filter((s) => s.status.status == status);

    if (filterName.trim()) {
      ret = ret?.filter(({ name }) =>
        name.toLowerCase().includes(filterName.trim().toLowerCase())
      );
    }
    return ret;
  }, [stalls, status, filterName]);

  return (
    <Stack maxWidth="30rem">
      <InputGroup startElement={<HiSearch />}>
        <Input
          placeholder="Search Stalls"
          onInput={(e) => {
            setFilterName(e.currentTarget.value);
          }}
        />
      </InputGroup>
      {!loading && !filteredStalls?.length && (
        <Box fontStyle="italic" fontSize={12}>
          No Stalls found
        </Box>
      )}
      {filteredStalls?.map((stall) => (
        <StallRow key={stall.id} stall={stall} reload={() => reloadStalls()} />
      ))}
    </Stack>
  );
};

export const StallRow: FC<{ stall: StallWithStatus; reload: () => void }> = ({
  stall,
}) => {
  const market = useMarket();
  return (
    <>
      <Separator marginY={2} maxWidth="30rem" />
      <Stack gap={2} maxWidth="30rem">
        <HStack gap={2}>
          <LinkTo asChild variant="underline">
            <Link to={`/${market.code}/stall/${stall.id}`}>
              <Heading size="lg" flex="1">
                {stall.name}
              </Heading>
            </Link>
          </LinkTo>
          <Box flex={1} />
          <StallStatusWidget status={stall?.status?.status} />
        </HStack>
        <HStack gap={2} justifyContent="space-between">
          <LinkTo
            variant="underline"
            colorPalette="blue"
            href={`mailto:${stall.email}`}
            onClick={(e) => e.stopPropagation()}
            fontSize="80%"
          >
            <Icon>
              <LuMail />
            </Icon>
            {stall.email}
          </LinkTo>
          {!!stall.phone?.trim() && (
            <LinkTo
              variant="underline"
              colorPalette="blue"
              href={`tel:${stall.phone}`}
              onClick={(e) => e.stopPropagation()}
              fontSize="80%"
            >
              <Icon>
                <LuPhone />
              </Icon>
              {stall.phone}
            </LinkTo>
          )}
        </HStack>
      </Stack>
    </>
  );
};
