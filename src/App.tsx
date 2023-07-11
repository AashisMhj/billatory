import { useState, useEffect, useContext } from 'react';
//
import { SnackBarProvider } from './context/snackBar';
import Routes from '@/routes';
import ThemeCustomization from '@/themes';
import ScrollTop from '@/components/layouts/ScrollTop';
import { SettingsContext } from '@/context/settings';
import LoadingPage from './pages/Loading';
import { getSettings } from './services/settings.service';
import { useNavigate } from 'react-router-dom';
import paths from './routes/path';
import { PalettesProps } from '@ant-design/colors';
import { Color, PaletteMode } from '@mui/material';
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
    customShadows: {
      button: string,
      text: string,
      z1: string,
    }
    palette: {
      mode: PaletteMode,
      common: {
        black: string,
        white: string,
      },
      colors: PalettesProps,
      grey: Color,
      primary: {
        lighter: string,
        100: string,
        200: string,
        light: string,
        400: string,
        main: string,
        dark: string,
        700: string,
        darker: string,
        900: string,
        contrastText: string
      },
      secondary: {
        lighter: string,
        100: string,
        200: string,
        light: string,
        400: string,
        main: string,
        600: string,
        dark: string,
        800: string,
        darker: string,
        A100: string,
        A200: string,
        A300: string,
        contrastText: string
      },
      error: {
        lighter: string,
        light: string,
        main: string,
        dark: string,
        darker: string,
        contrastText: string
      },
      warning: {
        lighter: string,
        light: string,
        main: string,
        dark: string,
        darker: string,
        contrastText: string
      },
      info: {
        lighter: string,
        light: string,
        main: string,
        dark: string,
        darker: string,
        contrastText: string
      },
      success: {
        lighter: string,
        light: string,
        main: string,
        dark: string,
        darker: string,
        contrastText: string
      }
      text: {
        primary: string,
        secondary: string,
        disabled: string
      },
      action: {
        disabled: string
      },
      divider: string,
      background: {
        paper: string,
        default: string
      }
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}


const App = () => {
  const navigate = useNavigate();
  const [is_loading, setLoading] = useState(true);
  const { updateValue } = useContext(SettingsContext)
  useEffect(() => {
    getSettings()
      .then((data) => {
        if (typeof data === "string") {
          let setting_data = JSON.parse(data);
          updateValue(setting_data);
          navigate(paths.dashboard);
        }
      })
      .catch(err => {
        console.log(err);
        navigate('/setup')
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);
  return (
    <ThemeCustomization>
      <SnackBarProvider>
        <ScrollTop>
          {
            is_loading ? <LoadingPage /> : <Routes />
          }
        </ScrollTop>
      </SnackBarProvider>
    </ThemeCustomization>
  )
}

export default App
