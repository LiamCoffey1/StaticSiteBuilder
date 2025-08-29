import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Button, Typography, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AddCircle, Layers, Palette } from '@mui/icons-material';
import usePageListStore from '../store/pageListStore';

// Define template types
interface NavbarTemplate {
    name: string;
    links: { text: string; url: string }[];
    layout?: 'horizontal' | 'vertical';
    theme?: string;
}

// Predefined templates
const navbarTemplates: NavbarTemplate[] = [
    {
        name: 'Default Navbar',
        links: [
            { text: 'Home', url: '/' },
            { text: 'About', url: '/about' },
            { text: 'Contact', url: '/contact' },
        ],
        layout: 'horizontal',
        theme: 'light',
    },
    {
        name: 'Dark Navbar',
        links: [
            { text: 'Home', url: '/' },
            { text: 'Services', url: '/services' },
            { text: 'Blog', url: '/blog' },
        ],
        layout: 'horizontal',
        theme: 'dark',
    },
    {
        name: 'Vertical Navbar',
        links: [
            { text: 'Dashboard', url: '/dashboard' },
            { text: 'Profile', url: '/profile' },
            { text: 'Settings', url: '/settings' },
        ],
        layout: 'vertical',
        theme: 'light',
    },
];

// Navbar Editor Component
const NavbarEditor = ({ template, onTemplateChange, links, setLinks }: { template: NavbarTemplate; onTemplateChange: (template: NavbarTemplate) => void; links: any;setLinks:any }) => {
    const { pages } = usePageListStore();  // Get pages from the store
  
    const [layout, setLayout] = useState(template.layout);
    const [theme, setTheme] = useState(template.theme);

    const handleLinkChange = (index: number, field: 'text' | 'url', value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const handleAddLink = () => {
        if (links.length < 3) { // Ensure no more than 3 links can be added
            const newPage = pages[links.length];
            setLinks([...links, { text: newPage.name, url: newPage.name.toLowerCase().replace(/\s+/g, '-') }]);
        }
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks);
    };

    useEffect(() => {
        onTemplateChange({ ...template, links, layout, theme });
    }, [links, layout, theme]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5">{template.name}</Typography>
            <Button variant="outlined" onClick={handleAddLink} disabled={links.length >= 3}>Add Link</Button> {/* Disable if 3 links are present */}
            {links.map((link, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Page</InputLabel>
                        <Select
                            value={link.url}
                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                            label="Page"
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.id} value={page.name.toLowerCase().replace(/\s+/g, '-')}>
                                    {page.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        type="text"
                        value={link.text}
                        onChange={e => handleLinkChange(index, 'text', e.target.value)}
                        placeholder="Link Text"
                    />
                    <Button variant="outlined" onClick={() => handleRemoveLink(index)}>Remove</Button>
                </Box>
            ))}
        </Box>
    );
};

// Navbar Builder App Component
const NavbarBuilderApp = () => {
    const { pages } = usePageListStore();  // Get pages from the store
    const [selectedTemplate, setSelectedTemplate] = useState<NavbarTemplate>({ name: 'Default Navbar', links: [], layout: 'horizontal', theme: 'light' });
    const [currentTab, setCurrentTab] = useState(0);
    const [links, setLinks] = useState(() => {
        // Convert pages to links with name as text and lowercase name with spaces as URL
        return pages.slice(0, 3).map(page => ({
            text: page.name,
            url: page.name.toLowerCase().replace(/\s+/g, '-'),
        }));
    });
    const handleTemplateSelect = (template: NavbarTemplate) => {
        setSelectedTemplate({...template, links});
    };

    const handleTemplateChange = (updatedTemplate: NavbarTemplate) => {
        setSelectedTemplate(updatedTemplate);
    };

    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
            {/* Left Sidebar */}
            <Box
                sx={{
                    width: 350,
                    bgcolor: theme.palette.background.paper,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Tabs
                    orientation="vertical"
                    value={currentTab}
                    onChange={(_, newValue) => setCurrentTab(newValue)}
                    aria-label="Navbar Template Editor"
                    sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
                >
                    <Tab label="Templates" />
                    <Tab label="Editor" />
                </Tabs>
                {currentTab === 0 && (
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
                        {navbarTemplates.map((template, index) => (
                            <Button key={index} variant="outlined" onClick={() => handleTemplateSelect(template)}>
                                {template.name}
                            </Button>
                        ))}
                    </Box>
                )}
                {currentTab === 1 && (
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
                        <NavbarEditor template={selectedTemplate} onTemplateChange={handleTemplateChange} links={links} setLinks={setLinks} />
                    </Box>
                )}
            </Box>

            {/* Right Content Area */}
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="h4">Navbar Preview</Typography>
                <div
                    style={{
                        display: selectedTemplate.layout === 'horizontal' ? 'flex' : 'block',
                        backgroundColor: selectedTemplate.theme === 'dark' ? '#333' : '#fff',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                >
                    <ul style={{ display: 'flex', gap: '10px', listStyleType: 'none' }}>
                        {selectedTemplate.links.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} style={{ color: selectedTemplate.theme === 'dark' ? 'white' : 'black' }}>
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Box>
        </Box>
    );
};

export default NavbarBuilderApp;
