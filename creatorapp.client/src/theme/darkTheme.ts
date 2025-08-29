import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 600 },
        body1: { fontSize: '1rem' },
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#928eff',
        },
        secondary: {
            main: '#de4015',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight:700,
                    textTransform: 'none',
                },
                containedPrimary: {
                    border: '1px solid #312f5b',
                    color: '#312f5b',
                    fontWeight: 600,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '25px',
                    border: '1px solid #646464',
                    paddingTop:5,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#6561ec #121212',
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '*::-webkit-scrollbar-track': {
                    background: '#121212',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: '#6561ec',
                    borderRadius: '4px',
                    border: '2px solid #121212',
                },
                '*::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#4c4ac1',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '*': {
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#6561ec #121212',
                    },
                    '*::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '*::-webkit-scrollbar-track': {
                        background: '#121212',
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: '#6561ec',
                        borderRadius: '4px',
                        border: '2px solid #121212',
                    },
                    '*::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#4c4ac1',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    },
});
