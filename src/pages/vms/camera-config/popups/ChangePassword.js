import React, { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Button,
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

const PassWord = ({ onClose, camera }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) //Thêm state cho việc hiển thị mật khẩu
  const [loading, setLoading] = useState(false)

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
          password: password
        },
        config
      )
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
      setLoading(false)
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đổi mật khẩu</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{ minWidth: 500 }}>
          <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
            <Grid item xs={12}>
              <CustomTextField
                label='Mật khẩu'
                type={showPassword ? 'text' : 'password'}
                onChange={handlePasswordChange}
                fullWidth
                InputProps={{
                  //Thêm InputProps để thêm IconButton
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
                  //Thêm InputProps để thêm IconButton
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={saveChange}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default PassWord
