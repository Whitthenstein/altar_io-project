import { useGeneratorStore } from "../store/generatorStore";

const CodeComponent = () => {
  const code = useGeneratorStore((state) => state.code);
  const isLive = useGeneratorStore((state) => state.isLive);
  const isConnected = useGeneratorStore((state) => state.isConnected);

  return (
    <div className="bottom_section_container">
      <div>{isLive && isConnected ? "🔴" : "⚫"} LIVE</div>
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
  );
};

export default CodeComponent;
