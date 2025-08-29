import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, List, ListItem, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, RadioGroup, FormControlLabel, Radio, Tooltip } from '@mui/material';
import { Edit, Delete, FileCopy as CloneIcon, DriveFileRenameOutline } from '@mui/icons-material';
import usePageListStore from '../store/pageListStore';
import { serialize } from '../utils/treeActions';
import { presetElements } from '../Constants/presetElements'
import { publishSite } from '../api/site';
import { useSnackbar } from '../context/SnackbarContext';

function Dashboard() {
    const navigate = useNavigate();
    const { pages, addPage, removePage, selectPage, renamePage } = usePageListStore();
    const { showSnackbar } = useSnackbar();

    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('start');
    const [newPageName, setNewPageName] = useState('');

    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const [publishing, setPublishing] = useState(false);
    const [creating, setCreating] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleGenerateWebsite = async () => {
        if (publishing) return;
        setPublishing(true);
        const serializedPages = pages.map(page => ({
            id: page.id,
            name: page.name,
            content: serialize(page.content)
        }));

        try {
            await publishSite({ pages: serializedPages });
            showSnackbar('Site published successfully', 'success');
        } catch (error) {
            console.error('Error calling PublishSite:', error);
            showSnackbar('Failed to publish site', 'error');
        } finally {
            setPublishing(false);
        }
    };

    const handleCreatePage = async () => {
        if (creating) return;
        setCreating(true);
        const newPage = {
            id: '', // let the server generate
            name: newPageName || `New Page ${pages.length + 1}`,
            content: { type: "ROOT", props: { key: "root", children: presetElements }, parent: null },
            bindings: { css: '', bindings: [], default: { index: 0 } },
        };
        try {
            await addPage(newPage);
            showSnackbar('Page created', 'success');
        } catch (e) {
            showSnackbar('Failed to create page', 'error');
        }
        setOpen(false);
        setNewPageName('');
        setCreating(false);
    };

    const filteredPages = pages.filter(page => page.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleRenameOpen = (id: string, currentName: string) => {
        setRenamingPageId(id);
        setRenameValue(currentName);
        setRenameDialogOpen(true);
    };

    const handleRenameConfirm = async () => {
        if (renamingPageId && renameValue.trim()) {
            try {
                await renamePage(renamingPageId, renameValue.trim());
                showSnackbar('Page renamed', 'success');
            } catch (e) {
                showSnackbar('Failed to rename page', 'error');
            }
        }
        setRenameDialogOpen(false);
        setRenamingPageId(null);
        setRenameValue('');
    };

    const handleDelete = async (id: string) => {
        try {
            await removePage(id);
            showSnackbar('Page deleted', 'success');
        } catch (e) {
            showSnackbar('Failed to delete page', 'error');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Dashboard</Typography>

            {/* Page List */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Pages</Typography>
                <Button variant="contained" disabled={creating} onClick={() => setOpen(true)}>{creating ? 'Creating...' : 'Create New +'}</Button>
                <Button variant="contained" disabled={publishing} onClick={() => handleGenerateWebsite()}>{publishing ? 'Publishing...' : 'Publish'}</Button>
            </Box>
            <TextField label="Search Pages" fullWidth sx={{ mt: 2 }} value={searchQuery} onChange={handleSearchChange} />
            <List sx={{ mt: 2 }}>
                {filteredPages.map(page => (
                    <ListItem key={page.id} sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                        <Paper sx={{ width: '100%', p: 2, display: 'flex', border: 1, borderColor: 'divider', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">{page.name}</Typography>
                            <Box>
                                <Tooltip title="Edit" placement="top"><IconButton aria-label="edit" color="primary" onClick={() => { selectPage(page.id); navigate('/editor?page_id=' + page.id); }}><Edit /></IconButton></Tooltip>
                                <Tooltip title="Delete" placement="top"><IconButton aria-label="delete" color="secondary" onClick={() => handleDelete(page.id)}><Delete /></IconButton></Tooltip>
                                {/* Hide/disable Clone until implemented */}
                                {/* <Tooltip title="Clone" placement="top"><IconButton aria-label="clone" color="primary"><CloneIcon /></IconButton></Tooltip> */}
                                <Tooltip title="Rename" placement="top"><IconButton aria-label="rename" color="warning" onClick={() => handleRenameOpen(page.id, page.name)}>
                                    <DriveFileRenameOutline />
                                </IconButton></Tooltip>
                            </Box>
                        </Paper>
                    </ListItem>
                ))}
            </List>


            {/* Rename Dialog */}
            <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
                <DialogTitle>Rename Page</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Page Name"
                        fullWidth
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRenameConfirm} disabled={!renameValue.trim() || creating}>Rename</Button>
                </DialogActions>
            </Dialog>

            {/* Create Page Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogContent>
                    <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                        <FormControlLabel value="start" control={<Radio />} label="Start from Scratch" />
                        <FormControlLabel value="template" control={<Radio />} label="Use Template" />
                        <FormControlLabel value="ai" control={<Radio />} label="Build with AI" />
                    </RadioGroup>
                    {selectedOption === 'start' && (
                        <TextField
                            label="Page Name"
                            fullWidth
                            value={newPageName}
                            onChange={(e) => setNewPageName(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreatePage} disabled={creating}>{creating ? 'Creating...' : 'Confirm'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Dashboard;
