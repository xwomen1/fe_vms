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
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const ImageForm = ({ faceType, imageUrl, onClose, userId, accessCode, fetchUserData }) => {
  const [imageData, setImageData] = useState(null)
  const [imageNew, setImageDataNew] = useState(null)
  const [imageId, setImageId] = useState(null)

  const [showPopup, setShowPopup] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

      const imageId = uploadResponse.data.id
      setImageId(imageId)

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
      Swal.fire('Đã xảy ra lỗi', error?.response?.data?.message, 'error')
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
        setLoading(true)

        setImageData(imageDataUrl)
        setShowPopup(true)
      } catch (error) {
        console.error('Error fetching image:', error)
        setShowPopup(false)
        setLoading(false)
      }
    }

    fetchImage()
  }, [imageUrl])

  const handleSave = async () => {
    try {
      setLoading(true) // Bắt đầu loading khi gửi request
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      // Chuẩn bị data để gửi đi
      const requestData1 = {
        faceFeatures: [
          {
            faceType: faceType, // Sử dụng biến faceType được truyền vào từ props
            imageFileId: imageId
          }
        ],
        updateType: 'ADD',
        userId: userId // Sử dụng biến userId được truyền vào từ props
      }

      // Gửi request API
      const response1 = await axios.post(
        'https://dev-ivi.basesystem.one/smc/iam/api/v0/mi-se/user-faces',
        requestData1,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('API Response:', response1.data)
      if (imageUrl == '/images/user.jpg') {
        try {
          const requestData2 = {
            accessCode: accessCode, // Sử dụng biến accessCode được truyền vào từ props
            faces: [
              {
                faceType: faceType, // Sử dụng biến faceType từ props
                featureType: 'ACCESS',
                imageFileId: imageId // Sử dụng id của ảnh từ phản hồi API đầu tiên
              }
            ],
            updateType: 'ADD'
          }

          const response2 = await axios.post(
            'https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-faces/detect-face',
            requestData2,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
          console.log('API Response 2:', response2.data)
          fetchUserData()

          Swal.fire('Thêm thành công', '', 'success')
        } catch (error) {
          Swal.fire('Đã xảy ra lỗi', error.response.data.message, 'error')

          console.error('Error saving data:', error)
        } finally {
          setLoading(false) // Dừng loading sau khi hoàn thành request
        }
      } else {
        try {
          const url = `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-faces/update/face?faceType=${faceType}&imageId=${imageId}&userId=${userId}`

          const response2 = await axios.post(
            url,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
          Swal.fire('Sửa thành công', '', 'success')
          fetchUserData() // Gọi lại hàm fetchUserData

          onClose()
        } catch (error) {
          Swal.fire('Đã xảy ra lỗi', error.response.data.message, 'error')
          onClose()

          console.error('Error saving data:', error)
        } finally {
          setLoading(false) // Dừng loading sau khi hoàn thành request
        }
      }

      // Đóng dialog sau khi lưu thành công
      onClose()
    } catch (error) {
      Swal.fire('Đã xảy ra lỗi', error.response.data.message, 'error')
      onClose()

      console.error('Error saving data:', error)
    } finally {
      setLoading(false) // Dừng loading sau khi hoàn thành request
    }
  }
  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <Dialog open={true} onClose={onClose}>
      <div style={{ backgroundColor: 'white', margin: 80 }}>
        <div style={{ backgroundColor: 'white' }}>
          <IconButton onClick={onClose}>{/* <CloseIcon /> */}</IconButton>
          <div>faceType: {faceType}</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            {imageData && imageNew == null && imageUrl != '/images/user.jpg' && (
              <div>
                <img src={imageData} alt='Ảnh' style={{ height: '50%', width: '50%' }} />
              </div>
            )}
            {imageData && imageNew !== null && !loading && (
              <div style={{ marginRight: 50 }}>
                <img src={imageData} alt='Ảnh' style={{ height: '200px', width: '200px' }} />
              </div>
            )}
            {imageNew && (
              <div>
                <img src={imageNew} alt='Ảnh' style={{ height: '200px', width: '200px' }} />
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
                  height: '300px',
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
            <div style={{ width: 20 }}></div>

            <Button variant='contained' color='primary' onClick={handleSave}>
              Lưu
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ImageForm
