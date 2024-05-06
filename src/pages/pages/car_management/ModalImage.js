/**
 *
 * ModalImage
 *
 */

import React, { useEffect, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Popup } from 'devextreme-react';
import {
  Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Tab, TableContainer, Paper,
  Table, TableHead, TableRow, TableCell, TableBody, Pagination, Menu, MenuItem, Dialog, DialogContent,
  DialogActions,
  Typography,
  TextField,
  Input,
  TextareaAutosize
} from "@mui/material";
import Icon from 'src/@core/components/icon'
import MaskGroup from './Imge/NoAvatar.svg';

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
        </IconButton>
        <Grid item xs={12} style={{ height: '100%' }}>
          <TransformWrapper defaultScale={1} defaultPositionX={0} defaultPositionY={0}>
            {({ zoomIn, zoomOut, resetTransform, centerView }) => (
              <React.Fragment>
                <Grid item container justifyContent='center' alignItems='center'>
                  <Grid item>

                      <IconButton style={{ background:'#fff',width:'40px',height:'40px'}} color='primary' onClick={() => onDownloadBtnClick()}>
                      <Icon icon='tabler:download' />
                      </IconButton>

                      <IconButton style={{ background:'#fff',width:'40px',height:'40px'}}  color='primary' onClick={() => zoomIn()}>
                        <Icon icon='tabler:zoom-in' />
                      </IconButton>

                      <IconButton style={{ background:'#fff',width:'40px',height:'40px'}} color='primary' onClick={() => zoomOut()}>
                        <Icon icon='tabler:zoom-out' />
                      </IconButton>

                      <IconButton style={{ background:'#fff',width:'40px',height:'40px'}} color='primary' onClick={() => resetTransform()}>
                      <Icon icon='tabler:rotate' />
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
