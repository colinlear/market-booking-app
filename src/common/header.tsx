import {
  Box,
  Heading,
  Stack,
  Image,
  HStack,
  Avatar,
  Menu,
  Portal,
  IconButton,
} from "@chakra-ui/react";
import type { FC } from "react";
import { NavLink } from "./navlink";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";
import { Link } from "react-router";
import { BsPerson } from "react-icons/bs";
import { auth } from "@/firebase/firebase";

export const Header: FC = () => {
  const market = useMarket();
  const isAdmin = useIsMarketAdmin();
  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        backgroundColor="rgba(69, 125, 21, 1.0)"
        height="7rem"
        width="100vw"
        zIndex={10}
      >
        <Link to={`/${market.code}`}>
          <Stack
            direction="row"
            marginTop={2}
            marginX={3}
            color="#fff"
            height="4rem"
            alignItems="center"
            gap={3}
          >
            {!!market.logo?.trim() && (
              <Box borderRadius="50%" backgroundColor="#fff" padding="0.25rem">
                <Image height="3rem" width="3rem" src={market.logo} />
              </Box>
            )}
            <Stack gap={0}>
              <Heading size="sm">{market.name}</Heading>
              <Heading size="2xl">Stallholder Portal</Heading>
            </Stack>
            <Box flex={1} />
            {!!auth.currentUser && (
              <Box>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <IconButton variant="plain">
                      <Avatar.Root>
                        <Avatar.Icon>
                          <BsPerson />
                        </Avatar.Icon>
                      </Avatar.Root>
                    </IconButton>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item
                          value="signout"
                          onClick={() => {
                            auth.signOut();
                          }}
                        >
                          Sign Out
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Box>
            )}
          </Stack>
        </Link>

        <HStack
          gap={4}
          marginLeft={3}
          marginRight={5}
          color="#fff"
          height="2.5rem"
          alignItems="center"
        >
          <NavLink to={`/${market.code}`}>
            {!auth.currentUser ? "Login" : isAdmin ? "Dates" : "Home"}
          </NavLink>
          <NavLink to={`/${market.code}/about`}>About</NavLink>
          <Box flex={1} />
          {isAdmin && (
            <>
              <NavLink to={`/${market.code}/manage/stalls`}>Stalls</NavLink>
              <NavLink to={`/${market.code}/manage`}>Manage</NavLink>
            </>
          )}
        </HStack>
      </Box>

      <Box height="7rem" />
    </>
  );
};
