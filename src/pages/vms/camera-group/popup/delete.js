import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import { router } from 'websocket'
import { useRouter } from 'next/router'

const CameraPopup = ({ open, id, onClose, onSuccess }) => {
  const router = useRouter()

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
    const urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups/${id}`

    axios
      .delete(urlDelete, config)
      .then(() => {
        onClose()
        Swal.fire({
          title: 'Success!',
          text: 'Deleted successfully',
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle style={{ fontSize: '24px', fontWeight: 'bold' }}>Accept</DialogTitle>
      <DialogContent>Do you want to delete it?</DialogContent>
      <DialogActions style={{ display: 'flex' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CameraPopup
