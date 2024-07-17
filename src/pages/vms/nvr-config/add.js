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
import { Autocomplete, Button, CircularProgress, IconButton, Paper, Box } from '@mui/material'
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
import PopupScanHik from './popups/AddHik'
import PopupScan from './popups/Add'
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import ImportPopup from './popups/ImportPopup'
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
import AddDevice from './popups/AddDevice'

const UserList = ({ apiData, assettypeStatus }) => {
  const [value, setValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [idNVR, setId] = useState([])
  const [nameNVR, setNameNvr] = useState(null)
  const [IPNVR, setIPNVR] = useState(null)
  const [openPopupImport, setOpenImportPopup] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupP, setOpenPopupP] = useState(false)
  const [protocolSelected, setProtocolSelected] = useState(false)
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
  const [selectedTitle, setSelectedTitle] = useState('')
  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [status1, setStatus1] = useState(25)
  const [protocol, setProtocol] = useState([])
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedValue, setSelectedValue] = useState('')
  const [Checkboxx, setChechBox] = useState(false)
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
  const [openPopupResponseHik, setOpenPopupResponseHik] = useState(false)
  const [openPopupResponseOnvif, setOpenPopupResponseOnvif] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [idBox, setIdBox] = useState(null)
  const [idBoxs, setIdBoxs] = useState(selectNVR?.value)
  const [selectedAuto, setSelectedAuto] = useState('')
  const [isOpenAddDevice, setIsOpenAddDevice] = useState(false)

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
        passWord,
        protocol: 'ONVIF'
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

  const handleScanLGT = async () => {
    if (!selectedTitle) {
      Swal.fire({
        title: 'Error',
        text: 'Hãy chọn loại giao thức',
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    setOpenPopupResponseHik(true)
    setLoading(true)
    setPopupMessage('')
    setIsError(false)
    try {
      const payload = {
        idBox: selectNVR?.value,
        userName,
        passWord,
        protocol: selectedTitle
      }
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/onvif/devicescanhikivision',
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

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

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
        passWord,
        protocol: 'ONVIF'
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

  const handleClosePopupImport = () => {
    setOpenImportPopup(false) // Đóng Popup khi cần thiết
  }

  const handleAddPClick = selectedNvrId => {
    setOpenPopupP(true)
    setIdBox(cameraId)
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
      },
      confirmButtonColor: '#FF9F43'
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
            Swal.fire({
              title: 'Thành công!',
              text: 'Xóa thành công',
              icon: 'success',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#FF9F43'
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
                  confirmButton.style.backgroundColor = '#FF9F43'
                  confirmButton.style.color = 'white'
                }
              }
            })
          })
      }
    })
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
          setTotal(response.data.page)
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

  useEffect(() => {
    const ApiProtocol = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: '',
            page: ''
          }
        }

        const response = await axios.get(
          'https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/options/protocol-types',
          config
        )
        setProtocol(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    ApiProtocol()
  }, [])

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
    setIdBox(newValue.value)
  }

  const handleOpenPopup = () => {
    setOpenImportPopup(true)
  }

  useEffect(() => {
    setSelectedNVR({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

  const handleRadioChange = event => {
    const { value } = event.target
    setSelectedValue(value)
    if (event.target.value === 'LoaiGT') {
      setProtocolSelected(true)
    } else {
      setProtocolSelected(false)
    }
    console.log(selectedValue)
  }

  const handleDDNSChangeTitle = (event, newValue) => {
    setSelectedTitle(newValue.name)
  }

  const resetPopupState = () => {
    setResponse(null)
    setIsError(false)
    setPopupMessage('')
    setLoading(false)
  }

  useEffect(() => {
    if (assettypeStatus.length) {
      setAssetType(assettypeStatus)
    }
  }, [assettypeStatus])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Grid container spacing={0} style={{ marginTop: '1%' }}>
            <Grid container spacing={0}>
              <Grid item xs={8}>
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
                        <FormControlLabel value='LoaiGT' control={<Radio />} label='Loại giao thức' />
                      </Grid>
                      <Grid item xs={3}>
                        <Autocomplete
                          fullWidth
                          options={protocol}
                          id='autocomplete-custom'
                          getOptionLabel={option => option.name || ''}
                          renderInput={params => <CustomTextField placeholder='Khác' {...params} />}
                          onChange={handleDDNSChangeTitle}
                          disabled={!protocolSelected}
                        />
                      </Grid>
                    </Grid>
                  </RadioGroup>
                </div>
              </Grid>
              <Grid item xs={4} style={{ display: 'flex' }}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant='contained' onClick={handleOpenPopup}>
                      <Icon icon='tabler:file-import' />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant='contained' onClick={() => setIsOpenAddDevice(true)}>
                      <Icon icon='tabler:square-rounded-plus' />
                    </Button>
                  </Grid>
                  <Grid item>
                    <CustomTextField
                      value={value}
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
              </Grid>
              <Grid item xs={12}>
                {' '}
                {selectedValue === 'dungIp' && selectedAuto !== 'onvif' && selectedAuto !== 'hikvision' && (
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
                      idBox={idBox}
                      setReload={() => setReload(reload + 1)}
                      userName={userName}
                      isError={isError}
                      popupMessage={popupMessage}
                      passWord={passWord}
                      response={response}
                      loadingDungIp={loading}
                      onClose={() => {
                        setOpenPopupResponseDungIP(false)
                        resetPopupState()
                      }}
                    />{' '}
                  </>
                )}
                {selectedValue === 'daiIp' && selectedAuto !== 'onvif' && selectedAuto !== 'hikvision' && (
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
                      idBox={idBox}
                      popupMessage={popupMessage}
                      passWord={passWord}
                      response={response}
                      loadingDaiIP={loading}
                      onClose={() => {
                        setOpenPopupResponse(false)
                        resetPopupState()
                      }}
                    />{' '}
                  </>
                )}
                {selectedValue === 'LoaiGT' && (
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
                        renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>
                    <Grid item xs={0.1}></Grid>

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
                      <Button variant='contained' onClick={handleScanLGT}>
                        Quét
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {openPopupResponseHik && (
                  <>
                    <PopupScanHik
                      open={openPopupResponseHik}
                      userName={userName}
                      setReload={() => setReload(reload + 1)}
                      passWord={passWord}
                      isError={isError}
                      selectedTitle={selectedTitle}
                      idBox={idBox}
                      popupMessage={popupMessage}
                      response={response}
                      loadingOnvif={loading}
                      onClose={() => {
                        setOpenPopupResponseHik(false)
                        resetPopupState()
                      }}
                    />{' '}
                  </>
                )}
              </Grid>
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
                      <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                        {assetType.status && assetType.status.name ? (
                          <div
                            style={{
                              backgroundColor:
                                assetType.status.name === 'connected'
                                  ? 'lightgreen'
                                  : assetType.status.name === 'disconnected'
                                  ? '#FF9F43'
                                  : 'orange',
                              borderRadius: '10px',
                              padding: '5px 10px',
                              width: '70%',
                              display: 'inline-block',
                              color: 'white'
                            }}
                          >
                            {assetType.status.name === 'connected'
                              ? 'Đã kết nối'
                              : assetType.status.name === 'disconnected'
                              ? 'Mất kết nối'
                              : assetType.status.name}
                          </div>
                        ) : (
                          assetType.status.name
                        )}
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
        {isOpenAddDevice && (
          <AddDevice
            show={isOpenAddDevice}
            setReload={() => setReload(reload + 1)}
            onClose={() => setIsOpenAddDevice(false)}
          />
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
      <ImportPopup open={openPopupImport} handleClose={handleClosePopupImport} />
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
