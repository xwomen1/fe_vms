import { useRouter } from 'next/router'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import {
  Grid,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
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
import RolePopup from './detail/popup/AddGroup'
import PolicyPopup from './detail/popup/AddPolicy'
import Swal from 'sweetalert2'
import Link from 'next/link'

const Add = () => {
  const router = useRouter()
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
  const [timeEndMorning, setTimeEndMorning] = useState(new Date())
  const [timeStartAfternoon, setTimeStartAfternoon] = useState(new Date())
  const [timeEndAfternoon, setTimeEndAfternoon] = useState(new Date())
  const [dateTime, setDateTime] = useState(new Date())
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
  const [userId, setUserId] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectContract, setSelectContract] = useState('')
  const [contractOptions, setContractOptions] = useState([])
  const [filteredRegionOptions, setFilteredRegionOptions] = useState(user?.level)
  const [filteredContractOptions, setFilteredContractOptions] = useState(user?.contractType)
  const [gender, setGender] = useState('')
  const [isLeader, setIsLeader] = useState(false)
  const [groups, setGroup] = useState([])

  let groupACIds = []
  const [regionOptions, setRegionOptions] = useState([])

  const handleAddRow = () => {
    const newRow = { groupName: '', code: '', id: '', isLeader: '' } // Thêm groupId vào đây
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

  const handleUserCodeChange = event => {
    setUserCode(event.target.value)
  }

  const handleSyncCodeChange = event => {
    setSyncCode(event.target.value)
  }
  const policyList = rows1.map(row => row.policyId)
  console.log(policyList, 'ploust')

  const handleGenderChange = event => {
    setGender(event.target.value)
  }

  const handleTimeValidityChange = event => {
    setTimeValidity(event.target.value)
  }
  useEffect(() => {
    if (timeValidity === 'Undefined') {
      setAvailableAt(null)
      setExpiredAt(null)
    }
  }, [timeValidity])

  // const userGroups = rows.map(row => ({
  //   groupId: row.id,
  //   policyName: true,
  //   isLeader: false
  // }))
  const fetchRegionName = async regionId => {
    try {
      const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${regionId}`)

      return response.data.name
    } catch (error) {
      console.error('Error fetching region name:', error)

      return ''
    }
  }

  const handleRegionChange = selectedOption => {
    setSelectedRegion(selectedOption)

    const selectedRegionId = selectedOption ? selectedOption.id : null
    const filteredRegions = regionOptions.filter(region => region.parentId === selectedRegionId)
    setFilteredRegionOptions(selectedRegionId)
    console.log(selectedOption, 'filterregion')
  }

  const handleContractChange = selectedOption => {
    setSelectContract(selectedOption)

    const selectedContractId = selectedOption ? selectedOption.id : null
    setFilteredContractOptions(selectedContractId)
  }

  const userPolicy = rows1.map(row => ({
    policyId: row.policyId
  }))

  const saveChanges = async () => {
    if (password !== confirmPassword) {
      Swal.fire('error!', 'Password and confirm password do not match.', 'error')

      return
    }
    if (!fullNameValue || fullNameValue.length <= 3) {
      Swal.fire({
        title: 'error!',
        text: 'error!, Name cannot be blank and length must be >3',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (!gender) {
      Swal.fire({
        title: 'error!',
        text: 'error! Gender cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (!email) {
      Swal.fire({
        title: 'error!',
        text: 'error! Email cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (!phoneNumber) {
      Swal.fire({
        title: 'error!',
        text: 'error! Phone Number  cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }

    if (!userCode) {
      Swal.fire({
        title: 'error!',
        text: 'error! userCode  cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }

    if (!account) {
      Swal.fire({
        title: 'error!',
        text: 'error! Account  cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (userGroups.length === 0) {
      Swal.fire({
        title: 'error!',
        text: 'error! Department cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'error!',
        text: 'error! Invalid email address',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (password.length < 6) {
      Swal.fire({
        title: 'error!',
        text: 'error! Password must contain at least 6 characters.',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/
    if (!passwordRegex.test(password)) {
      Swal.fire({
        title: 'error!',
        text: 'error! Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',

        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      const processedGroups = await userGroups(rows) // Call the userGroups function passing rows
      const genderMapping = { MALE: 'MALE', FEMALE: 'FEMALE', OTHER: 'OTHER' }

      if (processedGroups.length === 0) {
        Swal.fire({
          title: 'error!',
          text: 'error! Department User cannot leave blank.',
          willOpen: () => {
            const confirmButton = Swal.getConfirmButton()
            if (confirmButton) {
              confirmButton.style.backgroundColor = '#002060'
              confirmButton.style.color = 'white'
            }
          }
        })

        return
      }
      console.log()

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        `https://dev-ivi.basesystem.one/smc/iam/api/v0/users`,
        {
          ...params,
          userId: userId,
          fullName: fullNameValue,
          email: email,
          phoneNumber: phoneNumber,
          identityNumber: identityNumber,
          userCode: userCode,
          syncCode: syncCode,
          userStatus: status1,
          timeEndAfternoon: convertStringToTimeArray(timeEndAfternoon),
          timeStartAfternoon: convertStringToTimeArray(timeStartAfternoon),
          timeStartMorning: convertStringToTimeArray(dateTime),
          timeEndMorning: convertStringToTimeArray(timeEndMorning),
          availableAt: ava1 || null,
          expiredAt: ava2 || null,
          gender: gender,
          note: note,
          policyIds: policyList,
          level: filteredRegionOptions || selectedRegion.id,
          contractType: filteredContractOptions || selectContract.id,
          userGroups: processedGroups,
          userAccount: {
            accStatus: 'ACTIVE',
            username: account,
            password: password,
            identityProviderType: 'LOCAL'
          }
        },
        config
      )

      if (groupACIds.length > 0) {
        await addMemberToGroup(groupACIds, response.data.userId)
      } else {
        console.error('There is no groupACId in the array.')
      }

      Swal.fire({
        title: 'Successful!',
        text: 'Add user successfully',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
      router.push(`/apps/user/detail/${response.data.userId}`)
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('error!', error?.response?.data?.message, 'error')
    }
  }

  const createNewGroup = async (groupName, groupCode) => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://dev-ivi.basesystem.one/smc/iam/api/v0/groups',
        {
          groupName: groupName,
          groupCode: groupCode,
          isPnLVGR: false
        },
        config
      )
      if (response.data && response.data.groupACId) {
        groupACIds.push(response.data.groupACId)
      } else {
        throw new Error('Unable to get groupACId from API')
      }

      return response.data.groupId
    } catch (error) {
      throw error
    }
  }

  const addMemberToGroup = async (groupId, userId) => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access`,
        { userGroupIds: groupId, userId: userId },
        config
      )

      return response.data
    } catch (error) {
      console.error('Error adding member to group:', error)
      throw error
    }
  }

  const userGroups = async rows => {
    try {
      const processedGroups = []
      for (const row of rows) {
        const groupId = await createNewGroup(row.name, row.code)

        const userGroup = {
          groupId: groupId,
          policyName: true,
          isLeader: row.isLeader
        }
        processedGroups.push(userGroup)
        console.log(userGroup)
      }

      return processedGroups
    } catch (error) {
      throw error
    }
  }

  const convertStringToTimeArray = timeString => {
    const date = new Date(timeString)
    const hour = date.getHours()
    const minute = date.getMinutes()

    return [hour, minute]
  }

  const handleDeleteRow = index => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          'https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=level'
        )

        const regions = response.data.map(region => ({
          value: region.name,
          label: region.name,
          id: region.id
        }))
        setRegionOptions(regions)

        console.log(regions)
      } catch (error) {
        console.error('Error fetching regions:', error)
      }
    }

    fetchRegions()
  }, [])
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          'https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=contracttype'
        )

        const regions = response.data.map(region => ({
          value: region.name,
          label: region.name,
          id: region.id
        }))
        setContractOptions(regions)

        console.log(regions)
      } catch (error) {
        console.error('Error fetching regions:', error)
      }
    }

    fetchRegions()
  }, [])

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(
          'https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=company',
          config
        )

        setGroupOptions(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/policies/search', config)

        setPolicy(response.data.rows)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])
  const formatIsLeader = isLeader => <Checkbox checked={isLeader} disabled />

  const handleTimeChange = newValue => {
    setDateTime(newValue)
  }

  const handleTimeEndMorningChange = newValue => {
    setTimeEndMorning(newValue)
  }

  const handleTimeStartAfetrnoonChange = newValue => {
    setTimeStartAfternoon(newValue)
  }

  const handleTimeEndAfternoonChange = newValue => {
    setTimeEndAfternoon(newValue)
  }

  console.log('param', params)

  return (
    <div>
      <Grid container spacing={3} component={Paper}>
        <Grid style={{ borderRadius: '0.05%' }}>
          <Grid container spacing={2} item xs={5}>
            <IconButton size='small' component={Link} href={`/apps/user/list`} sx={{ color: 'text.secondary' }}>
              <Icon icon='tabler:chevron-left' />
            </IconButton>

            <h2 style={{ color: 'black' }}>Add New User</h2>
          </Grid>
          <Grid container spacing={2}>
            <div style={{ width: '80%' }}></div>
            <>
              <Button variant='contained' component={Link} href={`/apps/user/list`}>
                Cancel
              </Button>
              <Button variant='contained' onClick={saveChanges} sx={{ marginLeft: '10px' }}>
                Save
              </Button>
            </>
          </Grid>
          <Grid item xs={12} style={{ height: 10 }}>
            {' '}
          </Grid>
          <Grid container spacing={2} style={{ marginLeft: 10 }}>
            <Grid item xs={4}>
              <TextField label='Name*' onChange={handleFullNameChange} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <TextField label='Email*' onChange={handleEmailChange} fullWidth />
            </Grid>
            <Grid item xs={3.8}>
              <TextField label='Phone Number*' onChange={handlePhoneNumberChange} fullWidth />
            </Grid>
            <Grid item xs={4}>
              {/* Update Select to use the gender state */}
              <FormControl fullWidth>
                <InputLabel id='gender-label'>Gender*</InputLabel>
                <Select
                  labelId='gender-label'
                  id='gender-select'
                  value={gender} // Use the gender state
                  onChange={handleGenderChange} // Update onChange handler
                >
                  {/* MenuItems for gender options */}
                  <MenuItem value='MALE'>MALE</MenuItem>
                  <MenuItem value='FEMALE'>FEMALE</MenuItem>
                  <MenuItem value='OTHER'>OTHER</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField label='Identify number*' onChange={handleIdentityNumberChange} fullWidth />
            </Grid>
            <Grid item xs={3.8}>
              <TextField label='Code*' onChange={handleUserCodeChange} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <TextField label='Synchronize code' onChange={handleSyncCodeChange} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id='region-label'>Level</InputLabel>
                <Select
                  labelId='region-label'
                  id='region-select'
                  value={selectedRegion ? selectedRegion.id : ''}
                  onChange={e => handleRegionChange(regionOptions.find(opt => opt.id === e.target.value))}
                >
                  {regionOptions.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='region-label'>Contract Type</InputLabel>
                <Select
                  labelId='region-label'
                  id='region-select'
                  value={selectContract ? selectContract.id : ''}
                  onChange={e => handleContractChange(contractOptions.find(opt => opt.id === e.target.value))}
                >
                  {contractOptions.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>{' '}
            </Grid>
            <Grid item xs={2} style={{ marginTop: '1.1%' }}>
              Status
              <Switch checked={status1 === 'ACTIVE'} onChange={handleStatusChange} color='primary' label='Status' />
            </Grid>
            <Grid item xs={1} style={{ marginTop: '2%' }}>
              Morning shift:
            </Grid>

            <Grid item xs={1}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      showTimeSelect
                      selected={dateTime}
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat='h:mm '
                      id='time-only-picker'
                      onChange={date => handleTimeChange(date)}
                      customInput={<CustomInput />}
                    />
                  </div>
                </Box>
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={1}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      showTimeSelect
                      selected={timeEndMorning}
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat='h:mm '
                      id='time-only-picker'
                      onChange={date => handleTimeEndMorningChange(date)}
                      customInput={<CustomInput />}
                    />
                  </div>
                </Box>
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={1} style={{ marginTop: '2%' }}>
              Afternoon shift:
            </Grid>
            <Grid item xs={1}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      showTimeSelect
                      selected={timeStartAfternoon}
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat='h:mm '
                      id='time-only-picker'
                      onChange={date => handleTimeStartAfetrnoonChange(date)}
                      customInput={<CustomInput />}
                    />
                  </div>
                </Box>
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={1}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      showTimeSelect
                      selected={timeEndAfternoon}
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat='h:mm '
                      id='time-only-picker'
                      onChange={date => handleTimeEndAfternoonChange(date)}
                      customInput={<CustomInput />}
                    />
                  </div>
                </Box>
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Validity period</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                  value={timeValidity}
                  onChange={handleTimeValidityChange}
                >
                  <MenuItem value='Custom'>Custom</MenuItem>
                  <MenuItem value='Undefined'>None</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              {timeValidity === 'Custom' && (
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <DatePickerWrapper>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                        <div>
                          <DatePicker
                            selected={availableAt}
                            onChange={handleStartDateChange}
                            dateFormat='MM/dd/yyyy'
                            customInput={<CustomInput label='Start date' />}
                          />
                        </div>
                      </Box>
                    </DatePickerWrapper>
                  </Grid>
                  <Grid item xs={4}>
                    <DatePickerWrapper>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                        <div>
                          <DatePicker
                            selected={expiredAt}
                            onChange={handleEndDateChange}
                            dateFormat='MM/dd/yyyy'
                            customInput={<CustomInput label='End date' />}
                          />
                        </div>
                      </Box>
                    </DatePickerWrapper>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item xs={11.8}>
              <TextField rows={4} multiline label='Note' onChange={handleNoteChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5'>Department*</Typography>
            </Grid>
            <Grid item xs={11.8}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Department</TableCell>
                      <TableCell>Department Code</TableCell>
                      <TableCell align='right'>Is Leader</TableCell>
                      <TableCell align='center'>
                        <IconButton size='small' onClick={handleAddRow} sx={{ marginLeft: '10px' }}>
                          <Icon icon='bi:plus' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Autocomplete
                            options={groupOptions}
                            getOptionLabel={option => option.name}
                            value={row.name}
                            onChange={(event, newValue) => {
                              const updatedRows = [...rows]
                              updatedRows[index].name = newValue.name
                              updatedRows[index].code = newValue.code

                              // updatedRows[index].id = newValue.id
                              setRows(updatedRows)
                            }}
                            renderInput={params => <TextField {...params} label='Department' />}
                          />
                        </TableCell>
                        {console.log(rows)}
                        <TableCell>{row.code}</TableCell>
                        <TableCell align='right'>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={row.isLeader}
                                onChange={event => {
                                  const updatedRows = [...rows]
                                  updatedRows[index].isLeader = event.target.checked // Cập nhật giá trị isLeader
                                  setRows(updatedRows)
                                  setIsLeader(event.target.checked) // Cập nhật state isLeader
                                }}
                              />
                            }
                            label='Is Leader'
                          />
                        </TableCell>{' '}
                        <TableCell align='center'>
                          <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                            <Icon icon='bi:trash' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginLeft: 10 }}></Grid>
          <br></br>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={createAccount} onChange={handleCreateAccountChange} color='primary' />}
              label='Create Login Account'
              labelPlacement='start'
            />
          </Grid>
          {createAccount && (
            <Grid container spacing={2} style={{ marginLeft: 10 }}>
              <Grid item xs={12}>
                <Typography variant='h5'>Create Login Account</Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField label='Account*' onChange={handleAccountChange} fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label='Password*' type='password' onChange={handlePasswordChange} fullWidth />
              </Grid>
              <Grid item xs={3.8}>
                <TextField label='Confirm password*' type='password' onChange={handleConfirmPasswordChange} fullWidth />
              </Grid>
              <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={status === 'ACTIVE'}
                      onChange={e => {
                        setStatus(status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                      }}
                      color='primary'
                    />
                  }
                  label='Status'
                  labelPlacement='start'
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5'>Role</Typography>
              </Grid>
              <Grid item xs={11.8}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align='center'>
                          <IconButton onClick={handleAddRow1} size='small' sx={{ marginLeft: '10px' }}>
                            <Icon icon='bi:plus' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows1.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Autocomplete
                              options={policy}
                              getOptionLabel={option => option.policyName}
                              value={row.name}
                              onChange={(event, newValue) => {
                                const updatedRows = [...rows1]
                                updatedRows[index].policyName = newValue.policyName
                                updatedRows[index].description = newValue.description
                                updatedRows[index].policyId = newValue.policyId
                                setRows1(updatedRows)
                              }}
                              renderInput={params => <TextField {...params} label='Role' />}
                            />
                          </TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell align='center'>
                            <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                              <Icon icon='bi:trash' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <br></br>
    </div>
  )
}

export default Add
