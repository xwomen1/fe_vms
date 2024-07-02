import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import CustomTextField from 'src/@core/components/mui/text-field'

const RolePopup = ({ open, onClose, onSelect, nvr }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
  }

  const handleCancel = () => {
    onClose()
  }

  const saveChanges = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Mật khẩu và xác nhận mật khẩu không khớp nhau.',
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })
      onClose()

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
        `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/config/changepassword?idNVR=${nvr}`,
        {
          password: password
        },
        config
      )
      Swal.fire({
        title: 'Thành công!',
        text: 'Dữ liệu đã được cập nhật thành công.',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })
      onClose()
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
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đổi mật khẩu</DialogTitle>
      <DialogContent>
        <Grid item xs={4}>
          <CustomTextField label='Mật khẩu' type='password' onChange={handlePasswordChange} fullWidth />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField label='Xác nhận mật khẩu' type='password' onChange={handleConfirmPasswordChange} fullWidth />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={saveChanges}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RolePopup
