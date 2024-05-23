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
    valueGetter: params => new Date(params.value)
  },
  {
    id: 2,
    flex: 0.25,
    type: 'eventTypeString',
    width: 50,
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
  const [isOpenGroup, setIsOpenGroup] = useState([])
  const [selected, setSelected] = useState([])
  const [isOpenTable, setIsOpenTable] = useState(false)
  const [dataList, setDataList] = useState(null)
  const [rows, setRows] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])
  const [connections, setConnections] = useState([])

  const [selectedCameraIds, setSelectedCameraIds] = useState([]) // State for selected camera IDs
  const [longLat, setLongLat] = useState([]) // State for selected camera IDs

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

  const calculateConnections = () => {
    const lines = []
    for (let i = 0; i < selectedPoints.length - 1; i++) {
      const startPoint = selectedPoints[i]
      const endPoint = selectedPoints[i + 1]
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
    setConnections(lines)
  }
  useEffect(() => {
    calculateConnections()
  }, [selectedPoints])

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
  const GOONG_MAP_KEY = 'MaRpQPZORjHfEMC3tpTGCLlPqo5qXDkzvcemJZWO'

  // useEffect(() => {
  //   fetchDataList()
  // }, [])

  // const fetchDataList = async () => {
  //   setLoading(true)
  //   try {
  //     const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras`, config)
  //     setDataList(res.data)
  //     setRows(res.data || [])
  //   } catch (error) {
  //     console.error('Error fetching data: ', error)
  //     toast.error(error.message)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const startEpoch = startTime ? Math.floor(startTime.getTime()) : ''
      const endEpoch = endTime ? Math.floor(endTime.getTime()) : ''

      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/routine`, {
        params: {
          keyword,
          startTime: startEpoch,
          endTime: endEpoch
        },
        ...config
      })
      setRows(res.data || [])
      console.log(res.data)
      setIsOpenTable(true)
    } catch (error) {
      console.error('Error fetching events: ', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.time)
      setSelected(newSelected)

      return
    }
    setSelected([])
  }

  const handleCameraSelect = (event, cameraId, LongitudeOfCam, LatitudeOfCam) => {
    if (event.target.checked && LongitudeOfCam && LatitudeOfCam) {
      setSelectedCameraIds(prevIds => [...prevIds, cameraId])
      setSelectedPoints(prevPoints => [...prevPoints, { longitude: LongitudeOfCam, latitude: LatitudeOfCam }])
    } else {
      setSelectedCameraIds(prevIds => prevIds.filter(id => id !== cameraId))
      setSelectedPoints(prevPoints =>
        prevPoints.filter(point => point.longitude !== LongitudeOfCam || point.latitude !== LatitudeOfCam)
      )
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

  const viewMap = () => (
    <Grid container spacing={2}>
      <ReactMapGL
        {...viewport}
        width='100%'
        height='65vh'
        onViewportChange={setViewport}
        goongApiAccessToken={GOONG_MAP_KEY}
      >
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
        <Source type='geojson' data={{ type: 'FeatureCollection', features: connections }}>
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

  // Hàm cập nhật viewport
  const updateViewport = () => {
    const newViewport = calculateCenter()
    setViewport(newViewport)
  }

  useEffect(() => {
    // Mỗi khi selectedPoints thay đổi, cập nhật lại viewport
    updateViewport()
  }, [selectedPoints])

  const viewTable = () => (
    <TableContainer component={Paper} sx={{ height: '100%', minHeight: 'calc(60vh - 200px)' }}>
      <Table stickyHeader className='sticky table' sx={{ overflow: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox' sx={{ width: 20 }}>
              <Checkbox
                onChange={handleSelectAllClick}
                checked={rows.length > 0 && selected.length === rows.length}
                inputProps={{ 'aria-label': 'select all desserts' }}
                indeterminate={selected.length > 0 && selected.length < rows.length}
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
          {rows.map((row, index) => {
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
                    onChange={event => handleCameraSelect(event, row.id, row.LongtitudeOfCam, row.LatitudeOfCam)}
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
        <Grid item xs={12} sm={isOpenTable ? 9 : 12}>
          <Card>
            <CardContent>{viewMap()}</CardContent>
          </Card>
        </Grid>
        {isOpenTable && (
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ height: '60vh' }}>{viewTable()}</CardContent>
              <CardActions sx={{ justifyContent: 'space-around' }}>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <Button variant='contained'>Xóa danh sách</Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button variant='contained' onClick={() => handleExport()}>
                      Xuất file
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    {' '}
                    <Button variant='contained' onClick={() => setIsOpenTable(false)}>
                      Đóng
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
