/**
 *
 * ModalImage
 *
 */

import React, { useEffect, useState } from 'react'
import { Button } from 'devextreme-react/button'

//dùng thư viện khác
import Cropper from 'react-cropper'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'

//b
import styled from 'styled-components'

function ImageCropper({ onClose, fileAvatar, setFileAvatar, setAvatarImage }) {
  const classes = useStyles()
  const [image, setImage] = useState(null)
  const [cropper, setCropper] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ratio, setRatio] = useState(0.9)
  const { innerWidth } = window

  useEffect(() => {
    if (fileAvatar !== null) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(fileAvatar)
    }

    if (innerWidth <= 960) {
      setRatio(0.9)
    } else if (innerWidth > 960 && innerWidth <= 1920) {
      setRatio(0.7)
    } else if (innerWidth <= 2560) {
      setRatio(0.4)
    } else {
      setRatio(0.1)
    }
  }, [])

  const getCanvasBlob = canvas => {
    return new Promise(resolve => {
      canvas.toBlob(
        blob => {
          resolve(blob)
        },
        'image/jpeg',
        ratio
      )
    })
  }

  const onCrop = () => {
    setLoading(true)
    if (typeof cropper !== 'undefined') {
      const canvas = cropper.getCroppedCanvas()

      const canvasBlob = getCanvasBlob(canvas)

      canvasBlob.then(
        blob => {
          const file = new File([blob], fileAvatar.name, {
            type: 'image/jpeg'
          })
          setAvatarImage(canvas.toDataURL())
          setFileAvatar(file)
          setLoading(false)
          onClose()
        },
        () => {
          setLoading(false)
        }
      )
    }
  }

  const handleSliderChange = (event, newValue) => {
    const scaleVal = 1 + newValue / 100
    cropper.scale(scaleVal, scaleVal)
  }

  return (
    <Modal>
      {loading}
      <div className={classes.imageContainer}>
        <span
          className='close'
          onClick={() => {
            onClose()
          }}
        >
          &times;
        </span>
        <Cropper
          style={{ height: '100%', width: '100%' }}
          initialAspectRatio={1}
          preview='.img-preview'
          src={image}
          viewMode={1}
          guides
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive
          autoCropArea={0.5}
          checkOrientation={false}
          onInitialized={instance => {
            setCropper(instance)
          }}
        />
        <div className={classes.vertical}>
          <CustomSlider orientation='vertical' defaultValue={0} onChange={handleSliderChange} />
        </div>
        <Button
          id='btnSaveAndContinue'
          text='Đặt làm ảnh đại diện'
          type='success'
          onClick={() => {
            onCrop()
          }}
          style={{
            height: '40px',
            right: '30px',
            background: '#FFFFFF',
            boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
            borderRadius: '8px',
            marginTop: '-70px',
            position: 'absolute',
            border: '1px solid #00695C',
            color: '#00695C'
          }}
        />
      </div>
    </Modal>
  )
}

const Modal = styled.div`
  & {
    position: fixed;
    z-index: 9;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.9);
  }

  & .modal-content {
    width: 100%;
  }
  & .close {
    z-index: 1;
    position: absolute;
    top: 0px;
    right: 15px;
    color: #f1f1f1;
    font-size: 30px;
  }

  & .close:hover,
  .close:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
  }

  // default css

  & .cropper-container {
    direction: ltr;
    font-size: 0;
    line-height: 0;
    position: relative;
    -ms-touch-action: none;
    touch-action: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  & .cropper-container img {
    display: block;
    height: 100%;
    image-orientation: 0deg;
    max-height: none !important;
    max-width: none !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: 100%;
  }

  & .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  & .cropper-wrap-box,
  .cropper-canvas {
    overflow: hidden;
  }

  & .cropper-drag-box {
    background-color: #fff;
    opacity: 0;
  }

  & .cropper-modal {
    background-color: #000;
    opacity: 0.5;
  }

  & .cropper-view-box {
    display: block;
    height: 100%;
    outline: 1px solid #40a574;
    outline-color: #40a574;
    overflow: hidden;
    width: 100%;
  }

  & .cropper-dashed {
    display: none;
  }

  & .cropper-dashed.dashed-h {
    border-bottom-width: 1px;
    border-top-width: 1px;
    height: calc(100% / 3);
    left: 0;
    top: calc(100% / 3);
    width: 100%;
  }

  & .cropper-dashed.dashed-v {
    border-left-width: 1px;
    border-right-width: 1px;
    height: 100%;
    left: calc(100% / 3);
    top: 0;
    width: calc(100% / 3);
  }

  & .cropper-center {
    display: block;
    height: 0;
    left: 50%;
    opacity: 0.75;
    position: absolute;
    top: 50%;
    width: 0;
  }

  & .cropper-center::before,
  .cropper-center::after {
    background-color: #eee;
    content: ' ';
    display: block;
    position: absolute;
  }

  & .cropper-center::before {
    height: 1px;
    left: -3px;
    top: 0;
    width: 7px;
  }

  & .cropper-center::after {
    height: 7px;
    left: 0;
    top: -3px;
    width: 1px;
  }

  & .cropper-face,
  .cropper-line,
  .cropper-point {
    display: block;
    height: 100%;
    opacity: 0.1;
    position: absolute;
    width: 100%;
  }

  & .cropper-face {
    background-color: #fff;
    left: 0;
    top: 0;
  }

  & .cropper-line {
    background-color: #39f;
  }

  & .cropper-line.line-e {
    cursor: ew-resize;
    right: -3px;
    top: 0;
    width: 5px;
  }

  & .cropper-line.line-n {
    cursor: ns-resize;
    height: 5px;
    left: 0;
    top: -3px;
  }

  & .cropper-line.line-w {
    cursor: ew-resize;
    left: -3px;
    top: 0;
    width: 5px;
  }

  & .cropper-line.line-s {
    bottom: -3px;
    cursor: ns-resize;
    height: 5px;
    left: 0;
  }

  & .cropper-point {
    background-color: #fff;
    height: 5px;
    opacity: 0.75;
    width: 5px;
  }

  & .cropper-point.point-e {
    display: none;
  }

  & .cropper-point.point-n {
    display: none;
  }

  & .cropper-point.point-w {
    display: none;
  }

  & .cropper-point.point-s {
    display: none;
  }

  & .cropper-point.point-ne {
    cursor: nesw-resize;
    right: -3px;
    top: -3px;
    width: 20px;
    height: 20px;
  }

  & .cropper-point.point-nw {
    cursor: nwse-resize;
    left: -3px;
    top: -3px;
    width: 20px;
    height: 20px;
  }

  & .cropper-point.point-sw {
    bottom: -3px;
    cursor: nesw-resize;
    left: -3px;
    width: 20px;
    height: 20px;
  }

  & .cropper-point.point-se {
    bottom: -3px;
    cursor: nwse-resize;
    height: 20px;
    opacity: 1;
    right: -3px;
    width: 20px;
  }

  @media (min-width: 768px) {
    & .cropper-point.point-se {
      height: 15px;
      width: 15px;
    }
    & .cropper-point.point-ne {
      height: 15px;
      width: 15px;
    }
    & .cropper-point.point-nw {
      height: 15px;
      width: 15px;
    }
    & .cropper-point.point-sw {
      height: 15px;
      width: 15px;
    }
  }

  @media (min-width: 992px) {
    & .cropper-point.point-se {
      height: 10px;
      width: 10px;
    }
    & .cropper-point.point-ne {
      height: 10px;
      width: 10px;
    }
    & .cropper-point.point-sw {
      height: 10px;
      width: 10px;
    }
    & .cropper-point.point-nw {
      height: 10px;
      width: 10px;
    }
  }

  @media (min-width: 1200px) {
    & .cropper-point.point-se {
      height: 5px;
      opacity: 0.75;
      width: 5px;
    }
    & .cropper-point.point-sw {
      height: 5px;
      opacity: 0.75;
      width: 5px;
    }
    & .cropper-point.point-ne {
      height: 5px;
      opacity: 0.75;
      width: 5px;
    }
    & .cropper-point.point-nw {
      height: 5px;
      opacity: 0.75;
      width: 5px;
    }
  }

  & .cropper-point.point-se::before {
    background-color: #39f;
    bottom: -50%;
    content: ' ';
    display: block;
    height: 200%;
    opacity: 0;
    position: absolute;
    right: -50%;
    width: 200%;
  }

  & .cropper-invisible {
    opacity: 0;
  }

  & .cropper-hide {
    display: block;
    height: 0;
    position: absolute;
    width: 0;
  }

  & .cropper-hidden {
    display: none !important;
  }

  & .cropper-move {
    cursor: move;
  }

  & .cropper-crop {
    cursor: crosshair;
  }

  & .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }
`

const useStyles = makeStyles({
  vertical: {
    textAlign: 'center',
    height: '30%',
    position: 'relative',
    float: 'right',
    marginTop: '-65%',
    marginRight: '20px'
  },
  imageContainer: {
    width: '668px',
    height: '668px',
    margin: 'auto',
    overflow: 'hidden',
    position: 'relative'
  },
  white: {
    color: '#fff',
    '& p': { margin: '7px 0px' }
  }
})

const CustomSlider = withStyles({
  root: {
    color: '#C4C4C4',
    height: 8,
    '&$vertical': {
      width: 8
    }
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)'
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  },
  vertical: {
    '& $rail': {
      width: 8
    },
    '& $track': {
      width: 8
    },
    '& $thumb': {
      marginLeft: -8,
      marginBottom: -11
    }
  }
})(Slider)

ImageCropper.propTypes = {}

export default ImageCropper
