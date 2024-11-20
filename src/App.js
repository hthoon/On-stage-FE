import './App.css';
import AppRouter from "./router/Router";
import {BrowserRouter} from "react-router-dom";
import {AxiosContextProvider} from "./context/AxiosContext";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AxiosContextProvider>
                    <div className="Content">
                        <AppRouter/>
                    </div>
                </AxiosContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
