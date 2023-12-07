import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { ThemeProvider, createTheme } from "@mui/material";
import NicknamePage from "./pages/NicknamePage";
import "../src/styles/SharedStyles.css";
import StartNewRoom from "./pages/StartNewRoom";
import { UserProvider } from "./contexts/UserContext";
import Room from "./pages/Room/RoomPage";
import ResultPage from "./pages/ResultPage";
import { SocketProvider } from "./contexts/SocketContext";
import { NotificationProvider } from "./contexts/NotificationContext";

function App() {
  const theme = createTheme({
    components: {
      MuiButton: {
        // This targets all Material-UI button components
        styleOverrides: {
          root: {
            borderRadius: 50, // Sets the border radius to be fully rounded
            textTransform: "none", // Prevents text from being capitalized
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <SocketProvider>
          <UserProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/nickname" element={<NicknamePage />} />
                <Route path="/startnewroom" element={<StartNewRoom />} />
                <Route path="/room" element={<Room />} />
                <Route path="/resultpage" element={<ResultPage />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </SocketProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
