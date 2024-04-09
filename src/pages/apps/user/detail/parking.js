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

const UserDetails = () => {
  const router = useRouter()
  const { userId } = router.query

  const [user, setUser] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [params, setParams] = useState({})
  const [editing, setEditing] = useState(false)
  const [status1, setStatus1] = useState('')
  const [availableAt, setAvailableAt] = useState('')

  const [showPlusColumn, setShowPlusColumn] = useState(false)

  const [isFaceEnabled, setIsFaceEnabled] = useState(false)

  const handleStartDateChange = date => {
    setAvailableAt(date)
  }

  console.log('New start date:', isoToEpoch(availableAt))
  function isoToEpoch(isoDateString) {
    var milliseconds = Date.parse(isoDateString)

    var epochSeconds = Math.round(milliseconds)

    return epochSeconds
  }

  const handleStatusChange = () => {
    setStatus1(status1 === true ? false : true)
    setIsFaceEnabled(!isFaceEnabled)
  }
  const statusText = isFaceEnabled ? 'Đang hoạt động' : 'Không hoạt động'

  const toggleEdit = () => {
    setReadOnly(false)
    setEditing(true)
    setShowPlusColumn(!showPlusColumn)
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
          userId: userId
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

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access/${userId}/authentications`,
        config
      )
      setStatus1(response.data.data.isEnableFace)
      setUser(response.data.data)
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
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

        const response = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access/${userId}/authentications`,
          config
        )
        setUser(response.data.data)
        setStatus1(response.data.data.isEnableFace)
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }
    if (userId) {
      fetchUserData()
    }
  }, [userId])
  useEffect(() => {
    if (user) {
      setIsFaceEnabled(user.isEnableFace)
    }
  }, [user])

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
  console.log('param', user)

  return (
    <div>
      {user ? (
        <div>
          <Grid container spacing={3}>
            <Grid style={{ borderRadius: '0.05%' }}>
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
              <Grid container spacing={2} component={Paper} style={{ marginLeft: 10, backgroundColor: 'white' }}>
                {/* <Grid item ={1} style={{ marginTop: '2%' }}></Grid> */}
                <Grid container spacing={2} component={Paper} style={{ marginLeft: 10, backgroundColor: 'white' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                      <Switch
                        checked={status1 === true}
                        onChange={handleStatusChange}
                        color='primary'
                        label='Trạng thái'
                        disabled={readOnly}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={4}>
                    <DatePicker
                      selected={new Date(user?.faceIdentifyUpdatedAt)}
                      onChange={handleStartDateChange}
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption='Time'
                      dateFormat='hh:mm dd/MM/yyyy'
                      disabled={readOnly}
                      customInput={<CustomInput label='Thời gian cập nhật' />}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      label='Trạng thái'
                      value={statusText}
                      InputProps={{ readOnly: readOnly }}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='h5'>Đơn vị</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <br></br>
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
