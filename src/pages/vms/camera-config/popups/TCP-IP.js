import { useRouter } from 'next/router'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Grid,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import Swal from 'sweetalert2'
import Link from 'next/link'
import Alert from '@mui/material/Alert'

const multicastOption = [
  { label: 'ENABLE', value: 'option1' },
  { label: 'DISABLE', value: 'option2' }
]

const TCP = (cameras, nic) => {
  const router = useRouter()
  const { id } = router.query
  const [timeValidity, setTimeValidity] = useState('Custom')
  const [user, setUser] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [params, setParams] = useState({})
  const [editing, setEditing] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [policy, setPolicy] = useState([])
  const [status, setStatus] = useState('ACTIVE')
  const [status1, setStatus1] = useState('ACTIVE')
  const [availableAt, setAvailableAt] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [note, setNote] = useState('')
  const [rows, setRows] = useState([])
  const [rows1, setRows1] = useState([])
  const [createAccount, setCreateAccount] = useState(true)
  const [timeEndMorning, setTimeEndMorning] = useState('')
  const [timeStartAfternoon, setTimeStartAfternoon] = useState('')
  const [timeEndAfternoon, setTimeEndAfternoon] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [fullNameValue, setFullNameValue] = useState('')
  const [account, setAccount] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [identityNumber, setIdentityNumber] = useState('')
  const [userCode, setUserCode] = useState('')
  const [camera, setCamera] = useState('')
  const [ava1, setAva1] = useState(null)
  const [ava2, setAva2] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [multicast, setMulticast] = useState(cameras.camera.multicast)
  const [nicTypeOptions, setNicTypeOptions] = useState([])
  const defaultValue = cameras.camera.nicType?.name
  const [selectedNicType, setSelectedNicType] = useState(cameras.camera.nicType?.name || '')

  console.log(selectedNicType)

  const handleMulticastChange = (event, newValue) => {
    setMulticast(newValue)
  }

  const handleNicTypeChange = (event, newValue) => {
    setSelectedNicType(newValue)
  }
  const [loading, setLoading] = useState(false)

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

      const nicTypes = response.data.data.map(item => ({
        label: item.name,
        value: item.value
      }))
      setNicTypeOptions(nicTypes)

      // Set selectedNicType here based on your business logic
      if (nicTypes.length > 0) {
        setSelectedNicType(nicTypes[0].value) // Set it to the first value in the array, or adjust as needed
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComboboxFocus = () => {
    if (nicTypeOptions.length === 0) {
      fetchNicTypes()
    }
  }

  console.log(cameras)

  const handleAddRow = () => {
    const newRow = { groupName: '', groupCode: '', groupId: '' } // Thêm groupId vào đây
    setRows([...rows, newRow])
  }

  const handleAddRow1 = () => {
    const newRow1 = { policyName: '', description: '' }
    setRows1([...rows1, newRow1])
  }

  const handleCreateAccountChange = event => {
    setCreateAccount(event.target.checked)
  }

  const handleStartDateChange = date => {
    setAvailableAt(date)
    setAva1(isoToEpoch(date))
  }

  const handleEndDateChange = date => {
    setExpiredAt(date)
    setAva2(isoToEpoch(date))
  }
  console.log('New start date:', camera)
  function isoToEpoch(isoDateString) {
    var milliseconds = Date.parse(isoDateString)

    var epochSeconds = Math.round(milliseconds)

    return epochSeconds
  }

  const handleFullNameChange = event => {
    setFullNameValue(event.target.value)
  }

  const handleAccountChange = event => {
    setAccount(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
  }

  const handleStatusChange = () => {
    setStatus1(status1 === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
  }

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

  const formatDDNS = ddns => <Checkbox checked={ddns} disabled />
  console.log('Camera object:', cameras.camera)
  console.log('NIC Type:', cameras.camera.nicType)

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            <Autocomplete
              defaultValue={cameras.camera?.dhcp || ''}
              onChange={handleNicTypeChange}
              options={nicTypeOptions}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='Loại NIC' fullWidth />}
              onFocus={handleComboboxFocus}
              loading={loading}
            />
          </Grid>
          {console.log(cameras.camera.nicType?.name)}

          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <Switch checked={cameras.camera?.dhcp} color='primary' />
            DHCP
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='MTU' value={cameras.camera.mtu} onChange={handleEmailChange} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <CustomTextField label='Multicast Address' onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            {formatDDNS(cameras?.camera.ddns)} Enable Multicast Discovery
          </Grid>
          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <CustomTextField
              label='Preferred DNS Server              '
              value={cameras.camera.prefDNS}
              onChange={handleFullNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Alternate DNS Server
              '
              value={cameras.camera.alterDNS}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item xs={0.4}></Grid>
      </Grid>
      <br />
    </div>
  )
}

export default TCP
