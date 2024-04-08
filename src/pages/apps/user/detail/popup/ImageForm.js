import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Popup } from 'devextreme-react/popup'
import authConfig from 'src/configs/auth'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import { color } from '@mui/system'

const ImageForm = ({ faceType, imageUrl, onClose }) => {
  const [imageData, setImageData] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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
    <div style={{ backgroundColor: 'white' }}>
      <Popup visible={true} onHiding={onClose} style={{ backgroundColor: 'white', color: 'black' }}>
        {/* Nội dung của Popup */}
        <div style={{ backgroundColor: 'white' }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            {imageData && (
              <div>
                <img src={imageData} alt='Ảnh' style={{ height: '50%', width: '50%' }} />
              </div>
            )}
          </div>
          {/* Container chứa các nút, đặt sang phải */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            {/* Nút Lưu */}
            <Button variant='contained' color='primary' onClick={handleSave} style={{ marginRight: '8px' }}>
              Lưu
            </Button>
            {/* Nút Đóng */}
            <Button variant='contained' color='secondary' onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default ImageForm
