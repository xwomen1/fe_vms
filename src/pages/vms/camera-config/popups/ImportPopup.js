import React, { useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  Autocomplete,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TableRow,
  TableHead,
  Typography
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'

// Component ImportPopup
const ImportPopup = ({ open, handleClose }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectNVR, setSelectedNVR] = useState(null)
  const [nvrs, setNVR] = useState([])
  const [responseData, setResponseData] = useState([])
  const [statusMessage, setStatusMessage] = useState('')

  const fetchNicTypes = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/device', config)

      const nicTypes = response.data.map(item => ({
        label: item.nameDevice,
        value: item.id
      }))
      setNVR(nicTypes)
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    }
  }

  const handleComboboxFocus = () => {
    fetchNicTypes()
  }

  const handleDDNSChange = (event, newValue) => {
    setSelectedNVR(newValue)
  }

  const handleDialogClose = () => {
    setFiles([])
    setSelectedNVR(null)
    setStatusMessage('')
    setResponseData([])
    handleClose()
  }

  const handleImport = async () => {
    if (!files.length || !selectNVR) {
      console.error('No file selected or NVR not selected')

      return
    }

    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('id', selectNVR.value)

    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }

      const response = await axios.post('https://sbs.basesystem.one/ivis/vms/api/v0/cameras/import', formData, config)

      console.log('Import successful')
      if (response.data && response.data.length > 0) {
        setResponseData(response.data) // Cập nhật trạng thái với dữ liệu phản hồi
        setStatusMessage('')
      } else {
        setResponseData([])
        setStatusMessage(response.data.message)
      }
    } catch (error) {
      console.error('Error importing cameras:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setFiles([])
      setSelectedNVR(null)
      setResponseData([])
      setStatusMessage('')
    }
  }, [open])

  const onDrop = useCallback(acceptedFiles => {
    setFiles(
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    )
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>Import Camera</DialogTitle>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <DialogContent>
            <div
              {...getRootProps()}
              style={{ border: '2px dashed #aaa', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
            >
              <input {...getInputProps()} />
              <Icon icon='tabler:arrow-bar-to-down' color='#ff9300' fontSize='3rem' />
              <p>Kéo và thả file Excel vào đây, hoặc nhấn để chọn file</p>
            </div>
            <ul>
              {files.map(file => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </DialogContent>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            style={{ width: '90%', marginLeft: '5%' }}
            value={selectNVR}
            onChange={handleDDNSChange}
            options={nvrs}
            getOptionLabel={option => option.label}
            renderInput={params => <CustomTextField {...params} label='BOX' fullWidth />}
            onFocus={handleComboboxFocus}
          />
        </Grid>
      </Grid>
      {responseData.length > 0 ? (
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>IP Address</TableCell>
                <TableCell>HTTP Port</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Insert Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responseData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.ipAddress}</TableCell>
                  <TableCell>{data.httpPort}</TableCell>
                  <TableCell>{data.username}</TableCell>
                  <TableCell>{data.password}</TableCell>
                  <TableCell>
                    {data.insertstatus ? (
                      <Icon icon='tabler:check' color='green' />
                    ) : (
                      <Icon icon='tabler:x' color='red' />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      ) : (
        statusMessage && (
          <Grid item xs={12}>
            <Typography variant='body1' align='center'>
              {statusMessage}
            </Typography>
          </Grid>
        )
      )}
      <DialogActions>
        <Button onClick={handleDialogClose} variant='contained'>
          Cancel
        </Button>
        <Button onClick={handleImport} variant='contained' disabled={loading}>
          {loading ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportPopup
