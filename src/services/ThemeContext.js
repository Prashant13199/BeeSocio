import * as React from 'react';

export const ColorModeContext = React.createContext();

export default function ThemeContext(props) {

    const [mode, setMode] = React.useState('light');
    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }

    return (
        <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
            {props.children}
        </ColorModeContext.Provider>
    );
}