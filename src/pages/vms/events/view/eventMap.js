import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import ReactMapGL, { Marker, Popup, Source, Layer } from '@goongmaps/goong-map-react'

import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'
import axios from 'axios'
import * as XLSX from 'xlsx'

const columns = [
  {
    id: 1,
    flex: 0.15,
    type: 'timestamp',
    width: 50,
    align: 'right',
    label: 'Ngày giờ',
    field: 'timestamp',
    valueGetter: params => new Date(params.field)
  },
  {
    id: 2,
    flex: 0.15,
    type: 'eventTypeString',
    minWidth: 10,
    align: 'right',
    field: 'event',
    label: 'Sự kiện',
    field: 'eventTypeString'
  },
  {
    id: 3,
    flex: 0.15,
    width: 50,
    align: 'right',
    label: 'Camera',
    field: 'camName'
  }
]

const EventMap = () => {
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [selected, setSelected] = useState([])
  const [isOpenTable, setIsOpenTable] = useState(false)
  const [rows, setRows] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedTimes, setSelectedTimes] = useState([])

  const [selectedCameraIds, setSelectedCameraIds] = useState([])
  const [isReconnected, setIsReconnected] = useState(false)

  const [viewport, setViewport] = useState({
    longitude: 105.83416,
    latitude: 21.027763,
    zoom: 15
  })

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    connections.forEach(connection => {
      connectPoints(connection[0], connection[1])
    })
  }, [connections])
  useEffect(() => {
    if (isReconnected) {
    }
  }, [isReconnected])
  useEffect(() => {}, [selectedCameraIds])

  useEffect(() => {
    if (selectedTimes.length >= 2) {
      const lastIndex = selectedTimes.length - 1
      const lastTwoPoints = [selectedTimes[lastIndex - 1], selectedTimes[lastIndex]]

      connectPoints(lastTwoPoints)
    }
  }, [selectedTimes])

  useEffect(() => {
    updateViewport()
  }, [selectedPoints])

  function parseDateString(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      console.error('Invalid dateString:', dateString)

      return null
    }

    const [date, time] = dateString.split(' ')
    if (!date || !time) {
      console.error('Invalid date or time in dateString:', dateString)

      return null
    }

    const [day, month, year] = date.split('/').map(Number)
    const [hours, minutes, seconds] = time.split(':').map(Number)

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      console.error('Invalid date components in dateString:', dateString)

      return null
    }

    return new Date(year, month - 1, day, hours, minutes, seconds).getTime()
  }

  useEffect(() => {
    if (selectedPoints.length > 0) {
      const sortedPoints = selectedPoints.slice().sort((a, b) => {
        const timestampA = parseDateString(a.timestamp)
        const timestampB = parseDateString(b.timestamp)

        return timestampA - timestampB
      })

      console.log('After sorting:', sortedPoints)

      setSelectedPoints(sortedPoints)
    }
  }, [selectedPoints])

  const updateViewport = () => {
    const newViewport = calculateCenter()
    setViewport(newViewport)
  }

  const handleZoomIn = () => {
    setViewport(prevState => ({
      ...prevState,
      zoom: Math.min(prevState.zoom + 1, 20)
    }))
  }

  const handleZoomOut = () => {
    setViewport(prevState => ({
      ...prevState,
      zoom: Math.max(prevState.zoom - 1, 1)
    }))
  }

  const GOONG_MAP_KEY = 'MaRpQPZORjHfEMC3tpTGCLlPqo5qXDkzvcemJZWO'

  const handleSearch = async () => {
    setLoading(true)
    try {
      const startEpoch = startTime ? Math.floor(startTime.getTime()) : ''
      const endEpoch = endTime ? Math.floor(endTime.getTime()) : ''

      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/routine?sort=-created_at`, {
        params: {
          keyword,
          startTime: startEpoch,
          endTime: endEpoch
        },
        ...config
      })

      const formattedData = res.data.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp).getTime() // Chuyển đổi timestamp về dạng epoch
      }))

      setRows(formattedData || [])
      setIsOpenTable(true)
    } catch (error) {
      console.error('Error fetching events: ', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const connectPoints = points => {
    // Kiểm tra xem points có phải là một mảng không
    if (!Array.isArray(points) || points.length < 2) {
      // Nếu không phải mảng hoặc độ dài của nó không đủ, không thực hiện gì cả
      return
    }

    const [point1, point2] = points
    const { longitude: lon1, latitude: lat1 } = point1
    const { longitude: lon2, latitude: lat2 } = point2

    // Nếu cả hai điểm đều có tọa độ, thì nối chúng trên bản đồ
    if (lon1 && lat1 && lon2 && lat2) {
      drawLineOnMap(point1, point2)
      console.log('Đường nối từ', point1.time, 'đến', point2.time)
    }
  }

  const deletePreviousConnection = () => {
    if (connections.length > 0) {
      // Xoá điểm được nối từ mảng connections
      const updatedConnections = [...connections]
      updatedConnections.pop() // Xoá điểm cuối cùng
      setConnections(updatedConnections)
    }
  }

  const handleTimeSelect = (time, longitude, latitude) => {
    let newSelectedTimes = [...selectedTimes, { time, longitude, latitude }]

    // Sắp xếp các điểm theo timestamp
    newSelectedTimes.sort((a, b) => a.time - b.time)

    // Nếu có hơn 3 điểm, chỉ giữ lại 3 điểm mới nhất
    if (newSelectedTimes.length > 3) {
      newSelectedTimes = newSelectedTimes.slice(-3)
      setIsReconnected(true) // Đánh dấu rằng các kết nối được vẽ lại
    } else {
      setIsReconnected(false)
    }

    setSelectedTimes(newSelectedTimes)

    // Tạo kết nối giữa các điểm theo thứ tự timestamp
    let newConnections = []
    if (newSelectedTimes.length >= 2) {
      for (let i = 0; i < newSelectedTimes.length - 1; i++) {
        newConnections.push([newSelectedTimes[i], newSelectedTimes[i + 1]])
      }
    }
    setConnections(newConnections)
  }

  const findPointByTime = time => {
    const point = selectedPoints.find(point => point.timestamp === time)

    return point || null
  }

  const drawLineOnMap = (point1, point2) => {
    // Tạo một đường thẳng trên bản đồ từ point1 đến point2
    const newConnection = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [parseFloat(point1.longitude), parseFloat(point1.latitude)],
          [parseFloat(point2.longitude), parseFloat(point2.latitude)]
        ]
      }
    }

    // Thêm đường vừa tạo vào mảng connections
    setConnections(prevConnections => [...prevConnections, newConnection])
  }

  // Chuyển đổi timestamp thành định dạng "dd mm yyyy hh mm ss"
  const convertTimestampToDateTimeString = timestamp => {
    const dateObj = new Date(timestamp)
    const day = ('0' + dateObj.getDate()).slice(-2)
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2)
    const year = dateObj.getFullYear()
    const hours = ('0' + dateObj.getHours()).slice(-2)
    const minutes = ('0' + dateObj.getMinutes()).slice(-2)
    const seconds = ('0' + dateObj.getSeconds()).slice(-2)

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  // Cập nhật cột timestamp trong bảng thành định dạng "dd mm yyyy hh mm ss"
  const updatedRows = rows
    .sort(function (a, b) {
      return a.timestamp - b.timestamp
    })
    .map(row => ({
      ...row,
      timestamp: convertTimestampToDateTimeString(row.timestamp)
    }))

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id)
      setSelectedCameraIds(newSelected)

      // Sắp xếp lại các điểm theo thứ tự của chúng trong dữ liệu API
      const sortedRows = rows.sort((a, b) => a.timestamp - b.timestamp)

      const newSelectedPoints = sortedRows
        .filter(row => row.LongtitudeOfCam && row.LatitudeOfCam) // Lọc ra các điểm có tọa độ
        .map(row => ({
          longitude: row.LongtitudeOfCam,
          latitude: row.LatitudeOfCam,
          timestamp: row.timestamp
        }))
      setSelectedPoints(newSelectedPoints)

      // Gọi hàm handleTimeSelect với các điểm mới được chọn
      newSelectedPoints.forEach(point => {
        handleTimeSelect(point.timestamp, point.longitude, point.latitude)
      })
    } else {
      setSelectedCameraIds([])
      setSelectedPoints([])
      setSelectedTimes([])
    }
  }

  const handleCameraSelect = (event, cameraId, LongitudeOfCam, LatitudeOfCam, timestamp) => {
    if (event.target.checked && LongitudeOfCam && LatitudeOfCam) {
      setSelectedCameraIds(prevIds => [...prevIds, cameraId])
      setSelectedPoints(prevPoints => [
        ...prevPoints,
        { longitude: LongitudeOfCam, latitude: LatitudeOfCam, timestamp }
      ])

      // Gọi handleTimeSelect khi đã có đủ 3 điểm
      if (selectedPoints.length === 2) {
        handleTimeSelect(timestamp, LongitudeOfCam, LatitudeOfCam)
      }
    } else {
      setSelectedCameraIds(prevIds => prevIds.filter(id => id !== cameraId))
      setSelectedPoints(prevPoints =>
        prevPoints.filter(point => point.longitude !== LongitudeOfCam || point.latitude !== LatitudeOfCam)
      )
      setSelectedTimes(prevTimes => prevTimes.filter(time => time.time !== timestamp))
    }
  }

  const handleExport = async () => {
    const excelData = rows.reduce((acc, row) => {
      acc.push({
        'Ngày giờ': row.time,
        'Sự kiện': row.event,
        Camera: row.camera
      })

      return acc
    }, [])

    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Map')

    XLSX.writeFile(wb, 'Map.xlsx')
  }

  const epochToDate = epoch => {
    const dateObj = new Date(epoch)
    const year = dateObj.getFullYear()
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2)
    const day = ('0' + dateObj.getDate()).slice(-2)
    const hours = ('0' + dateObj.getHours()).slice(-2)
    const minutes = ('0' + dateObj.getMinutes()).slice(-2)
    const seconds = ('0' + dateObj.getSeconds()).slice(-2)

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  // Sử dụng hàm epochToDate để chuyển đổi epoch timestamp sang dạng ngày tháng năm và giờ phút giây
  const epochTimestamp = 1621766000000 // Ví dụ với một epoch timestamp cụ thể
  const formattedDate = epochToDate(epochTimestamp)

  const CustomMapPin = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='40'
      height='40'
      viewBox='0 0 24 24'
      stroke='orange'
      fill='orange'
      className='icon icon-tabler icons-tabler-filled icon-tabler-map-pin'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z' />
    </svg>
  )

  const viewMap = () => (
    <Grid container spacing={2}>
      <ReactMapGL
        {...viewport}
        width='100%'
        height='65vh'
        onViewportChange={newViewport => setViewport(newViewport)}
        goongApiAccessToken={GOONG_MAP_KEY}
      >
        <Button onClick={handleZoomIn} variant='contained'>
          +
        </Button>
        <Button onClick={handleZoomOut} variant='contained'>
          -
        </Button>
        {selectedPoints.map((point, index) => (
          <Marker
            key={index}
            latitude={parseFloat(point.latitude)}
            longitude={parseFloat(point.longitude)}
            offsetLeft={-20}
            offsetTop={-20}
          >
            <div>
              <CustomMapPin />
            </div>
          </Marker>
        ))}
        <Source type='geojson' data={{ type: 'FeatureCollection', features: renderConnections() }}>
          <Layer
            id='lines'
            type='line'
            layout={{
              'line-cap': 'round',
              'line-join': 'round'
            }}
            paint={{
              'line-color': 'orange',
              'line-width': 2
            }}
          />
        </Source>
      </ReactMapGL>
    </Grid>
  )

  const isSelected = name => selected.indexOf(name) !== -1
  const sortedPoints = selectedPoints.slice().sort((a, b) => a.timestamp - b.timestamp)

  const renderConnections = () => {
    const sortedPoints = selectedPoints.slice().sort((a, b) => a.timestamp - b.timestamp)
    const lines = []
    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const startPoint = sortedPoints[i]
      const endPoint = sortedPoints[i + 1]
      lines.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [parseFloat(startPoint.longitude), parseFloat(startPoint.latitude)],
            [parseFloat(endPoint.longitude), parseFloat(endPoint.latitude)]
          ]
        }
      })
    }

    return lines
  }

  const calculateCenter = () => {
    if (selectedPoints.length === 0) {
      // Trả về giá trị mặc định nếu không có điểm nào được chọn
      return {
        latitude: 21.027763,
        longitude: 105.83416,
        zoom: 15
      }
    }

    // Tính tổng tất cả các vị trí
    const totalLatitude = selectedPoints.reduce((acc, point) => acc + parseFloat(point.latitude), 0)
    const totalLongitude = selectedPoints.reduce((acc, point) => acc + parseFloat(point.longitude), 0)

    // Tính trung bình vị trí của các điểm được chọn
    const averageLatitude = totalLatitude / selectedPoints.length
    const averageLongitude = totalLongitude / selectedPoints.length

    // Tính khoảng cách lớn nhất từ trung tâm đến các điểm
    const maxDistance = selectedPoints.reduce((acc, point) => {
      const distance = Math.sqrt(
        Math.pow(parseFloat(point.latitude) - averageLatitude, 2) +
          Math.pow(parseFloat(point.longitude) - averageLongitude, 2)
      )

      return Math.max(acc, distance)
    }, 0)

    // Tính zoom level dựa trên khoảng cách lớn nhất
    const zoom = Math.min(Math.floor(Math.log2((360 * 0.8) / maxDistance)), 20)

    return {
      latitude: averageLatitude,
      longitude: averageLongitude,
      zoom: zoom
    }
  }

  const viewTable = () => (
    <TableContainer component={Paper} sx={{ height: '100%', minHeight: 'calc(60vh - 200px)' }}>
      <Table stickyHeader className='sticky table' sx={{ overflow: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox' sx={{ width: 20 }}>
              <Checkbox
                onChange={handleSelectAllClick}
                checked={rows.length > 0 && selectedCameraIds.length === rows.length}
                inputProps={{ 'aria-label': 'select all desserts' }}
                indeterminate={selectedCameraIds.length > 0 && selectedCameraIds.length < rows.length}
              />
            </TableCell>
            {columns.map(column => (
              <TableCell key={column.id} align={column.align} sx={{ width: column.width }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {updatedRows.map((row, index) => {
            const isItemSelected = selectedCameraIds.includes(row.id)
            const labelId = `enhanced-table-checkbox-${index}`

            return (
              <TableRow
                hover
                tabIndex={-1}
                key={index}
                role='checkbox'
                selected={isItemSelected}
                aria-checked={isItemSelected}
              >
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={isItemSelected}
                    onChange={event =>
                      handleCameraSelect(event, row.id, row.LongtitudeOfCam, row.LatitudeOfCam, row.timestamp)
                    }
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </TableCell>
                {columns.map(column => {
                  const value = row[column.field]

                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Bản đồ'
              sx={{
                py: 4,
                flexDirection: ['column', 'row'],
                '& .MuiCardHeader-action': { m: 0 },
                alignItems: ['flex-start', 'center']
              }}
              action={
                <Grid container spacing={2}>
                  <Grid item>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                      <CustomTextField
                        value={keyword}
                        placeholder='Tìm đối tượng'
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ mr: 2, display: 'flex' }}>
                              <Icon fontSize='1.25rem' icon='tabler:search' />
                            </Box>
                          ),
                          endAdornment: (
                            <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                              <Icon fontSize='1.25rem' icon='tabler:x' />
                            </IconButton>
                          )
                        }}
                        onChange={e => setKeyword(e.target.value)}
                        sx={{
                          width: {
                            xs: 1,
                            sm: 'auto'
                          },
                          '& .MuiInputBase-root > svg': {
                            mr: 2
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                      <Button variant='outlined' onClick={handleSearch}>
                        Tìm kiếm
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item>
                    <DatePickerWrapper>
                      <div>
                        <DatePicker
                          selected={startTime}
                          id='basic-input'
                          onChange={date => setStartTime(date)}
                          placeholderText='Chọn ngày bắt đầu'
                          customInput={<CustomInput label='Ngày bắt đầu' />}
                        />
                      </div>
                    </DatePickerWrapper>
                  </Grid>
                  <Grid item>
                    <DatePickerWrapper>
                      <div>
                        <DatePicker
                          selected={endTime}
                          id='basic-input'
                          onChange={date => setEndTime(date)}
                          placeholderText='Chọn ngày kết thúc'
                          customInput={<CustomInput label='Ngày kết thúc' />}
                        />
                      </div>
                    </DatePickerWrapper>
                  </Grid>
                </Grid>
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={isOpenTable ? 8 : 12}>
          <Card>
            <CardContent>{viewMap()}</CardContent>
          </Card>
        </Grid>
        {isOpenTable && (
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ height: '60vh' }}>{viewTable()}</CardContent>
              <CardActions sx={{ justifyContent: 'space-around' }}>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <Button variant='contained'>Xóa danh sách</Button>
                  </Grid>
                  <Grid item xs={5}>
                    <Button
                      variant='contained'
                      onClick={() => {
                        setIsOpenTable(false)
                        setSelectedCameraIds([])
                        setSelectedPoints([])
                      }}
                    >
                      Đóng bảng
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default EventMap
