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
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import CachedIcon from '@material-ui/icons/Cached';
import { HiOutlineDownload } from 'react-icons/hi';
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
    /* eslint-disable-next-line */
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
          style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 9999 }}
          onClick={onClose}
        >
          X
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
                        <HiOutlineDownload fontSize="normal" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Phóng to">
                      <IconButton onClick={() => zoomIn()}>
                        <ZoomInIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Thu nhỏ">
                      <IconButton onClick={() => zoomOut()}>
                        <ZoomOutIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Trung tâm">
                      <IconButton onClick={() => centerView()}>
                        <MyLocationIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Quay về mặc định">
                      <IconButton onClick={() => resetTransform()}>
                        <CachedIcon fontSize="small" />
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
