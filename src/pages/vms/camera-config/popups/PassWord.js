import React, { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Button, Grid } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'

const PassWord = ({ onClose, camera }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
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
    <div style={{ width: '100%' }}>
      <Grid container spacing={2} style={{ minWidth: 500 }}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={12}>
            <CustomTextField label='Mật khẩu' type='password' onChange={handlePasswordChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              label='Xác nhận mật khẩu'
              type='password'
              onChange={handleConfirmPasswordChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={saveChange}>OK</Button>
    </div>
  )
}

export default PassWord
