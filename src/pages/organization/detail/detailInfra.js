import React, { useState, useEffect } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import CustomTextField from 'src/@core/components/mui/text-field'

const InfraPopupDetail = ({ open, id, onClose, onSuccess }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [detail, setDetail] = useState('')
  const [nameError, setNameError] = useState('')
  const [typeError, setTypeError] = useState('')
  const [detailError, setDetailError] = useState('')
  console.log(onClose)
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
        setName(response.data.name || '')
        setType(response.data.code || '')
        setDetail(response.data.detail || '')
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
        code: type,
        detail: detail
      }

      await axios.put(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${id}`, payload, config)
      Swal.fire({
        title: 'Success!',
        text: 'The data has been updated successfully.',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating', error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    }
  }

  const validateInputs = () => {
    let isValid = true

    if (name.trim() === '') {
      setNameError('Local name cannot be left blank')
      isValid = false
    } else {
      setNameError('')
    }

    if (detail.trim() === '') {
      setDetailError('Local note cannot be left blank')
      isValid = false
    } else {
      setDetailError('')
    }

    if (type.trim() === '') {
      setTypeError('Local code cannot be left blank')
      isValid = false
    } else {
      setTypeError('')
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
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Update information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <CustomTextField
              label='Tên'
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              error={Boolean(nameError)}
              helperText={nameError}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Mã'
              value={type}
              onChange={e => setType(e.target.value)}
              fullWidth
              error={Boolean(typeError)}
              helperText={typeError}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              label='Ghi chú'
              value={detail}
              onChange={e => setDetail(e.target.value)}
              fullWidth
              error={Boolean(detailError)}
              helperText={detailError}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default InfraPopupDetail
