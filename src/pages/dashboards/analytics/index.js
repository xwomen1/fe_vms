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
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { format } from 'date-fns'
import authConfig from 'src/configs/auth'
import Icon from 'src/@core/components/icon'
import { Cell, Pie, PieChart } from 'recharts'
import { Legend } from 'chart.js'
import dynamic from 'next/dynamic'
import EventDetails from './popups/eventDetails'

const EventList = () => {
  const [deviceList, setDeviceList] = useState(null)
  const [eventsData, setEventData] = useState('')
  const defaultCameraID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'
  const [count, setCount] = useState('')
  const [websocket, setWebsocket] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
  const [status1, setStatus1] = useState([]) // Changed to an array to hold status data
  const [error, setError] = useState(null)
  const [total, setTotalPage] = useState(0)
  const [total1, setTotalPage1] = useState(0)
  const [eventDetail, setEventDetail] = useState(null)
  const [isOpenView, setIsOpenView] = useState(false)

  const [page, setPage] = useState(1)
  const [page1, setPage1] = useState(1)

  const [pageSize, setPageSize] = useState(25)
  const [pageSize1, setPageSize1] = useState(25)
  const [devices, setDevices] = useState([])

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

  useEffect(() => {
    // create WebSocket connection

    const ws = new WebSocket(
      `wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/list_ai_event/be571c00-41cf-4878-a1de-b782625da62a`
    )

    setWebsocket(ws)

    // create RTCPeerConnection

    const pc = new RTCPeerConnection(config)
    setRtcPeerConnection(pc)

    // listen for remote tracks and add them to remote stream

    pc.ontrack = event => {
      const stream = event.streams[0]
      if (!remoteVideoRef.current?.srcObject || remoteVideoRef.current?.srcObject.id !== stream.id) {
        setRemoteStream(stream)
        remoteVideoRef.current.srcObject = stream
      }
    }

    // close WebSocket and RTCPeerConnection on component unmount

    return () => {
      if (websocket) {
        websocket.close()
      }
      if (rtcPeerConnection) {
        rtcPeerConnection.close()
      }
    }
  }, [])

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
    }
  }

  const fetchFilteredOrAllUsers = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: pageSize,
          page: page
        }
      }
      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/cameras', config)
      const statuses = response.data.map(item => item.status.name)

      console.log(statuses, 'status')
      setStatus1(statuses)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }
  useEffect(() => {
    fetchFilteredOrAllUsers()
  }, [])

  useEffect(() => {
    if (rtcPeerConnection) {
      rtcPeerConnection.addEventListener('connectionstatechange', () => {})
    }
  }, [rtcPeerConnection])

  useEffect(() => {
    fetchDataList()
  }, [page, pageSize])

  useEffect(() => {
    if (eventsData) {
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
  }, [eventsData, deviceList])

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
        setError('Không tìm thấy trong hệ thống')
      } else {
        setError(error.response?.data?.message || 'Đang gặp sự cố')
      }
      setDeviceList([])
      toast.error('Đang gặp sự cố')
    }
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
  }

  const formatDateTime = dateTimeString => {
    const date = new Date(dateTimeString)

    return format(date, 'HH:mm dd/MM/yyyy')
  }

  const pieChartOptions = {
    chart: {
      width: 380,
      type: 'pie'
    },
    labels: ['ACTIVE', 'INACTIVE'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    colors: ['#FF9933', '#0099FF'],
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => opts.w.config.series[opts.seriesIndex]
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: val => val
      }
    }
  }

  const pieChartData = [
    status1.filter(status => status === 'connected').length,
    status1.filter(status => status === 'disconnected').length
  ]

  const handlePageChange1 = (event, newPage) => {
    setPage1(newPage)
  }

  const handleSelectPageSize1 = size => {
    setPageSize1(size)
    setPage1(1)
  }

  const fetchDataList1 = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
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

  // Prepare data for the pie chart
  const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

  return (
    <>
      <Grid component={Paper}>
        <Card>
          <CardHeader
            title='Top 5 AI Events'
            titleTypographyProps={{ sx: { mb: [2, 0] } }}
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
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deviceList?.slice(0, pageSize).map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell>{index + 1}</TableCell>
                        {columns.map(column => {
                          const value = row[column.field]

                          return (
                            <TableCell key={column.id} align={column.align}>
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
          <br />
          <Grid container spacing={2} style={{ padding: 10 }}>
            <Grid item xs={3}></Grid>

            <Grid item xs={1} style={{ padding: 0 }}>
              <Box>
                <Menu>
                  {pageSizeOptions.map(size => (
                    <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                      {size}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Pagination count={total} page={page} color='primary' onChange={handlePageChange} />
            </Grid>
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
                        <TableCell>STT</TableCell>
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
                            <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
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

              <br />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Grid>
              <p style={{ marginLeft: '3%', fontSize: '20px' }}>Camera List</p>
            </Grid>
            <Card>
              {/* Add Pie Chart here */}
              <ApexCharts options={pieChartOptions} series={pieChartData} type='pie' width={380} />
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
