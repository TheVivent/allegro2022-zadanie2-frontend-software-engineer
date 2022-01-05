// "zainspirowane" przez
// https://github.com/AlexWebLab/bootstrap-5-breakpoint-react-hook/blob/main/src/useBreakpoint.js
// w oryginalnym repozytorium brakuje type: "module"
// i dlatego nie mogłem skorzystać z jego pracy przy pomocy modułu

import { useState, useEffect } from "react";

type Viewport = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";

export default function useViewport() {
  const [viewport, setViewport] = useState<Viewport>();

  const handleResize = () => {
    const w = window.innerWidth;
    if (w >= 1400) setViewport("xxl");
    else if (w >= 1200) setViewport("xl");
    else if (w >= 992) setViewport("lg");
    else if (w >= 768) setViewport("md");
    else if (w >= 576) setViewport("sm");
    else setViewport("xs");
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
}
