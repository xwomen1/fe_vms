import { useState, useEffect } from 'react'
import {
  Grid,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'
import { callApi, putApi } from 'src/@core/utils/requestUltils'

const AddCamera = ({ nvr, onClose }) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const [camera, setCamera] = useState([])
  const [nvrCameraList, setNVRCameraList] = useState([])
  const [notification, setNotification] = useState({ message: '', type: '' })

  useEffect(() => {
    fetchGroupData();
  }, [nvr])

  const fetchGroupData = async () => {
    setLoading(true)
    try {
      const response = await callApi(
        `https://votv.ivms.vn/votv/vms/api/v0/nvrs/${nvr}/cameras`
      )
      setCamera(response.data)
    } catch (error) {
      console.error('Error fetching camera data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    setLoading(true)
    try {

      const nvrResponse = await callApi(`https://votv.ivms.vn/votv/vms/api/v0/nvrs/${nvr}`)
      const nvrCameras = nvrResponse.data.cameras

      const updatedCameras = nvrCameras.filter(camera => camera.id !== id)

      await putApi(`https://votv.ivms.vn/votv/vms/api/v0/nvrs/${nvr}`, { cameras: updatedCameras })

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

      const params = {
        cameras: [
          ...(nvrCameraList && Array.isArray(nvrCameraList) ? nvrCameraList : []),
          {
            id: id,
            name: name
          }
        ]
      }
      await putApi(`https://votv.ivms.vn/votv/vms/api/v0/nvrs/camera/${nvr}`, params)
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
                    <TableCell>{camera.Name}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{camera.sourceInputPortDescriptor.ipAddress}</TableCell>
                    <TableCell>{camera.sourceInputPortDescriptor.macAddress}</TableCell>
                    <TableCell>{camera.location}</TableCell>
                    <TableCell></TableCell>
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
                          <IconButton disabled={loading} onClick={() => handleDelete(camera.id)}>
                            <Icon icon='tabler:minus' />
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
