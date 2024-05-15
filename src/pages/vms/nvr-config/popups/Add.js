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
  TableRow,
  IconButton,
  Checkbox
} from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'

import Grid from '@mui/system/Unstable_Grid/Grid'
import TableCell from '@mui/material/TableCell'
import Icon from 'src/@core/components/icon'
import TableBody from '@mui/material/TableBody'
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress'

const Add = ({ open, response, onClose, url, port, userName, passWord, loadings, setReload }) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(false)
  console.log(response, 'res')

  console.log('url' + url, ' port' + port, 'username' + userName, 'password' + passWord)

  const fetchGroupDataNVR = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const responsenvr = await axios.get(
        `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs?sort=%2Bcreated_at&page=1`,
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

  const handleCreateNvr = async nvr => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs`,
        {
          location: nvr.location,
          name: nvr.name,
          ipAddress: nvr.url,
          macAddress: nvr.macAddress,

          // type: nvr.type,

          // [Todo][Hue][07May24]: check type bet scan result and create
          // status: nvr.status,
          passWord: passWord,
          userName: userName,
          httpPort: nvr.host
        },
        config
      )
      setReload()
      setLoading(false)
      onClose()

      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
    } catch (error) {
      console.error('Error updating user details:', error)
      setLoading(false)
      onClose()

      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
    }
  }

  const handleDelete = async id => {
    setLoading(true)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      await axios.delete(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${id}`, config)

      Swal.fire('Xóa camera thành công', '', 'success')
      setReload()
    } catch (error) {
      Swal.fire('Đã xảy ra lỗi', error.message, 'error')
      console.error('Error deleting camera:', error)
    } finally {
      onClose()
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='x1' style={{ maxWidth: '80%', margin: 'auto' }}>
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Quét nvr</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
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
                    response.map((nvr, index) => {
                      const foundNvr = selectedIds.find(item => item.macAddress === nvr.macAddress)

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
                              <IconButton onClick={() => handleDelete(foundNvr.id)}>
                                {' '}
                                {/* Truyền id của nvr */}
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
                      <TableCell colSpan={9}>Không có dữ liệu</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Add
