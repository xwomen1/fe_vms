import React, { forwardRef, useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Button, CircularProgress, Dialog, DialogActions, Grid, IconButton, InputAdornment } from '@mui/material'
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

  const saveChange = async () => {
    setLoading(true)
    if (password !== confirmPassword) {
      Swal.fire('Lỗi!', 'Mật khẩu và xác nhận mật khẩu không khớp nhau.', 'error')
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
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('Error!', error.response?.data?.message, 'error')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div style={{ width: '100%' }} className={classes.loadingContainer}>
      <Grid container spacing={2} style={{ minWidth: 500 }} className={classes.loadingContainer}></Grid>
      {loading && <CircularProgress className={classes.circularProgress} />}

      {/* Reduced minHeight here */}
      <Grid container spacing={2} style={{ minWidth: 400 }}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={12}>
            <CustomTextField
              label='Mật khẩu cũ'
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
              label='Mật khẩu mới'
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
              label='Xác nhận mật khẩu'
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
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button onClick={saveChange} variant='contained'>
          Lưu
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
  }
}))

export default PassWord
