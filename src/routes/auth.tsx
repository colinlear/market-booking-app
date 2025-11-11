import { Auth } from "@/Auth";
import type { FC } from "react";
import { Outlet } from "react-router";

export const AuthRoute: FC = () => {
  return (
    <Auth>
      <Outlet />
    </Auth>
  );
};
