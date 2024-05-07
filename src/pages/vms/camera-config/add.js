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
import { Autocomplete, Button, FormControl, IconButton, InputLabel, Paper, Select } from '@mui/material'
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
import PopupScan from './popups/Add'

const Add = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupP, setOpenPopupP] = useState(false)
  const [selectNVR, setSelectedNVR] = useState('')

  const [openPopupNetwork, setOpenPopupNetwork] = useState(false)
  const [openPopupVideo, setOpenPopupVideo] = useState(false)
  const [openPopupImage, setOpenPopupImage] = useState(false)
  const [openPopupCloud, setOpenPopupCloud] = useState(false)
  const [openPopupConnectCamera, setOpenPopupConnectCamera] = useState(false)
  const [openPopupVideoConnectCamera, setOpenPopupVideoConnectCamera] = useState(false)
  const [assettype, setAssetType] = useState([])
  const [nvrs, setNVR] = useState([])

  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [status1, setStatus1] = useState(25)

  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedValue, setSelectedValue] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [port, setPort] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState('')
  const [openPopupResponse, setOpenPopupResponse] = useState(false)

  const fetchNicTypes = async () => {
    try {
      // setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/nvrs', config)

      const nicTypes = response.data.data.map(item => ({
        label: item.name,
        value: item.value
      }))
      setNVR(nicTypes)

      // Set selectedNicType here based on your business logic
      if (nicTypes.length > 0) {
        setSelectedNVR(nicTypes[0].value) // Set it to the first value in the array, or adjust as needed
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
    setOpenPopupResponse(true)

    try {
      const payload = {
        ipAddress,
        port,
        username,
        password
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
      toast.success('Thành công')

      setOpenPopupResponse(true)
    } catch (error) {
      console.error('Error scanning device:', error)
      Swal.fire('Đã xảy ra lỗi', error.response.statusText, 'error')
    }
  }

  const handleRadioChange = event => {
    setSelectedValue(event.target.value)
    console.log(selectedValue)
  }

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

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

  const handleAddPClick = () => {
    setOpenPopupP(true)
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

  const handleDDNSChange = (event, newValue) => {
    setSelectedNVR(newValue)
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
        setStatus1(response.data.data.isOfflineSetting)
        setAssetType(response.data.data)
        setTotal(response.data.data.page)
        console.log(response.data.data[0].id)
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
                  <FormControlLabel value='onvif' control={<Radio />} label='ON VIF' />
                </Grid>
                <Grid item>
                  <FormControlLabel value='khac' control={<Radio />} label='Khác' />
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
                    renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />}
                    onFocus={handleComboboxFocus}

                    // loading={loading}
                  />{' '}
                </Grid>
                <Grid item xs={0.1}></Grid>

                <Grid item xs={1.8}>
                  <CustomTextField
                    value={ipAddress}
                    onChange={e => setIpAddress(e.target.value)}
                    label='Địa chỉ IP'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={0.1}></Grid>
                <Grid item xs={1.8}>
                  <CustomTextField value={port} onChange={e => setPort(e.target.value)} label='Cổng' fullWidth />
                </Grid>
                <Grid item xs={0.1}></Grid>
                <Grid item xs={1.8}>
                  <CustomTextField
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    label='Đăng nhập'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={0.1}></Grid>
                <Grid item xs={1.8}>
                  <CustomTextField
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
              </Grid>
            )}
            {openPopupResponse && (
              <>
                <PopupScan open={openPopupResponse} response={response} onClose={() => setOpenPopupResponse(false)} />{' '}
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
                  <Autocomplete renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />} />
                </Grid>
                <Grid item xs={0.1}></Grid>

                <Grid item xs={2}>
                  <CustomTextField label='Địa chỉ IP bắt đầu' fullWidth />
                </Grid>
                <Grid item xs={0.2}></Grid>

                <Grid item xs={0.4} style={{ marginTop: '2%' }}>
                  ----
                </Grid>
                <Grid item xs={2}>
                  <CustomTextField label='Địa chỉ IP kết thúc' fullWidth />
                </Grid>
                <Grid item xs={0.2}></Grid>

                <Grid item xs={2}>
                  <CustomTextField label='Cổng bắt đầu' fullWidth />
                </Grid>
                <Grid item xs={0.2}></Grid>

                <Grid item xs={0.4} style={{ marginTop: '2%' }}>
                  ----
                </Grid>
                <Grid item xs={2}>
                  <CustomTextField label='Cổng kết thúc' fullWidth />
                </Grid>
                <Grid item xs={2}>
                  <CustomTextField label='Đăng nhập' fullWidth />
                </Grid>
                <Grid item xs={0.4}></Grid>
                <Grid item xs={2}>
                  <CustomTextField label='Mật khẩu' type='password' fullWidth />
                </Grid>
                <Grid item xs={0.2}></Grid>

                <Grid item xs={4} style={{ marginTop: '2%' }}>
                  <Button>Cancel</Button>
                  <Button variant='contained'>Quét</Button>
                </Grid>
              </Grid>
            )}
            {selectedValue === 'onvif' && (
              <Grid
                container
                item
                component={Paper}
                style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
              >
                <Grid item xs={1.8}>
                  <Autocomplete renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />} />
                </Grid>
                <Grid item xs={0.1}></Grid>

                <Grid item xs={2}>
                  <CustomTextField label='Đăng nhập' fullWidth />
                </Grid>
                <Grid item xs={0.4}></Grid>
                <Grid item xs={2}>
                  <CustomTextField label='Mật khẩu' type='password' fullWidth />
                </Grid>
                <Grid item xs={0.2}></Grid>

                <Grid item xs={4} style={{ marginTop: '2%' }}>
                  <Button>Cancel</Button>
                  <Button variant='contained'>Quét</Button>
                </Grid>
              </Grid>
            )}
            {selectedValue === 'khac' && (
              <Grid
                container
                item
                component={Paper}
                style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
              >
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel id='time-validity-label'>Chọn</InputLabel>
                    <Select labelId='time-validity-label' id='time-validity-select'>
                      <MenuItem value='Custom'>Dahua</MenuItem>
                      <MenuItem value='Undefined'>Hikvision</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={0.4}></Grid>
                <Grid item xs={1.8}>
                  <Autocomplete renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />} />
                </Grid>
                <Grid item xs={0.1}></Grid>

                <Grid item xs={2}>
                  <CustomTextField label='Đăng nhập' fullWidth />
                </Grid>
                <Grid item xs={0.4}></Grid>
                <Grid item xs={2}>
                  <CustomTextField label='Mật khẩu' type='password' fullWidth />
                </Grid>
                <Grid item xs={0.2}></Grid>

                <Grid item xs={3} style={{ marginTop: '2%' }}>
                  <Button>Cancel</Button>
                  <Button variant='contained'>Quét</Button>
                </Grid>
              </Grid>
            )}
          </div>
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
                      <TableCell sx={{ padding: '16px' }}>{statusText}</TableCell>

                      <TableCell sx={{ padding: '16px' }}>
                        <Grid container spacing={2}>
                          <IconButton size='small' onClick={handleAddPClick}>
                            <Icon icon='tabler:key' />
                          </IconButton>
                          <IconButton size='small' onClick={handleAddVideoConnectClick}>
                            <Icon icon='tabler:camera' />
                          </IconButton>
                          <IconButton size='small' onClick={handleAddConnectCameraClick}>
                            <Icon icon='tabler:link' />
                          </IconButton>
                          <IconButton size='small' sx={{ color: 'text.secondary' }}>
                            <Icon icon='tabler:reload' />
                          </IconButton>
                        </Grid>
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
        {selectedIds.length > 0 && (
          <>
            <RolePopup open={openPopup} onClose={handleClosePopup} camera={selectedIds} />
            <Network open={openPopupNetwork} onClose={handleCloseNetWorkPopup} camera={selectedIds} />
            <Video open={openPopupVideo} onClose={handleCloseVideoPopup} camera={selectedIds} />
            <Image open={openPopupImage} onClose={handleCloseImagePopup} camera={selectedIds} />
            <Cloud open={openPopupCloud} onClose={handleCloseCloudPopup} camera={selectedIds} />
          </>
        )}
        <Passwords open={openPopupP} onClose={handleClosePPopup} camera={selectedIds} />

        <ConnectCamera open={openPopupConnectCamera} onClose={handleCloseConnectCameraPopup} camera={selectedIds} />
        <VideoConnectCamera
          open={openPopupVideoConnectCamera}
          onClose={handleCloseVideoConnectPopup}
          camera={selectedIds}
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

export default Add
