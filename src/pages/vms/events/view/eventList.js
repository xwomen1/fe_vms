import { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Switch,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Filter from '../popups/filter'
import Add from '../popups/add'
import EventDetails from '../popups/eventDetails'
import { delApi, getApi } from 'src/@core/utils/requestUltils'

const initValueFilter = {
  location: null,
  cameraName: null,
  startTime: null,
  endTime: null,
  keyword: '',
  limit: 25,
  page: 1
}

const EventList = ({}) => {
  const [keyword, setKeyword] = useState('')
  const [valueFilter, setValueFilter] = useState(initValueFilter)
  const [loading, setLoading] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [isOpenDel, setIsOpenDel] = useState(false)
  const [isOpenView, setIsOpenView] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [eventDetail, setEventDetail] = useState(null)
  const [idDelete, setIdDelete] = useState(null)
  const [deviceList, setDeviceList] = useState([])
  const [reload, setReload] = useState(0)
  const [count, setCount] = useState('')
  const [total, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [websocket, setWebsocket] = useState(null)
  const [eventData, setEventData] = useState(null)
  const defaultCameraID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [isRealtime, setIsRealtime] = useState(false)

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
    if (isRealtime && eventData) {
      const newList = []

      deviceList?.map((item, index) => {
        if (index === 0) {
          newList.push(eventData)
          newList.push(item)
          setCount(count + 1)
          deviceList?.pop()
        } else {
          newList.push(item)
        }
      })

      setDeviceList([...newList])
    }
  }, [isRealtime, eventData])

  useEffect(() => {
    fetchDataList()
  }, [valueFilter, reload])

  useEffect(() => {
    fetchDataList()
  }, [page, pageSize, keyword])

  const fetchDataList = async () => {
    const params = {
      keyword: keyword || '',
      limit: pageSize,
      page: parseInt(page),
      location: valueFilter?.location || '',
      cameraName: valueFilter?.cameraName || '',
      startTime: valueFilter?.startTime || '',
      endTime: valueFilter?.endTime || ''
    }
    setLoading(true)
    try {
      const res = await getApi(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/routine`, params)
      setDeviceList(res?.data)
      setCount(res.count)
      setTotalPage(Math.ceil(res.count / pageSize))
    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
  }

  const handleSearch = e => {
    setKeyword(e.target.value)
  }

  const handleSetValueFilter = data => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1
    }

    setValueFilter(newDto)
    setIsOpenFilter(false)
  }

  const handleSwitchChange = event => {
    const isChecked = event.target.checked
    setIsRealtime(isChecked)

    if (!isChecked && websocket) {
      websocket.close()
      setWebsocket(null)
    }
  }

  const DeleteView = () => (
    <Dialog
      open={isOpenDel}
      maxWidth='sm'
      scroll='body'
      onClose={() => setIsOpenDel(false)}
      onBackdropClick={() => setIsOpenDel(false)}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            Accept
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Do you want to delete it?</Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button
          variant='contained'
          onClick={() => {
            handleDelete()
            setIsOpenDel(false)
          }}
        >
          Accept
        </Button>
        <Button variant='tonal' color='secondary' sx={{ mr: 1 }} onClick={() => setIsOpenDel(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )

  const handleDelete = () => {
    if (idDelete != null) {
      setLoading(true)

      delApi(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/${idDelete}`)
        .then(() => {
          toast.success('Deleted successfully')
          setIdDelete(null)
          setReload(reload + 1)
        })
        .catch(error => {
          if (error && error?.response?.data) {
            console.error('error', error)
            toast.error(error?.response?.data?.message)
          } else {
            console.error('Error fetching data:', error)
            toast.error(error)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Event list'
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
          action={
            <Grid container spacing={2}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch checked={isRealtime} onChange={handleSwitchChange} name='realtimeEvents' color='primary' />
                  }
                  label='Real time event.'
                />
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <IconButton
                    aria-label='Filter'
                    onClick={() => {
                      setIsOpenFilter(true)
                    }}
                    color='primary'
                  >
                    <Icon icon='tabler:filter' />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item>
                <CustomTextField
                  value={keyword}
                  placeholder='Search '
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
                  onChange={e => handleSearch(e)}
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
              </Grid>
            </Grid>
          }
        />
        <CardContent>
          {deviceList?.length === 0 ? (
            <Typography variant='h6' align='center'>
              No data available
            </Typography>
          ) : (
            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {deviceList?.map((item, index) => {
                return (
                  <Grid item xs={12} sm={6} lg={2.4} key={index}>
                    <Card
                      sx={{
                        width: '100%',
                        height: '300px',
                        borderWidth: 1,
                        borderRadius: '10px',
                        borderStyle: 'solid',
                        borderColor: '#ccc'
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            height: '100%',
                            minHeight: 140,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center'
                          }}
                        >
                          <img
                            width={'100%'}
                            height={150}
                            alt='add-role'
                            src={item?.imageObject}
                            style={{
                              objectFit: 'contain',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              setIsOpenView(true)
                              setEventDetail(item)
                            }}
                          />
                        </Box>
                        <Typography sx={{ marginTop: '10px' }}>
                          {item?.timestamp ? new Date(item?.timestamp).toLocaleString() : 'Date'}
                        </Typography>
                        <Typography
                          sx={{
                            marginTop: '10px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {item?.result}
                        </Typography>
                        <Typography sx={{ marginTop: '10px' }}>
                          {item?.location ? item?.location : 'Location'}
                        </Typography>

                        <IconButton
                          size='small'
                          sx={{ color: 'text.secondary' }}
                          onClick={() => {
                            setIsOpenView(true)
                            setEventDetail(item)
                          }}
                        >
                          <Icon icon='tabler:info-circle' />
                        </IconButton>
                        <IconButton
                          size='small'
                          sx={{ color: 'text.secondary' }}
                          onClick={() => {
                            setIsOpenEdit(true)
                            setEventDetail(item)
                          }}
                        >
                          <Icon icon='tabler:edit' />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setIdDelete(item.id)
                            setIsOpenDel(true)
                          }}
                        >
                          <Icon icon='tabler:trash' />
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
              <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid item xs={3}></Grid>

                <Grid item xs={1} style={{ padding: 0 }}>
                  <Box>
                    <IconButton onClick={handleOpenMenu}>
                      <Icon icon='tabler:selector' />
                      <p style={{ fontSize: 15 }}>{pageSize} line/page</p>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
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
            </Grid>
          )}
        </CardContent>
      </Card>

      {isOpenFilter && (
        <Filter
          valueFilter={valueFilter}
          direction='ALL_EVEN'
          show={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          callback={handleSetValueFilter}
        />
      )}

      {isOpenView && (
        <EventDetails
          show={isOpenView}
          onClose={() => setIsOpenView(false)}
          data={eventDetail}
          setReload={() => setReload(reload + 1)}
        />
      )}

      {isOpenEdit && (
        <Add
          show={isOpenEdit}
          onClose={() => setIsOpenEdit(false)}
          data={eventDetail}
          setReload={() => setReload(reload + 1)}
        />
      )}

      {isOpenDel && DeleteView()}
    </>
  )
}

export default EventList
