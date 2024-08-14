import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const InfraPopup = ({ open, id, onClose, onSuccess }) => {
  const router = useRouter()
  const [errorOccurred, setErrorOccurred] = useState(false) // Thêm trạng thái để xác định xem đã xảy ra lỗi hay không

  const handleDelete = () => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    if (!token) {
      return
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const urlDelete = `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${id}`

    axios
      .delete(urlDelete, config)
      .then(() => {
        onClose()
        Swal.fire({
          title: 'Success!',
          text: 'Data was deleted successfully.',
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
      })
      .catch(error => {
        setErrorOccurred(true) // Đặt trạng thái lỗi thành true khi xảy ra lỗi
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
      })
  }

  // Sử dụng useEffect để đóng popup khi đã xảy ra lỗi
  useEffect(() => {
    if (errorOccurred) {
      onClose()
    }
  }, [errorOccurred, onClose])

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle style={{ fontSize: '24px', fontWeight: 'bold' }}>Confirm</DialogTitle>
      <DialogContent>Are you sure you want to delete ?</DialogContent>
      <DialogActions style={{ display: 'flex' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default InfraPopup
