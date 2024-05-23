import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { Autocomplete, Button, CircularProgress, IconButton, Paper } from '@mui/material'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/vms/nvr-config/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import ChangePassWords from './popups/ChangePassword'
import Passwords from './popups/PassWord'
import PopupScanDungIP from './popups/AddDungIP'
import PopupScanOnvif from './popups/AddOnvif'
import PopupScan from './popups/Add'
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'

import Network from './popups/Network'
import Video from './popups/video'
import Images from './popups/Image'
import Checkbox from '@mui/material/Checkbox'
import Cloud from './popups/Cloud'
import ConnectCamera from './popups/ConnectCamera'
import VideoConnectCamera from './popups/VideoConnectCamera'
import { Password } from '@mui/icons-material'
import Edit from './popups/Edit'
import toast from 'react-hot-toast'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [idNVR, setId] = useState([])
  const [nameNVR, setNameNvr] = useState(null)
  const [IPNVR, setIPNVR] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupP, setOpenPopupP] = useState(false)

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
  const [selectedValue, setSelectedValue] = useState('')

  const [loading, setLoading] = useState(false)
  const [idNvr, setIdnvr] = useState(null)
  const [reload, setReload] = useState(0)
  const [url, setUrl] = useState('')
  const [nvrs, setNVR] = useState([])
  const [host, setHost] = useState('')
  const [userName, setUsername] = useState('')
  const [passWord, setPassWord] = useState('')
  const [response, setResponse] = useState('')
  const [endHost, setEndHost] = useState('')
  const [endURL, setEndUrl] = useState('')
  const [startHost, setStartHost] = useState('')
  const [startURL, setStartUrl] = useState('')
  const defaultValue = ''
  const [selectNVR, setSelectedNVR] = useState('')
  const [openPopupResponse, setOpenPopupResponse] = useState(false)
  const [openPopupResponseDungIP, setOpenPopupResponseDungIP] = useState(false)
  const [openPopupResponseOnvif, setOpenPopupResponseOnvif] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleScan = async () => {
    setOpenPopupResponseDungIP(true)
    setLoading(true)
    setPopupMessage('') // Reset thông điệp khi bắt đầu scan
    setIsError(false) // Reset trạng thái lỗi khi bắt đầu scan
    try {
      const payload = {
        url,
        idBox: selectNVR?.value,
        host,
        userName,
        passWord
      }
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/onvif/scandevicestaticip',
        payload,
        config
      )

      setResponse(response.data)
      setLoading(false)
      setPopupMessage('Quét thành công')
      setIsError(false) // Không phải lỗi
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'No response from the server device, timeout: scan_device_ip'
      ) {
        setPopupMessage('Thiết bị chưa phản hồi')
      } else {
        setPopupMessage(`${error.response.data.message}`)
      }

      // // setOpenPopupResponseDungIP(false)
      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
  }

  const handleScanDaiIP = async () => {
    setOpenPopupResponse(true)
    setLoading(true)
    setPopupMessage('') // Reset thông điệp khi bắt đầu scan
    setIsError(false) // Reset trạng thái lỗi khi bắt đầu scan
    try {
      const payload = {
        idBox: selectNVR?.value,
        startHost: parseInt(startHost),
        endHost: parseInt(endHost),
        startURL,
        endURL,
        userName,
        passWord
      }
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/onvif/devicescanlistip',
        payload,
        config
      )

      setResponse(response.data)
      setLoading(false)

      toast.success('Thành công')

      setPopupMessage('Quét thành công')
      setIsError(false) // Không phải lỗi
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'No response from the server device, timeout: scan_device_ip'
      ) {
        setPopupMessage('Thiết bị chưa phản hồi')
      } else {
        setPopupMessage(`${error.response.data.message}`)
      }

      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
  }

  const handleScanOnvif = async () => {
    setOpenPopupResponseOnvif(true)
    setLoading(true)
    setPopupMessage('') // Reset thông điệp khi bắt đầu scan
    setIsError(false) // Reset trạng thái lỗi khi bắt đầu scan
    try {
      const payload = {
        idBox: selectNVR?.value,
        userName,
        passWord
      }
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/onvif/scandevice',
        payload,
        config
      )

      setResponse(response.data)
      setLoading(false)

      toast.success('Thành công')

      setPopupMessage('Quét thành công')
      setIsError(false) // Không phải lỗi
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'No response from the server device, timeout: scan_device'
      ) {
        setPopupMessage('Thiết bị chưa phản hồi')
      } else {
        setPopupMessage(`${error.response.data.message}`)
      }

      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
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

  const passwords = useCallback(val => {
    setValue(val)
  }, [])

  console.log(total, 'totalpage')

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
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${idDelete}`
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

  const handleRadioChange = event => {
    setSelectedValue(event.target.value)
    console.log(selectedValue)
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
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
          setTotal(response.data.page || 0)
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
  }, [page, pageSize, total, value, reload])

  console.log(nameNVR, 'idNVR')

  const fetchNicTypes = async () => {
    try {
      // setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/device', config)

      const nicTypes = response.data.map(item => ({
        label: item.nameDevice,
        value: item.id
      }))
      setNVR(nicTypes)

      // Set selectedNicType here based on your business logic
      if (nicTypes.length > 0) {
        setSelectedNVR(nicTypes[0].id) // Set it to the first value in the array, or adjust as needed
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      // setLoading(false)
    }
  }

  const handleComboboxFocus = () => {
    fetchNicTypes()
  }

  const handleDDNSChange = (event, newValue) => {
    setSelectedNVR(newValue)
  }
  useEffect(() => {
    setSelectedNVR({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Grid container spacing={2}>
            <Grid item xs={0.1}></Grid>

            <Grid item xs={12}>
              <div></div>
              <div>
                <RadioGroup value={selectedValue} onChange={handleRadioChange} style={{ marginLeft: 50 }}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <FormControlLabel value='dungIp' control={<Radio />} label='Dùng IP' />
                    </Grid>
                    <Grid item>
                      <FormControlLabel value='daiIp' control={<Radio />} label='Dải IP' />
                    </Grid>
                    <Grid item>
                      <FormControlLabel value='onvif' control={<Radio />} label='Onvif' />
                    </Grid>
                  </Grid>
                </RadioGroup>
                {selectedValue === 'dungIp' && (
                  <Grid
                    container
                    item
                    component={Paper}
                    style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
                  >
                    <Grid item xs={1.8}>
                      <Autocomplete
                        value={selectNVR}
                        onChange={handleDDNSChange}
                        options={nvrs}
                        getOptionLabel={option => option.label}
                        renderInput={params => <CustomTextField {...params} label='NVR/AI BOX' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={2.4}>
                      <CustomTextField
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        label='Địa chỉ IP'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={2.4}>
                      <CustomTextField value={host} onChange={e => setHost(e.target.value)} label='Cổng' fullWidth />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={2.4}>
                      <CustomTextField
                        value={userName}
                        onChange={e => setUsername(e.target.value)}
                        label='Đăng nhập'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={passWord}
                        onChange={e => setPassWord(e.target.value)}
                        label='Mật khẩu'
                        type='password'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2} style={{ marginTop: '1%' }}>
                      <Button style={{ marginLeft: '5%' }}>Cancel</Button>
                      <Button style={{ marginLeft: '5%' }} onClick={handleScan} variant='contained'>
                        Quét
                      </Button>
                    </Grid>
                    <Grid item xs={0.1} style={{ marginTop: '1%' }}>
                      {loading && <CircularProgress style={{ top: '5px' }} />}
                    </Grid>
                  </Grid>
                )}
                {openPopupResponseDungIP && (
                  <>
                    <PopupScanDungIP
                      open={openPopupResponseDungIP}
                      url={url}
                      port={host}
                      setReload={() => setReload(reload + 1)}
                      userName={userName}
                      isError={isError}
                      popupMessage={popupMessage}
                      passWord={passWord}
                      response={response}
                      loadingDungIp={loading}
                      onClose={() => setOpenPopupResponseDungIP(false)}
                    />{' '}
                  </>
                )}
                {selectedValue === 'daiIp' && (
                  <Grid
                    container
                    item
                    component={Paper}
                    style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
                  >
                    <Grid item xs={1.8}>
                      <Autocomplete
                        value={selectNVR}
                        onChange={handleDDNSChange}
                        options={nvrs}
                        getOptionLabel={option => option.label}
                        renderInput={params => <CustomTextField {...params} label='NVR/AI BOX' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>
                    <Grid item xs={0.4}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={startURL}
                        onChange={e => setStartUrl(e.target.value)}
                        label='Địa chỉ IP bắt đầu'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={0.4} style={{ marginTop: '2%' }}>
                      ----
                    </Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={endURL}
                        onChange={e => setEndUrl(e.target.value)}
                        label='Địa chỉ IP kết thúc'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={2}>
                      <CustomTextField
                        value={startHost}
                        onChange={e => setStartHost(e.target.value)}
                        label='Cổng bắt đầu'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={0.4} style={{ marginTop: '2%' }}>
                      ----
                    </Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={endHost}
                        onChange={e => setEndHost(e.target.value)}
                        label='Cổng kết thúc'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={userName}
                        onChange={e => setUsername(e.target.value)}
                        label='Đăng nhập'
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={0.4}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={passWord}
                        onChange={e => setPassWord(e.target.value)}
                        label='Mật khẩu'
                        type='password'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={4} style={{ marginTop: '1%' }}>
                      <Button>Cancel</Button>
                      <Button onClick={handleScanDaiIP} variant='contained'>
                        Quét
                      </Button>
                    </Grid>
                    <Grid item xs={0.1} style={{ marginTop: '1%', marginLeft: '-20%' }}>
                      {loading && <CircularProgress style={{ top: '5px' }} />}
                    </Grid>
                  </Grid>
                )}
                {openPopupResponse && (
                  <>
                    <PopupScan
                      open={openPopupResponse}
                      userName={userName}
                      setReload={() => setReload(reload + 1)}
                      isError={isError}
                      popupMessage={popupMessage}
                      passWord={passWord}
                      response={response}
                      loadingDaiIP={loading}
                      onClose={() => setOpenPopupResponse(false)}
                    />{' '}
                  </>
                )}
                {selectedValue === 'onvif' && (
                  <Grid
                    container
                    item
                    component={Paper}
                    style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
                  >
                    <Grid item xs={1.8}>
                      <Autocomplete
                        value={selectNVR}
                        onChange={handleDDNSChange}
                        options={nvrs}
                        getOptionLabel={option => option.label}
                        renderInput={params => <CustomTextField {...params} label='NVR/AI BOX' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>

                    <Grid item xs={0.4}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={userName}
                        onChange={e => setUsername(e.target.value)}
                        label='Đăng nhập'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.4}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={passWord}
                        onChange={e => setPassWord(e.target.value)}
                        label='Mật khẩu'
                        type='password'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={4} style={{ marginTop: '1%' }}>
                      <Button>Cancel</Button>
                      <Button variant='contained' onClick={handleScanOnvif}>
                        Quét
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {openPopupResponseOnvif && (
                  <>
                    <PopupScanOnvif
                      open={openPopupResponseOnvif}
                      userName={userName}
                      setReload={() => setReload(reload + 1)}
                      passWord={passWord}
                      isError={isError}
                      popupMessage={popupMessage}
                      response={response}
                      loadingOnvif={loading}
                      onClose={() => setOpenPopupResponseOnvif(false)}
                    />{' '}
                  </>
                )}
              </div>
              <Table>
                <TableHead>
                  <TableRow>
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
                      <TableCell sx={{ padding: '16px' }}>{(page - 1) * pageSize + index + 1} </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.name}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.type.name}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.ipAddress}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.macAddress}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.location}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {assetType.status?.name ? assetType.status.name : statusText}
                      </TableCell>

                      <TableCell sx={{ padding: '16px' }}>
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
