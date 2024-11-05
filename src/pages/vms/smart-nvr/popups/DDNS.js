import { useEffect, useState } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Grid,
  Checkbox,
  Switch,
  DialogActions,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles'
import { set } from 'nprogress'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'

const TCP = ({ onClose, mtu, nvr }) => {
  const [autoDNS, setAutoDNS] = useState(nvr?.autoDNS)
  const [multicast, setMulticast] = useState(nvr?.multicast)
  const [userName, setUserName] = useState(nvr?.userName)

  const [password, setPassword] = useState(nvr?.password)
  const [port, setPort] = useState(nvr?.port)

  const [dhcp, setDHCP] = useState(nvr?.dhcp)
  const [mtus, setMTU] = useState(nvr?.mtu || 'null')
  const [serverAddressNTP, setserverAddressNTP] = useState(nvr?.serverAddressNTP)
  const [ddnsServer, setDDNSServer] = useState(nvr?.ddns)
  const [domain, setDomain] = useState(nvr?.domain)
  const [macAddress, setMacAddress] = useState(nvr?.macAddress)
  const [ipv4, setIpv4] = useState(nvr?.ipv4SubnetMask)
  const [ipv6, setIpv6] = useState(nvr?.ipv6DefaultGateway)
  const [confirmPassword, setConfirmPassword] = useState('')

  const [subnetPrefixLength, setsubnetPrefixLength] = useState(nvr?.subnetPrefixLength)

  const [ipv4DefaultGateway, setIpv4Default] = useState(nvr?.ipv4DefaultGateway)
  const [showPassword, setShowPassword] = useState(false)

  const classes = useStyles()

  const [ddnsTypeOptions, setddnsTypeOptions] = useState([])

  const defaultValue = nvr?.ddnsType?.name || ''

  const [selectedDDNSType, setselectedDDNSType] = useState({
    label: nvr?.ddnsType?.name || '',
    value: nvr?.ddnsType?.name || ''
  })

  const handleUserNameChange = event => {
    setUserName(event.target.value)
  }
  console.log(nvr)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    if (nvr) {
      setDDNSServer(nvr.ddns)
      setUserName(nvr.userName)
      setselectedDDNSType({
        label: nvr?.ddnsType?.name || '',
        value: nvr?.ddnsType?.name || ''
      })
      setserverAddressNTP(nvr.serverAddressNTP)
      setPassword(nvr?.password)
      setPort(nvr?.port)
      setDomain(nvr?.domain)
    }
  }, [nvr])

  const fetchDDNSTypes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        'https://votv.ivms.vn/votv/vms/api/v0/cameras/options/combox?cameraType=network_ddns_type',
        config
      )

      const ddnsTypes = response.data.map(item => ({
        id: item.id,
        channel: item.channel,
        name: item.name,
        label: item.name,
        value: item.value
      }))
      setddnsTypeOptions(ddnsTypes)
      console.log(ddnsTypes)
      if (ddnsTypes.length > 0) {
        setselectedDDNSType(ddnsTypes[0].value)
      }
    } catch (error) {
      console.error('Error fetching DDNS types:', error)
    } finally {
      setLoading(false)
    }
  }
  console.log(selectedDDNSType)

  useEffect(() => {
    setselectedDDNSType({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

  const handleComboboxFocus = () => {
    if (ddnsTypeOptions.length === 0) {
      fetchDDNSTypes()
    }
  }

  const formatDDNS = autoDNS => <Checkbox checked={autoDNS} onChange={handleCheckboxChange} />

  console.log(nvr)

  const handleDDNSTypeChange = (event, newValue) => {
    setselectedDDNSType(newValue || defaultValue)
  }

  const [loading, setLoading] = useState(false)

  const handleStatusChange = () => {
    setDHCP(dhcp === true ? false : true)
  }

  const handleCheckboxChange = () => {
    setDDNSServer(ddnsServer === true ? false : true)
  }

  console.log(selectedDDNSType)

  const handleserverAddressNTPChange = event => {
    setserverAddressNTP(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handlePortChange = event => {
    setPort(event.target.value)
  }

  const handleDomainChange = event => {
    setDomain(event.target.value)
  }

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
  }

  const handleSaveClick = async () => {
    handleSave() // Gọi hàm handleSave truyền từ props
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (password !== confirmPassword) {
        onClose()
        Swal.fire({
          title: 'Error!',
          text: 'Password and confirm password do not match.',
          icon: 'error',
          willOpen: () => {
            const confirmButton = Swal.getConfirmButton()
            if (confirmButton) {
              confirmButton.style.backgroundColor = '#002060'
              confirmButton.style.color = 'white'
            }
          }
        })
        setLoading(false)

        return
      }

      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const data = {
        ddnsType: {
          id: selectedDDNSType.id || nvr.ddnsType.id,
          name: selectedDDNSType.name || nvr.ddnsType.name,
          channel: selectedDDNSType.channel
        },
        userName: userName,
        ddns: ddnsServer,
        serverAddressNTP: serverAddressNTP,

        password: password,
        confirm: confirmPassword,
        domain: domain
      }

      await axios.put(
        `https://votv.ivms.vn/votv/vms/api/v0/nvrs/config/networkconfig/{idNetWorkConfig}?idNetWorkConfig=${nvr.id}&NetWorkConfigType=ddns`,
        data,
        config
      )
      setLoading(false)
      onClose()

      Swal.fire({
        title: 'Successfully!',
        text: 'Data was saved successfully',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    } catch (error) {
      console.error(error)
      setLoading(false)
      onClose()

      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
      console.log(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }} className={classes.loadingContainer}>
      {loading && <CircularProgress className={classes.circularProgress} />}{' '}
      <Grid container spacing={3}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            {formatDDNS(ddnsServer)} Enable DDNS
          </Grid>

          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}></Grid>
          <Grid item xs={5.8}>
            <Autocomplete
              value={selectedDDNSType}
              onChange={handleDDNSTypeChange}
              options={ddnsTypeOptions}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='Loại DDNS' fullWidth />}
              onFocus={handleComboboxFocus}
            />{' '}
          </Grid>
          {/* <Grid item xs={5.8}>
            <CustomTextField label='DDNS Type' value={nvr?.ddnsType} fullWidth />
          </Grid> */}
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='User Name' value={userName} onChange={handleUserNameChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Server Address'
              value={serverAddressNTP}
              onChange={handleserverAddressNTPChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={toggleShowPassword} edge='end'>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={handlePasswordChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Port' value={port} onChange={handlePortChange} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Confirm'
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={toggleShowPassword} edge='end'>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Domain' value={domain} onChange={handleDomainChange} fullWidth />
          </Grid>
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
          <Button onClick={onClose}>Close</Button>

          <Button type='submit' variant='contained' onClick={handleSaveClick}>
            Save
          </Button>
        </DialogActions>
      </Grid>
      <br />
    </div>
  )
}

const useStyles = makeStyles(() => ({
  loadingContainer: {
    position: 'relative',
    minHeight: '100px', // Đặt độ cao tùy ý
    zIndex: 0
  },
  circularProgress: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999 // Đặt z-index cao hơn so với Grid container
  }
}))

export default TCP
