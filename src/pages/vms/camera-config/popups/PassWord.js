import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material' //Thêm InputAdornment
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { makeStyles } from '@material-ui/core/styles'

const PassWord = ({ onClose, camera }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) //Thêm state cho việc hiển thị mật khẩu
  const [loading, setLoading] = useState(false)
  const [ipAddress, setIpAddress] = useState('')
  const [httpPort, setHttpPort] = useState('')
  const [username, setUserName] = useState('')
  const classes = useStyles()
  const [passwordOld, setPasswordOld] = useState('')

  const handlePasswordOldChange = event => {
    setPasswordOld(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
  }

  const toggleShowPassword = () => {
    //Hàm xử lý hiển thị mật khẩu
    setShowPassword(!showPassword)
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (camera != null) {
          // Kiểm tra xem popup Network đã mở chưa
          const token = localStorage.getItem(authConfig.storageTokenKeyName)
          console.log('token', token)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${camera}`, config)
          setIpAddress(response.data.ipAddress)
          setHttpPort(response.data.httpPort)
          setUserName(response.data.username)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [camera])

  const saveChange = async () => {
    setLoading(true)
    onClose()
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

      const response = await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/changepassword?idCamera=${camera}`,
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
      setLoading(false)
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire(error.message, error.response?.data?.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }} className={classes.loadingContainer}>
      <Grid container spacing={2} style={{ minWidth: 500 }} className={classes.loadingContainer}>
        {loading && <CircularProgress className={classes.circularProgress} />}

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
  loadingContainer: {
    position: 'relative',
    minHeight: '100px',
    zIndex: 0
  },
  circularProgress: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999
  }
}))

export default PassWord
