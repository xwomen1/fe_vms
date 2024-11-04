import { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  styled
} from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

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

const initValueFilter = {
  location: null,
  cameraName: null,
  startTime: null,
  endTime: null,
  eventType: null,
  keyword: '',
  limit: 25,
  page: 1
}

const typeEvent = [
  { id: 1, name: 'AI_EVENT_PERSON_RECOGNITION' },
  { id: 2, name: 'LICENSE_PLATE_RECOGNITION' },
  { id: 3, name: 'AI_EVENT_BLACKLIST_FACE_RECOGNITION' },
  { id: 4, name: 'AI_EVENT_UNKNOWN_FACE_RECOGNITION' }
]

const Filter = ({ show, onClose, valueFilter, callback, direction }) => {
  console.log(valueFilter, 'valueFilter')

  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [locations, setLocations] = useState([])
  const [cameras, setCameras] = useState([])

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {}
  }

  const fetchLocations = async () => {
    try {
      const res = await axios.get(
        `  https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=VMS`,
        config
      )
      setLocations(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const fetchCameras = async () => {
    try {
      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras`, config)
      setCameras(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues: initValueFilter })

  useEffect(() => {
    fetchLocations()
    fetchCameras()
  }, [])

  useEffect(() => {
    reset(valueFilter)
    setStartTime(valueFilter.startTime ? new Date(valueFilter.startTime) : null)
    setEndTime(valueFilter.endTime ? new Date(valueFilter.endTime) : null)
  }, [valueFilter, reset])

  const onReset = values => {
    var detail = {
      location: '',
      cameraName: '',
      startTime: null,
      endTime: null,
      eventType: null
    }
    callback(detail)
    onClose()
  }

  const onSubmit = values => {
    var detail = { ...values }
    detail['startTime'] = startTime?.getTime() || null
    detail['endTime'] = endTime?.getTime() || null
    callback(detail)
    onClose()
  }

  console.log(startTime, 'starttime')

  return (
    <Card>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Filter
            </Typography>
          </Box>
          <form>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='location'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      defaultValue=''
                      label='Location'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.location)}
                      aria-describedby='validation-basic-select'
                      {...(errors.location && { helperText: 'This field is required' })}
                    >
                      {locations.map(item => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='cameraName'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      defaultValue=''
                      label='Camera'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.cameraName)}
                      aria-describedby='validation-basic-select'
                      {...(errors.cameraName && { helperText: 'This field is required' })}
                    >
                      {cameras.map(item => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePickerWrapper style={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }} className='demo-space-x'>
                    <div style={{ width: '100%' }}>
                      <DatePicker
                        showTimeSelect
                        timeFormat='HH:mm'
                        selected={startTime}
                        id='date-time-picker'
                        dateFormat='MM/dd/yyyy'
                        onChange={date => setStartTime(date)}
                        customInput={<CustomTextField fullWidth label='Start date' />}
                      />
                    </div>
                  </Box>
                </DatePickerWrapper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePickerWrapper style={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }} className='demo-space-x'>
                    <div style={{ width: '100%' }}>
                      <DatePicker
                        showTimeSelect
                        timeFormat='HH:mm'
                        selected={endTime}
                        id='date-time-picker'
                        dateFormat='MM/dd/yyyy'
                        onChange={date => setEndTime(date)}
                        customInput={<CustomTextField fullWidth label='End date' />}
                      />
                    </div>
                  </Box>
                </DatePickerWrapper>
              </Grid>
              {direction === 'ALL_EVENT' && (
                <Grid item xs={12} sm={5.8}>
                  <Controller
                    name='eventType'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        label='Type Event'
                        SelectProps={{
                          value: value,
                          onChange: e => onChange(e.target.value)
                        }}
                        id='validation-basic-select'
                        error={Boolean(errors.type)}
                        aria-describedby='validation-basic-select'
                        {...(errors.type && { helperText: 'This field is required' })}
                      >
                        {typeEvent.map(item => (
                          <MenuItem key={item.id} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <DialogActions
                  sx={{
                    justifyContent: 'center',
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
                    Filter
                  </Button>
                  <Button variant='tonal' onClick={handleSubmit(onReset)}>
                    Reset
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={onClose}>
                    Cancel
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default Filter
