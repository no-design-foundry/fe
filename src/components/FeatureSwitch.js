import React, { useEffect, useState } from "react";

import { useFela } from "react-fela";

const buttonRule = () => ({
  display: "inline-block",
  position: "relative",
  width: "auto",
  margin: "0 !important",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  "& > * + *": {
    marginLeft: ".5ch",
  }
});

function FeatureSwitch({ children, tag, onClick, checked=false }) {
  const [value, setValue] = useState(checked);
  const { css } = useFela({ value });

  function handleOnClick(e) {
    setValue(!value);
    if (onClick) {
      onClick({ tag, value: !value });
    }
  }

  return (
    <button className={css(buttonRule)} onClick={handleOnClick}>
      <div>{children}</div>
      <input type="checkbox" checked={value} readOnly />
    </button>
  );
}

export default FeatureSwitch;
