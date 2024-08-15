import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import DatePicker from 'react-datepicker'
import * as XLSX from 'xlsx'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { format, isWithinInterval, parse } from 'date-fns'
import TreeView from '@mui/lab/TreeView'
import { useForm } from 'react-hook-form'
import useUrlState from '../useUrlState'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import authConfig from 'src/configs/auth'

const initValueFilter = {}

function ReportMonth({ history }) {
  const [loading, setLoading] = useState(false)
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter)
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [users, setUsers] = useState([])
  const [daysInRange, setDaysInRange] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedGroups, setSelectedGroups] = useState([])

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues: valueFilter })

  useEffect(() => {
    const fetchData = async () => {
      // await fetchGroupData()
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
    if (selectedGroupId) {
      setValueFilter({ ...valueFilter, page: 1 })
      setUsers([])
    }
  }, [])

  useEffect(() => {
    fetchDataSource()
  }, [valueFilter.page, valueFilter.groupId])

  const fetchDataSource = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { groupId: selectedGroupId?.id || '', page: valueFilter.page, limit: valueFilter.limit }
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

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups', config)
        setGroups(addChildrenField(response.data?.rows))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  const addChildrenField = data => {
    return data?.map(group => {
      group.children = data.filter(child => child.parentId === group.id)

      return group
    })
  }

  const calculateDaysInRange = (start, end) => {
    if (start && end) {
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
    const workbook = XLSX.utils.book_new()

    const filteredData = users.map(employee => {
      const row = { 'Họ Employee Name': employee.fullName }
      daysInRange.forEach(day => {
        const formattedDay = format(parse(day, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy')

        const matchingTimes = employee.eventEachUsers.filter(time =>
          isWithinInterval(parse(formattedDay, 'dd/MM/yyyy', new Date()), {
            start: parse(format(new Date(time.minEventAt), 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date()),
            end: parse(format(new Date(time.maxEventAt), 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date())
          })
        )

        const totalDuration = matchingTimes.reduce((sum, time) => {
          const startTime = format(new Date(time.minEventAt), 'HH:mm')
          const endTime = format(new Date(time.maxEventAt), 'HH:mm')
          const lunchStart = '12:00'
          const lunchEnd = '13:30'

          if (endTime <= lunchStart || startTime >= lunchEnd) {
            sum += time.maxEventAt - time.minEventAt
          } else {
            if (startTime < lunchStart)
              sum += parse(lunchStart, 'HH:mm', new Date()) - parse(startTime, 'HH:mm', new Date())
            if (endTime > lunchEnd) sum += parse(endTime, 'HH:mm', new Date()) - parse(lunchEnd, 'HH:mm', new Date())
          }

          return sum
        }, 0)

        row[`ThoiGian_${formattedDay}_`] = `${matchingTimes
          .map(
            time =>
              `Vào: ${format(new Date(time.minEventAt), 'HH:mm')} - Ra: ${format(new Date(time.maxEventAt), 'HH:mm')}`
          )
          .join('\n')}\nTongThoiGian: ${formatDuration(totalDuration)}`
      })

      return row
    })

    const worksheet = XLSX.utils.json_to_sheet(filteredData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachNhanVien')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'DanhSachNhanVien.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatDuration = durationInMilliseconds => {
    const seconds = Math.floor((durationInMilliseconds / 1000) % 60)
    const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60)
    const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24)

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const emptyColumnCount = Math.max(0, 9 - daysInRange.length)
  const emptyColumn = Array.from({ length: emptyColumnCount }, (_, index) => index)
  const cellWidth = 150
  const minCellWidth = 150

  return (
    <Card>
      <CardHeader
        title={
          <Grid>
            <Button variant='contained'> Monthly Report</Button>
          </Grid>
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
              disablePortal
              id='autocomplete-user-groups'
              options={groups || []}
              autoHighlight
              getOptionLabel={option => option.name} // Hiển thị tên nhóm
              renderInput={params => <CustomTextField placeholder='Department' {...params} label='Department' />}
              onChange={(e, value) => {
                setSelectedGroupId(value ? { id: value.id } : '')
                setSelectedGroups(value ? [{ id: value.id }] : [])
              }}
              value={selectedGroupId ? groups.find(g => g.id === selectedGroupId.id) : null}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <DatePickerWrapper>
              <DatePicker
                selected={start}
                onChange={date => setStart(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Start Date' />}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={1}>
            <DatePickerWrapper>
              <DatePicker
                selected={end}
                onChange={date => setEnd(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='End Date' />}
                minDate={start}
              />
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
              variant='outlined'
              color='secondary'
              startIcon={<Icon icon='tabler:download' />}
              onClick={exportToExcel}
            >
              Download
            </Button>
          </Grid>
        </Grid>
        <br />
        <hr />
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
                    {day}
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
                  <TableCell style={fixedColumnStyle}>{employee?.fullName}</TableCell>
                  {daysInRange.map((day, dayIndex) => {
                    const formattedDay = format(parse(day, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy')

                    const matchingTimes = (employee.eventEachUsers || []).filter(time =>
                      isWithinInterval(parse(formattedDay, 'dd/MM/yyyy', new Date()), {
                        start: parse(format(new Date(time.minEventAt), 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date()),
                        end: parse(format(new Date(time.maxEventAt), 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date())
                      })
                    )

                    const totalDuration = matchingTimes.reduce((sum, time) => {
                      const startTime = format(new Date(time.minEventAt), 'HH:mm')
                      const endTime = format(new Date(time.maxEventAt), 'HH:mm')
                      const lunchStart = '12:00'
                      const lunchEnd = '13:30'

                      if (endTime <= lunchStart || startTime >= lunchEnd) {
                        sum += time.maxEventAt - time.minEventAt
                      } else {
                        if (startTime < lunchStart)
                          sum += parse(lunchStart, 'HH:mm', new Date()) - parse(startTime, 'HH:mm', new Date())
                        if (endTime > lunchEnd)
                          sum += parse(endTime, 'HH:mm', new Date()) - parse(lunchEnd, 'HH:mm', new Date())
                      }

                      return sum
                    }, 0)

                    return (
                      <TableCell
                        key={dayIndex}
                        style={{ ...cellStyle, width: `${cellWidth}px`, minWidth: `${minCellWidth}px` }}
                      >
                        {matchingTimes.map((time, timeIndex) => (
                          <div key={timeIndex}>
                            {format(new Date(time.minEventAt), 'HH:mm')} - {format(new Date(time.maxEventAt), 'HH:mm')}
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
  position: 'sticky',
  left: 0,
  zIndex: 1
}

const fixedColumnStyles = {
  ...cellStyle,
  position: 'sticky',
  backgroundColor: '#f2f2f2',
  left: 0,
  zIndex: 5
}

export default ReportMonth
