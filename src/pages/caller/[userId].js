import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, IconButton, Button, FormControlLabel, Checkbox, Switch, TextField, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { set } from 'nprogress'
// import TableCustom from 'src/layouts/components/TableCustom'
const UserDetails = () => {
  const router = useRouter()
  const { userId } = router.query
  const [user, setUser] = useState(null)
  const [group, setGroup] = useState(null)

  const [readOnly, setReadOnly] = useState(true)
  const [editing, setEditing] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [leaderOfUnit, setLeaderOfUnit] = useState('')
  const [status, setStatus] = useState('')
  const [timeEndMorning, setTimeEndMorning] = useState('')
  const [timeStartAfternoon, setTimeStartAfternoon] = useState('')
  const [timeEndAfternoon, setTimeEndAfternoon] = useState('')

  const [dateTime, setDateTime] = useState('')
  const [timeStart, setTimeStart] = useState(new Date())

  const [initialDateTime, setInitialDateTime] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showPlusColumn, setShowPlusColumn] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleAddRow = () => {
    setGroup(prevGroup => [...prevGroup, { groupName: '' }])
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const toggleEdit = () => {
    setReadOnly(false)
    setEditing(true)
    setShowPlusColumn(!showPlusColumn)
  }
  const toggleAddGroup = () => {
    setSelectedGroupOption(null)
  }

  const handleGroupChange = (event, newValue) => {
    setDefaultGroup(newValue)
    console.log(newValue)
  }

  const saveChanges = async () => {
    setReadOnly(true)
    setEditing(false)
  }

  const columns = [
    { id: 'groupName', label: 'Đơn vị', minWidth: 170 },
    { id: 'groupCode', label: 'Mã đơn vị', minWidth: 100 },
    {
      id: 'isLeader',
      label: 'Là lãnh đạo đơn vị',
      minWidth: 170,
      align: 'right'
    }
  ]
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
      setUser(response.data.data)
      setTimeStart(response.data.data.expiredAt)
      setInitialDateTime(response.data.data.timeStartAfternoon)
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
        setGroup(response.data.data.userGroups)
        setUser(response.data.data)
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

    setUser({
      ...user,
      fullName: '',
      email: ''
    })
  }

  const formatIsLeader = isLeader => <Checkbox checked={isLeader} disabled />

  return (
    <div>
      {user ? (
        <div>
          <Grid container spacing={3}>
            <Grid container spacing={2} item xs={3}>
              <IconButton size='small' component={Link} href={`/apps/user/list`} sx={{ color: 'text.secondary' }}>
                <Icon icon='tabler:chevron-left' />
              </IconButton>

              <h2 style={{ color: 'black' }}>Chi tiết người dùng: </h2>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={6} style={{ marginTop: '1%' }}>
              <IconButton
                size='small'
                component={Link}
                href={`/apps/user/detail/${user.userId}`}
                sx={{ color: 'orange' }}
              >
                <u> Thông tin cá nhân |</u>
              </IconButton>

              <Button
                variant='contained'
                size='small'
                component={Link}
                href={`/apps/user/detail/${user.userId}`}
                sx={{ backgroundColor: '#DCDCDC', color: 'black' }}
              >
                Thông tin định danh |
              </Button>
              <Button
                variant='contained'
                size='small'
                component={Link}
                href={`/apps/user/detail/${user.userId}`}
                sx={{ backgroundColor: '#DCDCDC', color: 'black' }}
              >
                Kiểm soát vào ra |
              </Button>

              <Button
                variant='contained'
                size='small'
                component={Link}
                href={`/apps/user/detail/${user.userId}`}
                sx={{ backgroundColor: '#DCDCDC', color: 'black', marginRight: '10px' }}
              >
                Thông tin gửi xe
              </Button>
            </Grid>
          </Grid>
          <br></br>

          <Grid style={{ backgroundColor: 'white', borderRadius: '0.05%' }}>
            <Grid container spacing={2}>
              <h3 style={{ color: 'black', marginLeft: '1%' }}> Thông tin người dùng</h3>
            </Grid>
            <Grid container spacing={2} style={{ marginLeft: 10 }}>
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
                <>
                  <Button variant='contained' onClick={toggleEdit}>
                    Chỉnh sửa
                  </Button>
                  {/* Thêm nút "+" ở đây */}
                </>
              )}
            </Grid>

            <Grid container spacing={2} style={{ marginLeft: 10 }}></Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Đơn vị</TableCell>
                  <TableCell>Mã đơn vị</TableCell>
                  <TableCell align='right'>Là lãnh đạo đơn vị</TableCell> {/* Updated alignment */}
                  {showPlusColumn && (
                    <TableCell align='center'>
                      <IconButton onClick={handleAddRow} size='small' sx={{ marginLeft: '10px' }}>
                        <Icon icon='bi:plus' />
                      </IconButton>
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
                        <IconButton onClick={() => handleDeleteRow(index)}>
                          <Icon icon='bi:trash' />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Other user details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default UserDetails
