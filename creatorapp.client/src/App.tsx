import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';

// Import components
import Dashboard from './pages/Dashboard';
import SidebarLayout from './layout/SidebarLayout';
import Images from './pages/Images';
import LayoutEditor from './pages/LayoutEditor';
import RequireAuth from './components/auth/RequireAuth';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';
import usePageListStore from './store/pageListStore';
import { lightTheme } from './theme/lightTheme';
import { darkTheme } from './theme/darkTheme';
import PageEditorGuard from './pages/PageEditorGuard';

function App() {
    const [darkMode, setDarkMode] = useState(true); // Toggle dark mode

    // Choose the theme based on the state
    const theme = darkMode ? darkTheme : lightTheme;

    const loadPages = usePageListStore(s => s.loadPages);
    const loading = usePageListStore(s => s.loading);
    const pages = usePageListStore(s => s.pages);

    // On app load or route changes, if token exists and pages are not loaded, fetch pages
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token && pages.length === 0 && !loading) {
            loadPages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, pages.length]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Ensures global styles are applied */}

            {/* Loading overlay when fetching pages */}
            {loading && (
                <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.35)', zIndex: 2000 }}>
                    <CircularProgress />
                </Box>
            )}

            <Router>
                {/* App Bar (Navigation) */}


                {/* Main content */}
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<RequireAuth />}> 
                        <Route path="/" element={
                            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                                <Dashboard />
                            </SidebarLayout>
                        } />
                        <Route path="/images" element={
                            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                                <Images />
                            </SidebarLayout>
                        } />
                        <Route path="/editor" element={<PageEditorGuard /> } />
                        <Route path="/layout" element={<LayoutEditor />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;