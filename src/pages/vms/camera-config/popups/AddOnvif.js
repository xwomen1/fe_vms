import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  Box,
  TableRow,
  IconButton,
  CircularProgress
} from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import CustomChip from 'src/@core/components/mui/chip'
import Grid from '@mui/system/Unstable_Grid/Grid'
import TableCell from '@mui/material/TableCell'
import Icon from 'src/@core/components/icon'
import TableBody from '@mui/material/TableBody'

const Add = ({
  open,
  response,
  onClose,
  url,
  port,
  idBoxOnvif,
  userName,
  passWord,
  loadingOnvif,
  setReload,
  isError,
  popupMessage
}) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: popupMessage, type: 'general', error: isError })

  const fetchGroupDataCamera = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const responsecamera = await axios.get(
        `https://votv.ivms.vn/votv/vms/api/v0/cameras?sort=%2Bcreated_at&page=1`,
        config
      )
      setSelectedIds(responsecamera.data)
    } catch (error) {
      console.error('Error fetching Camera data:', error)
    }
  }

  useEffect(() => {
    fetchGroupDataCamera()
  }, [])

  useEffect(() => {
    setMessage({ text: popupMessage, type: 'general', error: isError })
  }, [popupMessage, isError])

  const handleCreateCammera = async camera => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)
      setMessage({ text: '', type: '', error: false })

      // Xác thực các trường đầu vào
      if (
        !camera.location ||
        !camera.name ||
        !camera.url ||
        !camera.macAddress ||
        !camera.host ||
        !passWord ||
        !userName
      ) {
        setMessage({ text: 'Tất cả các trường đều bắt buộc', type: 'create', error: true })
        setLoading(false)

        return
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      await axios.post(
        `https://votv.ivms.vn/votv/vms/api/v0/cameras`,
        {
          box: {
            id: idBoxOnvif
          },
          location: camera.location,
          name: camera.name,
          ipAddress: camera.url,
          macAddress: camera.macAddress,
          passWord: passWord,
          userName: userName,
          httpPort: camera.host
        },
        config
      )

      setMessage({ text: 'Data has been updated successfully', type: 'create', error: false })
      setReload()
      fetchGroupDataCamera()
    } catch (error) {
      console.error('Error creating Camera:', error)
      setMessage({ text: `${error.response.data.message}`, type: 'create', error: true })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCamera = async id => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)
      setMessage({ text: '', type: '', error: false })

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      await axios.delete(`https://votv.ivms.vn/votv/vms/api/v0/cameras/${id}`, config)

      setMessage({ text: 'Deleted successfully', type: 'delete', error: false })
      setReload()
      fetchGroupDataCamera()
    } catch (error) {
      console.error('Error deleting Camera:', error)
      setMessage({ text: `${error.response.data.message}`, type: 'delete', error: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl' style={{ maxWidth: '80%', margin: 'auto' }}>
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Scan Camera </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          {loadingOnvif && <CircularProgress style={{ marginLeft: '50%' }} />}
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>NO.</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Device Name</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Device type</TableCell>
                    <TableCell sx={{ padding: '16px' }}>IP Address</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Mac Address</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Location</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Status</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Active</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {response && response.length > 0 ? (
                    response.map((camera, index) => {
                      if (camera.type === 'NVR') {
                        return null
                      }

                      const foundcamera = selectedIds.find(item => item.macAddress === camera.macAddress)

                      console.log(foundcamera, 'foundcamera')

                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ padding: '16px' }}>{index + 1}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.name}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.type}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.url}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.macAddress}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.location}</TableCell>
                          <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                            {camera.status ? (
                              <div>
                                <CustomChip
                                  rounded
                                  size='small'
                                  skin='light'
                                  sx={{ lineHeight: 1 }}
                                  label={camera.status === 'disconnected' ? 'Lost connection' : 'Connected'}
                                  color={camera.status === 'disconnected' ? 'primary' : 'success'}
                                />
                              </div>
                            ) : (
                              camera.status
                            )}
                          </TableCell>
                          <TableCell sx={{ padding: '16px' }}>
                            {foundcamera ? (
                              <IconButton onClick={() => handleDeleteCamera(foundcamera.id)}>
                                <Icon icon='tabler:minus' />
                              </IconButton>
                            ) : (
                              <IconButton onClick={() => handleCreateCammera(camera)}>
                                <Icon icon='tabler:plus' />
                              </IconButton>
                            )}
                            {loading && <CircularProgress style={{ marginLeft: '10%' }} />}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9}>No data</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {message.type === 'general' && (
                <Box style={{ color: message.error ? 'red' : '#002060', textAlign: 'center' }}>{message.text}</Box>
              )}
              {message.type === 'create' && (
                <Box style={{ color: message.error ? 'red' : '#002060', textAlign: 'center' }}>{message.text}</Box>
              )}
              {message.type === 'delete' && (
                <Box style={{ color: message.error ? 'red' : '#002060', textAlign: 'center' }}>{message.text}</Box>
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Add
