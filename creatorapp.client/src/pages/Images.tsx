import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia, Modal, Paper, IconButton, Select, MenuItem, Menu } from '@mui/material';
import { AddPhotoAlternate, MoreVert } from '@mui/icons-material';
import { useSnackbar } from '../context/SnackbarContext';
import { listImages, uploadImage } from '../api/images';

function Images() {
    const { showSnackbar } = useSnackbar();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imageList, setImageList] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');

    // Fetch existing images from the server
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const images = await listImages();
                setImageList(images);
            } catch (error) {
                console.error('Error fetching images:', error);
                showSnackbar('Failed to load images', 'error');
            }
        };

        fetchImages();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const uploadedUrl = await uploadImage(file);
                setImageList((prev) => [...prev, uploadedUrl]);
                setImageUrl(uploadedUrl);
                showSnackbar('Image uploaded', 'success');
            } catch (error) {
                console.error('Error uploading image:', error);
                showSnackbar('Failed to upload image', 'error');
            }
        }
    };

    const handleImageSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedUrl = event.target.value as string;
        setSelectedImage(selectedUrl);
        setImageUrl(selectedUrl);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuAction = () => {
        // Handle menu item actions here
        setAnchorEl(null); // Close menu after action
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Page Title and Description */}
            <Box sx={{ display: 'flex', marginBottom: 4, justifyContent: 'space-between' }}>
                <Box>
                    <Typography sx={{ marginBottom: 2 }} variant="h4" gutterBottom>
                        Images
                    </Typography>
                    <Typography sx={{ paddingBottom: 1 }} variant="subtitle1" gutterBottom>
                        Manage your website images here. You can upload, view, and organize your images.
                    </Typography>
                </Box>
            </Box>

            {/* Image Cards List */}
            <Grid container spacing={3} justifyContent="flex-start" wrap="wrap">
                {/* Add Image Button */}
                <Grid item xs={2} sm={2} md={2}>
                    <Card sx={{ display: 'flex', height: '100%', border: 1, borderColor: 'divider',  justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: 'background.paper' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '5px' }}>
                            <AddPhotoAlternate sx={{ fontSize: 40 }} />
                            <Typography variant="h6" component="div">
                                Add Image
                            </Typography>
                            <Button variant="contained" component="label">
                                Upload
                                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Image Cards */}
                {imageList.map((image, index) => (
                    <Grid item xs={2} sm={2} md={2} key={index}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', border: 1, borderColor: 'divider', }}>
                            <CardMedia
                                component="img"
                                height="100"
                                image={image}
                                alt={`Image ${index + 1}`}
                                sx={{ objectFit: 'contain', height: '200px' }}
                            />

                            <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" component="div">
                                    Image {index + 1}
                                </Typography>
                                <IconButton
                                    edge="end"
                                    aria-label="more"
                                    onClick={(event) => setAnchorEl(event.currentTarget)} // Open menu on click
                                    sx={{ padding: 0 }}
                                >
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)} // Close menu on click outside
                                >
                                    <MenuItem onClick={handleMenuAction}>Option 1</MenuItem>
                                    <MenuItem onClick={handleMenuAction}>Option 2</MenuItem>
                                    <MenuItem onClick={handleMenuAction}>Option 3</MenuItem>
                                </Menu>
                            </CardContent>

                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Modal for Image Preview and Selection */}
            <Modal open={isModalOpen} onClose={toggleModal}>
                <Paper
                    elevation={3}
                    sx={{
                        width: '80%',
                        maxHeight: '90vh',
                        margin: '5vh auto',
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        boxShadow: 24,
                        overflow: 'auto',
                        padding: 4,
                        outline: 'none',
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" marginBottom={2}>
                        Image Editor
                    </Typography>
                    {imageUrl && (
                        <Box
                            component="img"
                            src={imageUrl}
                            alt="Preview"
                            sx={{ width: '100px', height: 'auto', marginBottom: 2 }}
                        />
                    )}
                    <Typography variant="subtitle1" marginBottom={2}>
                        Select from existing images:
                    </Typography>
                    <Select
                        value={selectedImage}
                        onChange={handleImageSelection}
                        fullWidth
                        displayEmpty
                        sx={{ marginBottom: 2 }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {imageList.map((image, index) => (
                            <MenuItem key={index} value={image}>
                                {image}
                            </MenuItem>
                        ))}
                    </Select>
                </Paper>
            </Modal>
        </Box>
    );
}

export default Images;
