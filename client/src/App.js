import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { ThemeProvider, createTheme } from "@mui/material";
import NicknamePage from "./pages/NicknamePage";
import "../src/styles/SharedStyles.css";
import StartNewRoom from "./pages/StartNewRoom";
import { UserProvider } from "./contexts/UserContext";
import Room from "./pages/Room/RoomPage";
import TestUser from "./components/Test/apiTest";
import TestRoom from "./components/Test/apiTest2";
import TestAvatar from "./components/Test/AvatarPage";
import TestPage1 from "./components/Test/page1";
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
                <Route path="/testUser" element={<TestUser />} />
                <Route path="/testRoom" element={<TestRoom />} />
                <Route path="/testAvatar" element={<TestAvatar />} />
                <Route path="/testPage1" element={<TestPage1 />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </SocketProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
