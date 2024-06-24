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
  InputAdornment
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
import View from './popup/view'
import { useRouter } from 'next/router'
import { Label } from 'recharts'

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
        name: 'Trường 1',
        ChuyenNganh: 'Ngành 1',
        Ngay: '20/10/2024 -21/10/2024',
        HT: 'Trực tiếp',
        CD: 'Cao',
        MQH: 'Cha',
        HVT: 'Ngyễn Ngọc Tú',
        NS: '2001',
        CV: 'Chức vụ 1'
      }
    ]
  }

  const columns = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'name',
      label: 'Tên trường'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'ChuyenNganh',
      label: 'Chuyên ngành đào tạo, bồi dưỡng'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 100,
      align: 'right',
      label: 'Từ tháng, năm, đến tháng, năm',
      field: 'Ngay'
    },
    {
      id: 4,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'HT',
      label: 'Hình thức đào tạo'
    },
    {
      id: 5,
      flex: 0.15,
      minWidth: 100,
      align: 'right',
      label: 'Văn bằng chứng chỉ, trình độ',
      field: 'CD'
    }
  ]

  const columns2 = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'MQH',
      label: 'Mối quan hệ'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'HVT',
      label: 'Họ và tên'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 100,
      align: 'right',
      label: 'Năm sinh',
      field: 'NS'
    },
    {
      id: 4,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'CV',
      label: 'Quê quán, nghề nghiệp, chức danh, chức vụ'
    }
  ]

  const columns1 = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'Ngay',
      label: 'Từ tháng, năm đến tháng, năm'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'ChuyenNganh',
      label: 'Chức danh, chức vụ, đơn vị công tác'
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
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item xs={4}></Grid>
              <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button variant='contained'>Lưu</Button>
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
            <Grid item xs={12}>
              <Box
                sx={{
                  width: '200px',
                  height: 200,
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '45%',
                  marginBottom: '5%'
                }}
              >
                <img
                  alt=''
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(MaskGroup)}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Họ Tên' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Tên gọi Khác' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày sinh' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Nơi sinh' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Quê quán' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Giới tính' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Dân tộc' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Tôn giáo' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Nghề nghiệp' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Đăng ký hộ khẩu thường chú' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Nơi ở hiện nay' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày tuyển dụng' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Cơ quan tuyển dụng' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Chức vụ' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Công việc được giao' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Ngạch công chức' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Mã ngách' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Bậc lương' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Hệ số' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày Hưởng' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Phụ cấp chức vụ' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Phụ cấp khác' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Trình độ giáo dục phổ thông' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Trình độ chuyên môn cao nhất' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Lý luận chính trị' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Quản lý nhà nước' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Ngoại ngữ' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Tin học' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày vào đảng' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày chính thức' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày tham gia tổ chức chính trị- xã hội' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày nhập ngữ' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày xuất ngũ' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Quân hàm cao nhất' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Danh hiệu được phân cao nhất' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Sở trưởng công tác' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Khen thưởng' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Kỷ luật' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Tình trạng sức khỏe' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Chiều cao' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Cân năng' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Nhóm máu' fullWidth />
            </Grid>

            <Grid item xs={3}>
              <TextField label='Là thương binh hạng' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Là con gia đình chính sách' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Số chứng minh nhân dân' fullWidth />
            </Grid>
            <Grid item xs={3}>
              <DatePickerWrapper>
                <DatePicker
                  selected={birthDate}
                  onChange={date => setBirthDate(date)}
                  customInput={<TextField label='Ngày Cấp' fullWidth />}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Số sổ BHXH' fullWidth />
            </Grid>
            <Grid item xs={12}>
              <div>* Đào tạo, bồi dưỡng về chuyên môn, nghiệp vụ, lý luận chính trị, ngoại ngữ, tin học</div>
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
            <Grid item xs={12}>
              <div>* Tóm tắt quá trình công tác</div>
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
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
                          <TableCell>{index + 1}</TableCell>
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
            <Grid item xs={12}>
              <div>* Quan hệ gia đình</div>
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
              <Grid item xs={12} style={{ marginTop: '2%' }}>
                <TextField
                  label='... Nhận xét, đánh giá của cơ quan, đơn vị quản lý và sử dụng cán bộ, công chức .!'
                  fullWidth
                />
              </Grid>
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
