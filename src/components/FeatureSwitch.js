import React, { useState } from "react";

import { useFela } from "react-fela";

const buttonRule = () => ({
  display: "inline-block",
  position: "relative",
  width: "auto",

});

const indicatorRule = () => ({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  background: "silver",
  mixBlendMode: "multiply",
})

function FeatureSwitch({ children, tag, onClick }) {
  const [value, setValue] = useState(false);
  const { css } = useFela({ value });

  function handleOnClick(e) {
    setValue(!value);
    if (onClick) {
      onClick({ tag, value: !value });
    }
  }

  return (
    <button className={css(buttonRule)} onClick={handleOnClick}>
      {value && <div className={css(indicatorRule)}></div>}
      {children}
    </button>
  );
}

export default FeatureSwitch;
