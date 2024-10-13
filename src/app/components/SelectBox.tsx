import React from "react";
import Select from "react-select";

type OptionType = {
  value: string;
  label: JSX.Element;
};

interface SelectBoxProps {
  options: OptionType[];
  selectedValue: OptionType;
  //onChange: (value: OptionType | null) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  selectedValue,
  //onChange,
}) => {
  return (
    <div style={{ width: "400px", margin: "30px" }}>
      <Select
        options={options}
        defaultValue={selectedValue}
        // onChange={(value) => {
        //   onChange(value as OptionType | null);
        // }} // 選択変更時に親に通知
      />
    </div>
  );
};

export default SelectBox;
