import React, { useState, useEffect } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';

import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import { IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Popup } from 'devextreme-react/popup';
import VideoView from './popups/VideoView';
import { makeStyles } from '@material-ui/core/styles';
const options = { closeBoxURL: '', enableEventPropagation: true };
const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));
const Map = ({ latLng, data }) => {
  const [cordinates, setCordinates] = useState(latLng);
  const [isOpenGroup, setIsOpenGroup] = useState([]);
  const [videoId, setVideoId] = useState(null);
  const classes = useStyles();
  useEffect(() => {
    setCordinates(latLng);
  }, [latLng]);
  useEffect(() => {
    let openGroup = data.map((x) => false);
    setIsOpenGroup([...openGroup]);
  }, [data]);
  return (
    <div>
      <GoogleMap
        defaultZoom={15}
        // defaultCenter={{ lat: latLng ? latLng[0] : 21.0278, lng: latLng ? latLng[1] : 105.8342 }}
        center={{
          lat: cordinates ? parseFloat(cordinates[0]) : 21.0278,
          lng: cordinates ? parseFloat(cordinates[1]) : 105.8342,
        }}
      >
        {data.length > 0 &&
          data.map((marker, index) => {
            return (
              <Marker
                key={`marker_${index}`}
                //icon={iconMarker}
                onClick={() => {
                  let isOpen = data.map((x) => false);
                  isOpen[index] = true;
                  setIsOpenGroup(isOpen);
                }}
                position={{
                  lat: marker?.latitude
                    ? parseFloat(marker?.latitude)
                    : 21.0278,
                  lng: marker?.longitude
                    ? parseFloat(marker?.longitude)
                    : 105.8342,
                }}
              >
                <InfoBox options={options}>
                  <>
                    <div
                      style={{
                        backgroundColor: 'green',
                        color: 'white',
                        borderRadius: '1em',
                        padding: '0.2em',
                        display: 'inline-block',
                      }}
                    >
                      {marker.deviceName}
                    </div>
                  </>
                </InfoBox>
                {isOpenGroup[index] && (
                  <InfoWindow
                    onCloseClick={() => {
                      let isOpen = data.map((x) => false);
                      setIsOpenGroup(isOpen);
                    }}
                  >
                    <div>
                      <div>
                        <h6>
                          {`${marker.deviceName}`}
                          <span
														style={{
															top: '5px',
															position: 'absolute',
															right: '5px'
														}}
													>
														
                            <IconButton
                              aria-label="close"
                              className={classes.closeButton}
                              onClick={() => {
                                let isOpen = data.map((x) => false);
                                setIsOpenGroup(isOpen);
                              }}
                              size="small"
                            >
                              <CloseIcon />
                            </IconButton>
                          </span>
                        </h6>
                        <h6>Loại: {`${marker.deviceType}`}</h6>
                        <h6>IP: {`${marker.ip}`}</h6>
                        <h6>Mac: {`${marker.macAddress}`}</h6>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setVideoId(marker.id);
                          }}
                        >
                          Xem trực tiếp
                        </Button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
      </GoogleMap>
      {videoId && (
        <Popup
          className={`${classes.filter} popup`}
          visible={videoId}
          title={'Xem trực tiếp'}
          showTitle
          onHidden={() => {
            setVideoId(null);
          }}
          width="50%"
          height="auto"
        >
          <VideoView
            onClose={() => {
              setVideoId(null);
            }}
            id={videoId}
          />
        </Popup>
      )}
    </div>
  );
};

export default withScriptjs(withGoogleMap(Map));
