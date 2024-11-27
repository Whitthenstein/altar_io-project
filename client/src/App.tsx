import { Routes, Route } from "react-router-dom";

import GeneratorPage from "./components/GeneratorPage";
import PaymentsPage from "./components/PaymentsPage";
useWebSocket;
import "./App.css";
import useWebSocket from "./hooks/useWebSocket";

const App = () => {
  const { WebSocketManager } = useWebSocket();
  return (
    <>
      <WebSocketManager />
      <Routes>
        <Route path="/" element={<GeneratorPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
      </Routes>
    </>
  );
};

export default App;
