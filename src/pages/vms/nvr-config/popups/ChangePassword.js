import React, { forwardRef, useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { makeStyles } from '@material-ui/core/styles'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'

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

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const PassWord = ({ onClose, nvr }) => {
  const [passwordOld, setPasswordOld] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ipAddress, setIpAddress] = useState('')
  const [httpPort, setHttpPort] = useState('')
  const [username, setUserName] = useState('')
  const classes = useStyles()

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handlePasswordOldChange = event => {
    setPasswordOld(event.target.value)
  }

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (nvr != null) {
          const token = localStorage.getItem(authConfig.storageTokenKeyName)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
          const response = await axios.get(`https://votv.ivms.vn/votv/vms/api/v0/nvrs/${nvr}`, config)
          setIpAddress(response.data.ipAddress)
          setHttpPort(response.data.httpPort)
          setUserName(response.data.username)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [nvr])

  const saveChange = async () => {
    setLoading(true)
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Password and confirm password do not match.',
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })
      setLoading(false)

      return
    }

    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      await axios.put(
        `https://votv.ivms.vn/votv/vms/api/v0/nvrs/config/changepassword?idNVR=${nvr}`,
        {
          passwordNew: password,
          username: username,
          httpPort: httpPort,
          ipAddress: ipAddress,
          passwordOld: passwordOld
        },
        config
      )
      Swal.fire({
        title: 'Successfully!',
        text: 'Data has been updated successfully.',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Dialog
      open={Boolean(nvr)}
      onClose={onClose}
      fullWidth
      maxWidth='sm' // Changed to 'sm' for smaller width
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible', minHeight: '10vh', position: 'relative' } }} // Reduced minHeight here
    >
      {loading && <CircularProgress className={classes.circularProgress} />}
      <DialogTitle>Change password </DialogTitle>
      <CustomCloseButton onClick={onClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      <DialogContent sx={{ minHeight: '10vh' }}>
        {' '}
        {/* Reduced minHeight here */}
        <Grid container spacing={2} style={{ minWidth: 400 }}>
          <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
            <Grid item xs={12}>
              <CustomTextField
                autoComplete='new-password' // Thay đổi giá trị thành 'new-password'
                form='off' // Thêm thuộc tính form với giá trị 'off'
                label='Old password '
                type={showPassword ? 'text' : 'password'}
                onChange={handlePasswordOldChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={toggleShowPassword} edge='end'>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='New password '
                type={showPassword ? 'text' : 'password'}
                onChange={handlePasswordChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={toggleShowPassword} edge='end'>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='Confirm password '
                type={showPassword ? 'text' : 'password'}
                onChange={handleConfirmPasswordChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={toggleShowPassword} edge='end'>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          Cancel
        </Button>
        <Button onClick={saveChange} variant='contained'>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(() => ({
  circularProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999
  }
}))

export default PassWord
