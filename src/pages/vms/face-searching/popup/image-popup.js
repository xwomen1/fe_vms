import React, { useState } from 'react';
import axios from 'axios';
import authConfig from 'src/configs/auth';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  loadingContainer: {
    position: 'relative',
    minHeight: '100px',
    zIndex: 0,
  },
  circularProgress: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999,
  },
}));

const ImageForm = ({ onClose, onSave }) => {
  const [images, setImages] = useState([]);
  const [imagesSelect, setImagesSelect] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const classes = useStyles()

  const handleFileChange = async (event) => {
    let files = Array.from(event.target.files);

    if (files.length > 5) {
      Swal.fire('Error', 'You can only select up to 5 images', 'error');
      onClose();
      
return;
    }

    const newImages = [];
    const newImagesSelect = [];
    setLoading(true);
    for (const file of files) {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName);
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await axios.post(
          'https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/upload?isPublic=false&service=CMS',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const imageId = uploadResponse.data.id;
        newImagesSelect.push(uploadResponse.data);

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
    setImagesSelect(newImagesSelect);
    setLoading(false); 
  };

  const handleSave = () => {
    if (images.length > 0) {
      onSave(imagesSelect);
      onClose();
      console.log(imagesSelect, 'logsaveimage');
    } else {
      onClose()
      Swal.fire('Error', 'No images selected', 'error');
    }
  };

  const handleChangeImages = () => {
    setImages([]);
    setImagesSelect([]);
  };

  return (
    <Dialog open={true} onClose={onClose} disableBackdropClick={loading}>
      <IconButton
          onClick={onClose}
          style={{ position: 'absolute', top: '8px', right: '8px' }}
        >
          <CloseIcon />
        </IconButton>
      <div style={{ backgroundColor: 'white', margin: 80, position: 'relative', padding: '16px' }}>
      <div className={classes.loadingContainer}>

      {loading && <CircularProgress className={classes.circularProgress} />}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' }}>
          
          {images.length > 0 ? (
            <>
              {/* Hiển thị 3 ảnh đầu tiên trên một dòng */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    style={{ height: '100px', width: '100px' }}
                  />
                ))}
              </div>

              {/* Hiển thị 2 ảnh cuối cùng trên một dòng mới, nếu có */}
              {images.length > 3 && (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
                  {images.slice(3, 5).map((image, index) => (
                    <img
                      key={3 + index}
                      src={image}
                      alt={`Image ${3 + index + 1}`}
                      style={{ height: '100px', width: '100px' }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                margin: 'auto',
                width: '300px',
                height: '300px',
                border: '1px dashed rgb(0, 0, 0)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <input
                accept="image/jpeg,image/png"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button component="label">
                Select Images (max 5)
                <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
              </Button>
            </div>
          )}
        </div>
</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button style={{marginRight: 10}} onClick={handleSave} variant="contained" color="primary">
            Save Images
          </Button>
          <Button style={{marginRight: 10}} onClick={handleChangeImages} variant="contained" color="primary">
            Change Images
          </Button>
          <Button onClick={onClose} variant="contained" color="primary">
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ImageForm;
