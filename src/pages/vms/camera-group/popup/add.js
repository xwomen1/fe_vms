import React, { useState, useEffect } from 'react'
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
  Checkbox,
  TableCell,
  TableBody,
  Typography
} from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import { router } from 'websocket'
import Grid from '@mui/system/Unstable_Grid/Grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'

const CameraPopupDetail = ({ open, id, onClose, onSuccess }) => {
  const [groupName, setGroupName] = useState('')
  const [groupNameError, setGroupNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [groupOptions, setGroupOptions] = useState([])
  const [rows, setRows] = useState([])
  const [name, setName] = useState([])
  const [description, setDescription] = useState('')
  const [camera, setCamera] = useState([])
  const [cameras, setCameras] = useState([])
  const [cameraGroup, setCameraGroup] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  console.log('id', id)

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

  const filteredPolicyOptions = groupOptions.filter(option => !rows || !rows.some(group => group.name === option.name))

  const handleAddRow = () => {
    const newRow = { name: '', location: '', ipAddress: '', id: '' }
    setRows([...rows, newRow])
  }

  const handleDeleteRow = index => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }

  const validateInputs = () => {
    let isValid = true

    if (groupName.trim() === '') {
      setGroupNameError('Group name cannot be empty')
      isValid = false
    } else {
      setGroupNameError('')
    }

    if (description.trim() === '') {
      setDescriptionError('Description cannot be empty')
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
        router.reload()
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  const handleAdd = async () => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    console.log('token', token)

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    if (!validateInputs()) {
      console.log('Invalid data')

      return
    }

    try {
      const newGroupData = {
        name: groupName,
        description: description,
        cameras: rows.map(row => ({
          deviceName: row.name,
          id: row.id
        }))
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups',
        newGroupData,
        config
      )
      onClose()
      Swal.fire({
        title: 'Success!',
        text: 'The data has been added successfully',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
      onSuccess()
    } catch (error) {
      console.error('Error fetch data:', error)
      setErrorMessage(error.response?.data?.message || 'Error fetch data')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='x1' style={{ maxWidth: '80%', margin: 'auto' }}>
      <DialogTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>Add camera groups</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <CustomTextField
              label='Group Name'
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              error={groupNameError !== ''}
              helperText={groupNameError}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              label='Description'
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
                    <TableCell style={{ fontSize: '12px', textTransform: 'none' }}>Camera name</TableCell>
                    <TableCell style={{ fontSize: '12px', textTransform: 'none' }}>Location</TableCell>
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
                          options={filteredPolicyOptions}
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
              {errorMessage && (
                <Typography color='error' variant='body2' align='center' style={{ marginTop: '2%', fontSize: '16px' }}>
                  {errorMessage}
                </Typography>
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (validateInputs()) {
              handleAdd()
            } else {
              console.log('Invalid data')
            }
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CameraPopupDetail
