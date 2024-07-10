import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Fade,
  styled,
  TableBody
} from '@mui/material'
import authConfig from 'src/configs/auth'
import { makeStyles } from '@material-ui/core/styles'
import Icon from 'src/@core/components/icon'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddCamera = ({ nvr, onClose }) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const [camera, setCamera] = useState([])
  const [nvrCameraList, setNVRCameraList] = useState([])
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [status1, setStatus1] = useState(25)

  console.log(nvr, 'nvr')

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(
          `https://sbs.basesystem.one/ivis/vms/api/v0/device/${nvr}/cameras?sort=-created_at`,
          config
        )
        setCamera(response.data)
        setStatus1(response.data.status.name || '')
      } catch (error) {
        console.error('Error fetching camera data:', error)
      }
    }

    const fetchGroupDataNVR = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/device/hik?idNVR=${nvr}`, config)
        setNVRCameraList(response.data.cameras)
      } catch (error) {
        console.error('Error fetching NVR data:', error)
      }
    }

    fetchGroupData()
    fetchGroupDataNVR()
  }, [nvr, notification])

  const handleDelete = idDelete => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    if (!token) {
      return
    }
    setLoading(true)

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${idDelete}`
    axios
      .delete(urlDelete, config)
      .then(() => {
        const updatedData = camera.filter(cam => cam.id !== idDelete)
        setCamera(updatedData)
        setNotification({ message: 'Xoá thành công', type: 'success' })
        setLoading(false)
      })
      .catch(err => {
        setNotification({ message: `Xoá thất bại: ${err.message}`, type: 'error' })
        setLoading(false)
      })
  }
  const statusText = status1 ? 'Đang hoạt động' : 'Không hoạt động'

  const handleUpdate = async (id, name) => {
    setLoading(true)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const params = {
        cameras: [
          ...(nvrCameraList && Array.isArray(nvrCameraList) ? nvrCameraList : []),
          {
            id: id,
            name: name
          }
        ],
        box: {
          id: nvr
        }
      }
      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/camera/${nvr}`, params, config)
      setNotification({ message: 'Thêm thành công', type: 'success' })
    } catch (error) {
      setNotification({ message: `Thiết bị chưa phản hồi: ${error.message}`, type: 'error' })
      console.error('Error adding member to group:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.loadingContainer}>
      {loading && <CircularProgress className={classes.circularProgress} />}
      <Grid container spacing={1}>
        <Card>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                  <TableCell sx={{ padding: '16px' }}>Tên camera</TableCell>
                  <TableCell sx={{ padding: '16px' }}>Địa chỉ IP</TableCell>
                  <TableCell sx={{ padding: '16px' }}>Địa chỉ Mac</TableCell>
                  <TableCell sx={{ padding: '16px' }}>Vị trí</TableCell>
                  <TableCell sx={{ padding: '16px' }}>Trạng thái</TableCell>
                  <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(camera) && camera.length > 0 ? (
                  camera.map((camera, index) => (
                    <TableRow key={camera.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{camera.name}</TableCell>
                      <TableCell>{camera.ipAddress}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{camera.location}</TableCell>
                      <TableCell
                        sx={{
                          padding: '16px'
                        }}
                      >
                        <span
                          style={{
                            borderRadius: '10px',
                            padding: '5px 10px',
                            width: '70%',
                            display: 'inline-block',
                            backgroundColor: camera.status === 'connect' ? 'green' : 'orange'
                          }}
                        >
                          {camera.status === 'connect' ? 'Đang hoạt động' : 'Không hoạt động'}
                        </span>
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        <IconButton disabled={loading} onClick={() => handleDelete(camera.id)}>
                          <Icon icon='tabler:trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align='center'>
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>
        </Card>
      </Grid>

      {notification.message && (
        <Box mt={2} textAlign='center' style={{ color: notification.type === 'success' ? '#ff9f43' : 'red' }}>
          {notification.message}
        </Box>
      )}
    </div>
  )
}

const useStyles = makeStyles(() => ({
  loadingContainer: {
    position: 'relative',
    minHeight: '100px', // Đặt độ cao tùy ý
    zIndex: 0
  },
  circularProgress: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999 // Đặt z-index cao hơn so với Grid container
  }
}))

export default AddCamera
