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

const nicTypeOptions = [
  { label: 'Auto', value: 'option1' },
  { label: '10M Half-Dup', value: 'option2' },
  { label: '10M Full-Dup', value: 'option3' },
  { label: '100M Half-Dup', value: 'option4' },
  { label: '100M Full-Dup', value: 'option5' }
]

const TCPIP = nvrs => {
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
  const [syncCode, setSyncCode] = useState('')
  const [ava1, setAva1] = useState(null)
  const [ava2, setAva2] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedNicType, setSelectedNicType] = useState(nvrs?.nvrs?.ddnsType?.name)

  const handleNicTypeChange = (event, newValue) => {
    setSelectedNicType(newValue)
  }

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
  console.log('New start date:', isoToEpoch(availableAt))
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

  console.log('param', nvrs.nvrs.ddnsType)
  const formatDDNS = ddns => <Checkbox checked={ddns} disabled />

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            <Autocomplete
              value={selectedNicType}
              onChange={handleNicTypeChange}
              options={nicTypeOptions.map(option => option.label)}
              renderInput={params => <TextField {...params} label='Loại NIC' fullWidth />}
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='MAC Address' value={nvrs.nvrs.macAddress} onChange={handleEmailChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            {formatDDNS(nvrs.nvrs.dhcp)} DHCP
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='MTU' value={nvrs.nvrs.mtu} onChange={handleEmailChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='IPv4 Subnet Mask'
              value={nvrs.nvrs.ipv4SubnetMask}
              onChange={handleFullNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='IPv4 Default Gateway'
              value={nvrs.nvrs.ipv4DefaultGateway}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Subnet Prefix Length'
              value={nvrs.nvrs.subnetPrefixLength}
              onChange={handleFullNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='IPv6 Default Gateway'
              value={nvrs.nvrs.ipv6DefaultGateway}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ fontWeight: 500, backgroundColor: 'lightgray' }}>
          DNS Server
        </Grid>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            {formatDDNS(nvrs.nvrs.dhcp)} Auto DNS
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Preferred DNS Server'
              value={nvrs.nvrs.autoDNS}
              onChange={handleFullNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Alternnate DNS Server'
              value={nvrs.nvrs.alterDNS}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default TCPIP
