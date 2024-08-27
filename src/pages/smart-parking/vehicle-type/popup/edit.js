import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
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
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
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

const Edit = ({ open, onClose, fetchGroupData, assetId }) => {
  const [assetType, setAssetType] = useState([])
  const [name, setName] = useState(null)
  const [code, setCode] = useState(null)
  const [detail, setDetail] = useState(null)
  const [parkingId, setParkingId] = useState(null)
  const [activationStatus, setActivationStatus] = useState('')
  const [policies, setPolicies] = useState([])
  const [policyOption, setPolicyOption] = useState([])
  const [serviceParkingId, setServiceParkingId] = useState([])
  const [serviceParkingIdOption, setServiceParkingIdOption] = useState([])

  const handleAddRow1 = () => {
    const newRow = { name: '', startDate: '', id: '', code: '' } // Thêm groupId vào đây
    setPolicies([...policies, newRow])
  }

  const handleDeleteRow1 = index => {
    const updatedRows = [...policies]
    updatedRows.splice(index, 1)
    setPolicies(updatedRows)
  }

  const handleAddRow2 = () => {
    const newRow = { name: '', startDate: '', id: '', startDate: '', endDate: '' } // Thêm groupId vào đây
    setServiceParkingId([...serviceParkingId, newRow])
  }

  const handleDeleteRow2 = index => {
    const updatedRows = [...serviceParkingId]
    updatedRows.splice(index, 1)
    setServiceParkingId(updatedRows)
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

        const response = await axios.get('https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/parking/', config)

        setPolicyOption(response.data.rows)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  const filteredPolicyOptions = policyOption.filter(
    option => !policies || !policies.some(policies => policies.name === option.name)
  )
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

        const response = await axios.get(
          'https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/service/parking/',
          config
        )

        setServiceParkingIdOption(response.data.rows)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  const filteredServiceOptions = serviceParkingIdOption.filter(
    option => !serviceParkingId || !serviceParkingId.some(serviceParkingId => serviceParkingId.name === option.name)
  )
  useEffect(() => {
    fetchAssetType()
  }, [assetId])

  const fetchAssetType = () => {
    axios
      .get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/type/find/${assetId}`)
      .then(response => {
        // Lọc nhóm khác với groupName hiện tại
        setAssetType(response.data)
        setName(response.data.vehicleName)
        setCode(response.data.vehicleCode)
        setDetail(response.data.vehicleDetail)
        setActivationStatus(response.data.vehicleStatus)
      })
      .catch(error => {
        console.error('Error fetching groups:', error)
      })
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

  const handleOk = () => {
    const params = {
      detail: detail,
      name: name,
      status: activationStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
      parkingId: policyOption.map(policy => policy.id),
      serviceParkingId: serviceParkingIdOption.map(policy => policy.id)
    }

    //TodoHue: 31/7/2024: BE thieu them id bai do

    axios
      .put(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/type/${assetId}
`,
        params
      )
      .then(response => {
        console.log(' successfully:', response.data)
        toast.success('Chuyển nhóm thành công')
        onClose()
        fetchGroupData() // Gọi lại fetch để cập nhật danh sách nhóm
      })
      .catch(error => {
        console.error('Error moving group:', error)
      })
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
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <CustomTextField label='Tên loại phương tiện' value={name} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField label='Mã loại phương tiện' value={code} onChange={handleCodeChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <FormControl fullWidth>
                <CustomTextField
                  select
                  labelId='activation-status-label'
                  id='activation-status-select'
                  value={activationStatus}
                  onChange={event => setActivationStatus(event.target.value)}
                  label='Trạng thái kích hoạt'
                >
                  <MenuItem value='ACTIVE'>Đã kích hoạt</MenuItem>
                  <MenuItem value='INACTIVE'>Chưa kích hoạt</MenuItem>
                </CustomTextField>
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              rows={4}
              multiline
              label='Ghi chú'
              value={detail}
              onChange={handleDetailChange}
              id='textarea-outlined-static'
              fullWidth
            />
          </Grid>
          <Grid>Danh sách bãi đỗ xe áp dụng loại phương tiện này</Grid>

          <Grid item xs={11.8}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên bãi đỗ</TableCell>
                    <TableCell>Mã bãi đỗ</TableCell>
                    <TableCell>Phân Khu</TableCell>
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
                  {policies.map((policy, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {' '}
                        <Autocomplete
                          options={filteredPolicyOptions}
                          getOptionLabel={option => option.name}
                          value={policyOption.find(option => option.name === policy.name) || null}
                          onChange={(event, newValue) => {
                            const updatedRows = [...policies]
                            updatedRows[index].name = newValue.name
                            updatedRows[index].code = newValue.code
                            updatedRows[index].startDate = newValue.startDate
                            updatedRows[index].id = newValue.id

                            setPolicies(updatedRows)
                          }}
                          renderInput={params => <TextField {...params} label='Vai trò' />}
                        />
                      </TableCell>
                      <TableCell>{policy.code}</TableCell>

                      <TableCell>{policy.startDate}</TableCell>

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
          <Grid>Danh sách dịch vụ áp dụng loại phương tiện này</Grid>
          <Grid item xs={11.8}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên phương tiện</TableCell>
                    <TableCell>Mã phương tiện</TableCell>
                    <TableCell>Ngày áp dụng</TableCell>
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
                  {policies.map((policy, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {' '}
                        <Autocomplete
                          options={filteredServiceOptions}
                          getOptionLabel={option => option.name}
                          value={serviceParkingIdOption.find(option => option.name === policy.name) || null}
                          onChange={(event, newValue) => {
                            const updatedRows = [...serviceParkingId]
                            updatedRows[index].name = newValue.name
                            updatedRows[index].code = newValue.code
                            updatedRows[index].startDate = newValue.startDate
                            updatedRows[index].endDate = newValue.endDate

                            updatedRows[index].id = newValue.id

                            setPolicies(updatedRows)
                          }}
                          renderInput={params => <TextField {...params} label='Vai trò' />}
                        />
                      </TableCell>
                      <TableCell>{policy.code}</TableCell>

                      <TableCell>
                        {policy.startDate} - {policy.endDate}
                      </TableCell>

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
