import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Checkbox, Switch } from '@mui/material'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

const UserDetails = nvrs => {
  const [readOnly, setReadOnly] = useState(true)
  const [status1, setStatus1] = useState('ACTIVE')
  const [availableAt, setAvailableAt] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [note, setNote] = useState('')
  const [rows, setRows] = useState([])
  const [rows1, setRows1] = useState([])
  const [createAccount, setCreateAccount] = useState(true)
  const [fullNameValue, setFullNameValue] = useState('')
  const [account, setAccount] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [identityNumber, setIdentityNumber] = useState('')
  const [ava1, setAva1] = useState(null)
  const [ava2, setAva2] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleStartDateChange = date => {
    setAvailableAt(date)
    setAva1(isoToEpoch(date))
  }

  function isoToEpoch(isoDateString) {
    var milliseconds = Date.parse(isoDateString)

    var epochSeconds = Math.round(milliseconds)

    return epochSeconds
  }

  const handleFullNameChange = event => {
    setFullNameValue(event.target.value)
  }

  const handleStatusChange = () => {
    setStatus1(status1 === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }
  const formatDDNS = ddns => <Checkbox checked={ddns} disabled />

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8} style={{ fontWeight: 500, backgroundColor: 'lightgray' }}>
            NTP
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8} style={{ fontWeight: 500, backgroundColor: 'lightgray' }}>
            Manual Time Sync
          </Grid>{' '}
          <Grid item xs={5.8}>
            <Switch checked={nvrs.nvrs.ntp} onChange={handleStatusChange} color='primary' />
            NTP
          </Grid>
          <Grid item xs={5.8}>
            <Switch checked={nvrs.nvrs.manualTime} onChange={handleStatusChange} color='primary' />
            ManualTimeSync
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Server Address'
              value={nvrs.nvrs.serverAddressNTP}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <DatePicker
              selected={new Date(nvrs.nvrs.setTime)}
              onChange={handleStartDateChange}
              showTimeSelect
              timeIntervals={15}
              timeCaption='Time'
              dateFormat='MMMM d, yyyy '
              disabled={readOnly}
              customInput={<CustomInput label='Device Time' />}
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='NTP Port' value={nvrs.nvrs.port} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <DatePicker
              selected={new Date(nvrs.nvrs.setTime)}
              onChange={handleStartDateChange}
              showTimeSelect
              timeIntervals={15}
              timeCaption='Time'
              dateFormat='MMMM d, yyyy '
              disabled={readOnly}
              customInput={<CustomInput label='Set Time' />}
            />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Interval' value={nvrs.nvrs.domain} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={5.8} style={{ marginTop: 12 }}>
            {formatDDNS(nvrs.nvrs.dhcp)} Auto DNS
          </Grid>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default UserDetails
