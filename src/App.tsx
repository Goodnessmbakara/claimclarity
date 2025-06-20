import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import LandingPage from './components/LandingPage';

function App() {
  const [showChat, setShowChat] = useState(false);

  return showChat ? (
    <ChatInterface />
  ) : (
    <LandingPage onGetStarted={() => setShowChat(true)} />
  );
}

export default App;