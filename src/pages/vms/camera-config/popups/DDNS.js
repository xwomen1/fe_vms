import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Checkbox, Autocomplete, DialogActions, Button, CircularProgress } from '@mui/material'
import Swal from 'sweetalert2'

const DDNS = ({ cameras, onClose }) => {
  const [DDNSOption, setDDNS] = useState([])
  const [ddnss, setDDNSS] = useState(cameras?.ddns)
  const [serverAddress, setServerAddress] = useState(cameras?.serverAddress)
  const [port, setPort] = useState(cameras?.port)
  const [domain, setDomain] = useState(cameras?.domain)
  const [userName, setUserName] = useState(cameras?.userName)
  const [password, setPassword] = useState(cameras?.password)
  const [confirm, setConfirm] = useState(cameras?.confirm)

  const defaultValue = cameras?.ddnsType?.name || ''
  const [loading, setLoading] = useState(false)

  const [selectedDDNS, setSelectedDDNSType] = useState({
    label: cameras?.ddnsType?.name || '',
    value: cameras?.ddnsType?.name || ''
  })
  console.log(cameras)

  const handleDDNSChange = (event, newValue) => {
    setSelectedDDNSType(newValue || defaultValue)
  }

  const handleServerAddressChange = event => {
    setServerAddress(event.target.value)
  }

  const handlePortChange = event => {
    setPort(event.target.value)
  }

  const handleDomainChange = event => {
    setDomain(event.target.value)
  }

  const handleUserNameChange = event => {
    setUserName(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleConfirmChange = event => {
    setConfirm(event.target.value)
  }

  useEffect(() => {
    setSelectedDDNSType({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

  const fetchDDNS = async () => {
    try {
      // setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        'https://sbs.basesystem.one/ivis/vms/api/v0/cameras/options/combox?cameraType=network_ddns_type',
        config
      )

      const nicTypes = response.data.map(item => ({
        id: item.id,
        channel: item.channel,
        name: item.name,
        label: item.name,
        value: item.value
      }))
      setDDNS(nicTypes)

      if (nicTypes.length > 0) {
        setSelectedDDNSType(nicTypes[0].value) // Set it to the first value in the array, or adjust as needed
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      // setLoading(false)
    }
  }

  const handleSaveClick = async () => {
    handleSave()
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const data = {
        ddns: ddnss,
        ddnsType: {
          id: selectedDDNS.id || cameras?.ddnsType?.id,
          name: selectedDDNS.name || cameras?.ddnsType?.name,
          channel: selectedDDNS.channel
        },
        serverAddress: serverAddress || cameras?.serverAddress,
        port: port || cameras?.port,
        domain: domain || cameras?.domain,
        userName: userName || cameras?.userName,
        password: password || cameras?.password,
        confirm: confirm || cameras?.confirm
      }

      await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/networkconfig/{idNetWorkConfig}?idNetWorkConfig=${cameras.id}`,
        data,
        config
      )
      setLoading(false)
      Swal.fire('Lưu thành công!', '', 'success')

      onClose()
    } catch (error) {
      console.error(error)
      setLoading(false)
      onClose()

      Swal.fire(error.message, error.response?.data?.message)
      console.log(error.response?.data?.message)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleComboboxFocus = () => {
    fetchDDNS()
  }
  console.log(selectedDDNS)

  const handleCheckboxChange = () => {
    setDDNSS(ddnss === true ? false : true)
  }
  const formatDDNS = ddns => <Checkbox checked={ddns} onChange={handleCheckboxChange} />

  return (
    <div style={{ width: '100%' }}>
      {loading && <CircularProgress />}

      <Grid container spacing={3}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            {formatDDNS(ddnss)} Enable DDNS
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}></Grid>
          <Grid item xs={5.8}>
            <Autocomplete
              value={selectedDDNS}
              onChange={handleDDNSChange}
              options={DDNSOption}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='DDNS Type' fullWidth />}
              onFocus={handleComboboxFocus}

              // loading={loading}
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='User Name' value={userName} onChange={handleUserNameChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Server Address'
              value={serverAddress}
              onChange={handleServerAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Password' value={password} onChange={handlePasswordChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Port' value={port} onChange={handlePortChange} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Confirm' value={confirm} onChange={handleConfirmChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Domain' value={domain} onChange={handleDomainChange} fullWidth />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button type='submit' variant='contained' onClick={handleSaveClick}>
              Lưu
            </Button>
            <Button variant='tonal'>Mặc định</Button>
            <Button variant='tonal' color='secondary' onClick={onClose}>
              Hủy
            </Button>
          </DialogActions>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default DDNS
