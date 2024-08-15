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

const Add = ({ show, onClose, setReload }) => {
  const [loading, setLoading] = useState(false)
  const [dataDaily, setDataDaily] = useState([])
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [doorList, setDoorList] = useState([])
  const [groupName, setGroupName] = useState([])
  const [errorMessages, setErrorMessages] = useState([])
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedDoorInId, setSelectedDoorInId] = useState('')
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

  const API_REGIONS = `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/`
  const API_REGIONS_ID = `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/`

  const fetchDepartment = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_REGIONS}/?parentId=f963e9d4-3d6b-45df-884d-15f93452f2a2`, config)
      const group = res.data

      groupName.push(...res.data)
      setGroupName(group)
      group.map(item => {
        if (item.isParent == true) {
          fetchDepartmentChildren(item.id)
        }
      })
    } catch (error) {
      console.error('Error fetching data2: ', error)
    }
  }

  const fetchDepartmentChildren = async idParent => {
    try {
      const res = await axios.get(`${API_REGIONS}?parentId=${idParent}`, config)
      const groupChildren = [...res.data]
      groupName.push(...groupChildren)
      setGroupName(prevState => [...prevState, ...groupChildren])
    } catch (error) {
      console.error('Error fetching data3: ', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChange = async selectedValue => {
    try {
      const res = await axios.get(`${API_REGIONS_ID}/${selectedValue}`, config)
      const nameGroup = res?.data
      handleSelectChangeGroup(nameGroup)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const handleSelectChangeGroup = async nameGroupUser => {
    try {
      const res = await axios.get(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/`, config)

      const userGroups = res?.data?.rows

      const matchedGroup = userGroups.find(group => group.name === nameGroupUser.name)

      if (matchedGroup) {
        setSelectedGroupId(matchedGroup.id)
      } else if (matchedGroup === undefined) {
        const selectedGroup = nameGroupUser.id
        const selectedGroupName = nameGroupUser.name

        if (!selectedGroup) {
          return
        }

        const postData = {
          id: selectedGroup,
          name: selectedGroupName,
          type: 'USER'
        }

        const response = await axios.post(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups`,
          postData
        )
        setSelectedGroupId(response?.data?.id)
      }
    } catch (error) {
      console.error('Error handling group change:', error)
    }
  }

  useEffect(() => {
    fetchDoorList()
    fetchDepartment()
  }, [])

  const handleCheckboxChange = event => {
    setIsCheckboxChecked(event.target.checked)
  }

  const onSubmit = async values => {
    try {
      // Kiểm tra và đặt giá trị mặc định cho start và end
      const currentDate = new Date()
      const startDate = start || currentDate
      const endDate = end || currentDate

      if (values.calendarDays && Array.isArray(values.calendarDays)) {
        const validCalendarDays = values.calendarDays
          .filter(day => day.dayOfWeek && day.timePeriods && Array.isArray(day.timePeriods))
          .map(day => {
            return {
              dayOfWeek: day.dayOfWeek,
              timePeriods: day.timePeriods.map(timePeriod => {
                return {
                  endTimeInMinute: timePeriod.endTimeInMinute,
                  startTimeInMinute: timePeriod.startTimeInMinute
                }
              })
            }
          })
        values.calendarDays = validCalendarDays
      } else {
        values.calendarDays = []
      }

      values['startDate'] = format(startDate, 'yyyy-MM-dd')
      values['endDate'] = format(endDate, 'yyyy-MM-dd')

      // Gọi hàm cuối cùng với các ID đã tạo
      await handleAdd(values)
    } catch (err) {
      setErrorMessages([err.message])
      console.error('Error in onSubmit: ', err)
    }
  }

  const handleAdd = async values => {
    setLoading(true)
    try {
      const params = {
        ...values,
        groupId: selectedGroupId
      }

      await axios.post(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/create`,
        { ...params },
        config
      )
      toast.success('Create Successful')
      setReload()
      onClose()
    } catch (err) {
      setErrorMessages([err.response.data.message])

      console.error('Error in handleAdd: ', err)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredDoorList = excludeId => {
    return doorList.filter(door => door.id !== excludeId)
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
                Schedule Configuration
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Controller
                  name='nameCalendar'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Schedule Name'
                      onChange={onChange}
                      placeholder='Schedule Name'
                      error={Boolean(errors.nameCalendar)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.nameCalendar && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name='groupId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Department'
                      value={value}
                      onChange={e => {
                        const selectedValue = e.target.value
                        onChange(selectedValue)
                        handleSelectChange(selectedValue)
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.groupId)}
                      aria-describedby='validation-basic-select'
                      {...(errors.groupId && { helperText: 'This field is required' })}
                    >
                      {groupName.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name='doorInId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      defaultValue=''
                      label='Door In'
                      SelectProps={{
                        value: value,
                        onChange: e => {
                          onChange(e)
                          setSelectedDoorInId(e.target.value) // Update the selected doorInId
                        }
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.doorInId)}
                      aria-describedby='validation-basic-select'
                      {...(errors.doorInId && { helperText: 'This field is required' })}
                    >
                      {doorList.map(door => (
                        <MenuItem key={door.id} value={door.id}>
                          {door.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Controller
                  name='doorOutId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => {
                    const filteredDoorList = getFilteredDoorList(selectedDoorInId)

                    return (
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        label='Door Out'
                        SelectProps={{
                          value: value,
                          onChange: e => onChange(e)
                        }}
                        id='validation-basic-select'
                        error={Boolean(errors.doorOutId)}
                        aria-describedby='validation-basic-select'
                        {...(errors.doorOutId && { helperText: 'This field is required' })}
                      >
                        {filteredDoorList.map(door => (
                          <MenuItem key={door.id} value={door.id}>
                            {door.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={2}>
                <FormControlLabel
                  control={<Checkbox onChange={handleCheckboxChange} />}
                  label='Always'
                  style={{ marginTop: '25px' }}
                />
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item>Time Settings</Grid>
              <Grid item xs={12}>
                <Controller
                  name='calendarDays'
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Daily
                      callbackOfDaily={v => {
                        onChange(v)
                        setDataDaily(v)
                        setDataDailyState(v)
                      }}
                      dataDailyProps={dataDailyState}
                      disabled={isCheckboxChecked} // Truyền giá trị disabled từ checkbox vào Daily
                      error={Boolean(errors.calendarDays)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.calendarDays && { helperText: 'This field is required' })}
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
