import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon' // Make sure this path is correct

const CustomDialog = ({ open, handleClose, title, message, isSuccess, onClose }) => {
  const handleDialogClose = () => {
    if (onClose) onClose()
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle style={{ fontSize: '2rem', textAlign: 'center', position: 'relative' }}>
        {title}
        <IconButton onClick={handleDialogClose} style={{ position: 'absolute', top: 0, right: 0 }}>
          <Icon color='primary' icon='tabler:x' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{
            fontSize: '1rem',
            textAlign: 'center',
            color: isSuccess ? 'green' : 'red'
          }}
        >
          {message}
        </DialogContentText>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          {isSuccess ? (
            <div dangerouslySetInnerHTML={{ __html: Icontich }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: IconX }} />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const Icontich = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="58px" height="58px"><path fill="#bae0bd" d="M20,38.5C9.8,38.5,1.5,30.2,1.5,20S9.8,1.5,20,1.5S38.5,9.8,38.5,20S30.2,38.5,20,38.5z"/><path fill="#5e9c76" d="M20,2c9.9,0,18,8.1,18,18s-8.1,18-18,18S2,29.9,2,20S10.1,2,20,2 M20,1C9.5,1,1,9.5,1,20s8.5,19,19,19 s19-8.5,19-19S30.5,1,20,1L20,1z"/><path fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3" d="M11.2,20.1l5.8,5.8l13.2-13.2"/></svg>`

const IconX = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="58px" height="58px"><path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"/><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"/><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"/></svg>`

export default CustomDialog
