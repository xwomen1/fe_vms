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
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Filter from '../popups/filter'
import Add from '../popups/add'
import EventDetails from '../popups/eventDetails'

const initValueFilter = {
  location: null,
  cameraName: null,
  startTime: null,
  endTime: null,
  keyword: '',
  limit: 25,
  page: 1
}

const EventList = ({ eventData }) => {
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

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config1 = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const eventTypeColors = {
    'Phát hiện sự kiện AI': 'success',
    'Phát hiện đối tượng nguy hiểm': 'error',
    'Phát hiện hành vi bất thường': 'warning',
    'Phát hiện đối tượng danh sách đen': 'secondary'
  }

  useEffect(() => {
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
  }, [eventData])

  useEffect(() => {
    fetchDataList()
  }, [])

  useEffect(() => {
    fetchDataList()
  }, [valueFilter, reload])

  useEffect(() => {
    fetchDataList()
  }, [page, pageSize, keyword])

  const fetchDataList = async () => {
    const params = {
      ...config1,
      params: {
        camName: keyword || '',
        limit: pageSize,
        page: parseInt(page),
        location: valueFilter?.location || '',
        cameraName: valueFilter?.cameraName || '',
        startTime: valueFilter?.startTime || '',
        endTime: valueFilter?.endTime || ''
      }
    }
    setLoading(true)
    try {
      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/routine`, params)
      setDeviceList(res?.data)
      setCount(res.count)
      setTotalPage(Math.ceil(res.count / pageSize))
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error)
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
            Xác nhận
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Bạn có chắc chắn muốn xóa không ?</Typography>
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
          Đồng ý
        </Button>
        <Button variant='tonal' color='secondary' sx={{ mr: 1 }} onClick={() => setIsOpenDel(false)}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  )

  const handleDelete = () => {
    if (idDelete != null) {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      axios
        .delete(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/${idDelete}`, config)
        .then(() => {
          toast.success('Xóa thành công')
          setIdDelete(null)
          setReload(reload + 1)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
          toast.error(error?.response?.data || '')
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
          title='Danh sách sự kiện AI'
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
                <Box sx={{ float: 'right' }}>
                  <IconButton
                    aria-label='Bộ lọc'
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
                  placeholder='Tìm kiếm sự kiện '
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
                        {item?.timestamp ? new Date(item?.timestamp).toLocaleString() : 'Thời gian'}
                      </Typography>
                      <Typography sx={{ marginTop: '10px' }}>{item?.location ? item?.location : 'Vị trí'}</Typography>
                      <Typography
                        sx={{
                          marginTop: '10px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item?.description ? item?.description : 'Tên đối tượng'}
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
          </Grid>
        </CardContent>
        <Grid container spacing={2} style={{ padding: 10 }}>
          <Grid item xs={3}></Grid>

          <Grid item xs={1} style={{ padding: 0 }}>
            <Box>
              <IconButton onClick={handleOpenMenu}>
                <Icon icon='tabler:selector' />
                <p style={{ fontSize: 15 }}>{pageSize} dòng/trang</p>
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
      </Card>

      {isOpenFilter && (
        <Filter show={isOpenFilter} onClose={() => setIsOpenFilter(false)} callback={handleSetValueFilter} />
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
