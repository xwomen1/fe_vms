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
import { Box, Autocomplete, Button, FormControl, IconButton, InputLabel, Paper, Select } from '@mui/material'
import Swal from 'sweetalert2'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import RolePopup from './popups/ChangePassword'
import Passwords from './popups/PassWord'
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import toast from 'react-hot-toast'

import Network from './popups/Network'
import Video from './popups/video'
import Image from './popups/Image'
import Checkbox from '@mui/material/Checkbox'
import Cloud from './popups/Cloud'
import ConnectCamera from './popups/ConnectCamera'
import VideoConnectCamera from './popups/VideoConnectCamera'
import PopupScanOnvif from './popups/AddOnvif'
import PopupScanHik from './popups/AddHik'
import PopupScanDungIP from './popups/AddDungIP'
import PopupScan from './popups/Add'
import CircularProgress from '@mui/material/CircularProgress'
import Edit from './popups/Edit'
import CustomDialog from '../../pages/face_management/CustomDialog/CustomDialog'
import ImportPopup from './popups/ImportPopup'
import AddDevice from './popups/AddDevice'

const Add = ({ apiData, assettypeStatus }) => {
  const [value, setValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupP, setOpenPopupP] = useState(false)
  const [selectNVR, setSelectedNVR] = useState('')
  const defaultValue = ''
  const [endURL, setEndUrl] = useState('')
  const [assettype, setAssetType] = useState([])
  const [protocol, setProtocol] = useState([])
  const [nvrs, setNVR] = useState([])
  const [protocolSelected, setProtocolSelected] = useState(false)
  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [status1, setStatus1] = useState(25)
  const [startURL, setStartUrl] = useState('')
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedValue, setSelectedValue] = useState('')
  const [selectedAuto, setSelectedAuto] = useState('')
  const [startHost, setStartHost] = useState('')
  const [endHost, setEndHost] = useState('')
  const [openPopupResponseDungIP, setOpenPopupResponseDungIP] = useState(false)
  const [url, setUrl] = useState('')
  const [reload, setReload] = useState(0)
  const [host, setHost] = useState('')
  const [userName, setUsername] = useState('')
  const [passWord, setPassWord] = useState('')
  const [response, setResponse] = useState('')
  const [openPopupResponse, setOpenPopupResponse] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedNvrId, setSelectedNvrId] = useState(null)
  const [idBox, setIdBox] = useState(null)
  const [idBoxs, setIdBoxs] = useState(selectNVR?.value)
  const [selectedTitle, setSelectedTitle] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [openPopupResponseOnvif, setOpenPopupResponseOnvif] = useState(false)
  const [openPopupResponseHik, setOpenPopupResponseHik] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogMessage, setDialogMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isOpenAddDevice, setIsOpenAddDevice] = useState(false)

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
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
        actions: 'swal-actions'
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton()
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#ff9f43'
        }
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

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
        setPopupMessage(`${error.message}`)
      }

      // // setOpenPopupResponseDungIP(false)
      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
  }

  const handleRadioChange = event => {
    setSelectedValue(event.target.value)
    if (event.target.value === 'LoaiGT') {
      setProtocolSelected(true)
    } else {
      setProtocolSelected(false)
    }
    console.log(selectedValue)
  }

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  // const handleCheckboxChange = id => {
  //   const isSelected = selectedIds.includes(id)
  //   if (isSelected) {
  //     setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
  //     setSelectedNvrId(null)
  //   } else {
  //     setSelectedIds([...selectedIds, id])
  //     setSelectedNvrId(id)
  //   }
  // }
  const handleOpenPopup = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
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
            setDialogTitle('Xóa camera thành công')
            setIsSuccess(true)
            const updatedData = assettype.filter(assettype => assettype.id !== idDelete)
            setAssetType(updatedData)
            fetchFilteredOrAllUsers()
          })
          .catch(err => {
            setDialogTitle('xóa không thành công')
            setDialogMessage(err.message || 'xóa không thành công')
            setIsSuccess(false)
          })
          .finally(() => {
            setLoading(false)
            setDialogOpen(true)
          })
      }
    })
  }

  const handleAddPClick = cameraId => {
    setOpenPopupP(true)
    setIdBox(cameraId)
    setSelectedNvrId(cameraId)
  }

  const handleClosePPopup = () => {
    setOpenPopupP(false)
  }

  const handleCloseNetWorkPopup = () => {
    setOpenPopupNetwork(false)
  }

  const handleCloseVideoPopup = () => {
    setOpenPopupVideo(false)
  }

  const handleCloseImagePopup = () => {
    setOpenPopupImage(false)
  }

  const handleCloseCloudPopup = () => {
    setOpenPopupCloud(false)
  }

  const handleAddConnectCameraClick = () => {
    setOpenPopupConnectCamera(true)
  }

  const handleCloseConnectCameraPopup = () => {
    setOpenPopupConnectCamera(false)
  }

  const handleAddVideoConnectClick = () => {
    setOpenPopupVideoConnectCamera(true)
  }

  const handleCloseVideoConnectPopup = () => {
    setOpenPopupVideoConnectCamera(false)
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    setSelectedNVR({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
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

  const handleScanDaiIP = async () => {
    setOpenPopupResponse(true)
    setLoading(true)
    setPopupMessage('')
    setIsError(false)
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
        setPopupMessage(`${error.message}`)
      }

      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
  }

  const passwords = useCallback(val => {
    setValue(val)
  }, [])

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
          'https://sbs.basesystem.one/ivis/vms/api/v0/cameras/options/protocol-types',
          config
        )
        setProtocol(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    ApiProtocol()
  }, [])

  const handleDDNSChange = (event, newValue) => {
    setSelectedNVR(newValue)
    setIdBox(newValue.value)
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
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Grid container spacing={2} style={{ marginTop: '1%' }}>
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
                        renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>
                    <Grid item xs={0.1}></Grid>

                    <Grid item xs={1.8}>
                      <CustomTextField
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        label='Địa chỉ IP'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={1.8}>
                      <CustomTextField value={host} onChange={e => setHost(e.target.value)} label='Cổng' fullWidth />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={1.8}>
                      <CustomTextField
                        value={userName}
                        onChange={e => setUsername(e.target.value)}
                        label='Đăng nhập'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={1.8}>
                      <CustomTextField
                        value={passWord}
                        onChange={e => setPassWord(e.target.value)}
                        label='Mật khẩu'
                        type='password'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={2} style={{ marginTop: '2%' }}>
                      <Button>Cancel</Button>
                      <Button onClick={handleScan} variant='contained'>
                        Quét
                      </Button>
                    </Grid>
                    {loading && <CircularProgress />}
                  </Grid>
                )}
                {openPopupResponseDungIP && (
                  <>
                    <PopupScanDungIP
                      open={openPopupResponseDungIP}
                      url={url}
                      idBoxDungIP={idBox}
                      port={host}
                      setReload={() => setReload(reload + 1)}
                      userName={userName}
                      isError={isError}
                      popupMessage={popupMessage}
                      passWord={passWord}
                      response={response}
                      loadings={loading}
                      onClose={() => {
                        setOpenPopupResponseDungIP(false)
                        resetPopupState()
                      }}
                    />{' '}
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
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
                      idBox={selectNVR}
                      setReload={() => setReload(reload + 1)}
                      isError={isError}
                      idBoxDaiIP={idBox}
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
              </Grid>
              <Grid item xs={12}>
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
                        autoComplete='new-password' // Thay đổi giá trị thành 'new-password'
                        form='off'
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
                        autoComplete='new-password' // Thay đổi giá trị thành 'new-password'
                        form='off'
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
                      selectedTitle={selectedTitle}
                      setReload={() => setReload(reload + 1)}
                      passWord={passWord}
                      isError={isError}
                      popupMessage={popupMessage}
                      idBoxOnvif={idBox}
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
            </Grid>
            <Grid container spacing={2}>
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
        </Grid>
        {openPopupP && (
          <>
            <Edit open={openPopupP} onClose={handleClosePPopup} camera={selectedNvrId} />
          </>
        )}
        {isOpenAddDevice && (
          <AddDevice
            show={isOpenAddDevice}
            setReload={() => setReload(reload + 1)}
            onClose={() => setIsOpenAddDevice(false)}
          />
        )}
      </Grid>
      <ImportPopup open={openPopup} handleClose={handleClosePopup} />
      <CustomDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        title={dialogTitle}
        message={dialogMessage}
        isSuccess={isSuccess}
      />
    </>
  )
}

export default Add
