import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Button, CircularProgress, Grid, IconButton, InputAdornment, DialogActions } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { makeStyles } from '@material-ui/core/styles'

const PassWord = ({ onClose, nvr }) => {
  const [passwordOld, setPasswordOld] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ipAddress, setIpAddress] = useState('')
  const [httpPort, setHttpPort] = useState('')
  const [username, setUserName] = useState('')

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  })

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

  const validatePasswords = () => {
    let isValid = true
    let errors = {}

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Password and confirm password do not match.'
      isValid = false
    } else {
      errors.confirmPassword = ''
    }

    setErrors(errors)

    return isValid
  }

  const saveChange = async () => {
    setLoading(true)

    if (!validatePasswords()) {
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
        `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/config/changepassword?idNVR=${nvr}`,
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
        text: 'Dữ liệu đã được cập nhật thành công.',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Có lỗi xảy ra.',
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    } finally {
      setLoading(false)
      onClose()
    }
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
          const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`, config)
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

  return (
    <div style={{ width: '100%' }} className={classes.loadingContainer}>
      {loading && <CircularProgress className={classes.circularProgress} />}

      <Grid container spacing={2} style={{ minWidth: 400 }}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={12}>
            <CustomTextField
              label='Old password '
              autoComplete='new-password' // Thay đổi giá trị thành 'new-password'
              form='off' // Thêm thuộc tính form với giá trị 'off'
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
              helperText={errors.password}
              error={Boolean(errors.password)}
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
              helperText={errors.confirmPassword}
              error={Boolean(errors.confirmPassword)}
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
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={saveChange} variant='contained'>
          Save
        </Button>
      </DialogActions>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  circularProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999
  },
  loadingContainer: {
    position: 'relative'
  }
}))

export default PassWord
