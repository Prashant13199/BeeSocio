import React, { useEffect, createContext, useState } from 'react';

export const ColorModeContext = createContext();

export default function ThemeContext(props) {

    const [mode, setMode] = useState('light')
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

    useEffect(() => {
        if (darkThemeMq.matches) {
            setMode('dark')
        } else {
            setMode('light')
        }
    }, [])

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }

    return (
        <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
            {props.children}
        </ColorModeContext.Provider>
    );
}