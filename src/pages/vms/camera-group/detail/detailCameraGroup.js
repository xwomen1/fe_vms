import React, { useState } from 'react'
import {
  Autocomplete,
  TextField,
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
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import { router } from 'websocket'
import { useRouter } from 'next/router'
import Grid from '@mui/system/Unstable_Grid/Grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import TableCell from '@mui/material/TableCell'
import Icon from 'src/@core/components/icon'
import { useEffect, useMemo } from 'react'
import TableBody from '@mui/material/TableBody'

const CameraPopupDetail = ({ open, id, onClose, onSuccess }) => {
  const [groupName, setGroupName] = useState('')
  const [groupNameError, setGroupNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [groupOptions, setGroupOptions] = useState([])
  const [rows, setRows] = useState([])
  const [name, setName] = useState([])
  const [description, setDescription] = useState([])
  const [camera, setCamera] = useState([])
  const [cameras, setCameras] = useState([])
  const [cameraGroup, setCameraGroup] = useState([])
  console.log('id', id)

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups/${id}`, config)
        setCameraGroup(response.data)
        setGroupName(response.data.name)
        setDescription(response.data.description)
        console.log(response.data.cameras[0].id)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchFiltered()
  }, [])

  useEffect(() => {
    const fetchFilterCameras = async () => {
      try {
        if (cameraGroup && cameraGroup.cameras && cameraGroup.cameras.length > 0) {
          const token = localStorage.getItem(authConfig.storageTokenKeyName)
          const cameraIds = cameraGroup.cameras.map(camera => camera.id)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const cameraPromises = cameraIds.map(async cameraId => {
            try {
              const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${cameraId}`, config)

              return response.data
            } catch (error) {
              console.error(`Error fetching camera ${cameraId}:`, error)

              return null
            }
          })

          const cameraData = await Promise.all(cameraPromises)

          const filteredCameraData = cameraData.filter(data => data !== null)
          setRows(filteredCameraData)
        }
      } catch (error) {
        console.error('Error fetching cameras:', error)
      }
    }
    fetchFilterCameras()
  }, [cameraGroup])

  console.log(rows)

  const updateCameraGroup = async () => {
    onClose()
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const payload = {
        cameras: rows.map(row => ({ deviceName: row.name, id: row.id })),
        description: description,
        name: groupName
      }

      const response = await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups/${id}`,
        payload,
        config
      )
      Swal.fire({
        title: 'Thành công!',
        text: 'Dữ liệu đã được cập nhật thành công.',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })
      onSuccess()

      console.log('Camera group updated successfully')
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })
    }
  }

  const handleAddRow = () => {
    const newRow = { name: '', location: '', ipAddress: '', id: '' }
    setRows([...rows, newRow])
  }
  const formatIsLeader = isLeader => <Checkbox checked={isLeader} disabled />

  const handleDeleteRow = index => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }

  const validateInputs = () => {
    let isValid = true

    if (groupName.trim() === '') {
      setGroupNameError('Tên nhóm không được để trống')
      isValid = false
    } else {
      setGroupNameError('')
    }

    if (description.trim() === '') {
      setDescriptionError('Mô tả không được để trống')
      isValid = false
    } else {
      setDescriptionError('')
    }

    return isValid
  }

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/cameras', config)

        setGroupOptions(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='x1' style={{ maxWidth: '80%', margin: 'auto' }}>
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Sửa nhóm camera</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <CustomTextField
              label='Tên nhóm'
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              error={groupNameError !== ''}
              helperText={groupNameError}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Mô tả'
              value={description}
              onChange={e => setDescription(e.target.value)}
              error={descriptionError !== ''}
              helperText={descriptionError}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell style={{ fontSize: '12px', textTransform:'none' }}>STT</TableCell> */}
                    <TableCell style={{ fontSize: '12px', textTransform: 'none' }}>Tên camera</TableCell>
                    <TableCell style={{ fontSize: '12px', textTransform: 'none' }}>Vị trí</TableCell>
                    <TableCell style={{ fontSize: '12px', textTransform: 'none' }}>IP Cam</TableCell>
                    <TableCell align='center' style={{ fontSize: 'small' }}>
                      <IconButton size='small' onClick={handleAddRow} sx={{ marginLeft: '10px' }}>
                        <Icon icon='bi:plus' />
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
                          getOptionLabel={option => option?.name}
                          value={row}
                          onChange={(event, newValue) => {
                            const updatedRows = [...rows]
                            updatedRows[index].name = newValue?.name
                            updatedRows[index].location = newValue?.location
                            updatedRows[index].ipAddress = newValue?.ipAddress
                            updatedRows[index].id = newValue?.id

                            setRows(updatedRows)
                          }}
                          renderInput={params => <TextField {...params} label='Camera' />}
                        />
                        {console.log(rows)}
                      </TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.ipAddress}</TableCell>

                      <TableCell align='center'>
                        <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                          <Icon icon='bi:trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={() => {
            if (validateInputs()) {
              updateCameraGroup()
              console.log('Tên nhóm:', groupName)
              console.log('Mô tả:', description)
            } else {
              console.log('Dữ liệu không hợp lệ')
            }
          }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CameraPopupDetail
