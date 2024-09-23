import { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
  styled
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
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

const convertDateToString = dateString => {
  const date = new Date(dateString)
  const pad = num => String(num).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())

  return `${year}-${month}-${day}`
}

const format_form = [
  {
    name: 'createdUserIds',
    label: 'Subscribers',
    placeholder: 'Subscribers ',
    type: 'MultiAutocomplete',
    data: [],
    disabled: false,
    require: true,
    width: 6
  },
  {
    name: 'repeatType',
    label: 'Request Type',
    placeholder: 'Request Type',
    type: 'Autocomplete',
    data: [
      { id: 'ONCE', name: 'ONCE' },
      { id: 'DAILY', name: 'DAILY' },
      { id: 'WEEKLY', name: 'WEEKLY' }
    ],
    disabled: false,
    require: true,
    width: 6
  },
  {
    name: 'createdAt',
    label: 'Creation Date',
    placeholder: 'Click to select a creation date',
    type: 'DatePicker',
    data: [],
    disabled: false,
    require: true,
    width: 6
  },
  {
    name: 'status',
    label: 'Status',
    placeholder: 'Status',
    type: 'MultiAutocomplete',
    data: [
      { id: 'WAITING', name: 'WAITING' },
      { id: 'CANCELLED', name: 'CANCELLED' },
      { id: 'COMPLETE', name: 'COMPLETE' },
      { id: 'APPROVED', name: 'APPROVED' },
      { id: 'UNSUCCESSFUL', name: 'UNSUCCESSFUL' },
      { id: 'OUT_OF_DATE', name: 'OUT_OF_DATE' }
    ],
    disabled: false,
    require: true,
    width: 6
  },
  {
    name: 'AppointmentDate',
    label: 'Appointment Date',
    placeholder: 'Click to select an appointment date',
    type: 'DatePicker',
    data: [],
    disabled: false,
    require: true,
    width: 6
  },
  {
    name: 'startTimeInMinute',
    label: 'Start Time',
    placeholder: 'Click to select a start time',
    type: 'TimePicker',
    data: [],
    disabled: false,
    require: true,
    width: 3
  },
  {
    name: 'endTimeInMinute',
    label: 'End Time',
    placeholder: 'Click to select an end time',
    type: 'TimePicker',
    data: [],
    disabled: false,
    require: true,
    width: 3
  }
]

const defaultValues = {
  createdUserIds: null,
  startDate: null,
  endDate: null,
  startTimeInMinute: null,
  endTimeInMinute: null,
  statues: null,
  repeatType: null,
  createdAt: null
}

const Filter = ({ show, onClose, valueFilter, callback }) => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(format_form)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState(null)
  const [repeatType, setRepeatType] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [createdUserIds, setCreatedUserIds] = useState([])
  const [status, setStatus] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  useEffect(() => {
    handleSetValueFilter()
  }, [valueFilter])

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setLoading(true)

    try {
      const res = await getApi(`https://sbs.basesystem.one/ivis/iam/api/v0/users/search?limit=50&page=1&keyword=`)
      setSubscribers(res.data?.rows)
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

  const handleSetValueFilter = () => {
    if (valueFilter !== null) {
      if (valueFilter?.createdUserIds !== null) {
        const str = valueFilter?.createdUserIds
        const parsedArr = str?.split(',')
        setCreatedUserIds(parsedArr)
      }
      if (valueFilter?.status !== null) {
        const str = valueFilter?.status
        const parsedArr = str?.split(',')
        setStatus(parsedArr)
      }
      setRepeatType(valueFilter?.repeatType)
      setCreatedAt(valueFilter?.createdAt)
      setAppointmentDate(valueFilter?.startDate)
      setTime(valueFilter?.startTimeInMinute, setStartTime)
      setTime(valueFilter?.endTimeInMinute, setEndTime)
    }
  }

  const setTime = (time, setTimeFunc) => {
    if (time) {
      const hour = Math.floor(time / 60)
      const minute = time % 60
      const date = new Date()
      date.setHours(hour)
      date.setMinutes(minute)
      setTimeFunc(date)
    }
  }

  const handleCancel = () => {
    // callback(defaultValues)
    onClose()
  }

  const onSubmit = () => {
    var detail = {
      createdUserIds: createdUserIds.toString(),
      repeatType: repeatType,
      createdAt: createdAt ? convertDateToString(createdAt) : null,
      startTimeInMinute: startTime ? startTime?.getHours() * 60 + startTime?.getMinutes() : null,
      endTimeInMinute: endTime ? endTime?.getHours() * 60 + endTime?.getMinutes() : null,
      status: status.toString(),
      startDate: appointmentDate ? convertDateToString(appointmentDate) : null,
      endDate: appointmentDate ? convertDateToString(appointmentDate) : null
    }

    callback(detail)
    onClose()
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={onClose}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(10)} !important`],
            py: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Filter
            </Typography>
          </Box>
          <form>
            <Grid container spacing={2}>
              {form.map((item, index) => {
                if (item.type === 'MultiAutocomplete') {
                  // Tạo danh sách các tùy chọn đã chọn bằng cách so sánh các ID trong createdUserIds với subscribers
                  const selectedOptions =
                    item.name === 'createdUserIds'
                      ? subscribers.filter(subscriber => createdUserIds.includes(subscriber.userId || subscriber.id))
                      : item.data.filter(s => status?.includes(s.id))

                  return (
                    <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name={item.name}
                        control={control}
                        rules={{ required: item.require }}
                        render={({ field: { value, onChange } }) => (
                          <CustomAutocomplete
                            sx={{ width: 300 }}
                            multiple
                            options={item.name === 'createdUserIds' ? subscribers : item.data}
                            value={selectedOptions} // Hiển thị các tùy chọn đã chọn
                            id='autocomplete-checkboxes'
                            getOptionLabel={option =>
                              item.name === 'createdUserIds' ? option.fullName : option.name || ''
                            }
                            renderInput={params => (
                              <CustomTextField
                                fullWidth
                                {...params}
                                label={item.label}
                                placeholder={item.placeholder}
                              />
                            )}
                            onChange={(event, selectedItems) => {
                              // Lấy các ID đã chọn từ selectedItems
                              const newArr = selectedItems.map(item => item.userId || item.id)
                              if (item.name === 'createdUserIds') {
                                setCreatedUserIds(newArr) // Cập nhật state createdUserIds
                              }
                              if (item.name === 'status') {
                                setStatus(newArr.length > 0 ? newArr : [])
                              }
                            }}
                            renderOption={(props, option, { selected }) => (
                              <li {...props} key={option?.id}>
                                <Checkbox checked={selected} sx={{ mr: 2 }} />
                                <ul style={{ listStyleType: 'none' }}>
                                  <li>{item.name === 'createdUserIds' ? option.fullName : option.name}</li>
                                  <li>
                                    <Typography variant='caption'>
                                      {item.name === 'createdUserIds' ? option.email : ''}
                                    </Typography>
                                  </li>
                                </ul>
                              </li>
                            )}
                          />
                        )}
                      />
                    </Grid>
                  )
                }

                if (item.type === 'Autocomplete') {
                  return (
                    <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name={item.name}
                        control={control}
                        rules={{ required: item.require }}
                        render={({ field: { value, onChange } }) => (
                          <CustomAutocomplete
                            sx={{ width: 300 }}
                            value={repeatType}
                            onChange={(event, selectedItem) => {
                              onChange(selectedItem)
                              if (item.name === 'repeatType') {
                                setRepeatType(selectedItem?.id)
                              }
                            }}
                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                            options={item.data}
                            id='autocomplete-custom'
                            getOptionLabel={option => option.name || option || ''}
                            renderInput={params => <CustomTextField {...params} label={item.label} />}
                          />
                        )}
                      />
                    </Grid>
                  )
                }
                if (item.type === 'DatePicker') {
                  return (
                    <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name={item.name}
                        control={control}
                        rules={{ required: item.require }}
                        render={({ field: { value, onChange } }) => (
                          <DatePickerWrapper>
                            <div>
                              <DatePicker
                                selected={
                                  item.name === 'createdAt'
                                    ? createdAt
                                    : item.name === 'AppointmentDate'
                                    ? appointmentDate
                                    : null
                                }
                                id='basic-input'
                                dateFormat='dd/MM/yyyy'
                                onChange={date => {
                                  if (item.name === 'createdAt') {
                                    setCreatedAt(date)
                                  }
                                  if (item.name === 'AppointmentDate') {
                                    setAppointmentDate(date)
                                  }
                                }}
                                placeholderText={item.placeholder}
                                customInput={
                                  <CustomInput
                                    label={item.label}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position='end'>
                                          <Icon icon='tabler:calendar' />
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                }
                              />
                            </div>
                          </DatePickerWrapper>
                        )}
                      />
                    </Grid>
                  )
                }
                if (item.type === 'TimePicker') {
                  return (
                    <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name={item.name}
                        control={control}
                        rules={{ required: item.require }}
                        render={({ field: { value, onChange } }) => (
                          <DatePickerWrapper>
                            <div>
                              <DatePicker
                                showTimeSelect
                                selected={
                                  item.name === 'startTimeInMinute'
                                    ? startTime
                                    : item.name === 'endTimeInMinute'
                                    ? endTime
                                    : null
                                }
                                timeIntervals={30}
                                showTimeSelectOnly
                                dateFormat='h:mm aa'
                                id='time-only-picker'
                                onChange={date => {
                                  if (item.name === 'startTimeInMinute') {
                                    setStartTime(date)
                                  }
                                  if (item.name === 'endTimeInMinute') {
                                    setEndTime(date)
                                  }
                                }}
                                placeholderText={item.placeholder}
                                customInput={
                                  <CustomInput
                                    label={item.label}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position='end'>
                                          <Icon icon='tabler:clock' />
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                }
                              />
                            </div>
                          </DatePickerWrapper>
                        )}
                      />
                    </Grid>
                  )
                }
              })}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{}}>
          <Button variant='contained' color='secondary' onClick={() => handleCancel()}>
            Cancel
          </Button>
          <Button type='submit' variant='contained' onClick={() => onSubmit()}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Filter
