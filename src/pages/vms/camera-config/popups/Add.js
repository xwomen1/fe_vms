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

const Add = ({ open, response, onClose, url, port, userName, passWord }) => {
  const [selectedIds, setSelectedIds] = useState([])
  console.log('url' + url, ' port' + port, 'username' + userName, 'password' + passWord)

  const handleCreateCamera = async camera => {
    onClose()
    console.log('camera name', camera.name)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras`,
        {
          location: camera.location,
          name: camera.name,
          ipAddress: camera.url,
          macAddress: camera.macAddress,

          // type: camera.type,

          // [Todo][Hue][07May24]: check type bet scan result and create
          // status: camera.status,
          passWord: passWord,
          userName: userName,
          httpPort: camera.host
        },
        config
      )
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
    }
  }

  // const handleCreateCamera = async camera => {
  //   try {
  //     const response = await fetch('https://sbs.basesystem.one/ivis/vms/api/v0/camerass', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',

  //         // Assuming you need to authenticate with username and password
  //         Authorization: `Basic ${btoa(`${username}:${password}`)}`
  //       },
  //       body: JSON.stringify({
  //         ipAddress: camera.ipAddress,
  //         port: camera.port

  //         // Other parameters you need to send
  //       })
  //     })

  //     if (response.ok) {
  //       const newCamera = await response.json()

  //       // Update UI with new camera, you can add it to your response data array or update state
  //       // Example: response.data.push(newCamera);
  //       // Or update state with new data
  //     } else {
  //       // Handle error if needed
  //       console.error('Failed to create camera:', response.statusText)
  //     }
  //   } catch (error) {
  //     console.error('Error creating camera:', error)
  //   }
  // }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='x1' style={{ maxWidth: '80%', margin: 'auto' }}>
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Quét Camera</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tên Camera</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Loại</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Địa chỉ IP</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Địa chỉ Mac</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Vị trí</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Trạng thái</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {response.data && response.data.length > 0 ? (
                    response.data.map((camera, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ padding: '16px' }}>{index + 1}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{camera.name}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{camera.type}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{camera.url}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{camera.macAddress}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{camera.location}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{camera.status}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>
                          <IconButton size='small' onClick={() => handleAddPClick(camera.macAddress)}>
                            <Icon icon='tabler:edit' />
                          </IconButton>
                          <IconButton size='small' onClick={() => handleAddPClick(camera.macAddress)}>
                            <Icon icon='tabler:camera' />
                          </IconButton>
                          <IconButton onClick={() => handleCreateCamera(camera)}>
                            <Icon icon='tabler:plus' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
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
