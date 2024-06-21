import { useLottie } from "lottie-react";
import { useEffect, useRef, useState } from "react";

// const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
// or lottie-react - depending on what library you use

export default function ({ className, ...kwargs }) {
  const ref = useRef(null);
  const intersectionObserver = useRef(null);
  const { View, play, setDirection, setSpeed } = useLottie(kwargs);

  function handleOnMouseEnter() {
    setSpeed(2);
    setDirection(1);
    play();
  }
  function handleOnMouseLeave() {
    setSpeed(2);
    setDirection(-1);
    play();
  }

  function observerCallback(entries, observer) {
    entries.forEach(entry => {
      console.log({intersecting: entry.isIntersecting})
      if (entry.isIntersecting) {
        // Element is in view, play animation forward
        setSpeed(2);
        setDirection(1);
        play();
      } else {
        // Element is out of view, play animation in reverse
        setSpeed(2);
        setDirection(-1);
        play();
      }
    });
  };


  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      intersectionObserver.current  = new IntersectionObserver(observerCallback, {
        root: null, // observing the element in relation to the viewport
        threshold: 1, // callback is executed when 10% of the element is visible
      });
      intersectionObserver.current.observe(ref.current)
    }
    else  {
      ref.current.addEventListener("mouseenter", handleOnMouseEnter);
      ref.current.addEventListener("mouseleave", handleOnMouseLeave);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mouseenter", handleOnMouseEnter);
        ref.current.removeEventListener("mouseleave", handleOnMouseLeave);
      }
      if (ref.current && intersectionObserver.current) {
        intersectionObserver.current.unobserve(ref.current)
      }
    };
  }, [ref]);

  return <div className={className} ref={ref}>{View}</div>;
}
