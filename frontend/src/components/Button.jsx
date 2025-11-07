import React from "react";

const Button = ({ text, toCall }) => {
  return (
    <button className="btn btn-primary" onClick={toCall}>
      {text}
    </button>
  );
};

export default Button;
