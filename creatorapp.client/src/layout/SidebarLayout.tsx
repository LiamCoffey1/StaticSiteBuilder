import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider, Typography } from '@mui/material';
import { Home, Pageview, Add, Settings, AccountCircle } from '@mui/icons-material'; // Import MUI Icons
import { Link } from 'react-router-dom';

function SidebarLayout({ children, darkMode, setDarkMode }) {
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <Drawer
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        paddingTop: 2,
                        position: 'relative',
                    },
                }}
                variant="permanent"
                anchor="left"
                open={drawerOpen}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Logo */}
                    <Box sx={{ padding: 2 }}>
                        <Typography sx={{ color: 'primary.main' }} variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            My Website
                        </Typography>
                    </Box>
                    <Divider />

                    {/* Navigation Links */}
                    <List sx={{ flexGrow: 1 }}>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'primary.main' }} primary="Pages" />
                        </ListItem>
                        <ListItem button component={Link} to="/images">
                            <ListItemIcon>
                                <Pageview />
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'primary.main' }} primary="Images" />
                        </ListItem>
                        <ListItem button component={Link} to="/profile">
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'primary.main' }} primary="Profile" />
                        </ListItem>
                    </List>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    {/* Settings at the bottom */}
                    <ListItem button component={Link} to="/settings" sx={{ mt: 'auto', pl: 2 }}>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText sx={{ color: 'primary.main' }} primary="Settings" />
                    </ListItem>
                </Box>

            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    padding: 3,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default SidebarLayout;
