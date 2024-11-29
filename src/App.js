import './App.css';
import AppRouter from "./router/Router";
import {BrowserRouter} from "react-router-dom";
import {AxiosContextProvider} from "./context/AxiosContext";
import {LinkProvider} from "./context/LinkContext";
import Sidebar from "./components/sidebar/Sidebar";
import {AuthProvider} from "./context/AuthContext";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AxiosContextProvider>
                    <AuthProvider>
                        <LinkProvider>



                            <Sidebar/>
                            <div className="Content">
                                <AppRouter/>
                            </div>



                        </LinkProvider>
                    </AuthProvider>
                </AxiosContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
