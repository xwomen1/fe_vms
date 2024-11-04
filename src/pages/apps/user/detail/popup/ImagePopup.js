import React from 'react'
import { IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'

const ImagePopup = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen) return null // Không render nếu popup không mở

  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.popup}>
        <IconButton style={popupStyles.closeButton} onClick={onClose}>
          <Icon icon='bi:x' style={{ fontSize: '36px' }} /> {/* Sử dụng icon để đóng popup */}
        </IconButton>
        <img src={imageSrc} alt='Full Size' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </div>
  )
}

const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  popup: {
    position: 'relative',
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: 'black'
  }
}

export default ImagePopup
