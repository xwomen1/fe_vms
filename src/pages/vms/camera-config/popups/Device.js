import React, { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Autocomplete,
  Button,
  Checkbox,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'

const PassWord = ({ onClose, camera }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [groupOptions, setGroupOptions] = useState([])

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
  }

  const handleAddRow = () => {
    const newRow = { groupName: '', groupCode: '', groupId: '' } // Thêm groupId vào đây
    setRows([...rows, newRow])
  }

  const saveChange = async () => {
    setLoading(true)
    onClose()
    if (password !== confirmPassword) {
      Swal.fire('Lỗi!', 'Mật khẩu và xác nhận mật khẩu không khớp nhau.', 'error')
      setLoading(false)

      return
    }

    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/changepassword?idCamera=${camera}`,
        {
          password: password
        },
        config
      )
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
      setLoading(false)
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
      setLoading(false)
    }
  }
  const formatDDNS = ddns => <Checkbox checked={ddns} disabled />

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={2} style={{ minWidth: 500 }}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={3.9}>
            <CustomTextField label='Tên thiết bị' type='text' onChange={handlePasswordChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Tên người dùng' type='text' onChange={handleConfirmPasswordChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <CustomTextField label='Mật khẩu' type='text' onChange={handleConfirmPasswordChange} fullWidth />
          </Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              renderInput={params => <CustomTextField {...params} label='Nhóm người dùng' fullWidth />}
              loading={loading}
            />{' '}
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Địa chỉ IP' type='text' onChange={handleConfirmPasswordChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <CustomTextField label='Cổng http' type='text' onChange={handleConfirmPasswordChange} fullWidth />
          </Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Cổng onvif ' type='text' onChange={handleConfirmPasswordChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              renderInput={params => <CustomTextField {...params} label='Giao thức' fullWidth />}
              loading={loading}
            />{' '}
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <Autocomplete
              renderInput={params => <CustomTextField {...params} label='Vùng' fullWidth />}
              loading={loading}
            />{' '}
          </Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Latitude' type='text' onChange={handlePasswordChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Longtitude' type='text' onChange={handleConfirmPasswordChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            {formatDDNS(true)} thiết bị đang ngoại tuyến
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>Kênh</Typography>
        </Grid>
        <Grid item xs={11.8}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên Kênh</TableCell>
                  <TableCell>Proxied</TableCell>
                  <TableCell align='right'>Channel URL </TableCell>
                  <TableCell align='right'>StreamType </TableCell>

                  <TableCell align='center'>
                    <IconButton size='small' onClick={handleAddRow}>
                      <Icon icon='tabler:plus' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        options={groupOptions}
                        getOptionLabel={option => option.groupName}
                        value={row.name}
                        onChange={(event, newValue) => {
                          const updatedRows = [...rows]
                          updatedRows[index].name = newValue.name
                          updatedRows[index].groupCode = newValue.groupCode
                          updatedRows[index].groupId = newValue.groupId
                          setRows(updatedRows)
                        }}
                        renderInput={params => <CustomTextField {...params} label='Kênh' />}
                      />
                    </TableCell>
                    <TableCell>{row.groupCode}</TableCell>
                    <TableCell align='right'></TableCell>
                    <TableCell align='center'>
                      {index > 0 && (
                        <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                          <Icon icon='bi:trash' />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>{' '}
      </Grid>
      <br />
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={saveChange}>OK</Button>
    </div>
  )
}

export default PassWord
