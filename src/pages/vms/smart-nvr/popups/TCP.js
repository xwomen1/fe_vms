import { useEffect, useState } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Checkbox, Switch, DialogActions, Button, CircularProgress } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles'

const TCP = ({ cameras, onClose, mtu, nvr }) => {
  const [status1, setStatus1] = useState('ACTIVE')
  const [multicast, setMulticast] = useState(nvr?.multicast)
  const [dhcp, setDHCP] = useState(nvr?.dhcp)
  const [mtus, setMTU] = useState(nvr?.mtu || 'null')
  const [mutiAddress, setMultiAddress] = useState(nvr?.MulticastAddress)
  const [ddnsServer, setDDNSServer] = useState(nvr?.prefDNS)
  const [alter, setAlter] = useState(nvr?.alterDNS)
  const classes = useStyles()
  console.log(dhcp)
  const [nicTypeOptions, setNicTypeOptions] = useState([])
  const [nic, setNic] = useState([])

  const defaultValue = nvr?.nicType?.name || ''

  const [selectedNicType, setSelectedNicType] = useState({
    label: nvr?.nicType?.name || '',
    value: nvr?.nicType?.name || ''
  })

  const handleMTUChange = event => {
    setMTU(event.target.value)
  }

  const handleDDNSServerChange = event => {
    setDDNSServer(event.target.value)
  }

  const handleAltChange = event => {
    setAlter(event.target.value)
  }
  console.log(nvr)

  const handleNicTypeChange = (event, newValue) => {
    setSelectedNicType(newValue || defaultValue)
  }

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (nvr) {
      setMulticast(nvr.multicast)
      setDHCP(nvr.dhcp)
      setMTU(nvr.mtu)
      setMultiAddress(nvr.MulticastAddress)
      setDDNSServer(nvr.prefDNS)
      setAlter(nvr.alterDNS)
    }
  }, [nvr])

  const handleStatusChange = () => {
    setDHCP(dhcp === true ? false : true)
  }

  const handleCheckboxChange = () => {
    setMulticast(multicast === true ? false : true)
  }

  const fetchNicTypes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        'https://votv.ivms.vn/votv/vms/api/v0/nvrs/options/combox?cameraType=network_nic_type',
        config
      )
      setNic(response.data)

      const nicTypes = response.data.map(item => ({
        id: item.id,
        channel: item.channel,
        name: item.name,
        label: item.name,
        value: item.value
      }))
      setNicTypeOptions(nicTypes)
      console.log(nicTypes)
      if (nicTypes.length > 0) {
        setSelectedNicType(nicTypes[0].value)
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      setLoading(false)
    }
  }
  console.log(selectedNicType)

  useEffect(() => {
    setSelectedNicType({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

  const handleComboboxFocus = () => {
    if (nicTypeOptions.length === 0) {
      fetchNicTypes()
    }
  }

  const handleSaveClick = async () => {
    handleSave() // Gọi hàm handleSave truyền từ props
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
        multicast: multicast || nvr.multicast,
        dhcp: dhcp,
        mtu: mtus || nvr?.mtu,
        multicastAddress: mutiAddress || nvr.multicastAddress,
        prefDNS: ddnsServer || nvr.prefDNS,
        alterDNS: alter || nvr.alterDNS,
        nicType: {
          id: selectedNicType.id || nvr.nicType.id,
          name: selectedNicType.name || nvr.nicType.name,
          channel: selectedNicType.channel
        }
      }

      await axios.put(
        `https://votv.ivms.vn/votv/vms/api/v0/nvrs/config/networkconfig/{idNetWorkConfig}?idNetWorkConfig=${nvr.id}&NetWorkConfigType=tcpip`,
        data,
        config
      )
      setLoading(false)
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

      onClose()
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

  const formatDDNS = multicast => <Checkbox checked={multicast} onChange={handleCheckboxChange} />

  return (
    <div style={{ width: '100%' }} className={classes.loadingContainer}>
      {loading && <CircularProgress className={classes.circularProgress} />}

      <Grid container spacing={3}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            <Autocomplete
              value={selectedNicType}
              onChange={handleNicTypeChange}
              options={nicTypeOptions}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='NIC Type' fullWidth />}
              onFocus={handleComboboxFocus}
            />{' '}
          </Grid>
          <Grid item xs={5.8}>
            {formatDDNS(multicast)} DHCP
          </Grid>

          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <Switch checked={dhcp} onChange={handleStatusChange} color='primary' />
            DHCP
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='MTU' value={mtus} onChange={handleMTUChange} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <CustomTextField label='Multicast Address' fullWidth />
          </Grid>

          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <CustomTextField
              label='Preferred DNS Server'
              value={ddnsServer}
              onChange={handleDDNSServerChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Alternate DNS Server' value={alter} onChange={handleAltChange} fullWidth />
          </Grid>
        </Grid>
        <Grid item xs={0.4}></Grid>
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
