import React, { useEffect, useState, useCallback } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tab,
  TableContainer,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import Icon from 'src/@core/components/icon'
import { CircularProgress } from '@material-ui/core'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useRouter } from 'next/router'
import { Label } from 'recharts'
import Link from 'next/link'

const AccessRight = () => {
  const router = useRouter()
  const { userId } = router.query
  const [birthDate, setBirthDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
      },
      {
        id: 2,
        name: 'N.19',
        ChuyenNganh: 'Tổng số gặp mặt khách trong tháng',
        Ngay: 'Quy trình nội bộ',
        HT: 'MĐHT = TLTH',
        CD: 'Email',
        MQH: '25',
        HVT: 'MĐHT = TLTH',
        NS: 'Tự động',
        CV: 'Chức vụ 1',
        hesok: '1',
        vaitro: 'Nhân viên hành chính',
        from: '81',
        to: '90',
        xl: 'B'
      },
      ,
      {
        id: 3,
        name: 'N.19',
        ChuyenNganh: 'Tổng số hợp đồng đã ký trong tháng',
        Ngay: 'Quy trình nội bộ',
        HT: 'MĐHT = TLTH',
        CD: 'Email',
        MQH: '25',
        HVT: 'MĐHT = TLTH',
        NS: 'Tự động',
        CV: 'Chức vụ 1',
        hesok: '0.5',
        vaitro: 'Nhân viên part time',
        from: '71',
        to: '80',
        xl: 'C'
      },
      {
        id: 4,
        name: 'N.19',
        ChuyenNganh: 'Tổng số việc đã hoàn thành trong tháng',
        Ngay: 'Quy trình nội bộ',
        HT: 'MĐHT = TLTH',
        CD: 'Email',
        MQH: '25',
        HVT: 'MĐHT = TLTH',
        NS: 'Tự động',
        CV: 'Chức vụ 1',
        hesok: '1',
        vaitro: 'Kế toán',
        from: '51',
        to: '70',
        xl: 'D'
      },
      {
        id: 5,
        name: 'N.19',
        ChuyenNganh: 'Tổng số việc đã không hoàn thành trong tháng',
        Ngay: 'Quy trình nội bộ',
        HT: 'MĐHT = TLTH',
        CD: 'Email',
        MQH: '25',
        HVT: 'MĐHT = TLTH',
        NS: 'Tự động',
        CV: 'Chức vụ 1',
        hesok: '3.5',
        vaitro: 'Giám đốc',
        from: '1',
        to: '50',
        xl: 'E'
      }
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

  const columns2 = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'from',
      label: 'Từ'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'to',
      label: 'Đến'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 100,
      align: 'center',
      label: 'Xếp loại',
      field: 'xl'
    }
  ]

  const columns1 = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'vaitro',
      label: 'Vai trò'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'hesok',
      label: 'Hệ số K điều chỉnh'
    }
  ]

  const buildUrlWithToken = url => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    if (token) {
      return `${url}?token=${token}`
    }

    return url
  }

  const Img = React.memo(props => {
    const [loaded, setLoaded] = useState(false)

    const { src } = props

    return (
      <>
        <div
          style={
            loaded
              ? { display: 'none' }
              : {
                  width: '100px',
                  height: '100px',
                  display: 'grid',
                  backgroundColor: '#C4C4C4',
                  placeItems: 'center'
                }
          }
        >
          <CircularProgress size={20} />
        </div>
        <img
          {...props}
          src={src}
          alt='Ảnh'
          onLoad={() => setLoaded(true)}
          style={loaded ? { width: '100px', height: '100px' } : { display: 'none' }}
        />
      </>
    )
  })

  return (
    <Card>
      <CardHeader titleTypographyProps={{ sx: { mb: [2, 0] } }} />

      <CardContent>
        <Grid container spacing={2}>
          <Grid container spacing={1}>
            <Grid item xs={4} container alignItems='center'>
              <Button
                variant='contained'
                component={Link}
                href={`/kpi`}
                startIcon={<Icon icon='tabler:chevron-left' />}
              >
                Quay lại
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item xs={4}></Grid>
              <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button variant='contained'>Lưu thay đổi</Button>
                <Button variant='contained' style={{ marginLeft: '2%' }}>
                  Hủy
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={1} style={{ marginTop: '2%' }}>
            {/* <Grid item xs={12}>
              <Img
                // src={buildUrlWithToken(
                //   `https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${user.mainImageId}`
                // )}
                style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
              />
            </Grid> */}

            <Grid item xs={3}>
              <TextField label='Tên bộ KPI' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Mô tả' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Trạng thái</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Hoạt động</MenuItem>
                  <MenuItem value='Undefined'>Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Chiều hướng</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Tăng</MenuItem>
                  <MenuItem value='Undefined'>Giảm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Tần suất đo</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Ngày</MenuItem>
                  <MenuItem value='Undefined'>Tháng</MenuItem>
                  <MenuItem value='Undefined'>Quý</MenuItem>
                  <MenuItem value='Undefined'>Năm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Công thức xếp loại</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Thang điểm 5</MenuItem>
                  <MenuItem value='Undefined'>Thang điểm 10</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <CardHeader
                title='Danh sách chỉ tiêu
'
                titleTypographyProps={{ sx: { mb: [2, 0] } }}
                sx={{
                  py: 4,
                  flexDirection: ['column', 'row'],
                  '& .MuiCardHeader-action': { m: 0 },
                  alignItems: ['flex-start', 'center']
                }}
                action={
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button variant='contained'>Thêm mới</Button>
                  </Grid>
                }
              />

              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      {columns.map(column => (
                        <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length + 2} align='center'>
                          Đang tải dữ liệu...
                        </TableCell>
                      </TableRow>
                    ) : errorMessage ? (
                      <TableRow>
                        <TableCell style={{ color: 'red' }} colSpan={columns.length + 2} align='center'>
                          Error: {errorMessage}
                        </TableCell>
                      </TableRow>
                    ) : row.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns.length + 2} align='center'>
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      (console.log(row, 'log'),
                      row.data.map((row, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell>{index + 1}</TableCell>
                          {columns.map(column => {
                            const value = row[column.field]

                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number' ? column.format(value) : value}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={6}>
              <CardHeader
                title='Điều chỉnh điểm KPI theo hệ số K'
                titleTypographyProps={{ sx: { mb: [2, 0] } }}
                sx={{
                  py: 4,
                  flexDirection: ['column', 'row'],
                  '& .MuiCardHeader-action': { m: 0 },
                  alignItems: ['flex-start', 'center']
                }}
                action={
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button> + Thêm mới</Button>
                  </Grid>
                }
              />{' '}
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                  <TableHead>
                    <TableRow>
                      {columns1.map(column => (
                        <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns1.length + 2} align='center'>
                          Đang tải dữ liệu...
                        </TableCell>
                      </TableRow>
                    ) : errorMessage ? (
                      <TableRow>
                        <TableCell style={{ color: 'red' }} colSpan={columns1.length + 2} align='center'>
                          Error: {errorMessage}
                        </TableCell>
                      </TableRow>
                    ) : row.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns1.length + 2} align='center'>
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      (console.log(row, 'log'),
                      row.data.map((row, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                          {columns1.map(column => {
                            const value = row[column.field]

                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number' ? column.format(value) : value}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={6}>
              <CardHeader
                title='Thang điểm 5'
                titleTypographyProps={{ sx: { mb: [2, 0] } }}
                sx={{
                  py: 4,
                  flexDirection: ['column', 'row'],
                  '& .MuiCardHeader-action': { m: 0 },
                  alignItems: ['flex-start', 'center']
                }}
                action={
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button>+ Thêm mới</Button>
                  </Grid>
                }
              />{' '}
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      {columns2.map(column => (
                        <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns2.length + 2} align='center'>
                          Đang tải dữ liệu...
                        </TableCell>
                      </TableRow>
                    ) : errorMessage ? (
                      <TableRow>
                        <TableCell style={{ color: 'red' }} colSpan={columns2.length + 2} align='center'>
                          Error: {errorMessage}
                        </TableCell>
                      </TableRow>
                    ) : row.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns2.length + 2} align='center'>
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      (console.log(row, 'log'),
                      row.data.map((row, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell>{index + 1}</TableCell>
                          {columns2.map(column => {
                            const value = row[column.field]

                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number' ? column.format(value) : value}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const MaskGroup = `<svg width="21" height="23" viewBox="0 0 193 173" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M176.833 147.216C154.238 134.408 126.747 128.909 123.96 120.697C121.173 112.485 120.571 104.423 123.132 98.3208C125.692 92.2183 128.705 92.9717 130.211 86.1911C130.211 86.1911 133.977 86.9445 136.99 82.4242C140.003 77.9038 140.756 70.3698 140.756 66.6029C140.756 62.8359 135.484 60.5757 135.484 60.5757C135.484 60.5757 140.756 46.2612 137.743 31.9467C134.73 17.6322 124.939 -0.449244 92.553 1.05755V1.28356C66.1168 2.71501 57.6813 18.9883 54.8945 32.1727C51.8819 46.4872 57.1541 60.8017 57.1541 60.8017C57.1541 60.8017 51.8819 63.0619 51.8819 66.8289C51.8819 70.5959 52.635 78.1298 55.6477 82.6502C58.6604 87.1705 62.4262 86.4171 62.4262 86.4171C63.9326 93.1977 66.9453 92.4443 69.506 98.5468C72.0668 104.649 71.4643 112.786 68.6775 120.923C65.8908 129.059 38.4001 134.634 15.8051 147.442C-6.79001 160.25 -4.5305 173.058 -4.5305 173.058L197.319 172.907C197.168 172.831 199.428 160.024 176.833 147.216Z" fill="#797979"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="202" height="172" fill="white" transform="translate(-4.75635 0.982422)"/>
</clipPath>
</defs>
</svg>
`

export default AccessRight
