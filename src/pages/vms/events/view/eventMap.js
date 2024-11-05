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
import { current } from '@reduxjs/toolkit'

const formatCameraName = name => {
  const maxLength = '10px'
  if (name.length > maxLength) {
    const midIndex = Math.floor(name.length / 2)

    return `${name.slice(0, midIndex)}\n${name.slice(midIndex)}`
  }

  return name
}

const columns = [
  {
    id: 0,
    flex: 0.25,
    maxWidth: 50,
    align: 'center',
    field: 'imageObject',
    label: 'Image',
    renderCell: value => (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <img src={value} alt='' style={{ maxWidth: '60%', height: 'auto', objectFit: 'contain' }} />
      </Box>
    )
  },
  {
    id: 1,
    flex: 0.15,
    type: 'timestamp',
    maxWidth: 70,
    align: 'center',
    label: 'Date',
    field: 'timestamp',
    valueGetter: params => new Date(params.field)
  },
  {
    id: 2,
    flex: 0.15,
    type: 'result',
    maxWidth: 70,
    align: 'center',
    field: 'event',
    label: 'Result',
    field: 'result'
  },
  {
    id: 3,
    maxWidth: 60,
    align: 'center',
    label: 'Camera',
    field: 'camName',

    // Sử dụng hàm formatCameraName để chia tên camera thành 2 dòng nếu quá dài
    format: value => formatCameraName(value)
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

  const deepEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }

  useEffect(() => {
    if (selectedPoints.length > 0) {
      const sortedPoints = selectedPoints.slice().sort((a, b) => {
        const timestampA = parseDateString(a.timestamp)
        const timestampB = parseDateString(b.timestamp)

        return timestampA - timestampB
      })

      if (!deepEqual(sortedPoints, selectedPoints)) {
        setSelectedPoints(sortedPoints)
      }
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

      const res = await axios.get(`https://votv.ivms.vn/votv/vms/api/v0/aievents/routine?sort=-created_at`, {
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
    if (!Array.isArray(points) || points.length < 2) {
      return
    }

    const [point1, point2] = points
    const { longitude: lon1, latitude: lat1 } = point1
    const { longitude: lon2, latitude: lat2 } = point2

    if (lon1 && lat1 && lon2 && lat2) {
      drawLineOnMap(point1, point2)
    }
  }

  const deletePreviousConnection = () => {
    if (connections.length > 0) {
      const updatedConnections = [...connections]
      updatedConnections.pop() 
      setConnections(updatedConnections)
    }
  }

  const findPointByTime = time => {
    const point = selectedPoints.find(point => point.timestamp === time)

    return point || null
  }

  const drawLineOnMap = (point1, point2) => {
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

    setConnections(prevConnections => [...prevConnections, newConnection])
  }

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

  const updatedRows = rows
    .sort(function (a, b) {
      return a.timestamp - b.timestamp
    })
    .map(row => ({
      ...row,
      timestamp: convertTimestampToDateTimeString(row.timestamp)
    }))

  const handleDeleteList = () => {
    const updatedRows = rows.filter(row => !selectedCameraIds.includes(row.id))
    setRows(updatedRows)
    setSelectedCameraIds([])
    setSelectedPoints([])
    setSelectedTimes([])
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id)
      setSelectedCameraIds(newSelected)

      const sortedRows = rows.sort((a, b) => a.timestamp - b.timestamp)

      const newSelectedPoints = sortedRows
        .filter(row => row.longtitudeOfCam && row.latitudeOfCam) 
        .map(row => ({
          longitude: row.longtitudeOfCam,
          latitude: row.latitudeOfCam,
          timestamp: row.timestamp
        }))
      setSelectedPoints(newSelectedPoints)

    } else {
      setSelectedCameraIds([])
      setSelectedPoints([])
      setSelectedTimes([])
    }
  }

  const handleCameraSelect = async (event, cameraId, longitudeOfCam, latitudeOfCam, timestamp) => {
    if (event.target.checked && longitudeOfCam && latitudeOfCam) {
      const pointExists = selectedPoints.some(
        point => point.longitude === longitudeOfCam && point.latitude === latitudeOfCam && point.timestamp === timestamp
      );
  
      if (!pointExists) {
        setSelectedCameraIds(prevIds => [...prevIds, cameraId]);
        setSelectedPoints(prevPoints => [
          ...prevPoints,
          { longitude: longitudeOfCam, latitude: latitudeOfCam, timestamp },
        ]);
      }
    } else {
      // Unchecked, remove point and fetch new coordinates
      setSelectedCameraIds(prevIds => prevIds.filter(id => id !== cameraId));
      setSelectedPoints(prevPoints =>
        prevPoints.filter(point => point.longitude !== longitudeOfCam || point.latitude !== latitudeOfCam)
      );
      
      try {
        const response = await axios.get('https://your-api-url-to-fetch-coordinates');
        
        const newCoordinates = response.data.map(item => ({
          longitude: item.longtitudeOfCam,
          latitude: item.latitudeOfCam,
          timestamp: item.timestamp,
        }));
  
        setSelectedPoints(newCoordinates);
      } catch (error) {
        console.error("Error fetching new coordinates:", error);
      }
    }
  };
  

  const handleExport = async () => {
    const excelData = rows.reduce((acc, row) => {
      acc.push({
        Date: row.time,
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
      return {
        latitude: 21.027763,
        longitude: 105.83416,
        zoom: 15
      }
    }

    const totalLatitude = selectedPoints.reduce((acc, point) => acc + parseFloat(point.latitude), 0)
    const totalLongitude = selectedPoints.reduce((acc, point) => acc + parseFloat(point.longitude), 0)

    const averageLatitude = totalLatitude / selectedPoints.length
    const averageLongitude = totalLongitude / selectedPoints.length

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
      <Table stickyHeader className='sticky table' sx={{ overflow: 'auto' }} style={{ width: '750px' }}>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox' sx={{ width: 20 }}>
              <Checkbox
                onChange={handleSelectAllClick}
                checked={rows.length >= 0 && selectedCameraIds.length === rows.length}
                inputProps={{ 'aria-label': 'select all desserts' }}
                indeterminate={selectedCameraIds.length > 0 && selectedCameraIds.length < rows.length}
              />
            </TableCell>
            {columns.map(({ id, label, field, align, maxWidth, renderCell }) => (
              <TableCell key={id} align={align} sx={{ maxWidth }}>
                {label}
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
                      handleCameraSelect(event, row.id, row.longtitudeOfCam, row.latitudeOfCam, row.timestamp)
                    }
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </TableCell>
                {columns.map(({ field, renderCell, align, width, maxWidth }) => {
                  const value = row[field]

                  return (
                    <TableCell
                      key={field}
                      align={align}
                      sx={{ width, maxWidth, wordBreak: 'break-word', flexWrap: 'wrap' }}
                    >
                      {/* {columns.format && typeof value === 'number' ? columns.format(value) : value} */}
                      {renderCell ? renderCell(value) : value}
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
              title='Map'
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
                        placeholder='Find Object'
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
                        Search
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
                          placeholderText='Select Start date'
                          customInput={<CustomInput label='Start date' />}
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
                          placeholderText='Select End date'
                          customInput={<CustomInput label='End date' />}
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
                    <Button variant='contained' onClick={handleDeleteList}>
                      Delete
                    </Button>
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
                      Close
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
