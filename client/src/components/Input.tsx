import { ChangeEvent, HTMLInputTypeAttribute, useState } from "react";

type Props = {
  title: string;
  placeholder: string;
  onChangeFromProps?: (value: string) => void;
  type: HTMLInputTypeAttribute;
};

const Input = ({ title, placeholder, onChangeFromProps, type }: Props) => {
  const [value, setValue] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue.length > 0) {
      setValue(newValue);
    }

    onChangeFromProps && onChangeFromProps(newValue);
  };

  return (
    <div className="top_section_div">
      <h3>{title}</h3>
      <input
        type={type}
        className="character_cell"
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

export default Input;
