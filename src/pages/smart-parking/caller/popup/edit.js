import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'

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

const CustomFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiFormLabel-root': {
    fontSize: '1rem'
  },
  '& .MuiSelect-root': {
    fontSize: '1rem'
  }
}))

const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: theme.spacing(1),
    fontSize: '1rem'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.dark
  }
}))

const Edit = ({ open, onClose, fetchGroupData, assetId }) => {
  const [assetType, setAssetType] = useState({})
  const [subscriptionTypes, setSubscriptionTypes] = useState([])
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState(null)
  const [units, setUnits] = useState([])
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [name, setName] = useState(null)
  const [code, setCode] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [email, setEmail] = useState(null)
  const [activationStatus, setActivationStatus] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [vehicle, setVehicle] = useState([])
  const [vehicleOption, setVehicleOption] = useState([])
  useEffect(() => {
    fetchAssetType()
  }, [assetId])

  const fetchAssetType = async () => {
    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/sub/find/${assetId}`
      )
      const assetData = response.data
      setAssetType(assetData)
      setSelectedSubscriptionType(assetData.subscriptionType || null)
      setSelectedUnit(assetData.brandId || null)
      setName(response.data.nameClient)
      setCode(response.data.code)
      setPhoneNumber(response.data.phoneNumber)
      setEmail(response.data.email)
      setActivationStatus(response.data.status === 'YES' ? 'ACTIVE' : 'INACTIVE')
      setStartDate(response.data.startDate || '')
      setEndDate(response.data.endDate || '')
      const vehicleIds = response.data.vehicles
      if (vehicleIds && vehicleIds.length > 0) {
        const vehicleData = await fetchVehicles(vehicleIds)
        setVehicle(vehicleData)
        console.log(vehicleData, 'vehiclesdây')
      }
    } catch (error) {
      console.error('Error fetching asset type:', error)
    }
  }

  const fetchVehicles = async vehicleIds => {
    const vehiclePromises = vehicleIds.map(id =>
      axios.get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/find/${id}`)
    )
    const vehicles = await Promise.all(vehiclePromises)

    return vehicles.map(response => response.data)
  }
  useEffect(() => {
    if (selectedSubscriptionType !== null) {
      handleSubscriptionTypeOpen()
    }
    if (selectedUnit !== null) {
      handleUnitOpen()
    }
  }, [selectedSubscriptionType, selectedUnit])

  const handleSubscriptionTypeOpen = async () => {
    try {
      const response = await axios.get('https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/sub/type/')
      setSubscriptionTypes(response.data.rows)
    } catch (error) {
      console.error('Error fetching subscription types:', error)
    }
  }

  const handleUnitOpen = async () => {
    try {
      const response = await axios.get(
        'https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions/children-lv1/children/code?parentCode=dv'
      )
      setUnits(response.data)
    } catch (error) {
      console.error('Error fetching units:', error)
    }
  }

  const handleSubscriptionTypeChange = event => {
    const selectedType = subscriptionTypes.find(type => type.id === event.target.value)
    setSelectedSubscriptionType(selectedType)
  }

  const handleUnitChange = event => {
    setSelectedUnit(event.target.value)
  }

  const handleNameChange = event => {
    setName(event.target.value)
  }

  const handleCodeChange = event => {
    setCode(event.target.value)
  }

  const handlePhoneChange = event => {
    setPhoneNumber(event.target.value)
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handleStartDateChange = event => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = event => {
    setEndDate(event.target.value)
  }

  const handleDeleteRow1 = index => {
    const updatedRows = [...vehicle]
    updatedRows.splice(index, 1)
    setVehicle(updatedRows)
  }

  const handleAddRow1 = () => {
    const newRow = { plateNumber: '', name: '', id: '', code: '' } // Thêm groupId vào đây
    setVehicle([...vehicle, newRow])
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get('https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/', config)

        setVehicleOption(response.data.rows)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  const handleOk = () => {
    const vehicleIds = vehicle.map(v => v.id)

    const params = {
      ...assetType,
      subscriptionType: selectedSubscriptionType,
      brandId: selectedUnit,
      startDate: startDate,
      endDate: endDate,
      nameClient: name,
      code: code,
      phoneNumber: phoneNumber,
      email: email,
      status: activationStatus === 'YES' ? 'YES' : 'NO',
      vehicles: vehicleIds
    }

    axios
      .put(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/sub/${assetId}`, params)
      .then(response => {
        toast.success('Cập nhật thành công')
        onClose()
        fetchGroupData()
      })
      .catch(error => {
        console.error('Error updating asset:', error)
      })
  }

  const handleCancel = () => {
    onClose()
  }

  const filteredVehicleOptions = vehicleOption.filter(
    option => !vehicle || !vehicle.some(vehicle => vehicle.brandName === option.brandName)
  )

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
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <CustomTextField label='Tên khách hàng' value={name || ''} onChange={handleNameChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField label='Mã thuê bao' value={code || ''} onChange={handleCodeChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField label='Số điện thoại' value={phoneNumber || ''} onChange={handlePhoneChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField label='Email' value={email || ''} onChange={handleEmailChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField
              label='Ngày bắt đầu'
              type='date'
              value={startDate}
              onChange={handleStartDateChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField
              label='Ngày kết thúc'
              type='date'
              value={endDate}
              onChange={handleEndDateChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomFormControl fullWidth>
              <Typography variant='h6' gutterBottom>
                Loại thuê bao
              </Typography>
              <CustomSelect
                id='subscription-type-select'
                value={selectedSubscriptionType?.id || ''}
                onChange={handleSubscriptionTypeChange}
              >
                {subscriptionTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </CustomFormControl>
          </Grid>
          <Grid item xs={4}>
            <CustomFormControl fullWidth>
              <Typography variant='h6' gutterBottom>
                Đơn vị
              </Typography>
              <CustomSelect id='unit-select' value={selectedUnit || ''} onChange={handleUnitChange}>
                {units.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </CustomFormControl>
          </Grid>
          <Grid item xs={4}>
            <CustomFormControl fullWidth>
              <Typography variant='h6' gutterBottom>
                Trạng thái kích hoạt
              </Typography>
              <CustomSelect
                select
                labelId='activation-status-label'
                id='activation-status-select'
                value={activationStatus}
                onChange={event => setActivationStatus(event.target.value)}
              >
                <MenuItem value='ACTIVE'>Đã kích hoạt</MenuItem>
                <MenuItem value='INACTIVE'>Chưa kích hoạt</MenuItem>
              </CustomSelect>
            </CustomFormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h5'>Danh sách phương tiện</Typography>
          </Grid>
          <Grid item xs={11.8}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên phương tiện</TableCell>
                    <TableCell>Biển kiểm soát</TableCell>
                    <TableCell>Loại phương tiện</TableCell>
                    <TableCell>Mã thẻ</TableCell>
                    {/* {showPlusColumn && ( */}
                    <TableCell align='center'>
                      <IconButton onClick={handleAddRow1} size='small' sx={{ marginLeft: '10px' }}>
                        <Icon icon='bi:plus' />
                      </IconButton>
                    </TableCell>
                    {/* )} */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicle.map((policy, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {' '}
                        <Autocomplete
                          options={filteredVehicleOptions}
                          getOptionLabel={option => option.brandName}
                          value={vehicleOption.find(option => option.brandName === policy.brandName) || null}
                          onChange={(event, newValue) => {
                            const updatedRows = [...vehicle]
                            updatedRows[index].plateNumber = newValue.plateNumber
                            updatedRows[index].code = newValue.code
                            updatedRows[index].brandName = newValue.brandName
                            updatedRows[index].id = newValue.id

                            // updatedRows[index].id = newValue.id
                            setVehicle(updatedRows)
                          }}
                          renderInput={params => <TextField {...params} label='Vai trò' />}
                        />
                      </TableCell>
                      <TableCell>{policy.plateNumber}</TableCell>

                      <TableCell>{policy?.vehicleType?.name}</TableCell>
                      <TableCell>{policy.code}</TableCell>

                      <TableCell align='center'>
                        <IconButton onClick={() => handleDeleteRow1(index)}>
                          <Icon icon='bi:trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Huỷ</Button>
        <Button variant='contained' onClick={handleOk}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Edit
