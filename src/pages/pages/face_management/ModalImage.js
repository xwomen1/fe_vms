/**
 *
 * ModalImage
 *
 */

import React, { useEffect, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Popup } from 'devextreme-react';
import Grid from '@material-ui/core/Grid';
import { IconButton, Tooltip } from '@material-ui/core';
import Icon from 'src/@core/components/icon'
import MyLocationIcon from '@material-ui/icons/MyLocation';
import MaskGroup from './list/Imge/NoAvatar.svg';

function ModalImage({ onClose, imageUrl }) {

  const onDownloadBtnClick = () => {

    const link = document.createElement('a');
    
    link.href = url;
    link.download = 'Download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (imageUrl) {
      setUrl(imageUrl);
    } else {
      setUrl(MaskGroup);
    }
  }, [imageUrl]);
  
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
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }}
          onClick={onClose}
        >
          <Icon icon='tabler:circle-letter-x'/>
        </IconButton>
        <Grid item xs={12} style={{ height: '100%' }}>
          <TransformWrapper
            defaultScale={1}
            defaultPositionX={0}
            defaultPositionY={0}
          >
            {({ zoomIn, zoomOut, resetTransform, centerView }) => (
              <React.Fragment>
                <Grid item container justifyContent="center" alignItems="center">
                  <Grid item>
                    <Tooltip title="Tải xuống">
                      <IconButton onClick={() => onDownloadBtnClick()}>
                      <Icon icon='tabler:download' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Phóng to">
                      <IconButton onClick={() => zoomIn()}>
                        <Icon icon='tabler:camera-minus' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Thu nhỏ">
                      <IconButton onClick={() => zoomOut()}>
                        <Icon icon='tabler:camera-plus' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Trung tâm">
                      <IconButton onClick={() => centerView()}>
                        <MyLocationIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Quay về mặc định">
                      <IconButton onClick={() => resetTransform()}>
                      <Icon icon='tabler:rotate' />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: 'calc(100% - 48px)' }}
                  contentStyle={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    background:'#FFFFFF',
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                  }}
                >
                  <img
                    src={url}
                    alt="test"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
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
  );
}

ModalImage.propTypes = {};

export default ModalImage;
