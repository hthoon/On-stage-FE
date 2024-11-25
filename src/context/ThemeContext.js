// import React, { createContext, useContext, useState } from 'react';
//
// const ThemeContext = createContext();
//
// export const ThemeProvider = ({ children }) => {
//     const [theme, setTheme] = useState({
//         '--button-color': '#ffffff',
//         '--font-color': '#000000',
//         '--icon-color': '#ffffff',
//         '--profile-color': '#ffffff'
//     });
//
//     const updateTheme = (newTheme) => {
//         setTheme((prevTheme) => ({ ...prevTheme, ...newTheme }));
//     };
//
//     return (
//         <ThemeContext.Provider value={{ theme, updateTheme }}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };
//
// export const useTheme = () => useContext(ThemeContext);
