import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Button,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Box from '@mui/material/Box'

const ChipItem = ({ item, handleDelete }) => (
  <Chip
    key={item.name}
    avatar={<Avatar src={item.avatar} />}
    label={item.name}
    onDelete={() => handleDelete(item.name)}
    deleteIcon={<CloseIcon />}
    clickable={false}
    style={{ margin: 2 }}
  />
)

const ChipItem1 = ({ item, handleDelete }) => (
  <Chip
    key={item?.name}
    label={item?.name}
    onDelete={() => handleDelete(item?.name)}
    deleteIcon={<CloseIcon />}
    clickable={false}
    style={{ margin: 2 }}
  />
)

const AccessRight = () => {
  const router = useRouter()
  const { userId } = router.query
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedItem, setSelectedItem] = useState([])

  const items = [
    { name: 'Sandra Adams', avatar: '/images/avatars/1.png' },
    { name: 'Ali Connors', avatar: '/images/avatars/2.png' },
    { name: 'Trevor Hansen', avatar: '/images/avatars/3.png' },
    { name: 'Tucker Smith', avatar: '/images/avatars/4.png' },
    { name: 'Britta Holt', avatar: '/images/avatars/5.png' }
  ]

  const items1 = [
    { name: 'KINH DOANH' },
    { name: 'KẾ TOÁN' },
    { name: 'TÀI CHÍNH' },
    { name: 'KỸ THUẬT' },
    { name: 'CÔNG NHÂN' }
  ]

  const handleSelectChange = event => {
    const value = event.target.value
    if (!selectedItems.includes(value)) {
      setSelectedItems([...selectedItems, value])
    }
  }

  const handleSelectChange2 = event => {
    const value = event.target.value
    if (!selectedItem.includes(value)) {
      setSelectedItem([...selectedItem, value])
    }
  }

  const handleDelete = itemToDelete => {
    setSelectedItems(prevItems => prevItems.filter(item => item !== itemToDelete))
  }

  const handleDelete2 = itemToDelete => {
    setSelectedItem(prevItems => prevItems.filter(item => item !== itemToDelete))
  }

  const row = {
    data: [
      {
        id: 1,
        name: 'N.19',
        ChuyenNganh: 'Tổng số email gửi cho khách hàng trong tháng',
        Ngay: 'Quy trình nội bộ',
        HT: 'MĐHT = TLTH',
        CD: 'Email',
        MQH: '25',
        HVT: 'MĐHT = TLTH',
        NS: 'Tự động',
        CV: 'Chức vụ 1',
        hesok: '1.5',
        vaitro: 'Trưởng phòng',
        from: '91',
        to: '100',
        xl: 'A'
      }

      // Thêm dữ liệu khác tương tự
    ]
  }

  const columns = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'name',
      label: 'Mã'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'ChuyenNganh',
      label: 'Tên chỉ tiêu'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 100,
      align: 'center',
      label: 'Mục tiêu',
      field: 'Ngay'
    },
    {
      id: 4,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'HT',
      label: 'Mô tả'
    },
    {
      id: 5,
      flex: 0.15,
      minWidth: 100,
      align: 'center',
      label: 'Đơn vị đo',
      field: 'CD'
    },
    {
      id: 6,
      flex: 0.15,
      minWidth: 100,
      align: 'center',
      label: 'Độ quan trọng (%)',
      field: 'MQH'
    },
    {
      id: 7,
      flex: 0.15,
      minWidth: 100,
      align: 'center',
      label: 'Cách đánh giá',
      field: 'HVT'
    },
    {
      id: 8,
      flex: 0.15,
      minWidth: 100,
      align: 'center',
      label: 'Cách tính',
      field: 'NS'
    }
  ]

  return (
    <Card>
      <CardContent>
        <CardHeader titleTypographyProps={{ sx: { mb: [2, 0] } }} />

        <Grid container spacing={2}>
          <Grid container spacing={1} style={{ marginTop: '2%' }}>
            <Grid item xs={6}>
              <TextField label='Name' fullWidth />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Applicable staff department</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Sale</MenuItem>
                  <MenuItem value='Undefined'>Technical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='select-item-label'>Appreciated Group</InputLabel>
                <Select labelId='select-item-label' value='' onChange={handleSelectChange2}>
                  {items1.map(item => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedItem.map(value => {
                const item = items1.find(item => item.name === value)

                return <ChipItem1 key={value} item={item} handleDelete={handleDelete2} />
              })}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='select-item-label'>Appreciated Employee</InputLabel>
                <Select labelId='select-item-label' value='' onChange={handleSelectChange}>
                  {items.map(item => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedItems.map(value => {
                const item = items.find(item => item.name === value)

                return <ChipItem key={value} item={item} handleDelete={handleDelete} />
              })}
            </Grid>
            <Grid item xs={6}>
              <TextField label='Appreciated year' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label='Appreciated month' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label='Appreciated day' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Status</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='actiive'>True</MenuItem>
                  <MenuItem value='inactive'>False</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField label='Reporter' fullWidth />
            </Grid>

            <Grid item xs={6}>
              <TextField label='Appraiser' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label='Appover' fullWidth />
            </Grid>
            <Grid item xs={2}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      selected={new Date()}
                      dateFormat='MM/dd/yyyy'
                      customInput={<CustomInput label='Reporting deadline' />}
                    />
                  </div>
                </Box>
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={2}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      selected={new Date()}
                      dateFormat='MM/dd/yyyy'
                      customInput={<CustomInput label='Appraisal deadline' />}
                    />
                  </div>
                </Box>
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={2}>
              <DatePickerWrapper>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                      selected={new Date()}
                      dateFormat='MM/dd/yyyy'
                      customInput={<CustomInput label='Appover deadline' />}
                    />
                  </div>
                </Box>
              </DatePickerWrapper>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AccessRight
