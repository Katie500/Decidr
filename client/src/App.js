import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import { ThemeProvider, createTheme } from '@mui/material';
import NicknamePage from './pages/NicknamePage';
import '../src/styles/SharedStyles.css';
import Room from './pages/Room';
import StartNewRoom from './pages/StartNewRoom';

function App() {
  const theme = createTheme({
    components: {
      MuiButton: {
        // This targets all Material-UI button components
        styleOverrides: {
          root: {
            borderRadius: 50, // Sets the border radius to be fully rounded
            textTransform: 'none', // Prevents text from being capitalized
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/nickname" element={<NicknamePage />} />
          <Route path="/startnewroom" element={<StartNewRoom />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
