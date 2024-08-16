import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { IconButton, Box, CardHeader, Button, TableContainer, Paper } from '@mui/material'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/user'
import axios from 'axios'
import ChangePassWords from './popups/ChangePassword'
import Edit from './popups/Edit'
import Network from './popups/Network'
import Video from './popups/video'
import Images from './popups/Image'
import Checkbox from '@mui/material/Checkbox'
import Cloud from './popups/Cloud'
import LiveView from './popups/LiveView'

const Camera = ({ apiData }) => {
  const [value, setValue] = useState('')

  const [selectedIds, setSelectedIds] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupP, setOpenPopupP] = useState(false)
  const [openPopupNetwork, setOpenPopupNetwork] = useState(false)
  const [openPopupVideo, setOpenPopupVideo] = useState(false)
  const [openPopupImage, setOpenPopupImage] = useState(false)
  const [openPopupCloud, setOpenPopupCloud] = useState(false)
  const [selectedNvrId, setSelectedNvrId] = useState(null)
  const [assettype, setAssetType] = useState([])
  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [status1, setStatus1] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [prevCameraStatus, setPrevCameraStatus] = useState([])
  const [isOpenLiveView, setIsOpenLiveView] = useState(false)
  const [camera, setCamera] = useState(null)

  const defaultCameraID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'
  const [assettypeStatus, setAssetTypeStatus] = useState([])

  useEffect(() => {
    const ws = new WebSocket(`wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/cameraStatus/${defaultCameraID}`)

    ws.onmessage = event => {
      const { dataType, data } = JSON.parse(event.data)
      if (dataType === 'cameraStatus') {
        const cameraStatusUpdates = JSON.parse(data)
        updateCameraStatus(cameraStatusUpdates)
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  const updateCameraStatus = useCallback(
    cameraStatusUpdates => {
      const cameraStatusMap = new Map(
        cameraStatusUpdates.map(status => [status.id, status.statusValue.name, status.ip])
      )

      // Lặp qua các mục trong Map sử dụng for...of
      for (const entry of cameraStatusMap.entries()) {
        const [id, status, ip] = entry

        const entry1 = {
          id: id,
          status: status,
          ip: ip
        }

        setAssetTypeStatus(prevAssetType => {
          const newAssetType = prevAssetType.map(camera => {
            if (camera.id === entry1.id) {
              if (camera.status.name !== entry1.status) {
                // console.log('AssetType with ID', entry1.id, 'has changed status.')
                // console.log('Previous status:', camera.status.name)
                // console.log('New status:', entry1.status)
              }

              return { ...camera, status: { name: entry1.status } }
            }

            return camera
          })

          // console.log('New Asset Type:', newAssetType) // Log updated asset type

          return newAssetType
        })
      }
    },
    [assettypeStatus]
  )

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleCheckboxChange = id => {
    const isSelected = selectedIds.includes(id)
    if (isSelected) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
      setSelectedNvrId(null)
    } else {
      setSelectedIds([...selectedIds, id])
      setSelectedNvrId(id)
    }
  }

  const handleAddRoleClick = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

  const handleAddPClick = cameraId => {
    setOpenPopupP(true)
    setSelectedNvrId(cameraId)
  }

  const handleOpenLiveView = camera => {
    setIsOpenLiveView(true)
    setCamera(camera)
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
          page: page,
          keyword: value
        }
      }
      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/cameras', config)
      setStatus1(response.data.isOfflineSetting)
      setAssetType(response.data)
      setTotal(response.data.page)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleClosePPopup = () => {
    setOpenPopupP(false)
    fetchFilteredOrAllUsers()
  }

  useEffect(() => {
    fetchFilteredOrAllUsers()
  }, [value])

  const handleAddNetworkClick = () => {
    setOpenPopupNetwork(true)
  }

  const handleCloseNetWorkPopup = () => {
    setOpenPopupNetwork(false)
  }

  const handleAddVideoClick = () => {
    setOpenPopupVideo(true)
  }

  const handleCloseVideoPopup = () => {
    setOpenPopupVideo(false)
  }

  const handleAddImageClick = () => {
    setOpenPopupImage(true)
  }

  const handleCloseImagePopup = () => {
    setOpenPopupImage(false)
  }

  const handleAddCloudClick = () => {
    setOpenPopupCloud(true)
  }

  const handleCloseCloudPopup = () => {
    setOpenPopupCloud(false)
  }

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Accept',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Agree',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Cancel',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      },
      confirmButtonColor: '#002060'
    }

    return Swal.fire({ ...defaultProps, ...options })
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

  const handleDelete = idDelete => {
    showAlertConfirm({
      text: 'Do you want to delete it?'
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        if (!token) {
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire({
              title: 'Success!',
              text: 'Deleted successfully',
              icon: 'success',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#002060'
                  confirmButton.style.color = 'white'
                }
              }
            })
            const updatedData = assettype.filter(assettype => assettype.id !== idDelete)
            setAssetType(updatedData)
            fetchData()
          })
          .catch(err => {
            Swal.fire({
              title: 'Error!',
              text: err.response?.data?.message,
              icon: 'error',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#002060'
                  confirmButton.style.color = 'white'
                }
              }
            })
          })
      }
    })
  }

  useEffect(() => {
    if (assettypeStatus.length) {
      setAssetType(assettypeStatus)
    }
  }, [assettypeStatus])

  const fetchDataReload = async id => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/vms/api/v0/device/camera/synchronize?camera_id=${id}`,
        config
      )
      Swal.fire({
        title: 'Synchronization successful!',
        text: response?.message,
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    }
  }

  const handleReloadClick = id => {
    fetchDataReload(id)
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Camera List '
            titleTypographyProps={{ sx: { mb: [2, 0] } }}
            sx={{
              py: 4,
              flexDirection: ['column', 'row'],
              '& .MuiCardHeader-action': { m: 0 },
              alignItems: ['flex-start', 'center']
            }}
            action={
              <Grid container spacing={5}>
                <Grid item xs={9}>
                  {selectedIds === null ? (
                    <Box></Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant='contained' onClick={handleAddRoleClick}>
                        Password
                      </Button>
                      <Button variant='contained' onClick={handleAddNetworkClick}>
                        Network
                      </Button>
                      <Button variant='contained' onClick={handleAddVideoClick}>
                        Video
                      </Button>
                      <Button variant='contained' onClick={handleAddImageClick}>
                        Image
                      </Button>
                      <Button variant='contained' onClick={handleAddCloudClick}>
                        Storage
                      </Button>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    value={value}
                    autoComplete='off'
                    onChange={e => handleFilter(e.target.value)}
                    placeholder='Search…'
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 2, display: 'flex' }}>
                          <Icon fontSize='1.25rem' icon='tabler:search' />
                        </Box>
                      ),
                      endAdornment: (
                        <IconButton size='small' title='Clear' aria-label='Clear'>
                          <Icon fontSize='1.25rem' icon='tabler:x' />
                        </IconButton>
                      )
                    }}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: 1000 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>
                        <Checkbox
                          checked={selectedIds.length === assettype.length}
                          onChange={e => {
                            if (e.target.checked) {
                              const allIds = assettype.map(assetType => assetType.id)
                              setSelectedIds(allIds)
                            } else {
                              setSelectedIds([])
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align='center'>NO.</TableCell>
                      <TableCell align='center'>Device Name</TableCell>
                      <TableCell align='center'>Device Type</TableCell>
                      <TableCell align='center'>IP Address</TableCell>
                      <TableCell align='center'>Mac Address</TableCell>
                      <TableCell align='center'>Location</TableCell>
                      <TableCell align='center'>Status</TableCell>

                      <TableCell align='center'>Active</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assettype.map((assetType, index) => (
                      <TableRow key={assetType.id}>
                        <TableCell align='center'>
                          <Checkbox
                            checked={selectedIds.includes(assetType.id)}
                            onChange={() => handleCheckboxChange(assetType.id)}
                          />
                        </TableCell>
                        <TableCell align='center'>{(page - 1) * pageSize + index + 1} </TableCell>
                        <TableCell align='center'>{assetType.name}</TableCell>
                        <TableCell align='center'>{assetType.type.name}</TableCell>
                        <TableCell align='center'>{assetType.ipAddress}</TableCell>
                        <TableCell align='center'>{assetType.macAddress}</TableCell>
                        <TableCell align='center'>{assetType.location}</TableCell>
                        <TableCell align='center'>
                          {assetType.status && assetType.status.name ? (
                            <div>
                              <CustomChip
                                rounded
                                size='small'
                                skin='light'
                                sx={{ lineHeight: 1 }}
                                label={assetType.status.name === 'disconnected' ? 'Lost connection' : 'Connected'}
                                color={assetType.status.name === 'disconnected' ? 'primary' : 'success'}
                              />
                            </div>
                          ) : (
                            assetType.status.name
                          )}
                        </TableCell>

                        <TableCell align='center'>
                          <IconButton onClick={() => handleReloadClick(assetType.id)}>
                            <Icon icon='tabler:reload' />
                          </IconButton>
                          <IconButton onClick={() => handleOpenLiveView(assetType)}>
                            <Icon icon='tabler:video' />
                          </IconButton>
                          <IconButton size='small' onClick={() => handleAddPClick(assetType.id)}>
                            <Icon icon='tabler:edit' />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(assetType.id)}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br></br>
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
          </Grid>
        </Card>
        {openPopupNetwork && (
          <>
            <Network open={openPopupNetwork} onClose={handleCloseNetWorkPopup} camera={selectedIds} />
          </>
        )}
        {openPopup && (
          <>
            <ChangePassWords open={openPopup} onClose={handleClosePopup} camera={selectedIds} />
          </>
        )}
        {openPopupVideo && (
          <>
            <Video open={openPopupVideo} onClose={handleCloseVideoPopup} camera={selectedIds} />
          </>
        )}
        {openPopupImage && (
          <>
            <Images open={openPopupImage} onClose={handleCloseImagePopup} camera={selectedIds} />
          </>
        )}
        {openPopupCloud && (
          <>
            <Cloud open={openPopupCloud} onClose={handleCloseCloudPopup} camera={selectedIds} />
          </>
        )}
        {openPopupP && (
          <>
            <Edit open={openPopupP} onClose={handleClosePPopup} camera={selectedNvrId} />
          </>
        )}
        {isOpenLiveView && <LiveView show={isOpenLiveView} onClose={() => setIsOpenLiveView(false)} data={camera} />}
      </Grid>
    </Grid>
  )
}

export default Camera
