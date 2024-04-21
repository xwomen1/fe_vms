import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
  Paper,
} from '@material-ui/core';
import * as yup from 'yup';
import VAutocomplete from 'components/VAutocomplete';
// import FormGroup from 'components/FormGroup';
import { getApi, postApi, putApi, callApiWithConfig } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import { getErrorMessage } from '../../../Common/function';
import { useStyles } from '../../../styled';
import { streamerUrl } from '../../Mocdata/camera';
import TableCustom from 'components/TableCustom';
import styled from 'styled-components';
import {
  Column,
  Item,
  RequiredRule,
  Toolbar,
  ValidationRule,
} from 'devextreme-react/data-grid';
import ReactPlayer from "react-player";
import Loading from 'containers/Loading/Loadable';
import axios from 'axios';
import _ from 'lodash';


export const Add = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();
  const [mystream, setmystream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [channelId, setChannelId] = useState(0);
  const [channel, setChannel] = useState('Sub');
  const [media, setMedia] = useState(null);
  const [webrtc, setWebrtc] = useState(null);
  const [peerConnectionConfig, setPeerConnectionConfig] = useState(
    {'iceServers': [{
        urls: 'turn:coturn.basesystem.one:3478',
        username: 'demo',
        credential: 'demo',
      }]});
  const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection(peerConnectionConfig));
  const myvideo = useRef(null);

  const fetchDataSource = async () => {

    setLoading(true);
    var mediaStream = new MediaStream();
    
    setmystream(mediaStream);
    var newWebrtc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },      
        {
          urls: "stun:a.relay.metered.ca:80",
        },
        {
          urls: "turn:a.relay.metered.ca:80",
          username: "bbeb363d987392d314e0110b",
          credential: "QrVbdUCOHNv0v95T",
        },
        {
          urls: "turn:a.relay.metered.ca:80?transport=tcp",
          username: "bbeb363d987392d314e0110b",
          credential: "QrVbdUCOHNv0v95T",
        },
        {
          urls: "turn:a.relay.metered.ca:443",
          username: "bbeb363d987392d314e0110b",
          credential: "QrVbdUCOHNv0v95T",
        },
        {
          urls: "turn:a.relay.metered.ca:443?transport=tcp",
          username: "bbeb363d987392d314e0110b",
          credential: "QrVbdUCOHNv0v95T",
        },
      ],
      sdpSemantics: "unified-plan"
    });
    newWebrtc.onnegotiationneeded = async () => {
      var url = `${streamerUrl}/stream/${id}/channel/${channel}/webrtc?uuid=${id}&channel=${channel}`;
      var offer = await newWebrtc.createOffer();

      await newWebrtc.setLocalDescription(offer);
      var bodyFormData = new FormData();
      bodyFormData.append('data', btoa(newWebrtc.localDescription?.sdp));
      await axios({
          method: 'post',
          url: url,
          data: bodyFormData,
          headers: {
              'Content-Type': `multipart/form-data;`,
          },
      }).then(response => {
        
          newWebrtc.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: atob(response)
          }))

      });
    }
    newWebrtc.onsignalingstatechange = async () => {
      switch (newWebrtc.signalingState){
        case 'have-local-offer':
          var url = `${streamerUrl}/stream/${id}/channel/${channel}/webrtc?uuid=${id}&channel=${channel}`;
          
          var bodyFormData = new FormData();
          bodyFormData.append('data', btoa(newWebrtc.localDescription?.sdp));
          await axios({
              method: 'post',
              url: url,
              data: bodyFormData,
              headers: {
                  'Content-Type': `multipart/form-data;`,
              },
          }).then(response => {
              console.log(response);
              newWebrtc.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: atob(response)
              }))

          });
          break;
        case 'stable':
            /*
            * There is no ongoing exchange of offer and answer underway.
            * This may mean that the RTCPeerConnection object is new, in which case both the localDescription and remoteDescription are null;
            * it may also mean that negotiation is complete and a connection has been established.
            */
            break;

        case 'closed':
            /*
             * The RTCPeerConnection has been closed.
             */
            break;

        default:
            console.log(`unhandled signalingState is ${newWebrtc.signalingState}`);
            break;
      }
    }
    newWebrtc.ontrack = (event) => {
      console.log(event.streams.length + ' track is delivered');
      mediaStream.addTrack(event.track);
      setMedia(mediaStream);
      setLoading(false);
      // myvideo.srcObject = mediaStream;
      // myvideo.autoplay = true;
      // myvideo.muted = false;
    }

    let offer = await newWebrtc.createOffer({
            //iceRestart:true,
            offerToReceiveAudio:true,
            offerToReceiveVideo:true
        });
    await newWebrtc.setLocalDescription(offer);
    
    setWebrtc(newWebrtc);

    
    // setLoading(false);
  };
  
  const handChangeChannel = (name) => {
    setChannel(name);
    fetchDataSource();
  }

  
  

  useEffect(() => {
    if (id) {
      var xhr = new XMLHttpRequest();
      var json_obj, status = false;
      xhr.open("GET", `${streamerUrl}/stream/${id}/info`, true);
      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const setData = response?.payload?.channels;
            if(setData){
              setDetail(setData);
            }
            if(setData?.Sub){
              setChannel('Sub');
            }else{
              if(setData?.Main){
                setChannel('Main');
              }
            }
          } else {
            console.error(xhr.statusText);
          }
          
        }
      }.bind(this);
      xhr.onerror = function (e) {
        console.error(xhr.statusText);
      };
      xhr.send(null);
      fetchDataSource();
      
    }
  }, [id]);

  useEffect(() => {
    if (myvideo?.current?.srcObject != media) {
      myvideo.current.srcObject = media;
      myvideo.current.autoplay = true;
      myvideo.current.muted = false;
    }
  }, [media]);
  
  

  

  let timeout = useMemo(() => undefined, []);
  
  return (
    <div>
        
        <Grid container spacing={2}>
          <Grid item xs={12} alignItems="center" justify="center" spacing={0}>
            <video ref={myvideo} autoPlay style={{width: "100%", height: "400px" }}></video>
              
            {loading && (
              <h4
                style={{textAlign:'center'}}
              >
                Loading ...
              </h4>
            )}
            {/* {loading && (
              <ReactPlayer
                width="100%"
                height="300px"
                pip
                controls
                playing
                config={
                  { file: { forceHLS: true } }
                }
                url={`${streamerUrl}/stream/${id}/channel/${channel}/webrtc`}
              />
            )} */}
            
          </Grid>
          <Grid item xs={12} alignItems="center" justify="center" spacing={2}>
              {detail?.Sub && (
                  <Button 
                    onClick={()=>handChangeChannel('Sub')}
                    style={{marginRight: '10px'}} variant="outlined" color={channel == 'Sub' ? "primary" : ""} size="small">
                      Sub
                  </Button>
                )
              }
              {detail?.Main && (
                  <Button 
                    onClick={()=>handChangeChannel('Main')}
                    style={{marginRight: '10px'}} variant="outlined" color={channel == 'Main' ? "primary" : ""} size="small">
                      Main
                  </Button>
                )
              }
          </Grid>
        </Grid>

        <DialogActions style={{ marginTop: 36 }}>
          <Button onClick={onClose} variant="contained" color="primary">
            Đóng
          </Button>
        </DialogActions>
    </div>
  );
};

const TableCustomWrap = styled.div`
  .dx-datagrid-nodata {
    display: none;
  }
  .dx-visibility-change-handler {
    min-height: auto !important;
  }
  .dx-fileuploader-files-container {
    height: 0px;
    padding: 0px !important;
  }
`;


export default Add;
