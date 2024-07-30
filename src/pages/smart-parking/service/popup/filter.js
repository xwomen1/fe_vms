import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  Grid,
  IconButton,
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
// import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

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

const Filter = ({ open, onClose, groupName, fetchGroupData }) => {
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [availableAt, setAvailableAt] = useState('')
  const [dailyprice, setDailyPrice] = useState('')
  const [price1, setPrice1] = useState('')
  const [price2, setPrice2] = useState('')
  const [price3, setPrice3] = useState('')

  const [parkingList, setParkingList] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [parking, setParking] = useState(null)
  const [vehicleType, setVehicleType] = useState(null)
  const [status, setStatus] = useState(null)
  const [serviceParking, setServiceParking] = useState(null)

  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)


  useEffect(() => {
    fetchGroups()
    fetchParkings()
    fetchVehicleType()
  }, [])

  const fetchGroups = () => {
    axios
      .get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search')
      .then(response => {
        // Lọc nhóm khác với groupName hiện tại
        const filteredGroups = response.data.filter(group => group.groupName !== groupName)
        setGroups(filteredGroups)
      })
      .catch(error => {
        console.error('Error fetching groups:', error)
      })
  }

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

  const handleOnChange = dates => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const handleCancel = () => {
    onClose()
  }

  const handleStartDateChange = date => {
    setAvailableAt(date)
  }

  const handleOk = () => {
    const params = {
      vehicleTypeId: vehicleType?.id,
      parkingId: parking?.id,
      status: status?.name,
      startDate: startDate,
      endDate: endDate,
      eServiceParking: serviceParking?.name,
      startTime: startTime,
      endTime: endTime,

      // toGroupId: selectedGroup.groupId // Giả sử ID của group là 'groupId'
    }

    console.log('params', params);
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
      <Button>Lọc đơn vị</Button>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
              {' '}
              <Typography variant='h6'>Thông tin dịch vụ</Typography>
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
                value={selectedGroup}
                onChange={(event, newValue) => {
                  setSelectedGroup(newValue)
                }}
                options={groups}
                getOptionLabel={option => option.groupName}
                renderInput={params => <CustomInput {...params} label='Loại thuê bao' variant='outlined' fullWidth />}
              />
            </Grid>
            <Grid item xs={4}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      selectsRange
                      endDate={endDate}
                      selected={startDate}
                      startDate={startDate}
                      id='date-range-picker'
                      onChange={handleOnChange}
                      shouldCloseOnSelect={false}
                      customInput={<CustomInput label='Date Range' start={startDate} end={endDate} />}
                    />
                  </div>
                </Box>
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
              Thông tin giá
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
                      dateFormat='h:mm aa'
                      id='time-only-picker'
                      onChange={date => setStartTime(date)}
                      customInput={<CustomInput label='Time Only' />}
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
                      dateFormat='h:mm aa'
                      id='time-only-picker'
                      onChange={date => setEndTime(date)}
                      customInput={<CustomInput label='Time Only' />}
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
                value={dailyprice}
                onChange={e => setDailyPrice(e.target.value)}
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
                value={dailyprice}
                onChange={e => setDailyPrice(e.target.value)}
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
                value={dailyprice}
                onChange={e => setDailyPrice(e.target.value)}
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
