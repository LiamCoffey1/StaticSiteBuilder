import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, MenuItem, Modal, Paper, Select, SelectChangeEvent, Grid2 } from '@mui/material';
import { JsonElement } from '../../types';
import { listImages, uploadImage } from '../../../api/images';

interface ImageEditorProps {
    element: JsonElement;
    onUpdateElement: (updatedElement: JsonElement) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ element, onUpdateElement }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(element.props?.attributes?.src || '');
    const [imageList, setImageList] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const images = await listImages();
                setImageList(images);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        fetchImages();
    }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const url = await uploadImage(e.target.files[0]);
                setImageUrl(url);
                updateElementSrc(url);
                const images = await listImages();
                setImageList(images);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleImageSelection = (event: SelectChangeEvent<string>) => {
        const selectedUrl = event.target.value as string;
        setSelectedImage(selectedUrl);
        setImageUrl(selectedUrl);
        updateElementSrc(selectedUrl);
    };

    const updateElementSrc = (src: string) => {
        const updatedElement = {
            ...element,
            props: {
                ...element.props,
                attributes: {
                    ...element.props.attributes,
                    src,
                },
            },
        };
        onUpdateElement(updatedElement);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            {imageUrl && (
                <Box
                    component="img"
                    src={imageUrl}
                    alt="Preview"
                    sx={{ width: '100%', height: 'auto', marginBottom: 2 }}
                />
            )}
            <Button variant="contained" onClick={toggleModal} sx={{ marginTop: 2 }}>
                Edit Image
            </Button>
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
                        {imageList.map((image) => (
                            <MenuItem key={image} value={image}>
                                {image}
                            </MenuItem>
                        ))}
                    </Select>
                    <Grid2 container spacing={2}>
                        {imageList.map((image) => (
                            <Grid2 xs={4} key={image}>
                                <Box
                                    component="img"
                                    src={image}
                                    alt={image}
                                    sx={{
                                        width: '100%',
                                        height: '100px',
                                        objectFit: 'contain',
                                        cursor: 'pointer',
                                        border: selectedImage === image ? '2px solid #1976d2' : 'none',
                                    }}
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setImageUrl(image);
                                        updateElementSrc(image);
                                    }}
                                />
                            </Grid2>
                        ))}
                    </Grid2>
                    <Typography variant="subtitle1" marginBottom={2}>
                        Or upload a new image:
                    </Typography>
                    <Button variant="contained" component="label">
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </Button>
                </Paper>
            </Modal>
        </>
    );
};

export default ImageEditor;