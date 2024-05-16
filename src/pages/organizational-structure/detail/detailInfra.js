import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import CustomTextField from 'src/@core/components/mui/text-field'

const InfraPopupDetail = ({ open, id, onClose, onSuccess }) => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [nameError, setNameError] = useState('')
  const [codeError, setCodeError] = useState('')

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${id}`, config)
        setName(response.data.name)
        setCode(response.data.code)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    if (id) {
      fetchFiltered()
    }
  }, [id])

  const update = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const payload = {
        name: name,
        code: code
      }

      await axios.put(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${id}`,
        payload,
        config
      )
      Swal.fire('Sửa thành công', '', 'success')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating', error)
    }
  }

  const validateInputs = () => {
    let isValid = true

    if (name.trim() === '') {
      setNameError('Tên địa phương không được để trống')
      isValid = false
    } else {
      setNameError('')
    }

    if (code.trim() === '') {
      setCodeError('Mã địa phương không được để trống')
      isValid = false
    } else {
      setCodeError('')
    }

    return isValid
  }

  const handleUpdate = () => {
    if (validateInputs()) {
      update()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl' style={{ maxWidth: '50%', margin: 'auto' }}>
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Cập nhật thông tin địa phương</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <CustomTextField
              label='Tên địa phương'
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              error={Boolean(nameError)}
              helperText={nameError}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Mã địa phương'
              value={code}
              onChange={e => setCode(e.target.value)}
              fullWidth
              error={Boolean(codeError)}
              helperText={codeError}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleUpdate}>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InfraPopupDetail
