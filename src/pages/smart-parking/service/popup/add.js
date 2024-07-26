import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  Grid,
  IconButton,
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
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [availableAt, setAvailableAt] = useState('')
  const [rows1, setRows1] = useState([])

  const handleAddRow1 = () => {
    const newRow1 = { policyName: '', description: '' }
    setRows1([...rows1, newRow1])
  }

  const handleStartDateChange = date => {
    setAvailableAt(date)
  }
  useEffect(() => {
    fetchAssetType()
  }, [assetId])

  const fetchAssetType = () => {
    axios
      .get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/asset/type/find/${assetId}`)
      .then(response => {
        // Lọc nhóm khác với groupName hiện tại
        setAssetType(response.data)
        setName(response.data.name)
        setCode(response.data.code)
        setDetail(response.data.detail)
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
      name: name
    }

    axios
      .put(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/asset/type/${assetId}
`,
        params
      )
      .then(response => {
        console.log(' successfully:', response.data)
        toast.success('Sửa thành công')
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
        <Grid item xs={12}>
          <Button> Chi tiết dịch vụ</Button>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <CustomTextField label='Mã dịch vụ' value={name} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField label='Tên dịch vụ' value={name} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              value={selectedGroup}
              onChange={(event, newValue) => {
                setSelectedGroup(newValue)
              }}
              options={groups}
              getOptionLabel={option => option.groupName}
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
            <CustomTextField label='Nhóm dịch vụ' value={name} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField label='Trạng thái kích hoạt' value={name} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <DatePickerWrapper>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <div>
                  <DatePicker
                    selected={availableAt}
                    onChange={handleStartDateChange}
                    dateFormat='MM/dd/yyyy'
                    customInput={<CustomInput label='Ngày bắt đầu' />}
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
                    selected={availableAt}
                    onChange={handleStartDateChange}
                    dateFormat='MM/dd/yyyy'
                    customInput={<CustomInput label='Ngày kết thúc' />}
                  />
                </div>
              </Box>
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={11.8}>
            Bảng giá dịch vụ
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
                  {rows1.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>{' '}
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>{' '}
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>{' '}
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>{' '}
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>{' '}
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>{' '}
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
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
          <Grid item xs={11.8}>
            Bảng giá dịch vụ
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
                  {rows1.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>{' '}
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
                      </TableCell>{' '}
                      <TableCell>
                        <CustomTextField value={name} onChange={handleFullNameChange} fullWidth />
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
