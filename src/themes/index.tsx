import { ReactNode, useMemo, useContext  } from 'react';
// material-ui
import { CssBaseline, StyledEngineProvider, ThemeOptions } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// project import
import Palette from './theme/light';
import DarkPalette from './theme/dark';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';
import { ThemeContext } from '@/context/app-theme';

// ==============================|| DEFAULT THEME - MAIN  ||============================== //
interface Props{
  children: ReactNode
}

export default function ThemeCustomization({ children }:Props) {
  // TOKNOW OLD two variables passed here
  
  const {current_theme} = useContext(ThemeContext);
  const theme = Palette('light');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);


  
  const themeOptions:ThemeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1536
        }
      },
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [theme, themeTypography, themeCustomShadows, current_theme]
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <StyledEngineProvider injectFirst={true}>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

