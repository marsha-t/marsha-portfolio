import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const getTheme = () => document.documentElement.dataset.theme || "light";
        setTheme(getTheme());
        const observer = new MutationObserver(() => {
            setTheme(getTheme());
        });
        observer.observe(document.documentElement, {
            attributes: true, 
            attributeFilter: ["data-theme"],
        });
        return () => observer.disconnect();
    }, []);
    return theme;
}