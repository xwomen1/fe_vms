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
import RolePopup from './popup/AddGroup'
import PolicyPopup from './popup/AddPolicy'
import Swal from 'sweetalert2'

const UserDetails = () => {
  const router = useRouter()
  const { userId } = router.query
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupPolicy, setOpenPopupPolicy] = useState(false)
  const [timeValidity, setTimeValidity] = useState('Custom')
  const [user, setUser] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [params, setParams] = useState({})
  const [editing, setEditing] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [leaderOfUnit, setLeaderOfUnit] = useState('')
  const [status, setStatus] = useState('')
  const [status1, setStatus1] = useState('')
  const [availableAt, setAvailableAt] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [note, setNote] = useState('')

  const [timeEndMorning, setTimeEndMorning] = useState('')
  const [timeStartAfternoon, setTimeStartAfternoon] = useState('')
  const [timeEndAfternoon, setTimeEndAfternoon] = useState('')
  const [showPlusColumn, setShowPlusColumn] = useState(false)

  const [dateTime, setDateTime] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [fullNameValue, setFullNameValue] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [identityNumber, setIdentityNumber] = useState('')
  const [userCode, setUserCode] = useState('')
  const [syncCode, setSyncCode] = useState('')

  const [group, setGroup] = useState(null)
  const [policies, setPolicies] = useState(null)
  const [piId, setPiId] = useState(null)
  const [ava1, setAva1] = useState(null)
  const [ava2, setAva2] = useState(null)

  const handleAddRoleClickPolicy = () => {
    setOpenPopupPolicy(true)
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

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Accept',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Yes',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
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

  const handleClosePopupPolicy = () => {
    setOpenPopupPolicy(false) // Đóng Popup khi cần thiết
  }

  const handleAddRoleClick = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false) // Đóng Popup khi cần thiết
  }

  const handleTimeValidityChange = event => {
    setTimeValidity(event.target.value)
  }

  const handleRoleSelect = selectedRole => {
    console.log('Selected Role:', selectedRole)
    fetchUserData()
  }

  const handleRoleSelectPolicy = selectedRole => {
    console.log('Selected Role:', selectedRole)
    fetchUserData()
  }

  const toggleEdit = () => {
    setReadOnly(false)
    setEditing(true)
    setShowPlusColumn(!showPlusColumn)
  }

  const handleGroupChange = (event, newValue) => {
    setDefaultGroup(newValue)
    console.log(newValue)
  }

  const saveChanges = async () => {
    setReadOnly(true)
    setEditing(false)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      await axios.put(
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
          availableAt: ava1,
          expiredAt: ava2,
          note: note
        },
        config
      )
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
    }
  }

  const convertTimeArrayToString = timeArray => {
    if (Array.isArray(timeArray) && timeArray.length >= 2) {
      const [hour, minute] = timeArray

      const formattedMinute = minute < 10 ? `0${minute}` : minute

      return `${hour}:${formattedMinute}`
    } else {
      console.error('Invalid timeArray:', timeArray)

      return null
    }
  }

  const convertStringToTimeArray = timeString => {
    const date = new Date(timeString)
    const hour = date.getHours()
    const minute = date.getMinutes()

    return [hour, minute]
  }

  // Sử dụng hàm
  // console.log(timeArray, 'timearray')
  // const convertStringToTimeArray = timeString => {
  //   if (typeof timeString === 'string') {
  //     const [hourStr, minuteStr] = timeString.split(':').map(str => parseInt(str, 10))

  //     if (!isNaN(hourStr) && !isNaN(minuteStr)) {
  //       return [hourStr, minuteStr]
  //     }
  //   }

  //   console.error('Invalid timeString:', timeString)
  //   return null
  // }

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
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config)

        setGroupOptions(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])
  const formatIsLeader = isLeader => <Checkbox checked={isLeader} disabled />

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config)
      setGroup(response.data.userGroups)
      setPolicies(response.data.policies)
      setPiId(response.data.piId)
      setFullNameValue(response.data.fullName)
      setEmail(response.data.email)
      setPhoneNumber(response.data.phoneNumber)
      setIdentityNumber(response.data.identityNumber)
      setUserCode(response.data.userCode)
      setSyncCode(response.data.syncCode)
      setStatus1(response.data.userStatus)
      setAvailableAt(response.data.availableAt)
      setExpiredAt(response.data.expiredAt)
      setUser(response.data)
      setNote(response.data.note)
      setStatus(response.data.userAccount.accStatus)

      if (response.data.userGroups && response.data.userGroups.length > 0) {
        setDefaultGroup(response.data.userGroups[0])
      }
      if (response.data.userAccount && response.data.userAccount.length > 0) {
        setStatus(response.data.userAccount.accStatus)
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

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

  const handleDeleteRowPolicy = (piId, policyId) => {
    showAlertConfirm({
      text: 'Do you agree to delete it?'
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        if (!token) {
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            piId: piId,
            policyId: policyId
          }
        }

        let urlDelete = `https://dev-ivi.basesystem.one/smc/iam/api/v0/pi-policies`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Deleted successfully', '', 'success')
            fetchUserData()
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.response.data.message, 'error')
          })
      }
    })
  }

  const handleDeleteRow = (userId, groupId) => {
    showAlertConfirm({
      text: 'Do you agree to delete it?'
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        if (!token) {
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        let urlDelete = `https://dev-ivi.basesystem.one/smc/iam/api/v0/user-groups/${userId}/remove?groupId=${groupId}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Deleted successfully', '', 'success')

            // Tùy chỉnh việc cập nhật dữ liệu sau khi xóa
            fetchUserData()
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.message, 'error')
          })
      }
    })
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config)
        setUser(response.data)
        setGroup(response.data.userGroups)
        setPolicies(response.data.policies)
        setPiId(response.data.piId)
        setFullNameValue(response.data.fullName)
        setEmail(response.data.email)
        setPhoneNumber(response.data.phoneNumber)
        setIdentityNumber(response.data.identityNumber)
        setUserCode(response.data.userCode)
        setSyncCode(response.data.syncCode)
        setStatus1(response.data.userStatus)
        setAvailableAt(response.data.availableAt)
        setExpiredAt(response.data.expiredAt)
        setLeaderOfUnit(response.data.userGroups[0].isLeader)
        setNote(response.data.note)
        setStatus(response.data.userAccount.accStatus)

        if (response.data.timeStartMorning) {
          const [hour, minute] = response.data.timeStartMorning
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setDateTime(defaultTime)
        }
        console.log(timeEndMorning) // Kết quả mong muốn

        if (response.data.timeEndMorning) {
          const [hour, minute] = response.data.timeEndMorning
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeEndMorning(defaultTime)
        }
        if (response.data.timeStartAfternoon) {
          const [hour, minute] = response.data.timeStartAfternoon
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeStartAfternoon(defaultTime)
        }
        if (response.data.timeEndAfternoon) {
          const [hour, minute] = response.data.timeEndAfternoon
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeEndAfternoon(defaultTime)
        }

        // setDateTime(convertTimeArrayToString(response.data.timeEndMorning))
        console.log(convertTimeArrayToString(response.data.timeEndMorning))
        if (response.data.userGroups && response.data.userGroups.length > 0) {
          setDefaultGroup(response.data.userGroups[0])
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }
    if (userId) {
      fetchUserData()
    }
  }, [userId, leaderOfUnit])

  const handleCancel = () => {
    fetchUserData()

    setReadOnly(true)
    setEditing(false)
    setShowPlusColumn(!showPlusColumn)
  }
  useEffect(() => {
    fetchUserData()
  }, [])
  console.log('param', params)

  return (
    <div>
      {user ? (
        <div>
          <Grid container spacing={3}>
            <Grid style={{ borderRadius: '0.05%', marginLeft: 10 }}>
              <Grid container spacing={2}>
                <h3 style={{ color: 'black', marginLeft: '1%' }}> Information</h3>
              </Grid>
              <Grid container spacing={2}>
                <div style={{ width: '80%' }}></div>
                {editing ? (
                  <>
                    <Button variant='contained' onClick={saveChanges} sx={{ marginRight: '10px' }}>
                      Save
                    </Button>
                    <Button variant='contained' onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant='contained' onClick={toggleEdit}>
                    Edit
                  </Button>
                )}
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Name'
                    value={fullNameValue}
                    InputProps={{ readOnly: readOnly }}
                    onChange={handleFullNameChange}
                    fullWidth
                  />
                </Grid>
                {console.log(user.userAccount.accStatus)}
                <Grid item xs={4}>
                  <CustomTextField
                    label='Email'
                    value={email}
                    onChange={handleEmailChange}
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3.8}>
                  {' '}
                  {/* Sửa đổi xs={4} thành xs={8} */}
                  <CustomTextField
                    label='Phone Number'
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    InputProps={{ readOnly: readOnly }}
                    fullWidth // Thêm thuộc tính fullWidth vào đây
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Identify number'
                    value={identityNumber}
                    onChange={handleIdentityNumberChange}
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Code'
                    defaultValue={userCode}
                    onChange={handleUserCodeChange}
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3.8}>
                  <CustomTextField
                    label='Synchronize code'
                    defaultValue={syncCode}
                    onChange={handleSyncCodeChange}
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                  Status
                  <Switch
                    checked={status1 === 'ACTIVE'}
                    onChange={handleStatusChange}
                    color='primary'
                    label='Status'
                    disabled={readOnly}
                  />
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
                          disabled={readOnly}
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
                          disabled={readOnly}
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
                          disabled={readOnly}
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
                          disabled={readOnly}
                          dateFormat='h:mm '
                          id='time-only-picker'
                          onChange={date => handleTimeEndAfternoonChange(date)}
                          customInput={<CustomInput />}
                        />
                      </div>
                    </Box>
                  </DatePickerWrapper>
                </Grid>
                {/* <Grid item ={1} style={{ marginTop: '2%' }}></Grid> */}
                <Grid item xs={3.8}>
                  <FormControl fullWidth>
                    <InputLabel id='time-validity-label'>Validity period</InputLabel>
                    <Select
                      labelId='time-validity-label'
                      id='time-validity-select'
                      value={timeValidity}
                      disabled={readOnly}
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
                      {user.availableAt && (
                        <Grid item xs={4}>
                          <DatePicker
                            selected={new Date(availableAt)}
                            onChange={handleStartDateChange}
                            showTimeSelect
                            timeIntervals={15}
                            timeCaption='Time'
                            dateFormat='MMMM d, yyyy '
                            disabled={readOnly}
                            customInput={<CustomInput label='Start date' />}
                          />
                        </Grid>
                      )}
                      {user.expiredAt && (
                        <Grid item xs={4}>
                          <DatePicker
                            selected={new Date(expiredAt)}
                            onChange={handleEndDateChange}
                            showTimeSelect
                            timeIntervals={15}
                            timeCaption='Time'
                            disabled={readOnly}
                            dateFormat='MMMM d, yyyy '
                            customInput={<CustomInput label='End date' />}
                          />
                        </Grid>
                      )}
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={11.8}>
                  <CustomTextField
                    rows={4}
                    multiline
                    label='Note'
                    value={note}
                    onChange={handleNoteChange}
                    id='textarea-outlined-static'
                    fullWidth
                    InputProps={{ readOnly: readOnly }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h5'>Group</Typography>
                </Grid>
                <Grid item xs={11.8}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Group</TableCell>
                          <TableCell>Group Code</TableCell>
                          <TableCell align='right'>Is Leader</TableCell>
                          {showPlusColumn && (
                            <TableCell align='center'>
                              <IconButton onClick={handleAddRoleClick} size='small' sx={{ marginLeft: '10px' }}>
                                <Icon icon='bi:plus' />
                              </IconButton>
                              <RolePopup
                                open={openPopup}
                                onClose={handleClosePopup}
                                onSelect={handleRoleSelect}
                                userId={userId}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.map((group, index) => (
                          <TableRow key={index}>
                            <TableCell>{group.groupName}</TableCell>

                            <TableCell>{group.groupCode}</TableCell>
                            <TableCell align='right'>
                              {/* Render formatted content in isLeader column */}
                              {formatIsLeader(group.isLeader)}
                            </TableCell>
                            {showPlusColumn && (
                              <TableCell align='center'>
                                <IconButton onClick={() => handleDeleteRow(userId, group.groupId)}>
                                  <Icon icon='bi:trash' />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h5'>Account Information</Typography>
                </Grid>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Account'
                    defaultValue={user?.userAccount.username}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Account Type'
                    defaultValue={user?.userAccount.identityProviderType}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={status === 'ACTIVE'}
                        onChange={e => {
                          setStatus(status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                          const newStatus = e.target.checked ? 'true' : 'false'
                          const token = localStorage.getItem(authConfig.storageTokenKeyName)
                          fetch(
                            `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}/enable-account?enabled=${newStatus}`,
                            {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}` // Passing the token as a bearer token
                              }
                            }
                          )
                            .then(response => {
                              if (!response.ok) {
                                throw new Error('Failed to update account status')
                              }

                              return response.json()
                            })
                            .then(data => {
                              console.log('Account status updated:', data)
                            })
                            .catch(error => {
                              console.error('Error updating account status:', error)
                            })
                        }}
                        color='primary'
                        disabled={readOnly}
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
                          {showPlusColumn && (
                            <TableCell align='center'>
                              <IconButton onClick={handleAddRoleClickPolicy} size='small' sx={{ marginLeft: '10px' }}>
                                <Icon icon='bi:plus' />
                              </IconButton>
                              <PolicyPopup
                                open={openPopupPolicy}
                                onClose={handleClosePopupPolicy}
                                onSelect={handleRoleSelectPolicy}
                                userId={userId}
                                piId={piId}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {policies.map((policies, index) => (
                          <TableRow key={index}>
                            <TableCell>{policies.policyName}</TableCell>

                            <TableCell>{policies.description}</TableCell>
                            {showPlusColumn && (
                              <TableCell align='center'>
                                <IconButton onClick={() => handleDeleteRowPolicy(piId, policies.policyId)}>
                                  <Icon icon='bi:trash' />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <br></br>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default UserDetails
