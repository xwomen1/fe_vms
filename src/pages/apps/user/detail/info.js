import { useRouter } from 'next/router'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, IconButton, Button, FormControlLabel, Checkbox, Switch, TextField, Typography } from '@mui/material'
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

  const [user, setUser] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [selectedRole, setSelectedRole] = useState(null)

  const [editing, setEditing] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [leaderOfUnit, setLeaderOfUnit] = useState('')
  const [status, setStatus] = useState('')
  const [timeEndMorning, setTimeEndMorning] = useState('')
  const [timeStartAfternoon, setTimeStartAfternoon] = useState('')
  const [timeEndAfternoon, setTimeEndAfternoon] = useState('')
  const [showPlusColumn, setShowPlusColumn] = useState(false)

  const [dateTime, setDateTime] = useState('')
  const [timeStart, setTimeStart] = useState(new Date())

  const [group, setGroup] = useState(null)
  const [policies, setPolicies] = useState(null)
  const [piId, setPiId] = useState(null)

  const handleAddRoleClickPolicy = () => {
    setOpenPopupPolicy(true)
  }
  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
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
  const handleRoleSelect = selectedRole => {
    console.log('Selected Role:', selectedRole)
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
  const handleAddRow = () => {
    setGroup(prevGroup => [...prevGroup, { groupName: '' }])
  }
  const handleAddRow1 = () => {
    setGroup(prevGroup => [...prevGroup, { groupName: '' }])
  }

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

        setGroupOptions(response.data.data)
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
      setGroup(response.data.data.userGroups)
      setPolicies(response.data.data.policies)
      setPiId(response.data.data.piId)

      setUser(response.data.data)
      if (response.data.data.userGroups && response.data.data.userGroups.length > 0) {
        setDefaultGroup(response.data.data.userGroups[0])
      }
      if (response.data.data.userAccount && response.data.data.userAccount.length > 0) {
        setStatus(response.data.data.userAccount.accStatus)
      }

      console.log(response.data.data.userAccount.accStatus)
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }
  const handleTimeChange = newValue => {
    setDateTime(newValue) // Thay đổi từ time thành dateTime
  }
  const handleAvailableChange = newValue => {
    setTimeStart(newValue) // Thay đổi từ time thành dateTime
  }
  const handleTimeEndMorningChange = newValue => {
    setTimeEndMorning(newValue) // Thay đổi từ time thành dateTime
  }

  const handleTimeStartAfetrnoonChange = newValue => {
    setTimeStartAfternoon(newValue) // Thay đổi từ time thành dateTime
  }

  const handleTimeEndAfternoonChange = newValue => {
    setTimeEndAfternoon(newValue) // Thay đổi từ time thành dateTime
  }
  const handleDeleteRowPolicy = (piId, policyId) => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?'
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
            Swal.fire('Xóa thành công', '', 'success')
            // Tùy chỉnh việc cập nhật dữ liệu sau khi xóa
            fetchUserData()
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.message, 'error')
          })
      }
    })
  }
  const handleDeleteRow = (userId, groupId) => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?'
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
            Swal.fire('Xóa thành công', '', 'success')
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
        setUser(response.data.data)
        setGroup(response.data.data.userGroups)
        setPolicies(response.data.data.policies)
        setPiId(response.data.data.piId)

        setLeaderOfUnit(response.data.data.userGroups[0].isLeader)
        if (response.data.data.timeStartMorning) {
          const [hour, minute] = response.data.data.timeStartMorning
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setDateTime(defaultTime)
        }
        console.log(timeEndMorning) // Kết quả mong muốn

        if (response.data.data.timeEndMorning) {
          const [hour, minute] = response.data.data.timeEndMorning
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeEndMorning(defaultTime)
        }
        if (response.data.data.timeStartAfternoon) {
          const [hour, minute] = response.data.data.timeStartAfternoon
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeStartAfternoon(defaultTime)
        }
        if (response.data.data.timeEndAfternoon) {
          const [hour, minute] = response.data.data.timeEndAfternoon
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeEndAfternoon(defaultTime)
        }
        // setDateTime(convertTimeArrayToString(response.data.data.timeEndMorning))
        console.log(convertTimeArrayToString(response.data.data.timeEndMorning))
        if (response.data.data.userGroups && response.data.data.userGroups.length > 0) {
          setDefaultGroup(response.data.data.userGroups[0])
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
    router.reload()

    setUser({
      ...user,
      fullName: '',
      email: ''
    })
  }

  return (
    <div>
      {user ? (
        <div>
          <Grid container spacing={3}>
            <Grid style={{ backgroundColor: 'white', borderRadius: '0.05%' }}>
              <Grid container spacing={2}>
                <h3 style={{ color: 'black', marginLeft: '1%' }}> Thông tin người dùng</h3>
              </Grid>
              <Grid container spacing={2}>
                <div style={{ width: '80%' }}></div>
                {editing ? (
                  <>
                    <Button variant='contained' onClick={saveChanges} sx={{ marginRight: '10px' }}>
                      Lưu
                    </Button>
                    <Button variant='contained' onClick={handleCancel}>
                      Huỷ
                    </Button>
                  </>
                ) : (
                  <Button variant='contained' onClick={toggleEdit}>
                    Chỉnh sửa
                  </Button>
                )}
              </Grid>
              <Grid container spacing={2} style={{ marginLeft: 10 }}>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Tên'
                    defaultValue={user.fullName}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                {console.log(user.userAccount.accStatus)}
                <Grid item xs={4}>
                  {' '}
                  <CustomTextField
                    label='Email'
                    defaultValue={user.email}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3.8}>
                  {' '}
                  {/* Sửa đổi xs={4} thành xs={8} */}
                  <CustomTextField
                    label='Số điện thoại'
                    defaultValue={user.phoneNumber}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth // Thêm thuộc tính fullWidth vào đây
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Số giấy tờ'
                    defaultValue={user.identityNumber}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Mã người dùng'
                    defaultValue={user.userCode}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3.8}>
                  <CustomTextField
                    label='Mã đồng bộ'
                    defaultValue={user.syncCode}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={4}>
                  <Autocomplete
                    value={defaultGroup} // Sử dụng defaultGroup làm giá trị của Autocomplete
                    onChange={(event, newValue) => handleGroupChange(event, newValue)} // Xử lý sự kiện khi giá trị của Autocomplete thay đổi
                    disabled={readOnly}
                    // onInputChange={(event, newInputValue) => handleFilterGroup(newInputValue)} // Gọi hàm handleFilterGroup khi người dùng nhập vào trường Autocomplete
                    options={groupOptions} // Sử dụng groupOptions làm danh sách các nhóm cho Autocomplete
                    getOptionLabel={option => option.groupName} // Lấy nhãn của mỗi option trong danh sách nhóm
                    renderInput={params => <TextField {...params} label='Nhóm' variant='outlined' />}
                  />
                </Grid>

                <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={leaderOfUnit}
                        onChange={e => setLeaderOfUnit(e.target.checked)}
                        disabled={readOnly}
                      />
                    } // Sử dụng state leaderOfUnit để đánh dấu checkbox
                    label='Là lãnh đạo đơn vị'
                  />
                </Grid>
                <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.userAccount.accStatus === 'ACTIVE'} // Kiểm tra nếu trạng thái là ACTIVE thì switch = true, ngược lại là false
                        onChange={() => setStatus(status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')} // Đảo ngược trạng thái khi switch được bật hoặc tắt
                        color='primary'
                        disabled={readOnly}
                      />
                    }
                    label='Trạng thái'
                    labelPlacement='start'
                  />
                </Grid>
                <Grid item xs={3.8}>
                  <CustomTextField
                    label='Thời gian hiệu lực
      '
                    defaultValue={user?.customizeTime}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1} style={{ marginTop: '2%' }}>
                  Ca sáng:
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
                <Grid item xs={0.1}></Grid>
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
                <Grid item xs={1} style={{ marginTop: '2%' }}></Grid>
                <Grid item xs={0.7} style={{ marginTop: '2%' }}>
                  {' '}
                  Ca chiều:
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
                <Grid item xs={0.1}></Grid>
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
                <Grid item xs={1} style={{ marginTop: '2%' }}></Grid>
                {user.availableAt && (
                  <Grid item xs={2}>
                    <DatePicker
                      selected={new Date(user?.availableAt)}
                      id='basic-input'
                      onChange={date => handleAvailableChange(date)}
                      placeholderText='Click to select a date'
                      fullWidth
                      customInput={<CustomInput label='Ngày bắt đầu' />}
                    />
                  </Grid>
                )}
                {user.expiredAt && (
                  <Grid item xs={2}>
                    <DatePicker
                      selected={new Date(user?.expiredAt)}
                      id='basic-input'
                      onChange={date => handleAvailableChange(date)}
                      placeholderText='Click to select a date'
                      customInput={<CustomInput label='Ngày kết thúc' />}
                    />
                  </Grid>
                )}
                <Grid item xs={11.8}>
                  <CustomTextField
                    rows={4}
                    multiline
                    label='Multiline'
                    defaultValue={user?.note}
                    id='textarea-outlined-static'
                    fullWidth
                    InputProps={{ readOnly: readOnly }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h5'>Đơn vị kiêm nhiệm</Typography>
                </Grid>
                <Grid item xs={11.8}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Đơn vị</TableCell>
                          <TableCell>Mã đơn vị</TableCell>
                          <TableCell align='right'>Là lãnh đạo đơn vị</TableCell>
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
                            <TableCell>
                              <Autocomplete
                                value={groupOptions.find(option => option.groupName === group.groupName) || null}
                                options={groupOptions}
                                getOptionLabel={option => option.groupName}
                                onChange={(event, newValue) => handleGroupChange(newValue)}
                                renderInput={params => <CustomTextField {...params} />}
                              />
                            </TableCell>{' '}
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
                <Grid item xs={12}>
                  <Typography variant='h5'>Thông tin tài khoản</Typography>
                </Grid>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Tài khoản'
                    defaultValue={user?.userAccount.username}
                    id='form-props-read-only-input'
                    InputProps={{ readOnly: readOnly }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomTextField
                    label='Loại tài khoản'
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
                        checked={user.userAccount.accStatus}
                        onChange={e => setStatus(e.target.checked)}
                        color='primary'
                        disabled={readOnly}
                      />
                    }
                    label='Trạng thái'
                    labelPlacement='start'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h5'>Vai trò</Typography>
                </Grid>
                <Grid item xs={11.8}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên vai trò</TableCell>
                          <TableCell>Mô tả</TableCell>
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
