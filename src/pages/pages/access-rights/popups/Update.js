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
    label: 'Thứ 2',
    dayOfWeek: 'MONDAY',
    value: 2
  },
  {
    label: 'Thứ 3',
    dayOfWeek: 'TUESDAY',
    value: 3
  },
  {
    label: 'Thứ 4',
    dayOfWeek: 'WEDNESDAY',
    value: 4
  },
  {
    label: 'Thứ 5',
    dayOfWeek: 'THURSDAY',
    value: 5
  },
  {
    label: 'Thứ 6',
    dayOfWeek: 'FRIDAY',
    value: 6
  },
  {
    label: 'Thứ 7',
    dayOfWeek: 'SATURDAY',
    value: 7
  },
  {
    label: 'CN',
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
    label: 'Tên lịch',
    placeholder: 'Tên lịch',
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
    label: 'Cửa vào',
    placeholder: 'Cửa vào',
    type: 'AutocompleteDoorIn',
    require: true,
    width: 6
  },
  {
    name: 'doorOutName',
    label: 'Cửa ra',
    placeholder: 'Cửa ra',
    type: 'AutocompleteDoorOut',
    require: true,
    width: 6
  },
  {
    name: 'startDate',
    label: 'Ngày bắt đầu',
    placeholder: 'Ngày bắt đầu',
    type: 'startDate',
    data: [],
    require: false,
    width: 6
  },
  {
    name: 'endDate',
    label: 'Ngày Kết thúc',
    placeholder: 'Ngày kết thúc',
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
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/`,
        config
      )
      const setData = res.data.rows.filter(x => x.id == id)
      setDetail(setData[0])
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
    try {
      const response = await axios.get('https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups', config)
      setUserGroups(response.data.rows)
    } catch (error) {
      console.error('Error fetching user groups: ', error)
    }
  }
  console.log(detail?.id, 'detail')

  const ViewContent = () => {
    const transformCalendarDays = calendarDays => {
      console.log('calendarDays', calendarDays)

      return calendarDays.map(day => {
        const { dayOfWeek, timePeriods } = day
        const value = dataDailyDefault.find(item => item.dayOfWeek === dayOfWeek)?.value || 1

        let label
        if (value === 1) {
          label = 'CN'
        } else if (value >= 2 && value <= 7) {
          label = `Thứ ${value}`
        } else {
          label = 'CN'
        }

        return {
          label,
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

    return (
      <div>
        <div
          style={{
            color: '#333',
            margin: '20px 0 20px 0'
          }}
        >
          <span>Bảng cấu hình thời gian</span>
        </div>

        <div
          style={{
            width: '100%'
          }}
        >
          <div
            style={{
              marginLeft: 50,
              width: 'calc(100% - 150px)',
              position: 'relative',
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: 14,
              display: 'flex'
            }}
          >
            {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((time, index) => (
              <div
                key={index.toString()}
                style={{
                  width: `${100 / 6}%`,
                  textAlign: 'center',
                  padding: '8px 0'
                }}
              >
                {time}
              </div>
            ))}
            <div
              style={{
                position: 'absolute',
                right: -70,
                textAlign: 'center',
                padding: '8px 0'
              }}
            >
              24:00
            </div>
          </div>

          <Daily
            callbackOfDaily={v => {
              setDataDaily(v)
              setDataDailyState(v)
            }}
            dataDailyProps={dataDailyState}
          />
        </div>
      </div>
    )
  }

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
      toast.success('Cập nhật thành công')
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
              Cấu hình lịch
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
                            {...(errors[item.name] && { helperText: 'Trường này bắt buộc' })}
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
                                label='Công ty'
                                value={selectedOption}
                                options={userGroups}
                                getOptionLabel={option => option.name || ''}
                                renderInput={params => (
                                  <CustomTextField {...params} label='Công ty' placeholder='Khác' />
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
                              label='Cửa vào'
                              value={selectedOption}
                              options={filteredDoorList}
                              getOptionLabel={option => option.name || ''}
                              renderInput={params => <CustomTextField {...params} label='Cửa vào' placeholder='Khác' />}
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
                              label='Cửa ra'
                              value={selectedOption}
                              options={filteredDoorList}
                              getOptionLabel={option => option.name || ''}
                              renderInput={params => <CustomTextField {...params} label='Cửa ra' placeholder='Khác' />}
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

                if (item.type == 'Schedule') {
                  return (
                    <Grid item xs={12} key={index}>
                      <span style={{ color: '#f5963a', fontSize: 20, position: 'relative' }}>
                        Cấu hình thời gian hoạt động
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            bottom: -10,
                            display: 'inline-block',
                            content: '',
                            width: '100%',
                            height: '5px',
                            background: '#7ebbfc',
                            borderRadius: 25
                          }}
                        />
                      </span>
                      {ViewContent()}
                    </Grid>
                  )
                }
                if (item.type === 'startDate') {
                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Controller
                        name='startDate'
                        control={control}
                        rules={{ required: item.require }}
                        render={({ field: { value, onChange } }) => (
                          <DatePickerWrapper>
                            <DatePicker
                              selected={value ? new Date(value) : null}
                              onChange={onChange}
                              customInput={
                                <CustomTextField
                                  fullWidth
                                  label='Ngày bắt đầu'
                                  error={Boolean(errors.startDate)}
                                  helperText={errors.startDate ? 'Trường này bắt buộc' : ''}
                                />
                              }
                            />
                          </DatePickerWrapper>
                        )}
                      />
                    </Grid>
                  )
                }
                if (item.type === 'endDate') {
                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Controller
                        name='endDate'
                        control={control}
                        rules={{ required: item.require }}
                        render={({ field: { value, onChange } }) => (
                          <DatePickerWrapper>
                            <DatePicker
                              selected={value ? new Date(value) : null}
                              onChange={onChange}
                              customInput={
                                <CustomTextField
                                  fullWidth
                                  label='Ngày kết thúc'
                                  error={Boolean(errors.endDate)}
                                  helperText={errors.endDate ? 'Trường này bắt buộc' : ''}
                                />
                              }
                            />
                          </DatePickerWrapper>
                        )}
                      />
                    </Grid>
                  )
                }
              })}
              <Grid item xs={12}></Grid>
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
            Hủy
          </Button>
          <Button variant='contained' onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default View
