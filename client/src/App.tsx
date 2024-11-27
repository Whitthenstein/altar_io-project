import { ChangeEvent, useEffect, useState } from "react";

import { socket } from "./api/webSocketAPI";

import { createEmptyGrid } from "./utils";

import "./App.css";

const EMPTY_GRID = createEmptyGrid();

const App = () => {
  const [character, setCharacter] = useState("");
  const [characterInputDisabled, setCharacterInputDisabled] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [code, setCode] = useState<number | null>(null);
  const [grid, setGrid] = useState(EMPTY_GRID);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const goLive = () => {
    if (isLive || !socket) {
      return;
    }

    socket.on("grid-update", (newGrid: string[][], newCode: number) => {
      setGrid(newGrid);
      setCode(newCode);
    });

    socket.on("character-input-locked", () => {
      setCharacterInputDisabled(true);
    });
    socket.on("character-input-unlocked", () => {
      setCharacterInputDisabled(false);
    });

    socket.emit("go-live");

    setIsLive(true);
  };

  const onCharacterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.toLocaleLowerCase();

    if (char.length === 0) {
      setCharacter("");
      socket.emit("character-input-sent", null);
      return;
    }

    if (char.length > 1) {
      const insertedChar = char.charAt(1);
      setCharacter(insertedChar);
      socket.emit("character-input-sent", insertedChar);
      return;
    }

    const charCode = char.charCodeAt(0);

    if (charCode >= 97 && charCode <= 122) {
      setCharacter(char);
      socket.emit("character-input-sent", char);
    }
  };

  return (
    <div className="container">
      <div className="top_section_container">
        <div className="top_section_div">
          <h3>Character</h3>
          <input
            className="character_cell"
            onChange={onCharacterChange}
            placeholder={"Character"}
            value={character}
            disabled={characterInputDisabled}
          />
        </div>

        <div className="top_section_div">
          <button disabled={isLive || !isConnected} onClick={goLive}>
            GENERATE 2D GRID
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="grid_row" key={`grid-row${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <input
                className="grid_cell"
                key={`grid-cell-${rowIndex}:${cellIndex}`}
                type="text"
                disabled={true}
                value={cell}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="bottom_section_container">
        <div>{isLive ? "🔴" : "⚫"} LIVE</div>
        <div>
          <input
            className="code_cell"
            type="text"
            disabled
            readOnly
            value={`YOUR CODE: ${code ? code : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
