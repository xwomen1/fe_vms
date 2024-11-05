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

const Add = ({
  open,
  response,
  onClose,
  url,
  port,
  idBox,
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

  const fetchGroupDataNVR = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const responsenvr = await axios.get(
        `https://votv.ivms.vn/votv/vms/api/v0/nvrs?sort=%2Bcreated_at&page=1`,
        config
      )
      setSelectedIds(responsenvr.data)
    } catch (error) {
      console.error('Error fetching NVR data:', error)
    }
  }

  useEffect(() => {
    fetchGroupDataNVR()
  }, [])

  useEffect(() => {
    setMessage({ text: popupMessage, type: 'general', error: isError })
  }, [popupMessage, isError])

  const handleCreateNvr = async nvr => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)
      setMessage({ text: '', type: '', error: false })

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      await axios.post(
        `https://votv.ivms.vn/votv/vms/api/v0/nvrs`,
        {
          box: {
            id: idBox
          },
          location: nvr.location,
          name: nvr.name,
          ipAddress: nvr.url,
          macAddress: nvr.macAddress,
          passWord: passWord,
          userName: userName,
          httpPort: nvr.host
        },
        config
      )

      setMessage({ text: 'Data has been updated successfully', type: 'create', error: false })
      setReload()
      fetchGroupDataNVR()
    } catch (error) {
      console.error('Error creating NVR:', error)
      setMessage({ text: `${error.response.data.message}`, type: 'create', error: true })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNvr = async id => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)
      setMessage({ text: '', type: '', error: false })

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      await axios.delete(`https://votv.ivms.vn/votv/vms/api/v0/nvrs/${id}`, config)

      setMessage({ text: 'Deleted successfully', type: 'delete', error: false })
      setReload()
      fetchGroupDataNVR()
    } catch (error) {
      console.error('Error deleting NVR:', error)
      setMessage({ text: `${error.response.data.message}`, type: 'delete', error: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl' style={{ maxWidth: '80%', margin: 'auto' }}>
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Scan NVR</DialogTitle>
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
                    response.map((nvr, index) => {
                      if (nvr.type !== 'NVR') {
                        return null // Ẩn dữ liệu không phải là 'NVR'
                      }

                      const foundNvr =
                        selectedIds?.length > 0 ? selectedIds.find(item => item.macAddress === nvr.macAddress) : null

                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ padding: '16px' }}>{index + 1}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{nvr.name}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{nvr.type}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{nvr.url}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{nvr.macAddress}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{nvr.location}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>{nvr.status}</TableCell>
                          <TableCell sx={{ padding: '16px' }}>
                            {foundNvr ? (
                              <IconButton onClick={() => handleDeleteNvr(foundNvr.id)}>
                                <Icon icon='tabler:minus' />
                              </IconButton>
                            ) : (
                              <IconButton onClick={() => handleCreateNvr(nvr)}>
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
                      <TableCell colSpan={8}>No data</TableCell>
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
