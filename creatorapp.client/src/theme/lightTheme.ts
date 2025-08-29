import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 600 },
        body1: { fontSize: '1rem' },
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#5956d3',
        },
        secondary: {
            main: '#de4015',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
                '*': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#5956d3 #f5f5f5',
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '*::-webkit-scrollbar-track': {
                    background: '#f5f5f5',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: '#5956d3',
                    borderRadius: '4px',
                    border: '2px solid #f5f5f5',
                },
                '*::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#4c4ac1',
                },
            },
        },
    },
});
