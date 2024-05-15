import { useEffect, useState } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Checkbox, DialogActions, Button, CircularProgress } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles'

const TCP = ({ onClose, nvr }) => {
  const classes = useStyles()
  const defaultValue = nvr?.nicType?.name || ''

  const [autoDNS, setAutoDNS] = useState(nvr?.autoDNS || false)
  const [multicast, setMulticast] = useState(nvr?.multicast || false)
  const [prefDNS, setPrefDNS] = useState(nvr?.prefDNS || '')
  const [alterDNS, setAlterDNS] = useState(nvr?.alterDNS || '')
  const [dhcp, setDHCP] = useState(nvr?.dhcp || false)
  const [mtus, setMTU] = useState(nvr?.mtu || 'null')
  const [multiAddress, setMultiAddress] = useState(nvr?.MulticastAddress || '')
  const [ddnsServer, setDDNSServer] = useState(nvr?.prefDNS || '')
  const [alter, setAlter] = useState(nvr?.alterDNS || '')
  const [macAddress, setMacAddress] = useState(nvr?.macAddress || '')
  const [ipv4, setIpv4] = useState(nvr?.ipv4SubnetMask || '')
  const [ipv6, setIpv6] = useState(nvr?.ipv6DefaultGateway || '')
  const [subnetPrefixLength, setSubnetPrefixLength] = useState(nvr?.subnetPrefixLength || '')
  const [ipv4DefaultGateway, setIpv4Default] = useState(nvr?.ipv4DefaultGateway || '')
  const [nicTypeOptions, setNicTypeOptions] = useState([])

  const [selectedNicType, setSelectedNicType] = useState({
    label: nvr?.nicType?.name || '',
    value: nvr?.nicType?.name || ''
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (nvr) {
      setAutoDNS(nvr.autoDNS || false)
      setMulticast(nvr.multicast || false)
      setDHCP(nvr.dhcp || false)
      setMTU(nvr.mtu || 'null')
      setMultiAddress(nvr.MulticastAddress || '')
      setDDNSServer(nvr.prefDNS || '')
      setAlter(nvr.alterDNS || '')
      setMacAddress(nvr.macAddress || '')
      setIpv4(nvr.ipv4SubnetMask || '')
      setIpv4Default(nvr.ipv4DefaultGateway || '')
      setSubnetPrefixLength(nvr.subnetPrefixLength || '')
      setIpv6(nvr.ipv6DefaultGateway || '')
      setPrefDNS(nvr.prefDNS || '')
      setAlterDNS(nvr.alterDNS || '')
    }
  }, [nvr])
  useEffect(() => {
    setSelectedNicType({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

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
        'https://sbs.basesystem.one/ivis/vms/api/v0/cameras/options/combox?cameraType=network_nic_type',
        config
      )

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

  const handleNicTypeChange = (event, newValue) => {
    setSelectedNicType(newValue || defaultValue)
  }

  const handleComboboxFocus = () => {
    fetchNicTypes()
    console.log('Fetching NIC types...') // Add this line
  }

  const handleCheckboxChange = () => {
    setAutoDNS(!autoDNS)
  }

  const handleSaveClick = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const data = {
        macAddress: macAddress || nvr.macAddress,
        dhcp: dhcp,
        mtu: mtus || nvr?.mtu,
        ipv4SubnetMask: ipv4 || nvr?.ipv4SubnetMask,
        ipv4DefaultGateway: ipv4DefaultGateway || nvr?.ipv4DefaultGateway,
        subnetPrefixLength: subnetPrefixLength || nvr?.subnetPrefixLength,
        ipv6DefaultGateway: ipv6 || nvr?.ipv6DefaultGateway,
        prefDNS: prefDNS || nvr?.prefDNS,
        alterDNS: alterDNS || nvr?.alterDNS,
        autoDNS: autoDNS,
        nicType: {
          id: selectedNicType.id || nvr.nicType.id,
          name: selectedNicType.name || nvr.nicType.name,
          channel: selectedNicType.channel
        }
      }
      await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/config/networkconfig/{idNetWorkConfig}?idNetWorkConfig=${nvr.id}&NetWorkConfigType=tcpip`,
        data,
        config
      )
      Swal.fire('Lưu thành công!', '', 'success')
      onClose()
    } catch (error) {
      console.error(error)
      onClose()

      Swal.fire('Lưu thất bại', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

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
              renderInput={params => <CustomTextField {...params} label='Loại NIC' fullWidth />}
              onFocus={handleComboboxFocus}
            />{' '}
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='MAC Address'
              value={macAddress}
              onChange={e => setMacAddress(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={5.8}>
            <Checkbox checked={dhcp} onChange={() => setDHCP(!dhcp)} /> DHCP
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='MTU' value={mtus} onChange={e => setMTU(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='IPv4 Subnet Mask' value={ipv4} onChange={e => setIpv4(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='IPv4 Default Gateway'
              value={ipv4DefaultGateway}
              onChange={e => setIpv4Default(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Subnet Prefix Length'
              value={subnetPrefixLength}
              onChange={e => setSubnetPrefixLength(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='IPv6 Default Gateway'
              value={ipv6}
              onChange={e => setIpv6(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ fontWeight: 500, backgroundColor: 'lightgray' }}>
          DNS Server
        </Grid>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            <Checkbox checked={autoDNS} onChange={handleCheckboxChange} /> Auto DNS
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Preferred DNS Server'
              value={prefDNS}
              onChange={e => setPrefDNS(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Alternate DNS Server'
              value={alterDNS}
              onChange={e => setAlterDNS(e.target.value)}
              fullWidth
            />
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
          <Button onClick={onClose}>Đóng</Button>
          <Button type='submit' variant='contained' onClick={handleSaveClick}>
            Lưu
          </Button>
        </DialogActions>
      </Grid>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  loadingContainer: {
    position: 'relative',
    minHeight: '100px',
    zIndex: 0
  },
  circularProgress: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999
  }
}))

export default TCP
