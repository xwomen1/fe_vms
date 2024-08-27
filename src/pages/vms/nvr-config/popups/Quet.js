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
import CustomChip from 'src/@core/components/mui/chip'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'

const AddCamera = ({ nvr, onClose }) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const [camera, setCamera] = useState([])
  const [nvrCameraList, setNVRCameraList] = useState([])
  const [notification, setNotification] = useState({ message: '', type: '' })

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
          'https://sbs.basesystem.one/ivis/vms/api/v0/cameras?sort=%2Bcreated_at&page=1',
          config
        )
        setCamera(response.data)
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

        const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`, config)
        setNVRCameraList(response.data.cameras)
      } catch (error) {
        console.error('Error fetching NVR data:', error)
      }
    }

    fetchGroupData()
    fetchGroupDataNVR()
  }, [nvr, notification])

  const handleDelete = async id => {
    setLoading(true)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const nvrResponse = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`, config)
      const nvrCameras = nvrResponse.data.cameras

      const updatedCameras = nvrCameras.filter(camera => camera.id !== id)

      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`, { cameras: updatedCameras }, config)

      setNotification({ message: 'Deleted successfully', type: 'success' })
    } catch (error) {
      setNotification({ message: `An error occurred: ${error.message}`, type: 'error' })
      console.error('Error deleting camera:', error)
    } finally {
      setLoading(false)
    }
  }

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
        ]
      }
      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/camera/${nvr}`, params, config)
      setNotification({ message: 'Added successfully', type: 'success' })
    } catch (error) {
      setNotification({ message: `Device not responding: ${error.message}`, type: 'error' })
      console.error('Error adding member to group:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.loadingContainer}>
      {loading && <CircularProgress className={classes.circularProgress} />}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: '16px' }}>NO.</TableCell>
                <TableCell sx={{ padding: '16px' }}>Camera Name</TableCell>
                <TableCell sx={{ padding: '16px' }}>Device Type</TableCell>
                <TableCell sx={{ padding: '16px' }}>IP Address</TableCell>
                <TableCell sx={{ padding: '16px' }}>Connect NVR/AI Box </TableCell>
                <TableCell sx={{ padding: '16px' }}>Mac Address</TableCell>
                <TableCell sx={{ padding: '16px' }}>Location</TableCell>
                <TableCell sx={{ padding: '16px' }}>Status</TableCell>
                <TableCell sx={{ padding: '16px' }}>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(camera) && camera.length > 0 ? (
                camera.map((camera, index) => (
                  <TableRow key={camera.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{camera.name}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{camera.ipAddress}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{camera.location}</TableCell>
                    <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                      {camera.status.name ? (
                        <div>
                          <CustomChip
                            rounded
                            size='small'
                            skin='light'
                            sx={{ lineHeight: 1 }}
                            label={camera.status.name === 'disconnected' ? 'Lost connection' : 'Connected'}
                            color={camera.status.name === 'disconnected' ? 'primary' : 'success'}
                          />
                        </div>
                      ) : (
                        camera.status.name
                      )}
                    </TableCell>
                    <TableCell sx={{ padding: '16px' }}>
                      <Grid container spacing={2}>
                        {Array.isArray(nvrCameraList) && nvrCameraList.length > 0 ? (
                          nvrCameraList.some(nvrCamera => nvrCamera.id === camera.id) ? (
                            <IconButton disabled={loading} onClick={() => handleDelete(camera.id)}>
                              <Icon icon='tabler:minus' />
                            </IconButton>
                          ) : (
                            <IconButton disabled={loading} onClick={() => handleUpdate(camera.id, camera.name)}>
                              <Icon icon='tabler:plus' />
                            </IconButton>
                          )
                        ) : (
                          <IconButton disabled={loading} onClick={() => handleUpdate(camera.id, camera.name)}>
                            <Icon icon='tabler:plus' />
                          </IconButton>
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {notification.message && (
            <div style={{ color: notification.type === 'success' ? '#002060' : 'red', textAlign: 'center' }}>
              {notification.message}
            </div>
          )}
        </Grid>
      </Grid>
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
