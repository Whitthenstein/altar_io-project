import { useEffect, useState } from "react";
import { useGeneratorStore } from "../store/generatorStore";

import { getWebSocket } from "../api/webSocketAPI";

const useWebSocket = () => {
  const sessionID = useGeneratorStore((state) => state.sessionID);
  const [socket] = useState(getWebSocket(sessionID));

  const WebSocketManager = () => {
    const setGrid = useGeneratorStore((state) => state.setGrid);
    const setIsConnected = useGeneratorStore((state) => state.setIsConnected);
    const isLive = useGeneratorStore((state) => state.isLive);
    const setCode = useGeneratorStore((state) => state.setCode);
    const setSessionID = useGeneratorStore((state) => state.setSessionID);

    useEffect(() => {
      const onConnect = () => {
        setIsConnected(true);
      };

      const onDisconnect = () => {
        setIsConnected(false);
      };

      socket.on("session", ({ sessionID }: { sessionID: string }) => {
        socket.auth = { sessionID };
        setSessionID(sessionID);
      });

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    }, []);

    useEffect(() => {
      isLive &&
        socket.on("grid-update", (newGrid: string[][], newCode: number) => {
          setGrid(newGrid);
          setCode(newCode);
        });
    }, [isLive, setCode, setGrid]);

    return null;
  };

  return { WebSocketManager, socket };
};

export default useWebSocket;
