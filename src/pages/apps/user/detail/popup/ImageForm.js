import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Popup } from 'devextreme-react/popup'
import authConfig from 'src/configs/auth'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import { color } from '@mui/system'
import { Dialog } from '@mui/material'
import { Input } from '@mui/icons-material'

const ImageForm = ({ faceType, imageUrl, onClose, userId }) => {
  const [imageData, setImageData] = useState(null)
  const [imageNew, setImageDataNew] = useState(null)

  const handleFileChange = async event => {
    const file = event.target.files[0]
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await axios.post(
        'https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/upload?isPublic=false&service=IAM',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const imageId = uploadResponse.data.data.id

      const downloadResponse = await axios.get(
        `https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/download/${imageId}`,
        {
          responseType: 'arraybuffer',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const base64Image = Buffer.from(downloadResponse.data, 'binary').toString('base64')
      const imageDataUrl = `data:${downloadResponse.headers['content-type'].toLowerCase()};base64,${base64Image}`
      setImageDataNew(imageDataUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const base64Image = Buffer.from(response.data, 'binary').toString('base64')
        const imageDataUrl = `data:${response.headers['content-type'].toLowerCase()};base64,${base64Image}`

        setImageData(imageDataUrl)
      } catch (error) {
        console.error('Error fetching image:', error)
      }
    }

    fetchImage()
  }, [imageUrl])

  const handleSave = () => {
    // Thực hiện hành động lưu ở đây
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <div style={{ backgroundColor: 'white', margin: 80 }}>
        <div style={{ backgroundColor: 'white' }}>
          <IconButton onClick={onClose}>{/* <CloseIcon /> */}</IconButton>
          <div>faceType: {faceType}</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            {imageData && imageNew == null && faceType != null && (
              <div>
                <img src={imageData} alt='Ảnh' style={{ height: '50%', width: '50%' }} />
              </div>
            )}
            {imageData && imageNew !== null && faceType != null && (
              <div style={{ marginRight: 50 }}>
                <img src={imageData} alt='Ảnh' style={{ height: '100%', width: '100%' }} />
              </div>
            )}
            {imageNew && (
              <div>
                <img src={imageNew} alt='Ảnh' style={{ height: '50%', width: '50%' }} />
                <Button component='label'>
                  Đổi ảnh
                  <input type='file' onChange={handleFileChange} style={{ display: 'none' }} />
                </Button>
              </div>
            )}
            {imageNew == null && (
              <div
                style={{
                  margin: 'auto',
                  width: '300px',
                  height: '200px',
                  border: '1px dashed rgb(0, 0, 0)',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <input
                  accept='image/jpeg,image/png'
                  type='file'
                  onChange={handleFileChange} // Kết nối với hàm xử lý
                  style={{ display: 'none' }}
                />
                <Button component='label'>
                  Chọn ảnh
                  <input type='file' onChange={handleFileChange} style={{ display: 'none' }} />
                </Button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '60px' }}>
            <Button variant='contained' color='secondary' onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ImageForm
