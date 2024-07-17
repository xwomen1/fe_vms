import axios from 'axios'
import authConfig from 'src/configs/auth'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import CustomChip from 'src/@core/components/mui/chip'

const AIConfig = () => {
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [cameraGroup, setCameraGroup] = useState([])
  const [alertAIList, setAlertAIList] = useState([])
  const [modelAIList, setModelAIList] = useState([])
  const [dataList, setDataList] = useState([])
  const [reload, setReload] = useState(0)
  const [switchStates, setSwitchStates] = useState({})

  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const columns = [
    {
      id: 1,
      flex: 0.15,
      minWidth: 50,
      align: 'right',
      field: 'image',
      label: 'Hình ảnh'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'right',
      field: 'name',
      label: 'camera'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 120,
      align: 'right',
      field: 'ipAddress',
      label: 'IP'
    },
    {
      id: 4,
      flex: 0.15,
      minWidth: 120,
      align: 'right',
      field: 'location',
      label: 'Khu vực'
    },
    {
      id: 5,
      flex: 0.15,
      minWidth: 50,
      align: 'right',
      field: 'face',
      label: 'Nhận diện khuôn mặt',
      renderCell: row => (
        <Switch
          checked={switchStates[row.id]?.face || false}
          onChange={e => handleSwitchChange(e, row.id, 'face_recognition', row.alert_id, row.isExistFace)}
        />
      )
    },
    {
      id: 6,
      flex: 0.15,
      minWidth: 50,
      align: 'right',
      field: 'licensePlate',
      label: 'Nhận diện biển số',
      renderCell: row => (
        <Switch
          checked={switchStates[row.id]?.licensePlate || false}
          onChange={e => handleSwitchChange(e, row.id, 'license_plate_recognition', row.alert_id, row.isExistLicensePlate)}
        />
      )
    }
  ]

  useEffect(() => {
    fetchCameraGroup()
    handleGetModelAI()
  }, [reload])

  const fetchCameraGroup = async () => {
    try {
      const res = await axios.get(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras?sort=%2Bcreated_at&page=1`,
        config
      )
      setCameraGroup(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const handleGetModelAI = async () => {
    setLoading(true)

    const params = {
      ...config,
      params: {
        sort: '+created_at',
      }
    }

    try {
      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai`, params)
      const list = []
      const face = res.data?.find((item) => item.type === 'face_recognition')
      const licensePlate = res.data?.find((item) => item.type === 'license_plate_recognition')
      list.push(face)
      list.push(licensePlate)
      setModelAIList(list)
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

  const fetchModelAICameras = async (cameraGroup) => {
    if (!cameraGroup) return

    try {
      const promises = cameraGroup.map(async (camera) => {
        const res = await axios.get(
          `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/user/ai-properties/camera/${camera.id}`,
          config
        )

        return res?.data[0]
      })

      const results = await Promise.all(promises)
      setAlertAIList(results)
    } catch (error) {
      console.error('Error fetching data: ', error)
      toast(error.message)
    }
  }

  useEffect(() => {
    fetchModelAICameras(cameraGroup)
  }, [cameraGroup, reload])

  useEffect(() => {
    if (!Array.isArray(alertAIList) || !Array.isArray(cameraGroup)) return;

    const data = cameraGroup.map((camera) => {
      const item = alertAIList.find((alert) => alert?.camera_id === camera?.id);
      if (!item) return camera;

      const licensePlate = item.cameraaiproperty.find((a) => a?.cameraModelAI?.type === 'license_plate_recognition');
      const face = item.cameraaiproperty.find((b) => b?.cameraModelAI?.type === 'face_recognition');

      const alert = {
        alert_id: item?.id || null,
        face: face?.isactive ? item?.id : null,
        isExistFace: face !== undefined ? true : false,
        licensePlate: licensePlate?.isactive ? item?.id : null,
        isExistLicensePlate: licensePlate !== undefined ? true : false
      };

      return { ...camera, ...alert };
    });

    setDataList(data);

    const initialSwitchStates = {};
    data.forEach((item) => {
      initialSwitchStates[item?.id] = {
        face: Boolean(item?.face),
        licensePlate: Boolean(item?.licensePlate),
      };
    });

    setSwitchStates(initialSwitchStates);
  }, [alertAIList, cameraGroup]);


  const handleSwitchChange = (event, cameraId, type, cameraAIPropertyId, isModelExist) => {
    setSwitchStates(prevState => ({
      ...prevState,
      [cameraId]: {
        ...prevState[cameraId],
        [type]: event.target.checked
      }
    }))

    if (cameraAIPropertyId && isModelExist === true) {
      handleUpdateAlertIsActive(cameraAIPropertyId, type)
    }

    if (cameraAIPropertyId && isModelExist === false) {
      handleGetModelAIByCamera(cameraId, cameraAIPropertyId, type)
    }

    if (cameraAIPropertyId === undefined) {
      handleAddAlertIsActive(cameraId, type)
    }

  }

  const handleAddAlertIsActive = async (cameraId, type) => {

    const values = modelAIList.find((model) => model.type === type)

    const params = {
      camera_id: cameraId,
      cameraaiproperty: [
        {
          cameraModelAI: { ...values },
          cameraAiZone: {
            vfences: [],
            vzone: {}
          },
          calendarDays: [],
          isactive: true
        }
      ]
    }

    try {
      await axios.post(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/user/ai-properties`,
        { ...params },
        config
      )
      setReload(reload + 1)
      toast.success('Thao tác thành công')
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

  const handleGetModelAIByCamera = async (cameraId, cameraAIPropertyId, type) => {
    try {
      const res = await axios.get(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/user/ai-properties/camera/${cameraId}`,
        config
      )
      const data = res.data[0].cameraaiproperty
      if (data !== undefined) {
        handleUpdateAlertIsActive2(cameraAIPropertyId, data, type)
      }

    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    }
  }

  const handleUpdateAlertIsActive2 = async (cameraAIPropertyId, data, type) => {
    const values = modelAIList.find((model) => model.type === type)

    const params = {
      cameraaiproperty: [
        ...data,
        {
          cameraModelAI: { ...values },
          cameraAiZone: {
            vfences: [],
            vzone: {}
          },
          calendarDays: [],
          isactive: true
        }
      ]
    }

    try {
      await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/user/ai-properties/${cameraAIPropertyId}`,
        { ...params },
        config
      )
      setReload(reload + 1)
      toast.success('Thao tác thành công')
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

  const handleUpdateAlertIsActive = async (alertId, type) => {
    const alert = alertAIList.find((alert) => alert?.id === alertId)

    const changedAlerts = alert?.cameraaiproperty?.map(alert => {
      return alert?.cameraModelAI?.type === type ? { ...alert, isactive: !alert.isactive } : alert
    })

    const params = {
      cameraaiproperty: [...changedAlerts]
    }

    try {
      await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/user/ai-properties/${alertId}`,
        { ...params },
        config
      )
      setReload(reload + 1)
      toast.success('Thao tác thành công')
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

  const handlePageChange = newPage => {
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

  return (
    <Card>
      <CardHeader title='Cấu hình AI' />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell align='right'>STT</TableCell>
                  {columns.map(column => (
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align='right'>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList.slice(0, pageSize).map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell align='right'>{index + 1}</TableCell>
                      {columns.map(column => {
                        const value = row[column.field]

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.renderCell ? column.renderCell(row) : value}
                          </TableCell>
                        )
                      })}
                      <TableCell align='right'>
                        <CustomChip
                          rounded
                          size='small'
                          skin='light'
                          sx={{ lineHeight: 1 }}
                          color={row.status.name === 'disconnected' ? 'primary' : 'success'}
                          label={row.status.name}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <br />
        <Grid item xs={12}>
          <Grid container spacing={2} style={{ padding: 10 }}>
            <Grid item xs={3}></Grid>
            <Grid item xs={1}>
              <span style={{ fontSize: 15 }}> dòng/trang</span>
            </Grid>
            <Grid item xs={1} style={{ padding: 0 }}>
              <Box>
                <Button onClick={handleOpenMenu} endIcon={<Icon icon='tabler:selector' />}>
                  {pageSize}
                </Button>
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
              <Pagination
                count={total}
                page={page}
                color='primary'
                onChange={(event, page) => handlePageChange(page)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default AIConfig
