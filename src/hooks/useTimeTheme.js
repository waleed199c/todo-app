import { useEffect, useState } from "react";

export function useTimeTheme() {
  const [theme, setTheme] = useState("morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setTheme("morning");
    else if (hour < 17) setTheme("afternoon");
    else if (hour < 20) setTheme("sunset");
    else setTheme("night");
  }, []);

  return theme;
}
