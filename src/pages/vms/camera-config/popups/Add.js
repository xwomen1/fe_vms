import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

const RolePopup = ({ open, onClose, response }) => {
  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Role</DialogTitle>
      <DialogContent>response{response}</DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RolePopup
