import { ChangeEvent, useEffect, useState } from "react";

import useWebSocket from "../hooks/useWebSocket";
import { useGeneratorStore } from "../store/generatorStore";

import CodeComponent from "./CodeComponent";

const GeneratorPage = () => {
  const [character, setCharacter] = useState("");
  const [characterInputDisabled, setCharacterInputDisabled] = useState(false);

  const grid = useGeneratorStore((state) => state.grid);
  const isLive = useGeneratorStore((state) => state.isLive);
  const setIsLive = useGeneratorStore((state) => state.setIsLive);
  const isConnected = useGeneratorStore((state) => state.isConnected);

  const { socket } = useWebSocket();

  useEffect(() => {
    if (isConnected && socket) {
      socket.on("character-input-locked", () => {
        setCharacterInputDisabled(true);
      });
      socket.on("character-input-unlocked", () => {
        setCharacterInputDisabled(false);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, socket]);

  const goLive = () => {
    if (isLive || !socket) {
      return;
    }

    socket.on("character-input-locked", () => {
      setCharacterInputDisabled(true);
    });
    socket.on("character-input-unlocked", () => {
      setCharacterInputDisabled(false);
    });

    socket.emit("go-live");

    setIsLive(true);
    localStorage.setItem("isLive", "true");
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

      <CodeComponent />
    </div>
  );
};

export default GeneratorPage;
