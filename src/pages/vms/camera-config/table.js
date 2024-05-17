import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/user'
import axios from 'axios'
import TableHeader from 'src/views/apps/vms/camera-config/TableHeader'
import ChangePassWords from './popups/ChangePassword'
import Edit from './popups/Edit'

import Network from './popups/Network'
import Video from './popups/video'
import Images from './popups/Image'
import Checkbox from '@mui/material/Checkbox'
import Cloud from './popups/Cloud'

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
  console.log(selectedIds)

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

  const handleClosePPopup = () => {
    setOpenPopupP(false)
    fetchFilteredOrAllUsers()
  }
  useEffect(() => {
    fetchFilteredOrAllUsers()
  }, [])

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
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
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
  const statusText = status1 ? 'Đang hoạt động' : 'Không hoạt động'

  const handleDelete = idDelete => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?'
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
            Swal.fire('Xóa thành công', '', 'success')
            const updatedData = assettype.filter(assettype => assettype.id !== idDelete)
            setAssetType(updatedData)
            fetchData()
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.message, 'error')
          })
      }
    })
  }
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
        const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/cameras', config)
        setStatus1(response.data.isOfflineSetting)
        setAssetType(response.data)
        setTotal(response.data.page)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchFilteredOrAllUsers()
  }, [page, pageSize, total, value])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          {selectedIds === null ? (
            <TableHeader />
          ) : (
            <TableHeader
              value={value}
              passwords={handleAddRoleClick}
              networks={handleAddNetworkClick}
              images={handleAddImageClick}
              videos={handleAddVideoClick}
              cloud={handleAddCloudClick}
            />
          )}{' '}
          <Grid container spacing={2}>
            <Grid item xs={0.1}></Grid>

            <Grid item xs={12}>
              <div></div>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>
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
                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tên thiết bị</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Loại</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Địa chỉ IP</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Địa chỉ Mac</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Vị trí</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Trạng thái</TableCell>

                    <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assettype.map((assetType, index) => (
                    <TableRow key={assetType.id}>
                      <TableCell sx={{ padding: '16px' }}>
                        <Checkbox
                          checked={selectedIds.includes(assetType.id)}
                          onChange={() => handleCheckboxChange(assetType.id)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{(page - 1) * pageSize + index + 1} </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.name}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.type.name}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.ipAddress}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.macAddress}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.location}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{statusText}</TableCell>

                      <TableCell sx={{ padding: '16px' }}>
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
              <br></br>
              <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={1.5} style={{ padding: 0 }}>
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
                </Grid>
                <Grid item xs={6}>
                  <Pagination count={total} color='primary' onChange={(event, page) => handlePageChange(page)} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
        {openPopupNetwork && (
          <>
            {' '}
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
            <Edit open={openPopupP} onClose={handleClosePPopup} camera={selectedNvrId} />
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default Camera
