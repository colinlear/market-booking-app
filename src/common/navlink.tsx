import type { FC } from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link, type LinkProps } from "react-router";

export const NavLink: FC<LinkProps> = (props) => {
  return (
    <ChakraLink asChild color="#eee">
      <Link {...props} />
    </ChakraLink>
  );
};
