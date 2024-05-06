<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Popup } from 'devextreme-react';
import {
  Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Tab, TableContainer, Paper,
  Table, TableHead, TableRow, TableCell, TableBody, Pagination, Menu, MenuItem, Dialog, DialogContent,
} from "@mui/material";
import Icon from 'src/@core/components/icon'
import MaskGroup from './list/Imge/NoAvatar.svg';
=======
/**
 *
 * ModalImage
 *
 */
//review và dùng thuần bên Vuexy, cần thiết thì thay đổi UI
import React, { useEffect, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Popup } from 'devextreme-react'
import Grid from '@material-ui/core/Grid'
import { IconButton, Tooltip } from '@material-ui/core'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import MyLocationIcon from '@material-ui/icons/MyLocation'
import CachedIcon from '@material-ui/icons/Cached'
import { HiOutlineDownload } from 'react-icons/hi'
import MaskGroup from './list/Imge/NoAvatar.svg'
import { Icon } from '@mui/material'
>>>>>>> 45c3967a2261dd0c9d91fc6e3bd09c3069950361

function ModalImage({ onClose, imageUrl }) {
  const onDownloadBtnClick = () => {
    const link = document.createElement('a')

    link.href = url
    link.download = 'Download.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (imageUrl) {
      setUrl(imageUrl)
    } else {
      setUrl(MaskGroup)
    }
  }, [imageUrl])

  return (
    <Popup
<<<<<<< HEAD
    visible
    onHiding={() => onClose()}
    dragEnabled
    closeOnOutsideClick
    showCloseButton
    height="100%"
    width="100%"
  >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ width: '100%', height: '100%' }}
      >
          <IconButton
          color='primary'
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999, background:'#fff' }}
          onClick={onClose}
        >
          <Icon icon='tabler:letter-x'/>
=======
      visible
      onHiding={() => onClose()}
      dragEnabled
      closeOnOutsideClick
      showCloseButton
      height='100%'
      width='100%'
    >
      <Grid container justifyContent='center' alignItems='center' style={{ width: '100%', height: '100%' }}>
        <IconButton style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }} onClick={onClose}>
          <Icon icon='tabler:circle-letter-x' />
>>>>>>> 45c3967a2261dd0c9d91fc6e3bd09c3069950361
        </IconButton>
        <Grid item xs={12} style={{ height: '100%' }}>
          <TransformWrapper defaultScale={1} defaultPositionX={0} defaultPositionY={0}>
            {({ zoomIn, zoomOut, resetTransform, centerView }) => (
              <React.Fragment>
                <Grid item container justifyContent='center' alignItems='center'>
                  <Grid item>
<<<<<<< HEAD

                      <IconButton style={{ background:'#fff',width:'40px',height:'40px'}} color='primary' onClick={() => onDownloadBtnClick()}>
                      <Icon icon='tabler:download' />
=======
                    <Tooltip title='Tải xuống'>
                      <IconButton onClick={() => onDownloadBtnClick()}>
                        <Icon icon='tabler:download' />
>>>>>>> 45c3967a2261dd0c9d91fc6e3bd09c3069950361
                      </IconButton>
                      <IconButton style={{ background:'#fff',width:'40px',height:'40px'}}  color='primary' onClick={() => zoomIn()}>
                        <Icon icon='tabler:zoom-in' />
                      </IconButton>
                      <IconButton style={{ background:'#fff',width:'40px',height:'40px'}} color='primary' onClick={() => zoomOut()}>
                        <Icon icon='tabler:zoom-out' />
                      </IconButton>
<<<<<<< HEAD
                      <IconButton style={{ background:'#fff',width:'40px',height:'40px'}} color='primary' onClick={() => resetTransform()}>
                      <Icon icon='tabler:rotate' />
=======
                    </Tooltip>
                    <Tooltip title='Trung tâm'>
                      <IconButton onClick={() => centerView()}>
                        <MyLocationIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Quay về mặc định'>
                      <IconButton onClick={() => resetTransform()}>
                        <Icon icon='tabler:rotate' />
>>>>>>> 45c3967a2261dd0c9d91fc6e3bd09c3069950361
                      </IconButton>
                  </Grid>
                </Grid>
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: 'calc(100% - 48px)' }}
                  contentStyle={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    background: '#FFFFFF',
                    justifyContent: 'center',
                    flexWrap: 'nowrap'
                  }}
                >
                  <img
                    src={url}
                    alt='test'
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%'
                    }}
                    onError={() => setUrl(MaskGroup)}
                  />
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </Grid>
      </Grid>
    </Popup>
  )
}

ModalImage.propTypes = {}

export default ModalImage
