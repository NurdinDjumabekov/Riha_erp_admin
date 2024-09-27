import React from "react";

const SendInput = (props) => {
  const { value, onChange, title, name, placeholder } = props;
  const { type } = props;

  return (
    <div className="inputSend">
      <p>{title}</p>
      <input
        type={type ? type : "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
};

export default SendInput;