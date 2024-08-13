import { Paper } from '@material-ui/core'
import { Button, CircularProgress, Grid, IconButton, InputAdornment, Box } from '@mui/material'

import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Swal from 'sweetalert2'
import axios from 'axios'

const UserList = ({ apiData }) => {
  const [name, setName] = useState(null)
  const [passwordOld, setPasswordOld] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1)
  }

  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2)
  }

  const handleNameChange = event => {
    setName(event.target.value)
  }

  const username = localStorage.getItem(authConfig.username)

  const saveChange = async () => {
    setLoading(true)
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
        `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/update-password`,
        {
          newPassword: password,
          token: token,
          curPassword: passwordOld
        },
        config
      )
      Swal.fire({
        title: 'Thành công!',
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
    }
  }

  return (
    <Grid container spacing={2} component={Paper}>
      <Grid item xs={6}>
        <CustomTextField label='Tên người dùng' value={username || ''} onChange={handleNameChange} fullWidth />
      </Grid>
      <Grid item xs={6}>
        <CustomTextField
          InputLabelProps={{
            shrink: true
          }}
          autoComplete='old-password'
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
      <Grid item xs={6}>
        <CustomTextField
          InputLabelProps={{
            shrink: true
          }}
          label='Mật khẩu mới'
          autoComplete='new-password'
          type={showPassword1 ? 'text' : 'password'}
          onChange={handlePasswordChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={toggleShowPassword1} edge='end'>
                  {showPassword1 ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <CustomTextField
          label='Xác nhận mật khẩu'
          autoComplete='off'
          type={showPassword2 ? 'text' : 'password'}
          onChange={handleConfirmPasswordChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={toggleShowPassword2} edge='end'>
                  {showPassword2 ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button variant='contained' color='primary' onClick={saveChange} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Đổi mật khẩu'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default UserList
