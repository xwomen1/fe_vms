import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TreeView from '@mui/lab/TreeView'
import CustomChip from 'src/@core/components/mui/chip'
import TreeItem from '@mui/lab/TreeItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { IconButton, Box, Button, CardHeader, TableContainer, Paper } from '@mui/material'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/vms/nvr-config/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import ChangePassWords from './popups/ChangePassword'
import Passwords from './popups/PassWord'

import Network from './popups/Network'
import Video from './popups/video'
import Images from './popups/Image'
import Checkbox from '@mui/material/Checkbox'
import Cloud from './popups/Cloud'
import ConnectCamera from './popups/ConnectCamera'
import VideoConnectCamera from './popups/VideoConnectCamera'
import { Password } from '@mui/icons-material'
import Edit from './popups/Edit'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [idNVR, setId] = useState([])
  const [nameNVR, setNameNvr] = useState(null)
  const [IPNVR, setIPNVR] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupP, setOpenPopupP] = useState(false)
  const defaultCameraID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'
  const [openPopupNetwork, setOpenPopupNetwork] = useState(false)
  const [openPopupVideo, setOpenPopupVideo] = useState(false)
  const [openPopupImage, setOpenPopupImage] = useState(false)
  const [openPopupCloud, setOpenPopupCloud] = useState(false)
  const [openPopupConnectCamera, setOpenPopupConnectCamera] = useState(false)
  const [openPopupVideoConnectCamera, setOpenPopupVideoConnectCamera] = useState(false)

  const [selectedNvrId, setSelectedNvrId] = useState(null)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [assettype, setAssetType] = useState([])
  const [nvr, setNvr] = useState([1])

  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [status1, setStatus1] = useState(25)

  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)

  const defaultNvrID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'
  const [assettypeStatus, setAssetTypeStatus] = useState([])

  useEffect(() => {
    const ws = new WebSocket(`wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/nvrStatus/${defaultNvrID}`)

    ws.onmessage = event => {
      const { dataType, data } = JSON.parse(event.data)
      if (dataType === 'nvrStatus') {
        const NVRStatusUpdates = JSON.parse(data)
        updateNVRStatus(NVRStatusUpdates)
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  const updateNVRStatus = useCallback(NVRStatusUpdates => {
    const NVRStatusMap = new Map(
      NVRStatusUpdates?.map(status => [status.id, { status: status.statusValue.name, ip: status.ip }])
    )

    setAssetTypeStatus(prevStatus => {
      const newStatus = [...prevStatus]
      NVRStatusMap.forEach((value, key) => {
        const index = newStatus.findIndex(item => item.id === key)
        if (index !== -1) {
          newStatus[index] = { ...newStatus[index], ...value }
        } else {
          newStatus.push({ id: key, ...value })
        }
      })

      return newStatus
    })
  }, [])

  useEffect(() => {
    if (assettypeStatus.length) {
      setAssetType(prevAssettype => {
        return prevAssettype.map(asset => {
          const statusUpdate = assettypeStatus.find(status => status.id === asset.id)
          if (statusUpdate) {
            return { ...asset, status: { name: statusUpdate.status } }
          }

          return asset
        })
      })
    }
  }, [assettypeStatus])

  useEffect(() => {
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
        const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/nvrs', config)
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setStatus1(response.data.isOfflineSetting || false)
          setNvr(response.data[0].id)
          setAssetType(response.data)
          setTotal(response.data.page)
          console.log(response.data[0].id)
        } else {
          setStatus1(false)
          setNvr(null)
          setAssetType([])
          setTotal(0)
          console.warn('Response data is empty or invalid')
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchFilteredOrAllUsers()
  }, [page, pageSize, total, value])

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

  const handleAddRolesClick = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false) // Đóng Popup khi cần thiết
  }

  const handleAddPClick = selectedNvrId => {
    setOpenPopupP(true)
    setSelectedNvrId(selectedNvrId)
  }

  const handleClosePPopup = () => {
    setOpenPopupP(false) // Đóng Popup khi cần thiết
  }

  const handleAddNetworkClick = () => {
    setOpenPopupNetwork(true)
  }

  const handleCloseNetWorkPopup = () => {
    setOpenPopupNetwork(false) // Đóng Popup khi cần thiết
  }

  const handleAddVideoClick = () => {
    setOpenPopupVideo(true)
  }

  const handleCloseVideoPopup = () => {
    setOpenPopupVideo(false) // Đóng Popup khi cần thiết
  }

  const handleAddImageClick = () => {
    setOpenPopupImage(true)
  }

  const handleCloseImagePopup = () => {
    setOpenPopupImage(false) // Đóng Popup khi cần thiết
  }

  const handleAddCloudClick = () => {
    setOpenPopupCloud(true)
  }

  const handleCloseCloudPopup = () => {
    setOpenPopupCloud(false) // Đóng Popup khi cần thiết
  }

  const handleAddConnectCameraClick = () => {
    setOpenPopupConnectCamera(true)
  }

  const handleCloseConnectCameraPopup = () => {
    setOpenPopupConnectCamera(false) // Đóng Popup khi cần thiết
  }

  const handleAddVideoConnectClick = () => {
    setOpenPopupVideoConnectCamera(true)
  }

  const handleCloseVideoConnectPopup = () => {
    setOpenPopupVideoConnectCamera(false) // Đóng Popup khi cần thiết
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

  const passwords = useCallback(val => {
    setValue(val)
  }, [])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  console.log(total, 'totalpage')

  const statusText = status1 ? 'Đang hoạt động' : 'Không hoạt động'

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
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire({
              title: 'Successfully!',
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
              text: err.response?.data?.message || err.message,
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

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const fetchDataReload = async id => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/vms/api/v0/device/nvr/synchronize?nvr_id=${id}`,
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
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='NVR List'
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
                      <Button variant='contained' color='primary' onClick={handleAddRoleClick}>
                        Password
                      </Button>
                      <Button variant='contained' color='primary' onClick={handleAddNetworkClick}>
                        Network
                      </Button>
                      <Button variant='contained' color='primary' onClick={handleAddVideoClick}>
                        Video
                      </Button>
                      <Button variant='contained' color='primary' onClick={handleAddImageClick}>
                        Image
                      </Button>
                      <Button variant='contained' color='primary' onClick={handleAddCloudClick}>
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
                        <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setValue('')}>
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
              <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
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
                        <TableCell align='center'>{assetType.type?.name}</TableCell>
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
                          <IconButton size='small' onClick={() => handleAddPClick(assetType.id)}>
                            <Icon icon='tabler:edit' />
                          </IconButton>
                          <IconButton
                            size='small'
                            onClick={() => {
                              setIPNVR(assetType.ipAddress)
                              setNameNvr(assetType.name)
                              setId(assetType.id)
                              handleAddConnectCameraClick(assetType.id)
                            }}
                          >
                            <Icon icon='tabler:link' />
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
            {/* <ChangePassWords open={openPopup} onClose={handleClosePopup} nvr={selectedIds} /> */}
            <Network open={openPopupNetwork} onClose={handleCloseNetWorkPopup} nvr={selectedIds} />
          </>
        )}
        {/* {selectedIds.length > 0 && (
          <>
            <ChangePassWords open={openPopup} onClose={handleClosePopup} nvr={selectedIds} />
            <Network open={openPopupNetwork} onClose={handleCloseNetWorkPopup} nvr={selectedIds} />
            <Video open={openPopupVideo} onClose={handleCloseVideoPopup} nvr={selectedIds} />
            <Image open={openPopupImage} onClose={handleCloseImagePopup} nvr={selectedIds} />
            <Cloud open={openPopupCloud} onClose={handleCloseCloudPopup} nvr={selectedIds} />
            
          </>

        )}  */}
        {openPopup && (
          <>
            <ChangePassWords open={openPopup} onClose={handleClosePopup} nvr={selectedIds} />
          </>
        )}
        {openPopupVideo && (
          <>
            <Video open={openPopupVideo} onClose={handleCloseVideoPopup} camera={selectedIds} />
          </>
        )}{' '}
        {openPopupImage && (
          <>
            <Images open={openPopupImage} onClose={handleCloseImagePopup} camera={selectedIds} />
          </>
        )}{' '}
        {openPopupCloud && (
          <>
            <Cloud open={openPopupCloud} onClose={handleCloseCloudPopup} camera={selectedIds} />
          </>
        )}
        {openPopupP && (
          <>
            <Edit open={openPopupP} onClose={handleClosePPopup} nvr={selectedNvrId} />
          </>
        )}
        {/* <Passwords open={openPopupP} onClose={handleClosePPopup} nvr={selectedIds} /> */}
        <ConnectCamera
          open={openPopupConnectCamera}
          onClose={handleCloseConnectCameraPopup}
          nvr={idNVR}
          name={nameNVR}
          ip={IPNVR}
        />
        <VideoConnectCamera
          open={openPopupVideoConnectCamera}
          onClose={handleCloseVideoConnectPopup}
          nvr={selectedIds}
        />
      </Grid>
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
