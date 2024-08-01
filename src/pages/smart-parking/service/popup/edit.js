import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import DatePicker from 'react-datepicker'
import { getApi, putApi } from 'src/@core/utils/requestUltils'
import { Controller, useForm } from 'react-hook-form'

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

const statusGroup = [
  {
    id: '1',
    name: 'YES'
  },
  {
    id: '3',
    name: 'NO'
  }
]

const serviceParkingGroup = [
  {
    id: '1',
    name: 'OTO'
  },
  {
    id: '3',
    name: 'MOTORBIKE'
  }
]

const format_form = [
  {
    name: 'code',
    label: 'Mã dịch vụ',
    placeholder: 'Mã dịch vụ',
    type: 'TextField',
    require: true,
    width: 4
  },
  {
    name: 'name',
    label: 'Tên dịch vụ',
    placeholder: 'Tên dịch vụ',
    type: 'TextField',
    require: true,
    width: 4
  },
  {
    name: 'vehicleType',
    label: 'Loại phương tiện',
    placeholder: 'Tên phương tiện',
    type: 'Autocomplete',
    require: true,
    width: 4
  },
  {
    name: 'subscriptionType',
    label: 'Loại thuê bao',
    placeholder: 'Loại thuê bao',
    type: 'Autocomplete',
    require: true,
    width: 4
  },
  {
    name: 'status',
    label: 'Trạng thái kích hoạt',
    placeholder: 'Trạng thái kích hoạt',
    type: 'Autocomplete',
    require: true,
    width: 4
  },
  {
    name: 'eserviceParking',
    label: 'Nhóm dịch vụ',
    placeholder: 'Nhóm dịch vụ',
    type: 'Autocomplete',
    require: true,
    width: 4
  },
  {
    name: 'detepicker',
    label: 'Ngày áp dụng',
    placeholder: 'Ngày áp dụng',
    type: 'DatePicker',
    require: true,
    width: 4
  }
]




const Edit = ({ open, onClose, id, setReload }) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(null)
  const [code, setCode] = useState(null)
  const [detail, setDetail] = useState(null)
  const [groups, setGroups] = useState([])
  const [servicePrice, setServicePrice] = useState([])

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

  const [form, setForm] = useState(format_form)

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  useEffect(() => {
    fetchData()
    fetchParkings()
    fetchVehicleType()
    fetchSubTypes()
  }, [])

  useEffect(() => {
    if (detail) {
      setDetailFormValue()
    }
  }, [detail])

  const setDetailFormValue = () => {
    reset(detail)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getApi(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/service/parking/find/${id}`)
      setDetail(res.data)
      setCode(res.data?.code)
      setName(res.data?.name)
      setStatus(res.data?.status)
      setStartDate(res.data?.startDate)
      setEndDate(res.data?.endDate)
      setServiceParking(res.data?.eserviceParking)
      setSubType(res.data?.subscriptionType.name)
      setVehicleType(res.data?.vehicleType.name)
      setServicePrice(res.data?.serviceParkingPrice)
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

  const handleAddRow1 = () => {
    const newRow1 = { policyName: '', description: '' }
    setServicePrice([...servicePrice, newRow1])
  }


  const handleCancel = () => {
    onClose()
  }

  const handleFullNameChange = event => {
    setName(event.target.value)
  }

  const handleCodeChange = event => {
    setCode(event.target.value)
  }

  const handleDetailChange = event => {
    setDetail(event.target.value)
  }


  const handleOnChange = dates => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const onSubmit = values => {
    const params = {
      ...values
    }

    putApi(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/service/parking/${detail.id}`, { ...params })
      .then(() => {
        toast.success('Cập nhật thành công')
        setReload()
      })
      .catch(error => {
        if (error && error?.response?.data) {
          console.error('error', error)
          toast.error(error?.response?.data?.message)
        } else {
          console.error('Error fetching data:', error)
          toast.error(error)
        }
      })
      .finally(() => {
        setLoading(false)
        onClose()
      })

    console.log('params', params);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xl'
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={onClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      <DialogContent>
        <Box sx={{ m: 5, textAlign: 'left' }}>
          <Typography variant='h3' sx={{ mb: 3 }} color='#FF9F43'>
            Chi tiết dịch vụ
          </Typography>
        </Box>
        <form>
          <Grid container spacing={4}>
            {form.map((item, index) => {
              if (item.type === 'TextField') {
                return (
                  <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Controller
                      name={item.name}
                      control={control}
                      rules={{ required: item.require }}
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
              if (item.type === 'Autocomplete') {
                const options =
                  item.name === 'vehicleType' ? vehicleTypes :
                    item.name === 'subscriptionType' ? subTypes :
                      item.name === 'status' ? statusGroup :
                        item.name === 'eserviceParking' ? serviceParkingGroup : [];

                const value =
                  item.name === 'vehicleType' ? vehicleType :
                    item.name === 'subscriptionType' ? subType :
                      item.name === 'status' ? status :
                        item.name === 'eserviceParking' ? serviceParking : null;

                return (
                  <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Controller
                      name={item.name}
                      control={control}
                      rules={{ required: item.require }}
                      render={({ field: { value, onChange } }) => (
                        <Autocomplete
                          fullWidth
                          value={value || null}
                          onChange={(event, selectedItem) => {
                            if (item.name === 'status' || item.name === 'eserviceParking') {
                              onChange(selectedItem.name)
                            } else {
                              onChange(selectedItem)
                            }
                          }}
                          options={options}
                          getOptionLabel={option => option?.name || option}
                          renderInput={(params) => <CustomInput {...params} label={item.label} variant='outlined' fullWidth />}
                        />
                      )}
                    />
                  </Grid>
                );
              }
              if (item.type === 'DatePicker') {
                return (
                  <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
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
                )
              }
            })}
          </Grid>

          <Grid item xs={12} container spacing={0} sx={{ marginTop: 5 }}>
            <Grid item xs={12}>
              <Typography variant='h6'>Bảng giá dịch vụ</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Giờ bắt đầu</TableCell>
                      <TableCell>Giờ kết thúc</TableCell>
                      <TableCell>Giá ngày thường</TableCell>
                      <TableCell>Giá ngày nghỉ</TableCell>
                      <TableCell>Giá ngày lễ</TableCell>
                      <TableCell>Thời gian miễn phí (giờ dầu)</TableCell>
                      <TableCell>Trọng số</TableCell>

                      <TableCell>Mô tả</TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={handleAddRow1} size='small' sx={{ marginLeft: '10px' }}>
                          <Icon icon='bi:plus' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {servicePrice.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            value={row?.startTime}
                            onChange={handleFullNameChange}
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <Icon icon="tabler:clock" />
                                </InputAdornment>
                              )
                            }}
                          />
                        </TableCell>{' '}
                        <TableCell>
                          <CustomTextField
                            value={row?.endTime}
                            onChange={handleFullNameChange}
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <Icon icon="tabler:clock" />
                                </InputAdornment>
                              )
                            }} />
                        </TableCell>{' '}
                        <TableCell>
                          <CustomTextField value={row?.dailyPrice} onChange={handleFullNameChange} fullWidth />
                        </TableCell>{' '}
                        <TableCell>
                          <CustomTextField value={row?.weekendPrice} onChange={handleFullNameChange} fullWidth />
                        </TableCell>{' '}
                        <TableCell>
                          <CustomTextField value={row?.holidayPrice} onChange={handleFullNameChange} fullWidth />
                        </TableCell>{' '}
                        <TableCell>
                          <CustomTextField value={row?.timeFree} onChange={handleFullNameChange} fullWidth />
                        </TableCell>
                        <TableCell>
                          <CustomTextField value={row?.weight} onChange={handleFullNameChange} fullWidth />
                        </TableCell>{' '}
                        <TableCell>
                          <CustomTextField value={''} onChange={handleFullNameChange} fullWidth />
                        </TableCell>{' '}
                        <TableCell align='center'>
                          {index > 0 && (
                            <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                              <Icon icon='bi:trash' />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={0} sx={{ marginTop: 5 }}>
            <Grid item xs={12}>
              <Typography variant='h6'>Bãi đỗ xe sử dụng dịch vụ này</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Mã bãi đỗ xe</TableCell>
                      <TableCell>Tên bãi đỗ xe</TableCell>
                      <TableCell>Khu vực</TableCell>
                      <TableCell align='center'>
                        <IconButton onClick={handleAddRow1} size='small' sx={{ marginLeft: '10px' }}>
                          <Icon icon='bi:plus' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {servicePrice.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <CustomTextField value={''} fullWidth />
                        </TableCell>{' '}
                        <TableCell>
                          <CustomTextField value={''} fullWidth />
                        </TableCell>{' '}
                        <TableCell>
                          <CustomTextField value={''} fullWidth />
                        </TableCell>{' '}
                        <TableCell align='center'>
                          {index > 0 && (
                            <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                              <Icon icon='bi:trash' />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Huỷ</Button>
        <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Edit
