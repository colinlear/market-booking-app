import { Auth } from "./Auth";

import { createBrowserRouter, RouterProvider } from "react-router";
import { BaseUI } from "./routes/baseui";
import { HomeRoute } from "./routes/home";
import { ManageRoute } from "./routes/manage";
import { NotFound } from "./common/notfound";
import { StallRoute } from "./routes/stall";
import { ManageDateRoute } from "./routes/manage-date";
import { ManageStallsRoute } from "./routes/manage-stalls";
import { AddStallRoute } from "./routes/stall-add";
import { EditStallRoute } from "./routes/stall-edit";
import { Toaster } from "./components/ui/toaster";

const router = createBrowserRouter([
  { path: "", Component: NotFound },
  {
    path: ":marketCode/",
    Component: BaseUI,
    children: [
      {
        path: "",
        Component: HomeRoute,
      },
      {
        path: "manage",
        Component: ManageRoute,
      },
      {
        path: "manage/date/:date",
        Component: ManageDateRoute,
      },
      {
        path: "manage/stalls",
        Component: ManageStallsRoute,
      },
      {
        path: "stall/add",
        Component: AddStallRoute,
      },
      {
        path: "stall/:stallId",
        Component: StallRoute,
      },
      {
        path: "stall/:stallId/edit",
        Component: EditStallRoute,
      },
    ],
  },
]);

function App() {
  return (
    <Auth>
      <RouterProvider router={router} />
      <Toaster />
    </Auth>
  );
}

export default App;
