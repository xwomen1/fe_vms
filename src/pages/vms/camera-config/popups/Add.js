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
import Grid from '@mui/system/Unstable_Grid/Grid'
import TableCell from '@mui/material/TableCell'
import Icon from 'src/@core/components/icon'
import TableBody from '@mui/material/TableBody'
import httpStatusMessages from 'src/message'

const Add = ({
  open,
  response,
  onClose,
  url,
  idBoxDaiIP,
  port,
  userName,
  passWord,
  loadingDaiIP,
  setReload,
  isError,
  popupMessage,
  idBox
}) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: popupMessage, type: 'general', error: isError })
  console.log(idBox, 'idbox')

  const fetchGroupDataCamera = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const responsecamera = await axios.get(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras?sort=%2Bcreated_at&page=1`,
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

  const handleCreateCamera = async camera => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)
      setMessage({ text: '', type: '', error: false })

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras`,
        {
          box: {
            id: idBoxDaiIP
          },
          location: camera.location,
          name: camera.name,
          ipAddress: camera.url,
          macAddress: camera.macAddress,
          passWord: passWord,
          userName: userName,
          httpPort: camera.host,
          box: {
            id: idBox.value
          }
        },
        config
      )

      const message = httpStatusMessages[response.status] || [response.data.message]
      console.log(response.message)
      setMessage({ text: message, type: 'create', error: false })

      setReload()
      fetchGroupDataCamera()
    } catch (error) {
      console.error('Error creating Camera:', error)
      if (error.response) {
        setMessage({ text: `${error.response.data.message}`, type: 'create', error: true })
      } else {
        setMessage({ text: 'Network error or server is not responding', type: 'create', error: true })
      }
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

      await axios.delete(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${id}`, config)

      setMessage({ text: 'Xóa thành công', type: 'delete', error: false })
      setReload()
      fetchGroupDataCamera()
    } catch (error) {
      console.error('Error deleting Camera:', error)
      setMessage({ text: `${error.response.data.message}`, type: 'delete', error: true })
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setSelectedIds([])
    setLoading(false)
    setMessage({ text: '', type: 'general', error: false })
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  useEffect(() => {
    if (open) {
      response == ''
      resetState()
      fetchGroupDataCamera()
    }
  }, [open])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xl' style={{ maxWidth: '80%', margin: 'auto' }}>
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Quét Camera</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          {loadingDaiIP && <CircularProgress style={{ marginLeft: '50%' }} />}
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tên thiết bị</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Loại thiết bị</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Địa chỉ IP</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Địa chỉ Mac</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Vị trí</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Trạng thái</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {response && response.length > 0 ? (
                    response.map((camera, index) => {
                      if (camera.type === 'NVR') {
                        return null
                      }

                      const foundcamera = selectedIds.find(item => item.macAddress === camera.macAddress)

                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ padding: '16px' }}>{index + 1}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.name}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.type}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.url}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.macAddress}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.location}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{camera.status}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>
                            {foundcamera ? (
                              <IconButton onClick={() => handleDeleteCamera(foundcamera.id)}>
                                <Icon icon='tabler:minus' />
                              </IconButton>
                            ) : (
                              <IconButton onClick={() => handleCreateCamera(camera)}>
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
                      <TableCell colSpan={9}>Không có dữ liệu</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {message.type === 'general' && (
                <Box style={{ color: message.error ? 'red' : '#ff9f43', textAlign: 'center' }}>{message.text}</Box>
              )}
              {message.type === 'create' && (
                <Box style={{ color: message.error ? 'red' : '#ff9f43', textAlign: 'center' }}>{message.text}</Box>
              )}
              {message.type === 'delete' && (
                <Box style={{ color: message.error ? 'red' : '#ff9f43', textAlign: 'center' }}>{message.text}</Box>
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='contained'>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Add
