import React, { useEffect, useState, useRef, use } from 'react'
import _ from 'lodash'
import Button from '@mui/material/Button'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'

export const ViewCamera = ({ id, channel, sizeScreen }) => {
  const [websocket, setWebsocket] = useState(null)
  const [text, setText] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [loading, setLoading] = useState(false)
  const remoteVideoRef = useRef(null)
  const [heightDiv, setHeightDiv] = useState(100)
  useEffect(() => {
    const heightCaculator = Math.floor((window.innerHeight - 90) / sizeScreen)
    setHeightDiv(heightCaculator)
    window.addEventListener('resize', () => {
      setHeightDiv(heightCaculator)
    })
  }, [])

  return (
    <div className='portlet portlet-video live' style={{ width: '100%', height: heightDiv }}>
      <div className='portlet-title'>
        <div className='caption'>
          <span className='label label-sm bg-red'>LIVE</span>
          <span className='caption-subject font-dark sbold uppercase'>Camera {id}</span>
        </div>
        <div className='media-top-controls'>
          <div className='btn-group'>
            <Button className='sd_btn btn btn-default btn-xs active' onClick={() => {}}>
              SD
            </Button>
            <Button className='hd_btn btn btn-default btn-xs ' onClick={() => {}}>
              HD
            </Button>
          </div>
        </div>
      </div>
      <video width='100%' height={heightDiv} controls>
        <source src='https://www.w3schools.com/tags/movie.mp4' type='video/mp4' />
        <source src='https://www.w3schools.com/tags/movie.ogg' type='video/ogg' />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default ViewCamera
