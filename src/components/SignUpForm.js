import axios from "axios";
import React, { useRef, useState } from "react";
import { useFela } from "react-fela";
import Markdown from "./Markdown";
import { useClickAway, useLockBodyScroll } from "react-use";
const termsAndConditions = require(`@/texts/termsAndConditions.md`);

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
  color: "pink",
});

const commonInputRule = () => ({
  background: "#FFFFFFBB",
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
  borderRadius: 0,
  "&::placeholder": {
    color: "pink",
  },
});

const buttonRule = () => ({
  textAlign: "left",
  color: "inherit",
});

const markDownRule = () => ({
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(125, 125, 125, 0.7)",
  backdropFilter: "blur(5px)",
  "-webkit-backdrop-filter": "blur(5px)",
});

const markDownInnerRule = () => ({
  background: "white",
  maxWidth: "70ch",
  padding: 20,
  borderRadius: 20,
  margin: 20,
});

const messageRule = ({message}) => ({
  gridColumn: "1 / -1",
  color: message[1] === "success" ? "#7FFF00" : "#FF0800",
});

function SignUpForm() {
  
  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [termsAreVisible, setTermsAreVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { css } = useFela({message});
  const markDownWrapperRef = useRef(null);

  useLockBodyScroll(termsAreVisible);

  useClickAway(markDownWrapperRef, () => {
    setTermsAreVisible(false);
  });

  function handleOnSubmit(e) {
    e.preventDefault();
    setProcessing(true);
    const data = {
      email: e.target.email.value,
      agreed: e.target.agree.checked,
      opt_in: e.target.opt_in.checked,
    }
    axios
      .post("/api/subscribe", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setMessage(["Thank you for subscribing!", "success"]);
        e.target.reset();
      })
      .catch((error) => {
        setMessage(["Ohh, something went wrong. Please try again later.", "error"]);
      })
      .finally((response) => {
        setProcessing(false);
      });
  }
  return (
    <>
      <form onSubmit={handleOnSubmit} className={css(formRule)}>
        Get Notified About Upcoming Filters and Other Stuff 🥰
        {message && <div className={css(messageRule)}>{message[0]}</div>}
        <input
          className={css(commonInputRule, emailInputRule)}
          id="email"
          name="email"
          type="email"
          required={true}
          placeholder="Email"
        />
        <label className={css(checkBoxRule)}>
          <input
            id="agree"
            name="agree"
            type="checkbox"
            required={true}
            className={css(checkBoxInputRule)}
            onChange={() => setAgreed(true)}
          />
          <span className={css(commonInputRule, checkboxLabelRule)}>
            I Agree to be Contacted
          </span>
        </label>
        <input id="opt_in" name="opt_in" type="checkbox" hidden required={!agreed} tabIndex={-1}></input>
        <button
          disabled={processing}
          className={css(commonInputRule, buttonRule)}
        >
          Subscribe
        </button>
        <u onClick={() => setTermsAreVisible(true)}>Terms & Conditions</u>
      </form>
      {termsAreVisible && (
        <div className={css(markDownRule)}>
          <div ref={markDownWrapperRef} className={css(markDownInnerRule)}>
            <Markdown markdown={termsAndConditions}></Markdown>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUpForm;
