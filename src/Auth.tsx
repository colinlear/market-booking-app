import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { Link as RouterLink } from "react-router";
import { auth as authui } from "firebaseui";
import { EmailAuthProvider, onAuthStateChanged } from "firebase/auth";
import { Box, HStack, Link, ProgressCircle } from "@chakra-ui/react";

import { auth } from "./firebase/firebase";

import "firebaseui/dist/firebaseui.css";

export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      setIsSignedIn(!!user);
    });
  }, []);

  useEffect(() => {
    if (isLoading || isSignedIn) return;
    const ui = authui.AuthUI.getInstance() || new authui.AuthUI(auth);

    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          // console.debug("Auth Result", authResult);
          setIsSignedIn(!!authResult);
          return false;
        },
        uiShown: function () {
          // This is what should happen when the form is full loaded. In this example, I hide the loader element.
          const loader = document.getElementById("loader");
          if (loader) {
            loader.style.display = "none";
          }
        },
      },
      signInOptions: [
        // This array contains all the ways an user can authenticate in your application. For this example, is only by email.
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
          forceSameDevice: false,
          requireDisplayName: true,
        },
      ],
    });
  }, [isLoading, isSignedIn]);

  if (!isSignedIn) {
    return (
      <>
        <Box flex={1} smDown={{ flex: 0 }} />
        <Box>
          <Box id="firebaseui-auth-container"></Box>
          <div id="loader" className="text-center">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="75vh"
            >
              <ProgressCircle.Root size="xl" colorPalette="green">
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range strokeLinecap="round" />
                </ProgressCircle.Circle>
              </ProgressCircle.Root>
            </Box>
          </div>
        </Box>
        <Box flex={3} />
        <HStack
          flex={0}
          width="100%"
          px={2}
          bgColor="white"
          color="black"
          alignItems="flex-start"
        >
          <HStack
            smDown={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "1px",
            }}
          >
            <Box>
              &copy;2025{" "}
              <Link
                variant="underline"
                href="https://helppo.au"
                target="_blank"
              >
                Helppo Solutions
              </Link>
              .
            </Box>
            <Box>All rights reserved</Box>
          </HStack>
          <Box flex={1} />
          <Link variant="underline" asChild>
            <RouterLink to="/privacy">Privacy Policy</RouterLink>
          </Link>
        </HStack>
      </>
    );
  }
  return children;
};
