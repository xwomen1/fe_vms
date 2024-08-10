import { useState, forwardRef, useEffect } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  styled
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Daily from '../mocdata/daily'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
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

const dataDailyDefault = [
  {
    label: '',
    value: 1
  },
  {
    label: 'MONDAY',
    dayOfWeek: 'MONDAY',
    value: 2
  },
  {
    label: 'TUESDAY',
    dayOfWeek: 'TUESDAY',
    value: 3
  },
  {
    label: 'WEDNESDAY',
    dayOfWeek: 'WEDNESDAY',
    value: 4
  },
  {
    label: 'THURSDAY',
    dayOfWeek: 'THURSDAY',
    value: 5
  },
  {
    label: 'FRIDAY',
    dayOfWeek: 'FRIDAY',
    value: 6
  },
  {
    label: 'SATURDAY',
    dayOfWeek: 'SATURDAY',
    value: 7
  },
  {
    label: 'SUNDAY',
    dayOfWeek: 'SUNDAY',
    value: 8
  }
]

const defaultValues = {
  name: null,
  description: null,
  listScheduleWeekly: []
}

const Add = ({ show, onClose, setReload }) => {
  const [loading, setLoading] = useState(false)
  const [dataDaily, setDataDaily] = useState([])
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [errorMessages, setErrorMessages] = useState([])
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  const onSubmit = async values => {
    try {
      if (values.listScheduleWeekly && Array.isArray(values.listScheduleWeekly)) {
        const validCalendarDays = values.listScheduleWeekly
          .filter(day => day.dayOfWeek && day.times && Array.isArray(day.times))
          .map(day => {
            return {
              dayOfWeek: day.dayOfWeek,
              times:
                day.times.length > 0
                  ? day.times.map(times => {
                      return {
                        endTimeInMinute: times.endTimeInMinute,
                        startTimeInMinute: times.startTimeInMinute
                      }
                    })
                  : []
            }
          })
        values.scheduleWeeklyRequest = validCalendarDays
      } else {
        values.scheduleWeeklyRequest = []
      }

      await handleAdd(values)
    } catch (err) {
      setErrorMessages([err.message])
      console.error('Error in onSubmit: ', err)
    }
  }

  const handleAdd = async values => {
    setLoading(true)
    try {
      console.log(values)

      const params = {
        ...values,
        listHoliday: []
      }

      await axios.post(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/schedules`, { ...params }, config)
      toast.success('Successfully Added')
      setReload()
      onClose()
    } catch (err) {
      setErrorMessages([err.response.data.message])

      console.error('Error in handleAdd: ', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form>
        <Dialog
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
            <Box sx={{ mb: 8, textAlign: 'left' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                Add New Schedule
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Schedule Name'
                      onChange={onChange}
                      placeholder='Schedule Name'
                      error={Boolean(errors.name)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.name && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Desciption'
                      onChange={onChange}
                      placeholder='Desciption'
                      error={Boolean(errors.description)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.description && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item>Time Settings</Grid>
              <Grid item xs={12}>
                <Controller
                  name='listScheduleWeekly'
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Daily
                      callbackOfDaily={v => {
                        onChange(v)
                        setDataDaily(v)
                        setDataDailyState(v)
                      }}
                      dataDailyProps={dataDailyState}
                      error={Boolean(errors.listScheduleWeekly)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.listScheduleWeekly && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'flex-end',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            {errorMessages.length > 0 && (
              <Box sx={{ color: 'red', textAlign: 'center', width: '100%' }}>
                <Typography style={{ color: 'red' }} variant='body2'>
                  Error: {errorMessages[0]}
                </Typography>
              </Box>
            )}
            <Button variant='tonal' color='secondary' onClick={onClose}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Card>
  )
}

Add.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  setReload: PropTypes.func.isRequired,
  filter: PropTypes.string
}

export default Add
