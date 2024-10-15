import axios from "axios";
import React, { useState } from "react";
import { useFela } from "react-fela";

const formRule = () => ({
  borderRadius: "20px 20px 0 0",
  border: "none",
  background: "pink",
  display: "flex",
  fromTabletS: {
    width: "calc(50% - 2px)",
  },
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 5,
  marginTop: 50,
  paddingTop: 10,
  paddingHorizontal: 10,
  paddingBottom: 50,
});

const checkBoxRule = () => ({
  position: "relative",
  width: "100%",
});

const checkBoxInputRule = () => ({
  width: "100%",
  zIndex: 1,
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  opacity: 0,
  cursor: "pointer",
  "&:checked + *": {
    background: "black",
    color: "transparent",
  },
});

const checkboxLabelRule = () => ({
  pointerEvents: "none",
  display: "block",
});

const commonInputRule = () => ({
  appearance: "none",
  "-webkit-appearance": "none",
  background: "#FFFFFF66",
  outline: "none",
  border: "none",
  paddingVertical: 10,
  paddingHorizontal: 10,
  fontSize: "inherit",
  fontWeight: "inherit",
  fontFamily: "inherit",
});

const emailInputRule = () => ({
  width: "100%",
});

const buttonRule = () => ({
  appearance: "none",
  "-webkit-appearance": "none",
  textAlign: "left"
});

const messageRule = () => ({
  gridColumn: "1 / -1",
});
function SignUpForm() {
  const { css } = useFela();

  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  function handleOnSubmit(e) {
    e.preventDefault();
    setProcessing(true);
    axios
      .post("/api/subscribe", { email: e.target.email.value })
      .then(() => {
        setMessage("Thank you for subscribing!");
        e.target.reset();
      })
      .catch((error) => {
        setMessage("Ohh, something went wrong. Please try again later.");
      })
      .finally((response) => {
        setProcessing(false);
      });
  }
  return (
    <form onSubmit={handleOnSubmit} className={css(formRule)}>
      Get Notified About Upcoming Filters and Other Stuff 🥰
      {message && <div className={css(messageRule)}>{message}</div>}
      <input
        className={css(commonInputRule, emailInputRule)}
        name="email"
        type="email"
        required
        placeholder="Email"
      />
      <label className={css(checkBoxRule)}>
        <input type="checkbox" required className={css(checkBoxInputRule)} />
        <span className={css(commonInputRule, checkboxLabelRule)}>
          I Agree to be Contacted
        </span>
      </label>
      <button
        disabled={processing}
        className={css(commonInputRule, buttonRule)}
      >
        Subscribe
      </button>
      <u>Terms and conditions</u>
    </form>
  );
}

export default SignUpForm;
