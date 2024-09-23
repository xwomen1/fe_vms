import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  Switch,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import { format } from 'date-fns'
import authConfig from 'src/configs/auth'
import Icon from 'src/@core/components/icon'
import EventDetails from './popups/eventDetails'
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, Sector } from 'recharts'

const EventList = () => {
  const [deviceList, setDeviceList] = useState(null)
  const [eventsData, setEventData] = useState('')
  const defaultCameraID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'
  const [count, setCount] = useState('')
  const [pageSize1, setPageSize1] = useState(25)
  const [websocket, setWebsocket] = useState(null)
  const [cameraData, setCameraData] = useState([])
  const [chartData, setChartData] = useState([])
  const [total, setTotalPage] = useState(0)
  const [total1, setTotalPage1] = useState(0)
  const [eventDetail, setEventDetail] = useState(null)
  const [isOpenView, setIsOpenView] = useState(false)
  const [devices, setDevices] = useState([])
  const [page, setPage] = useState(1)
  const [page1, setPage1] = useState(1)
  const [activeIndex, setActiveIndex] = useState(null)
  const [isRealtime, setIsRealtime] = useState(false)
  const [pageSize, setPageSize] = useState(25)

  const pageSizeOptions = [25, 50, 100]

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config1 = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const config = {
    bundlePolicy: 'max-bundle',
    iceServers: [
      {
        urls: 'stun:dev-ivis-camera-api.basesystem.one:3478'
      },
      {
        urls: 'turn:dev-ivis-camera-api.basesystem.one:3478',
        username: 'demo',
        credential: 'demo'
      }
    ]
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras?limit=25&page=1`, config)
        const cameras = response.data

        // Đếm số lượng kết nối và không kết nối
        const connectedCount = cameras.filter(camera => camera.status.name === 'connected').length
        const disconnectedCount = cameras.filter(camera => camera.status.name === 'disconnected').length

        setChartData([
          { name: 'Connected', value: connectedCount },
          { name: 'Disconnected', value: disconnectedCount }
        ])
      } catch (error) {
        console.error('Error fetching camera data:', error)
      }
    }

    fetchData()

    return () => {
      if (websocket != undefined && websocket != null) {
        websocket.close()
      }
    }
  }, [])

  console.log(chartData)

  const columns = [
    {
      id: 1,
      flex: 0.25,
      maxWidth: 50,
      align: 'center',
      field: 'imageObject',
      label: 'Image',
      renderCell: value => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img src={value} alt='' style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
        </Box>
      )
    },
    {
      id: 3,
      flex: 0.15,
      maxWidth: 50,
      align: 'center',
      field: 'description',
      label: 'Object Name'
    },
    {
      id: 4,
      flex: 0.15,
      maxWidth: 30,
      align: 'center',
      field: 'timestamp',
      label: 'Time',
      renderCell: value => new Date(value).toLocaleString()
    },

    {
      id: 6,
      flex: 0.25,
      maxWidth: 50,
      align: 'center',
      field: 'location',
      label: 'Location'
    }
  ]

  const handleSwitchChange = event => {
    const isChecked = event.target.checked
    setIsRealtime(isChecked)

    if (!isChecked && websocket) {
      websocket.close()
      setWebsocket(null)
    }
  }

  useEffect(() => {
    if (isRealtime) {
      const ws = new WebSocket(
        `wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/list_ai_event/be571c00-41cf-4878-a1de-b782625da62a`
      )
      setWebsocket(ws)

      ws.addEventListener('open', () => {
        ws.send(
          JSON.stringify({
            id: defaultCameraID,
            type: 'request'
          })
        )
      })

      ws.addEventListener('message', handleMessage)
      ws.addEventListener('error', error => {
        console.error('WebSocket error:', error)
      })
      ws.addEventListener('close', handleClose)

      return () => {
        if (ws) {
          ws.close()
          setWebsocket(null)
        }
      }
    }
  }, [isRealtime])

  const handleMessage = async event => {
    const message = JSON.parse(event.data)
    const newMessage = JSON.parse(message?.data)
    setEventData(newMessage)
  }

  useEffect(() => {
    if (websocket) {
      websocket.addEventListener('open', () => {
        websocket.send(
          JSON.stringify({
            id: defaultCameraID,
            type: 'request'
          })
        )
      })
      websocket.addEventListener('message', handleMessage)

      websocket.addEventListener('error', error => {
        console.error('WebSocket error:', error)
      })

      websocket.addEventListener('close', handleClose)
    }
  }, [websocket])

  const handleClose = async event => {
    if (websocket) {
      websocket.close()
      setWebsocket(null)
    }
  }

  useEffect(() => {
    if (isRealtime && eventsData) {
      const newList = []

      deviceList?.map((item, index) => {
        if (index === 0) {
          newList.push(eventsData)
          newList.push(item)
          setCount(count + 1)
          deviceList?.pop()
        } else {
          newList.push(item)
        }
      })

      setDeviceList([...newList])
    }
  }, [isRealtime, eventsData])

  useEffect(() => {
    fetchDataList()
  }, [page, pageSize])

  const fetchDataList = async () => {
    const params = {
      ...config1,
      params: {
        limit: 5,
        page: parseInt(page)
      }
    }
    try {
      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/routine`, params)
      setDeviceList(res.data)
      setCount(res.count)
      setTotalPage(Math.ceil(res.count / 5))
    } catch (error) {
      console.error('Error fetching data:', error)
      if (error.response && error.response.status === 404) {
        console.error('Không tìm thấy trong hệ thống')
      } else {
        console.error(error.response?.data?.message || 'Đang gặp sự cố')
      }
      setDeviceList([])
      toast.error('Đang gặp sự cố')
    }
  }

  const COLORS = ['#0088FE', '#ff9933']

  const fetchDataList1 = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: 1,
          limit: 5
        }
      }

      const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/incidents/logs`, config)
      setDevices(response.data)
      setTotalPage1(Math.ceil(response.count / 5))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
    }
  }, [token, page1, pageSize1])
  useEffect(() => {
    fetchDataList1()
  }, [fetchDataList1])

  const columns1 = [
    { id: 1, flex: 0.25, minWidth: 70, align: 'left', field: 'eventName', label: 'Incident Name' },
    { id: 2, flex: 0.15, minWidth: 50, align: 'left', field: 'severity', label: 'Severity Level' },
    { id: 4, flex: 0.15, minWidth: 100, align: 'left', field: 'createdAt', label: 'Time' },
    { id: 5, flex: 0.15, minWidth: 100, align: 'left', field: 'location', label: 'Location' },
    { id: 6, flex: 0.25, minWidth: 50, align: 'left', field: 'status', label: 'Status' },
    { id: 7, flex: 0.25, minWidth: 50, align: 'left', field: 'source', label: 'Source' }
  ]

  const formatDateTime = dateTimeString => {
    const date = new Date(dateTimeString)

    return format(date, 'HH:mm dd/MM/yyyy')
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  return (
    <>
      <Grid component={Paper}>
        <Card>
          <CardHeader
            title='Top 5 AI Events'
            titleTypographyProps={{ sx: { mb: [2, 0] } }}
            action={
              <FormControlLabel
                control={
                  <Switch checked={isRealtime} onChange={handleSwitchChange} name='realtimeEvents' color='primary' />
                }
                label='Real time event.'
              />
            }
            sx={{
              py: 4,
              flexDirection: ['column', 'row'],
              '& .MuiCardHeader-action': { m: 0 },
              alignItems: ['flex-start', 'center']
            }}
          />
          <Grid container spacing={0}>
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell align='center'>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deviceList?.slice(0, pageSize).map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell sx={{ padding: '4px', height: '35px' }}>{index + 1}</TableCell>
                        {columns.map(column => {
                          const value = row[column.field]

                          return (
                            <TableCell sx={{ padding: '4px', height: '35px' }} key={column.id} align={column.align}>
                              {column.renderCell ? column.renderCell(value) : value}
                            </TableCell>
                          )
                        })}
                        <TableCell>
                          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton
                              size='small'
                              sx={{ color: 'text.secondary' }}
                              onClick={() => {
                                setIsOpenView(true)
                                setEventDetail(row)
                              }}
                            >
                              <Icon icon='tabler:info-circle' />
                            </IconButton>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Card>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Grid>
              <p style={{ marginLeft: '3%', fontSize: '20px' }}>Top 5 System Incidents</p>
            </Grid>
            <Card>
              <Grid container spacing={0}>
                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                  <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>NO.</TableCell>
                        {columns1.map(column => (
                          <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(devices) && devices.length > 0 ? (
                        devices.map((row, index) => (
                          <TableRow hover tabIndex={-1} key={index}>
                            <TableCell>{index + 1}</TableCell>
                            {columns1.map(column => {
                              const value = row[column.field]

                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.field === 'createdAt' ? formatDateTime(value) : value}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns1.length + 1}>Không có dữ liệu ...</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Grid>
              <p style={{ marginLeft: '3%', fontSize: '20px' }}>Camera List</p>
            </Grid>
            <Card>
              <div style={{ marginLeft: '25px' }}>
                {chartData.length > 0 ? (
                  <PieChart width={400} height={400}>
                    <Pie
                      data={chartData}
                      cx={200}
                      cy={200}
                      labelLine={false}
                      label={({ name, value }) => {
                        return name === 'Connected' ? `Connected : ${value}` : `Disconnected : ${value}`
                      }}
                      outerRadius={130}
                      fill='#8884d8'
                      dataKey='value'
                      activeIndex={activeIndex}
                      activeShape={props => {
                        const RADIAN = Math.PI / 180

                        const {
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          startAngle,
                          endAngle,
                          fill,
                          payload,
                          percent,
                          value
                        } = props
                        const sin = Math.sin(-RADIAN * midAngle)
                        const cos = Math.cos(-RADIAN * midAngle)
                        const sx = cx + (outerRadius + 10) * cos
                        const sy = cy + (outerRadius + 10) * sin
                        const mx = cx + (outerRadius + 30) * cos
                        const my = cy + (outerRadius + 30) * sin
                        const ex = mx + (cos >= 0 ? 1 : -1) * 22
                        const ey = my
                        const textAnchor = cos >= 0 ? 'start' : 'end'

                        return (
                          <g>
                            <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
                              {payload.name}
                            </text>
                            <Sector
                              cx={cx}
                              cy={cy}
                              innerRadius={innerRadius}
                              outerRadius={outerRadius + 10}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              fill={fill}
                            />
                            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
                            <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
                            <text
                              x={ex + (cos >= 0 ? 1 : -1) * 12}
                              y={ey}
                              textAnchor={textAnchor}
                              fill='#333'
                            >{`Camera:   ${value}`}</text>
                            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill='#999'>
                              {`(Rate ${(percent * 100).toFixed(2)}%)`}
                            </text>
                          </g>
                        )
                      }}
                      onMouseEnter={onPieEnter}
                      onMouseLeave={() => setActiveIndex(null)}
                      onClick={onPieEnter}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </Card>
          </Grid>
        </Grid>
        {isOpenView && (
          <EventDetails
            show={isOpenView}
            onClose={() => setIsOpenView(false)}
            data={eventDetail}
            setReload={() => setReload(reload + 1)}
          />
        )}
      </Grid>
    </>
  )
}

export default EventList
