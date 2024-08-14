import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import CustomTextField from 'src/@core/components/mui/text-field'

const InfraPopupAdd = ({ open, onClose, onSuccess, id }) => {
  const [adults, setAdults] = useState([])
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [type, setType] = useState('')
  const [nameError, setNameError] = useState('')
  const [noteError, setNoteError] = useState('')
  const [typeError, setTypeError] = useState('')

  const fetchDataAdults = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          type: 'adults',
          sort: '+created_at',
          page: 1
        }
      }
      const response = await axios.get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions', config)

      setAdults(response.data.length > 0 ? response.data[0].id : '')

      return response.data
    } catch (error) {
      console.error('Error fetching adult data:', error)

      return []
    }
  }

  const Add = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const data = {
        detail: note,
        isParent: true,
        name: name,
        parentID: id,
        code: type
      }
      const response = await axios.post('https://sbs.basesystem.one/ivis/infrares/api/v0/regions', data, config)
      console.log(data)
      Swal.fire({
        title: 'Thành công!',
        text: 'Dữ liệu đã được thêm thành công.',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      onClose()

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      onClose()

      console.error('Error adding infra:', error)
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

  useEffect(() => {
    fetchDataAdults()
  }, [])

  const validateInputs = () => {
    let isValid = true

    if (name.trim() === '') {
      setNameError('Tên không được để trống')
      isValid = false
    } else {
      setNameError('')
    }

    if (note.trim() === '') {
      setNoteError('Ghi chú không được để trống')
      isValid = false
    } else {
      setNoteError('')
    }

    if (type.trim() === '') {
      setTypeError('Code cannot be blank')
      isValid = false
    } else {
      setTypeError('')
    }

    return isValid
  }

  const handleAdd = () => {
    if (validateInputs()) {
      Add()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle style={{ fontSize: '24px', fontWeight: 'bold' }}>Thêm cơ cấu tổ chức</DialogTitle>
      <DialogContent>
        <CustomTextField
          label='Tên'
          type='text'
          fullWidth
          style={{ marginBottom: '16px' }}
          value={name}
          onChange={e => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
        />
        <CustomTextField
          label='Mã định danh'
          type='text'
          fullWidth
          style={{ marginBottom: '16px' }}
          value={type}
          onChange={e => setType(e.target.value)}
          error={!!typeError}
          helperText={typeError}
        />
        <CustomTextField
          label='Ghi chú'
          type='text'
          fullWidth
          style={{ marginBottom: '16px' }}
          value={note}
          onChange={e => setNote(e.target.value)}
          error={!!noteError}
          helperText={noteError}
        />
      </DialogContent>
      <DialogActions style={{ display: 'flex' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default InfraPopupAdd
