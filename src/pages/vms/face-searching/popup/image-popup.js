import React, { useState } from 'react';
import axios from 'axios';
import authConfig from 'src/configs/auth';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Dialog } from '@mui/material';
import Swal from 'sweetalert2';

const ImageForm = ({ onClose, onSave }) => {
  const [images, setImages] = useState([]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];

    for (const file of files) {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName);
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await axios.post(
          'https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/upload?isPublic=false&service=IAM',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const imageId = uploadResponse.data.id;

        const downloadResponse = await axios.get(
          `https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/download/${imageId}`,
          {
            responseType: 'arraybuffer',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const base64Image = Buffer.from(downloadResponse.data, 'binary').toString('base64');
        const imageDataUrl = `data:${downloadResponse.headers['content-type'].toLowerCase()};base64,${base64Image}`;
        newImages.push(imageDataUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        Swal.fire('Error', error?.response?.data?.message, 'error');
      }
    }

    setImages(newImages);
  };

  const handleSave = () => {
    if (images.length > 0) {
      onSave(images); // Pass the array of images back to the parent
      onClose(); // Close the popup
    } else {
      Swal.fire('Error', 'No images selected', 'error');
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <div style={{ backgroundColor: 'white', margin: 80 }}>
        <IconButton onClick={onClose}>{/* <CloseIcon /> */}</IconButton>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Image ${index + 1}`} style={{ height: '250px', width: '250px' }} />
              </div>
            ))
          ) : (
            <div
              style={{
                margin: 'auto',
                width: '300px',
                height: '300px',
                border: '1px dashed rgb(0, 0, 0)',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <input
                accept='image/jpeg,image/png'
                type='file'
                multiple
                onChange={handleFileChange} // Connect to the handler
                style={{ display: 'none' }}
              />
              <Button component='label'>
                Select Images
                <input type='file' multiple onChange={handleFileChange} style={{ display: 'none' }} />
              </Button>
            </div>
          )}
        </div>
        <Button onClick={handleSave} variant='contained' color='primary' style={{ marginTop: '16px' }}>
          Save Images
        </Button>
      </div>
    </Dialog>
  );
};

export default ImageForm;
