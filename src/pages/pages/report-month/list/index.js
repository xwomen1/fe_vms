import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import DatePicker from 'react-datepicker'
import TreeItem from '@mui/lab/TreeItem'
import * as XLSX from 'xlsx'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { format, isWithinInterval, parse } from 'date-fns'
import TreeView from '@mui/lab/TreeView'
import { useForm } from 'react-hook-form'
import useUrlState from '../useUrlState'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { makeStyles } from '@material-ui/core/styles'

const initValueFilter = {}

function ReportMonth({ history }) {
  const [loading, setLoading] = useState(false)
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter)
  const [start, setStart] = useState(null)
  const [users, setUsers] = useState([])
  const [end, setEnd] = useState(null)
  const [daysInRange, setDaysInRange] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const classes = useStyles()
  const [selectedGroup, setSelectedGroup] = useState(null)

  const {
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: valueFilter
  })

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      setStart(startDate)
      setEnd(endDate)
      calculateDaysInRange(startDate, endDate)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedGroupId !== null) {
      setValueFilter({ ...valueFilter, page: 1 })
      setUsers([])
    }
  }, [])

  useEffect(() => {
    fetchDataSource()
  }, [valueFilter.groupId])

  const fetchDataSource = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          groupId: selectedGroupId?.id || ''
        }
      }

      const response = await axios.get(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/event/user/inout',
        config
      )
      setUsers(response.data)
      reset(valueFilter)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        setLoading(true)

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups', config)
        setGroups(response.data?.rows || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchGroupData()
  }, [])

  const calculateDaysInRange = (start, end) => {
    if (start && end && start instanceof Date && end instanceof Date) {
      const days = []
      let currentDay = new Date(start)

      while (currentDay <= end) {
        days.push(format(currentDay, 'dd/MM/yyyy'))
        currentDay.setDate(currentDay.getDate() + 1)
      }
      setDaysInRange(days)
    }
  }

  const handleSearch = () => {
    calculateDaysInRange(start, end)
    fetchDataSource()
  }

  const exportToExcel = () => {
    // Tạo một workbook mới
    const workbook = XLSX.utils.book_new()

    // Tạo một worksheet từ dữ liệu đã gộp cho khoảng ngày đã chọn
    const filteredData = users.map(employee => {
      const row = {
        'Họ Employee Name': employee.fullName
      }

      daysInRange.forEach(day => {
        const formattedDay = format(parse(day, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy')

        const matchingTimes = employee.eventEachUsers.filter(time => {
          const startDate = format(new Date(time.minEventAt), 'dd/MM/yyyy')
          const endDate = format(new Date(time.maxEventAt), 'dd/MM/yyyy')

          return isWithinInterval(parse(formattedDay, 'dd/MM/yyyy', new Date()), {
            start: parse(startDate, 'dd/MM/yyyy', new Date()),
            end: parse(endDate, 'dd/MM/yyyy', new Date())
          })
        })

        const totalDuration = matchingTimes.reduce((sum, time) => {
          const startTime = format(new Date(time.minEventAt), 'HH:mm')
          const endTime = format(new Date(time.maxEventAt), 'HH:mm')

          const lunchStart = '12:00'
          const lunchEnd = '13:30'

          // Nếu thời gian nằm ngoài thời gian nghỉ trưa hoặc không nằm trong thời gian làm việc
          if (endTime <= lunchStart || startTime >= lunchEnd) {
            sum += time.maxEventAt - time.minEventAt
          } else {
            // Trường hợp còn lại, tính thời gian làm việc trừ thời gian nghỉ trưa
            if (startTime < lunchStart) {
              sum += parse(lunchStart, 'HH:mm', new Date()) - parse(startTime, 'HH:mm', new Date())
            }
            if (endTime > lunchEnd) {
              sum += parse(endTime, 'HH:mm', new Date()) - parse(lunchEnd, 'HH:mm', new Date())
            }
          }

          return sum
        }, 0)

        const formattedTimes = matchingTimes
          .map(
            time =>
              `Vào: ${format(new Date(time.minEventAt), 'HH:mm')} - Ra: ${format(new Date(time.maxEventAt), 'HH:mm')}`
          )
          .join('\n')
        const totalTime = formatDuration(totalDuration)

        // Thời gian vào, ra và tổng thời gian được thêm vào dòng tương ứng
        row[`ThoiGian_${formattedDay}_`] = `${formattedTimes}\nTongThoiGian: ${totalTime}`
      })

      return row
    })

    const worksheet = XLSX.utils.json_to_sheet(filteredData)

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachNhanVien')

    // Tạo buffer cho file Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    // Tạo Blob từ buffer
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetcharset=UTF-8'
    })

    // Tạo đường dẫn URL cho Blob
    const url = URL.createObjectURL(blob)

    // Tạo một thẻ a để tải xuống
    const a = document.createElement('a')
    a.href = url
    a.download = 'DanhSachNhanVien.xlsx'

    // Thêm thẻ a vào body và click để bắt đầu tải xuống
    document.body.appendChild(a)
    a.click()

    // Xóa thẻ a sau khi đã tải xuống
    document.body.removeChild(a)
  }

  const formatDuration = durationInMilliseconds => {
    const seconds = Math.floor((durationInMilliseconds / 1000) % 60)
    const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60)
    const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24)

    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}`
  }
  const emptyColumnCount = Math.max(0, 9 - daysInRange.length)

  // Tạo một mảng chứa các cột rỗng
  const emptyColumn = Array.from({ length: emptyColumnCount }, (_, index) => index)

  const cellWidth = 150
  const minCellWidth = 150

  return (
    <Card className={classes.loadingContainer}>
      {loading && <CircularProgress className={classes.circularProgress} />}

      <CardHeader
        title={
          <>
            <Grid>
              <Button variant='contained'> Monthly Report</Button>
            </Grid>
          </>
        }
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 4,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <Autocomplete
              options={groups}
              getOptionLabel={option => option.name}
              loading={loading}
              onChange={(event, newValue) => {
                setSelectedGroupId(newValue)
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Select User Group'
                  variant='outlined'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <>{params.InputProps.endAdornment}</>
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <DatePickerWrapper>
              <div>
                <DatePicker
                  selected={start}
                  id='basic-input'
                  onChange={date => setStart(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Start Date' />}
                />
              </div>
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={1}>
            <DatePickerWrapper>
              <div>
                <DatePicker
                  selected={end}
                  id='basic-input'
                  onChange={date => setEnd(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Start End' />}
                  minDate={start}
                />
              </div>
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Button onClick={handleSearch} style={{ marginTop: 20 }} variant='contained'>
              Search
            </Button>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              style={{ marginTop: 20, marginLeft: -30 }}
              variant='contained'
              startIcon={<Icon icon='tabler:download' />}
              onClick={exportToExcel}
            >
              Download
            </Button>
          </Grid>
        </Grid>
        <br /> <hr />
        <br />
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table aria-label='Monthly Report'>
            <TableHead>
              <TableRow>
                <TableCell style={fixedColumnStyles}>Employee Name</TableCell>
                {daysInRange.map((day, index) => (
                  <TableCell
                    key={index}
                    style={{ ...headerCellStyle, width: `${cellWidth}px`, minWidth: `${minCellWidth}px` }}
                  >
                    {`${day}`}
                  </TableCell>
                ))}
                {emptyColumn.map(colIndex => (
                  <TableCell
                    key={`empty-column-${colIndex}`}
                    style={{ ...headerCellStyle, width: `${cellWidth}px`, minWidth: `${minCellWidth}px` }}
                  ></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((employee, employeeIndex) => (
                <TableRow key={employeeIndex}>
                  <TableCell
                    key={employeeIndex}
                    style={{
                      ...fixedColumnStyle,
                      position: 'sticky',
                      top: 0,
                      backgroundColor: 'white',
                      zIndex: 2
                    }}
                  >
                    {employee?.fullName}
                  </TableCell>
                  {daysInRange.map((day, dayIndex) => {
                    const formattedDay = format(parse(day, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy')

                    // Kiểm tra xem eventEachUsers có tồn tại và là một mảng
                    const matchingTimes = (employee.eventEachUsers || []).filter(time => {
                      const startDate = format(new Date(time.minEventAt), 'dd/MM/yyyy')
                      const endDate = format(new Date(time.maxEventAt), 'dd/MM/yyyy')

                      return isWithinInterval(parse(formattedDay, 'dd/MM/yyyy', new Date()), {
                        start: parse(startDate, 'dd/MM/yyyy', new Date()),
                        end: parse(endDate, 'dd/MM/yyyy', new Date())
                      })
                    })

                    const totalDuration = matchingTimes.reduce((sum, time) => {
                      const startTime = format(new Date(time.minEventAt), 'HH:mm')
                      const endTime = format(new Date(time.maxEventAt), 'HH:mm')

                      const lunchStart = '12:00'
                      const lunchEnd = '13:30'

                      // Nếu thời gian nằm ngoài thời gian nghỉ trưa hoặc không nằm trong thời gian làm việc
                      if (endTime <= lunchStart || startTime >= lunchEnd) {
                        sum += time.maxEventAt - time.minEventAt
                      } else {
                        // Trường hợp còn lại, tính thời gian làm việc trừ thời gian nghỉ trưa
                        if (startTime < lunchStart) {
                          sum += parse(lunchStart, 'HH:mm', new Date()) - parse(startTime, 'HH:mm', new Date())
                        }
                        if (endTime > lunchEnd) {
                          sum += parse(endTime, 'HH:mm', new Date()) - parse(lunchEnd, 'HH:mm', new Date())
                        }
                      }

                      return sum
                    }, 0)

                    return (
                      <TableCell
                        key={dayIndex}
                        style={{
                          ...cellStyle,
                          width: `${cellWidth}px`,
                          minWidth: `${minCellWidth}px`
                        }}
                      >
                        {matchingTimes.map((time, timeIndex) => (
                          <div key={timeIndex}>
                            {format(new Date(time.minEventAt), ' HH:mm')} -{' '}
                            {format(new Date(time.maxEventAt), ' HH:mm')}
                          </div>
                        ))}
                        {matchingTimes.length > 0 && (
                          <div>
                            Total time
                            <div style={{ color: '#e28743' }}>{formatDuration(totalDuration)}</div>
                          </div>
                        )}
                      </TableCell>
                    )
                  })}
                  {emptyColumn.map(colIndex => (
                    <TableCell
                      key={`empty-cell-${employeeIndex}-${colIndex}`}
                      style={{ ...cellStyle, width: `${cellWidth}px`, minWidth: `${minCellWidth}px` }}
                    ></TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

const cellStyle = {
  border: '1px solid #dddddd',
  padding: '20px',
  minWidth: '25%',
  textAlign: 'left'
}

const headerCellStyle = {
  ...cellStyle,
  backgroundColor: '#f2f2f2'
}

const fixedColumnStyle = {
  ...cellStyle,
  width: 'auto',
  minWidth: '150px',
  position: 'sticky',
  left: 0,
  zIndex: 1
}

const fixedColumnStyles = {
  ...cellStyle,
  width: 'auto',
  minWidth: '200px',
  position: 'sticky',
  backgroundColor: '#f2f2f2',
  left: 0,
  zIndex: 5
}

const useStyles = makeStyles(() => ({
  loadingContainer: {
    position: 'relative',
    minHeight: '100px', // Đặt độ cao tùy ý
    zIndex: 0
  },
  circularProgress: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999 // Đặt z-index cao hơn so với Grid container
  }
}))

export default ReportMonth
