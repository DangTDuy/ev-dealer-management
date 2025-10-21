import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 900,
    },
    h2: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 800,
    },
    h3: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#667eea',
      light: '#8b9ef5',
      dark: '#4a5fc7',
    },
    secondary: {
      main: '#764ba2',
      light: '#9b6fc9',
      dark: '#5a3880',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': {
            fontFamily: 'Be Vietnam Pro',
            fontDisplay: 'swap',
          },
        },
      },
    },
  },
})

export default theme

