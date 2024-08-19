import { useState, forwardRef, useEffect } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  TextField,
  DialogContent,
  Autocomplete,
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
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import format from 'date-fns/format'

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
  groupId: null,
  doorInId: null,
  doorOutId: null,
  nameCalendar: null,
  startDate: null,
  endDate: null,
  calendarDays: []
}

const format_form = [
  {
    name: 'nameCalendar',
    label: 'Schedule Name',
    placeholder: 'Schedule Name',
    type: 'TextField',
    data: [],
    require: true,
    width: 6
  },
  {
    name: 'groupName',
    label: 'Phòng ban',
    placeholder: 'Phòng ban',
    type: 'Autocomplete',
    require: true,
    width: 6
  },
  {
    name: 'doorInName',
    label: 'Door In',
    placeholder: 'Door In',
    type: 'AutocompleteDoorIn',
    require: true,
    width: 6
  },
  {
    name: 'doorOutName',
    label: 'Door Out',
    placeholder: 'Door Out',
    type: 'AutocompleteDoorOut',
    require: true,
    width: 6
  },
  {
    name: 'startDate',
    label: 'Start Date',
    placeholder: 'Start Date',
    type: 'startDate',
    data: [],
    require: false,
    width: 6
  },
  {
    name: 'endDate',
    label: 'End Date',
    placeholder: 'End Date',
    type: 'endDate',
    data: [],
    require: false,
    width: 6
  },
  {
    name: 'calendarDays',
    label: '',
    placeholder: '',
    type: 'Schedule',
    data: [],
    require: false,
    width: 12
  }
]

const View = ({ show, onClose, id, setReload, filter, idAccessGroupId, idDoorAccessId, idScheduleId }) => {
  const [loading, setLoading] = useState(false)
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [detail, setDetail] = useState(null)
  const [dataDaily, setDataDaily] = useState([])
  const [doorList, setDoorList] = useState([])
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)
  const [form, setForm] = useState(format_form)
  const [userGroups, setUserGroups] = useState([])
  const [selectedDoorOutId, setSelectedDoorOutId] = useState(null)
  const [selectedDoorInId, setSelectedDoorInId] = useState(null)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {}
  }

  const {
    handleSubmit,
    control,
    setError,
    setValue,
    reset,
    getValues,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  useEffect(() => {
    fetchDataList()
    fetchUserGroups()
    fetchDoorList()
  }, [])

  console.log(idAccessGroupId, idDoorAccessId, idScheduleId)

  useEffect(() => {
    if (detail) {
      setDetailFormValue()
    }
  }, [detail])

  const setDetailFormValue = () => {
    reset(detail)
  }

  const fetchDataList = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/find/${id}`,
        config
      )
      setDetail(res?.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoorList = async () => {
    try {
      const res = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors
            `,
        config
      )
      setDoorList(res.data.rows)
    } catch (error) {
      console.error('Error fetching data1: ', error)
    }
  }

  const fetchUserGroups = async () => {
    let allUserGroups = []
    let currentPage = 1
    let totalPages = 1

    try {
      while (currentPage <= totalPages) {
        const response = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups?page=${currentPage}&limit=50`,
          config
        )
        const data = response.data
        allUserGroups = [...allUserGroups, ...data.rows]
        totalPages = data.totalPage
        currentPage += 1
      }
      setUserGroups(allUserGroups)
    } catch (error) {
      console.error('Error fetching user groups: ', error)
    }
  }

  const dayMapping = {
    1: 'SUNDAY',
    2: 'MONDAY',
    3: 'TUESDAY',
    4: 'WEDNESDAY',
    5: 'THURSDAY',
    6: 'FRIDAY',
    7: 'SATURDAY'
  }

  const transformCalendarDays = calendarDays => {
    return calendarDays.map(day => {
      const { dayOfWeek, timePeriods } = day
      const value = dataDailyDefault.find(item => item.dayOfWeek === dayOfWeek)?.value || 1

      return {
        label: dayMapping[value] || 'SUNDAY',
        dayOfWeek,
        value,
        timePeriods
      }
    })
  }

  useEffect(() => {
    if (detail && detail.calendarDays) {
      const transformedData = transformCalendarDays(detail.calendarDays)
      setDataDailyState(transformedData)
      setDataDaily(transformedData)
    }
  }, [detail])

  const handleSave = async () => {
    try {
      setLoading(true)

      const formData = {
        nameCalendar: getValues('nameCalendar') || '',
        groupId: getValues('groupId') || '',
        doorInId: getValues('doorInId') || '',
        doorOutId: getValues('doorOutId') || '',
        startDate: getValues('startDate') ? format(new Date(getValues('startDate')), 'yyyy-MM-dd') : null,
        endDate: getValues('endDate') ? format(new Date(getValues('endDate')), 'yyyy-MM-dd') : null,
        calendarDays: dataDaily,
        scheduleId: idScheduleId,
        doorAccessId: idDoorAccessId,
        accessGroupId: idAccessGroupId
      }
      console.log(detail.startDate, 'startDate')
      console.log(detail.endDate, 'enddate')

      await axios.put(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/${id}`,
        formData,
        config
      )
      setReload()
      toast.success('Update Successful')
    } catch (error) {
      console.error('Error updating data: ', error)
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleDoorOutIdChange = newValue => {
    setSelectedDoorOutId(newValue)
  }

  const handleDoorInIdChange = newValue => {
    setSelectedDoorInId(newValue)
  }

  const filterDoorList = doorIdToExclude => {
    return doorList.filter(option => option.id !== doorIdToExclude)
  }

  return (
    <Card>
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
              Schedule Configuration
            </Typography>
          </Box>
          <form>
            <Grid container spacing={3}>
              {form.map((item, index) => {
                if (item.type == 'TextField') {
                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Controller
                        name={item.name}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            label={item.label}
                            onChange={onChange}
                            placeholder={item.placeholder}
                            error={Boolean(errors[item.name])}
                            aria-describedby='validation-basic-last-name'
                            {...(errors[item.name] && { helperText: 'This field is required' })}
                          />
                        )}
                      />
                    </Grid>
                  )
                }
                if (item.type == 'Autocomplete') {
                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Controller
                        name='groupId'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => {
                          // Convert `value` to the correct option object
                          const selectedOption = userGroups.find(option => option.id === value) || null
                          console.log('value:', value)
                          console.log('selectedOption:', selectedOption)

                          return (
                            <>
                              <Autocomplete
                                fullWidth
                                id='autocomplete-custom'
                                label='Department'
                                value={selectedOption}
                                options={userGroups}
                                getOptionLabel={option => option.name || ''}
                                renderInput={params => (
                                  <CustomTextField {...params} label='Department' placeholder='Department' />
                                )}
                                onChange={(event, newValue) => {
                                  onChange(newValue ? newValue.id : null)
                                }}
                              />
                            </>
                          )
                        }}
                      />
                    </Grid>
                  )
                }
                if (item.type === 'AutocompleteDoorIn') {
                  const filteredDoorList = filterDoorList(selectedDoorOutId)

                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Controller
                        name='doorInId'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => {
                          const selectedOption = filteredDoorList.find(option => option.id === value) || null

                          return (
                            <Autocomplete
                              fullWidth
                              id='autocomplete-doorInId'
                              label='Door In'
                              value={selectedOption}
                              options={filteredDoorList}
                              getOptionLabel={option => option.name || ''}
                              renderInput={params => (
                                <CustomTextField {...params} label='Door In' placeholder='Door In' />
                              )}
                              onChange={(event, newValue) => {
                                onChange(newValue ? newValue.id : null)
                                handleDoorInIdChange(newValue ? newValue.id : null) // Save selected doorInId
                              }}
                            />
                          )
                        }}
                      />
                    </Grid>
                  )
                }

                if (item.type === 'AutocompleteDoorOut') {
                  const filteredDoorList = filterDoorList(selectedDoorInId)

                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Controller
                        name='doorOutId'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => {
                          const selectedOption = doorList.find(option => option.id === value) || null

                          return (
                            <Autocomplete
                              fullWidth
                              id='autocomplete-doorOutId'
                              label='Door Out'
                              value={selectedOption}
                              options={filteredDoorList}
                              getOptionLabel={option => option.name || ''}
                              renderInput={params => (
                                <CustomTextField {...params} label='Door Out' placeholder='Door Out' />
                              )}
                              onChange={(event, newValue) => {
                                onChange(newValue ? newValue.id : null)
                                handleDoorOutIdChange(newValue ? newValue.id : null) // Save selected doorOutId
                              }}
                            />
                          )
                        }}
                      />
                    </Grid>
                  )
                }
              })}

              <Grid item xs={12}>
                {' '}
                <Box>
                  <Controller
                    name='calendarDays'
                    control={control}
                    render={() => (
                      <Daily
                        callbackOfDaily={v => {
                          setDataDaily(v)
                          setDataDailyState(v)
                        }}
                        dataDailyProps={dataDailyState}
                        disabled={isCheckboxChecked}
                        error={Boolean(errors.calendarDays)}
                        aria-describedby='validation-basic-last-name'
                        {...(errors.calendarDays && { helperText: 'This field is required' })}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'flex-end',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default View
