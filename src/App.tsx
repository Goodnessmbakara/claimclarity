import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import LandingPage from "./components/LandingPage";
import ClaimCreationPage from "./components/ClaimCreationPage";

type AppView = "landing" | "chat" | "create-claim";

function App() {
  const [currentView, setCurrentView] = useState<AppView>("landing");

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage onGetStarted={() => setCurrentView("chat")} />;
      case "chat":
        return (
          <ChatInterface onCreateClaim={() => setCurrentView("create-claim")} />
        );
      case "create-claim":
        return <ClaimCreationPage onBack={() => setCurrentView("chat")} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentView("chat")} />;
    }
  };

  return renderView();
}

export default App;
