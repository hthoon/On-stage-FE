import './App.css';
import AppRouter from "./router/Router";
import {BrowserRouter} from "react-router-dom";
import {AxiosContextProvider} from "./context/AxiosContext";
import {LinkProvider} from "./context/LinkContext";
import {ThemeProvider} from "./context/ThemeContext";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AxiosContextProvider>
                    <LinkProvider>

                            <div className="Content">
                                <AppRouter/>
                            </div>

                    </LinkProvider>
                </AxiosContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
