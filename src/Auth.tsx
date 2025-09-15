import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { auth as authui } from "firebaseui";
import { EmailAuthProvider, onAuthStateChanged } from "firebase/auth";
import { Box, ProgressCircle } from "@chakra-ui/react";

import { auth } from "./firebase";

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
          console.debug("Auth Result", authResult);
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
      tosUrl: "https://www.vicparkmarket.com.au",
      privacyPolicyUrl: "https://www.vicparkmarket.com.au",
    });
  }, [isLoading, isSignedIn]);

  if (!isSignedIn) {
    return (
      <>
        <div id="firebaseui-auth-container"></div>
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
      </>
    );
  }
  return children;
};
