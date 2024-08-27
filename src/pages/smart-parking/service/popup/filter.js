import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { getApi } from 'src/@core/utils/requestUltils'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const statusGroup = [
  {
    id: '1',
    label: 'Tất cả',
    name: ''
  },
  {
    id: '2',
    label: 'YES',
    name: 'YES'
  },
  {
    id: '3',
    label: 'NO',
    name: 'NO'
  }
]

const eServiceParking = [
  {
    id: '1',
    label: 'Tất cả',
    name: ''
  },
  {
    id: '2',
    label: 'OTO',
    name: 'OTO'
  },
  {
    id: '3',
    label: 'MOTORBIKE',
    name: 'MOTORBIKE'
  }
]

const convertDateToString = date => {
  const pad = num => String(num).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
}

const Filter = ({ open, onClose, callback, groupName, fetchGroupData }) => {
  const [loading, setLoading] = useState(false)
  const [dailyPriceType, setDailyPriceType] = useState('')
  const [holidayPriceType, setHolidayPriceType] = useState('')
  const [weekendPriceType, setWeekendPriceType] = useState('')
  const [price1, setPrice1] = useState('')
  const [price2, setPrice2] = useState('')
  const [price3, setPrice3] = useState('')

  const [parkingList, setParkingList] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [subTypes, setSubTypes] = useState([])
  const [parking, setParking] = useState(null)
  const [vehicleType, setVehicleType] = useState(null)
  const [subType, setSubType] = useState(null)
  const [status, setStatus] = useState(null)
  const [serviceParking, setServiceParking] = useState(null)

  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)


  useEffect(() => {
    fetchParkings()
    fetchVehicleType()
    fetchSubTypes()
  }, [])

  const fetchParkings = async () => {
    setLoading(true)

    try {
      const res = await getApi(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/parking/`)
      setParkingList(res.data?.rows)
    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchVehicleType = async () => {
    setLoading(true)

    try {
      const res = await getApi(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/type/`)
      setVehicleTypes(res.data?.rows)
    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchSubTypes = async () => {
    setLoading(true)

    try {
      const res = await getApi(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/sub/type/`)
      setSubTypes(res.data?.rows)
    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOnChange = dates => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {

    const params = {
      vehicleTypeId: vehicleType?.id,
      subscriptionTypeId: subType?.id,
      parkingId: parking?.id,
      status: status?.name,
      startDate: startDate !== null ? convertDateToString(startDate).split('T')[0] : null,
      endDate: endDate !== null ? convertDateToString(endDate).split('T')[0] : null,
      eServiceParking: serviceParking?.name,
      startTime: startTime !== null ? convertDateToString(startTime).split('T')[1].split('Z')[0] : null,
      endTime: endTime !== null ? convertDateToString(endTime).split('T')[1].split('Z')[0] : null,

      dailyPriceMax: dailyPriceType === 'Tăng' ? price1 : null,
      dailyPriceEqual: dailyPriceType === 'Bằng' ? price1 : null,
      dailyPriceMin: dailyPriceType === 'Giảm' ? price1 : null,

      holidayPriceMax: holidayPriceType === 'Tăng' ? price2 : null,
      holidayPriceEqual: holidayPriceType === 'Bằng' ? price2 : null,
      holidayPriceMin: holidayPriceType === 'Giảm' ? price2 : null,


      weekendPriceMax: weekendPriceType === 'Tăng' ? price3 : null,
      weekendPriceEqual: weekendPriceType === 'Bằng' ? price3 : null,
      weekendPriceMin: weekendPriceType === 'Giảm' ? price3 : null,

      // toGroupId: selectedGroup.groupId // Giả sử ID của group là 'groupId'
    }

    callback(params)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={onClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      <Box sx={{ m: 5, textAlign: 'left' }}>
        <Typography variant='h3' sx={{ mb: 3 }} color='#FF9F43'>
          Lọc đơn vị
        </Typography>
      </Box>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
              {' '}
              <Typography variant='h5'>Thông tin dịch vụ</Typography>
            </Grid>

            <Grid item xs={4}>
              <Autocomplete
                value={vehicleType}
                onChange={(event, newValue) => {
                  setVehicleType(newValue)
                }}
                options={vehicleTypes}
                getOptionLabel={option => option.name}
                renderInput={params => <CustomInput {...params} label='Loại phương tiện' variant='outlined' fullWidth />}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                value={subType}
                onChange={(event, newValue) => {
                  setSubType(newValue)
                }}
                options={subTypes}
                getOptionLabel={option => option.name}
                renderInput={params => <CustomInput {...params} label='Loại thuê bao' variant='outlined' fullWidth />}
              />
            </Grid>
            <Grid item xs={4}>
              <DatePickerWrapper>
                <DatePicker
                  selectsRange
                  endDate={endDate}
                  selected={startDate}
                  startDate={startDate}
                  id='date-range-picker'
                  onChange={handleOnChange}
                  shouldCloseOnSelect={false}
                  customInput={
                    <CustomInput
                      label='Ngày áp dụng'
                      start={startDate}
                      end={endDate}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <Icon icon="tabler:calendar" />
                          </InputAdornment>
                        )
                      }}
                    />
                  }
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                value={status}
                onChange={(event, newValue) => {
                  setStatus(newValue)
                }}
                options={statusGroup}
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <CustomInput {...params} label='Trạng thái kích hoạt' variant='outlined' fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                value={serviceParking}
                onChange={(event, newValue) => {
                  setServiceParking(newValue)
                }}
                options={eServiceParking}
                getOptionLabel={option => option.label}
                renderInput={params => <CustomInput {...params} label='Nhóm dịch vụ' variant='outlined' fullWidth />}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                value={parking}
                onChange={(event, newValue) => {
                  setParking(newValue)
                }}
                options={parkingList}
                getOptionLabel={option => option.name}
                renderInput={params => <CustomInput {...params} label='Bãi đỗ xe' variant='outlined' fullWidth />}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
              {' '}
              <br></br>
              <Typography variant='h5'>Thông tin giá</Typography>
            </Grid>
            <Grid item xs={4}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      showTimeSelect
                      selected={startTime}
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat='h:mm:ss aa'
                      id='time-only-picker'
                      onChange={date => setStartTime(date)}
                      customInput={
                        <CustomInput
                          label='Thời gian bắt đầu'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Icon icon="tabler:clock" />
                              </InputAdornment>
                            )
                          }}
                        />
                      }
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
                      showTimeSelect
                      selected={endTime}
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat='h:mm:ss aa'
                      id='time-only-picker'
                      onChange={date => setEndTime(date)}
                      customInput={
                        <CustomInput
                          label='Thời gian kết thúc'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Icon icon="tabler:clock" />
                              </InputAdornment>
                            )
                          }}
                        />
                      }
                    />
                  </div>
                </Box>
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <CustomInput
                label='Giá ngày thường'
                select
                fullWidth
                style={{ marginBottom: '16px' }}
                value={dailyPriceType}
                onChange={e => setDailyPriceType(e.target.value)}
              >
                <MenuItem value='Tăng'>Lớn hơn </MenuItem>
                <MenuItem value='Bằng'>Bằng</MenuItem>
                <MenuItem value='Giảm'>Nhỏ hơn</MenuItem>
              </CustomInput>
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                label='Giá ngày nghỉ'
                select
                fullWidth
                style={{ marginBottom: '16px' }}
                value={holidayPriceType}
                onChange={e => setHolidayPriceType(e.target.value)}
              >
                <MenuItem value='Tăng'>Lớn hơn </MenuItem>
                <MenuItem value='Bằng'>Bằng</MenuItem>
                <MenuItem value='Giảm'>Nhỏ hơn</MenuItem>
              </CustomInput>
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                label='Giá ngày lễ'
                select
                fullWidth
                style={{ marginBottom: '16px' }}
                value={weekendPriceType}
                onChange={e => setWeekendPriceType(e.target.value)}
              >
                <MenuItem value='Tăng'>Lớn hơn </MenuItem>
                <MenuItem value='Bằng'>Bằng</MenuItem>
                <MenuItem value='Giảm'>Nhỏ hơn</MenuItem>
              </CustomInput>
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                type='text'
                fullWidth
                style={{ marginBottom: '16px' }}
                value={price1}
                onChange={e => setPrice1(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                type='text'
                fullWidth
                style={{ marginBottom: '16px' }}
                value={price2}
                onChange={e => setPrice2(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                type='text'
                fullWidth
                style={{ marginBottom: '16px' }}
                value={price3}
                onChange={e => setPrice3(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' onClick={handleOk}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Filter
