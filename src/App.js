import './App.css';
import AppRouter from "./router/Router";
import {BrowserRouter} from "react-router-dom";
import {AxiosContextProvider} from "./context/AxiosContext";
import {LinkProvider} from "./context/LinkContext";
import Sidebar from "./components/sidebar/Sidebar";
import {AuthProvider} from "./context/AuthContext";
import {SpotifyProvider} from "./context/SpotifyContext";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AxiosContextProvider>
                    <AuthProvider>
                        <LinkProvider>
                            <SpotifyProvider>


                                <Sidebar/>
                                <div className="Content">
                                    <AppRouter/>
                                </div>


                            </SpotifyProvider>
                        </LinkProvider>
                    </AuthProvider>
                </AxiosContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
