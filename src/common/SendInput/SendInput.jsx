import React from "react";

const SendInput = (props) => {
  const { value, onChange, title, name, placeholder } = props;
  const { type, maxLength, typeInput, ref } = props;

  return (
    <div className="inputSend">
      <p>{title}</p>
      {typeInput == "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          ref={ref}
        />
      ) : (
        <input
          type={type ? type : "text"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          maxLength={type == "number" ? 14 : 100}
          ref={ref}
        />
      )}
    </div>
  );
};

export default SendInput;
