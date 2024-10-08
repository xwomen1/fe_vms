import React, { useState, useEffect, forwardRef } from 'react'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Grid, Typography, styled, Fade } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Webcam from 'react-webcam' // Import thư viện react-webcam

import { useDropzone } from 'react-dropzone'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const AddImageGuest = ({ show, onClose, callback, setReload }) => {
  const [data, setData] = useState({})
  const [image, setImage] = useState(null)
  const [webcamImage, setWebcamImage] = useState(null)
  const { control, handleSubmit } = useForm()
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const [formValues, setFormValues] = useState({
    fullName: '',
    identityNumber: '',
    phoneNumber: ''
  })

  useEffect(() => {
    if (callback) {
      fetchDataList()
    }
  }, [callback])

  const fetchDataList = async () => {
    if (!callback) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/guests/${callback}`, config)
      const data = response.data
      setFormValues({
        fullName: data.fullName,
        identityNumber: data.identityNumber,
        phoneNumber: data.phoneNumber
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    }
  }

  const handleCapture = webcamRef => {
    const imageSrc = webcamRef.current.getScreenshot()
    setWebcamImage(imageSrc)
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]
      setWebcamImage(null)
      setImage(URL.createObjectURL(file))
    }
  })

  const onSubmit = async formData => {
    try {
      const formDataToSend = new FormData()

      if (webcamImage) {
        const response = await fetch(webcamImage)
        const blob = await response.blob()
        formDataToSend.append('file', blob, 'webcam-image.jpg')
      } else if (image) {
        const response = await fetch(image)
        const blob = await response.blob()
        formDataToSend.append('file', blob, 'uploaded-image.jpg')
      }

      formDataToSend.append('isPublic', 'true')
      formDataToSend.append('service', 'GUEST_REGISTRATION')

      const uploadResponse = await axios.post(
        'https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/upload',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      const imageId = uploadResponse.data.id

      const updateData = {
        documentFileId: imageId,
        fullName: formData.fullName || formValues.fullName,
        isUpdateIdentity: false,
        phoneNumber: formValues.phoneNumber
      }

      await axios.put(`https://dev-ivi.basesystem.one/smc/iam/api/v0/guests/${callback}/update`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success('Customer information updated successfully!')
      onClose()
      setReload()
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred while uploading or updating customer information.', error.message)
    }
  }

  const webcamRef = React.useRef(null)

  return (
    <Dialog
      open={show}
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <CustomCloseButton onClick={onClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>

        <Typography variant='h6' sx={{ mb: 4 }}>
          Document photo
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='identityNumber'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={formValues.identityNumber}
                    fullWidth
                    label='Document number.'
                    placeholder='Enter document number'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='fullName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={formValues.fullName}
                    fullWidth
                    label='Customer name.'
                    placeholder='Enter customer name'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  border: '1px dashed #ccc',
                  height: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Webcam audio={false} ref={webcamRef} screenshotFormat='image/jpeg' width='100%' height='100%' />
              </Box>
              <Button variant='contained' onClick={() => handleCapture(webcamRef)} fullWidth sx={{ mt: 2 }}>
                Capture image from webcam
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '1px solid #ccc',
                  height: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                <input {...getInputProps()} />
                {webcamImage || image ? (
                  <img src={webcamImage || image} alt='Selected' style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : (
                  <Typography>Select or drag and drop a file here.</Typography>
                )}
              </Box>
              <Button
                variant='contained'
                onClick={() => {
                  setWebcamImage(null)
                  setImage(null)
                }}
                fullWidth
                sx={{ mt: 2 }}
              >
                Delete Image
              </Button>
            </Grid>
          </Grid>

          <DialogActions sx={{ mt: 4 }}>
            <Button onClick={onClose} color='error'>
              Cancel
            </Button>
            <Button type='submit' variant='contained'>
              Edit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddImageGuest
