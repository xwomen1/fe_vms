import { useRouter } from 'next/router'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Checkbox } from '@mui/material'

import Paper from '@mui/material/Paper'

const UserDetails = cameras => {
  const router = useRouter()

  const [status1, setStatus1] = useState('ACTIVE')
  const [availableAt, setAvailableAt] = useState('')

  console.log('New start date:', isoToEpoch(availableAt))
  function isoToEpoch(isoDateString) {
    var milliseconds = Date.parse(isoDateString)

    var epochSeconds = Math.round(milliseconds)

    return epochSeconds
  }

  const handleFullNameChange = event => {
    setFullNameValue(event.target.value)
  }

  // useEffect(() => {
  //   const fetchGroupData = async () => {
  //     try {
  //       const token = localStorage.getItem(authConfig.storageTokenKeyName)
  //       console.log('token', token)

  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }

  //       const response = await axios.get(
  //         `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/networkconfig/{idCamera}?idCamera=${camera.camera}`,
  //         config
  //       )

  //       setNvrs(response.data.data)
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     }
  //   }

  //   fetchGroupData()
  // }, [])

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handlePhoneNumberChange = event => {
    setPhoneNumber(event.target.value)
  }

  const handleNoteChange = event => {
    setNote(event.target.value)
  }

  const handleIdentityNumberChange = event => {
    setIdentityNumber(event.target.value)
  }

  console.log('param', cameras?.camera.ddnsType)
  const formatDDNS = ddns => <Checkbox checked={ddns} disabled />

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            {formatDDNS(cameras?.camera.ddns)} Enable DDNS
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='DDNS Type'
              value={cameras?.camera.ddnsType?.name}
              onChange={handleFullNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='User Name'
              value={cameras?.camera?.userName}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Server Address'
              value={cameras?.camera.serverAddressNTP}
              onChange={handleFullNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Password' value={cameras?.camera.password} onChange={handleEmailChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Port' value={cameras?.camera.port} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Confirm' value={cameras?.camera.confirm} onChange={handleEmailChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Domain' value={cameras?.camera.domain} onChange={handleFullNameChange} fullWidth />
          </Grid>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default UserDetails
