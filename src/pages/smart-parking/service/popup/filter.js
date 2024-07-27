import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

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

const Edit = ({ open, onClose, groupId, groupName, fetchGroupData }) => {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [availableAt, setAvailableAt] = useState('')
  const [dailyprice, setDailyPrice] = useState('')
  const [price1, setPrice1] = useState('')
  const [price2, setPrice2] = useState('')
  const [price3, setPrice3] = useState('')

  useEffect(() => {
    fetchGroups()
  }, [groupName])

  const fetchGroups = () => {
    axios
      .get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search')
      .then(response => {
        // Lọc nhóm khác với groupName hiện tại
        const filteredGroups = response.data.filter(group => group.groupName !== groupName)
        setGroups(filteredGroups)
      })
      .catch(error => {
        console.error('Error fetching groups:', error)
      })
  }

  const handleCancel = () => {
    onClose()
  }

  const handleStartDateChange = date => {
    setAvailableAt(date)
  }

  const handleOk = () => {
    if (selectedGroup) {
      const params = {
        groupId: groupId,
        toGroupId: selectedGroup.groupId // Giả sử ID của group là 'groupId'
      }

      axios
        .put('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/move', params)
        .then(response => {
          console.log('Group moved successfully:', response.data)
          toast.success('Chuyển nhóm thành công')
          onClose()
          fetchGroupData() // Gọi lại fetch để cập nhật danh sách nhóm
        })
        .catch(error => {
          console.error('Error moving group:', error)
        })
    }
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
      <Button>Lọc đơn vị</Button>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
              {' '}
              Thông tin dịch vụ
            </Grid>

            <Grid item xs={4}>
              <Autocomplete
                value={selectedGroup}
                onChange={(event, newValue) => {
                  setSelectedGroup(newValue)
                }}
                options={groups}
                getOptionLabel={option => option.groupName}
                renderInput={params => (
                  <CustomInput {...params} label='Loại phương tiện' variant='outlined' fullWidth />
                )}
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
              <Autocomplete
                value={selectedGroup}
                onChange={(event, newValue) => {
                  setSelectedGroup(newValue)
                }}
                options={groups}
                getOptionLabel={option => option.groupName}
                renderInput={params => (
                  <CustomInput {...params} label='Trạng thái kích hoạt' variant='outlined' fullWidth />
                )}
              />
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
              <Autocomplete
                value={selectedGroup}
                onChange={(event, newValue) => {
                  setSelectedGroup(newValue)
                }}
                options={groups}
                getOptionLabel={option => option.groupName}
                renderInput={params => <CustomInput {...params} label='Nhóm dịch vụ' variant='outlined' fullWidth />}
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
                renderInput={params => <CustomInput {...params} label='Bãi đỗ xe' variant='outlined' fullWidth />}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
              {' '}
              <br></br>
              Thông tin giá
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
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <CustomInput
                label='Giá ngày thường'
                select
                fullWidth
                style={{ marginBottom: '16px' }}
                value={dailyprice}
                onChange={e => setDailyPrice(e.target.value)}
              >
                <MenuItem value='Tăng'>Lớn hơn </MenuItem>
                <MenuItem value='Giảm'>Nhỏ hơn</MenuItem>
              </CustomInput>
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                label='Giá ngày nghỉ'
                select
                fullWidth
                style={{ marginBottom: '16px' }}
                value={dailyprice}
                onChange={e => setDailyPrice(e.target.value)}
              >
                <MenuItem value='Tăng'>Lớn hơn </MenuItem>
                <MenuItem value='Giảm'>Nhỏ hơn</MenuItem>
              </CustomInput>
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                label='Giá ngày lễ'
                select
                fullWidth
                style={{ marginBottom: '16px' }}
                value={dailyprice}
                onChange={e => setDailyPrice(e.target.value)}
              >
                <MenuItem value='Tăng'>Lớn hơn </MenuItem>
                <MenuItem value='Giảm'>Nhỏ hơn</MenuItem>
              </CustomInput>
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                type='text'
                fullWidth
                style={{ marginBottom: '16px' }}
                value={price1}
                onChange={e => setPrice1(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                type='text'
                fullWidth
                style={{ marginBottom: '16px' }}
                value={price2}
                onChange={e => setPrice2(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomInput
                type='text'
                fullWidth
                style={{ marginBottom: '16px' }}
                value={price3}
                onChange={e => setPrice3(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' onClick={handleOk}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Edit
