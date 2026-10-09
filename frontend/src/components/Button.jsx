import React from "react";

const Button = ({ text, toCall, disabled }) => {
  return (
    <button className="btn btn-primary" onClick={toCall} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
