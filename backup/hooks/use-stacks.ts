import {
  AppConfig,
  showConnect,
  type UserData,
  UserSession,
} from "@stacks/connect";
import { useEffect, useState } from "react";

export function useStacks() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  function connectWallet() {
    showConnect({
      appDetails: {
        name: "Stacks Account History",
        icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
      },
      userSession,
      onFinish: () => {
        window.location.reload();
      },
    });
  }

  function disconnectWallet() {
    userSession.signUserOut();
    setUserData(null);
  }

  useEffect(() => {
    try {
      if (userSession.isUserSignedIn()) {
        setUserData(userSession.loadUserData());
      } else if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then((data) => setUserData(data));
      }
    } catch (err) {
      console.error("Error loading Stacks session:", err);
      userSession.signUserOut(); // reset corrupted session
    }
  }, []);
  
  return { userData, connectWallet, disconnectWallet };
}
