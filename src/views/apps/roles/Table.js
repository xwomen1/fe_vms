import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'

const UserList = ({ show, onClose, setReload }) => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState([])
  const [rows, setRows] = useState([{}])

  useEffect(() => {
    fetchDataTenants()
  }, [])

  const fetchDataTenants = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/tenants`, config)
      setTenants(response?.data)
    } catch (error) {
      console.error('Error fetching tenants:', error)
      toast.error(error.message || 'Error fetching tenants')
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (rowIndex, scope) => {
    const updatedRows = [...rows]
    if (!updatedRows[rowIndex].scopes) {
      updatedRows[rowIndex].scopes = []
    }

    if (updatedRows[rowIndex].scopes.includes(scope)) {
      updatedRows[rowIndex].scopes = updatedRows[rowIndex].scopes.filter(s => s !== scope)
    } else {
      updatedRows[rowIndex].scopes.push(scope)
    }

    setRows(updatedRows)
  }

  const addRow = () => {
    setRows([...rows, {}])
  }

  const deleteRow = rowIndex => {
    setRows(rows.filter((row, index) => index !== rowIndex))
  }

  const handleAddRows = async () => {
    for (const [rowIndex, row] of rows.entries()) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const postData = {
          resourceCode: row.resourceCode || '',
          resourceName: row.resourceName || '',
          scopes: row.scopes
            ? row.scopes.map(scope => ({
                scope,
                scopeName: scope
              }))
            : [],
          tenantId: row.tenantId || ''
        }

        await axios.post('https://dev-ivi.basesystem.one/smc/iam/api/v0/resources', postData, config)
        toast.success(`Thêm mới tài nguyên hàng ${rowIndex + 1} thành công!`)
      } catch (error) {
        console.error(`Error adding resource for row ${rowIndex + 1}:`, error)
        toast.error(`Error adding resource for row ${rowIndex + 1}: ${error.message || 'Error adding resource'}`)
      }
    }

    setReload(prev => prev + 1)
    onClose()
  }

  const handleRowChange = (rowIndex, field, value) => {
    const updatedRows = [...rows]
    updatedRows[rowIndex][field] = value
    setRows(updatedRows)
  }

  const scopeLabels = {
    get: 'xem danh sách',
    list: 'xem chi tiết',
    update: 'cập nhật',
    create: 'thêm mới',
    delete: 'xóa'
  }

  return (
    <Dialog open={show} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogTitle>Tạo mới tài nguyên</DialogTitle>
      <DialogContent>
        <Grid container spacing={0}>
          <Grid
            container
            item
            component={Paper}
            style={{ backgroundColor: 'white', width: '100%', padding: '10px', maxHeight: 600 }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead style={{ background: '#F6F6F7', position: 'sticky', top: 0, zIndex: 1, fontSize: '1px' }}>
                  <TableRow>
                    <TableCell>Chọn service</TableCell>
                    <TableCell>Nhập Resource code</TableCell>
                    <TableCell>Nhập Resource name</TableCell>
                    <TableCell>xem danh sách</TableCell>
                    <TableCell>xem chi tiết</TableCell>
                    <TableCell>cập nhật</TableCell>
                    <TableCell>thêm mới</TableCell>
                    <TableCell>xóa</TableCell>
                    <TableCell>Hành động</TableCell>
                    <TableCell>
                      <Button onClick={addRow} variant='contained'>
                        <Icon variant='contained' icon='mdi:plus' />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell style={{ width: '30%' }}>
                        <Autocomplete
                          options={tenants}
                          getOptionLabel={option => option.tenantName}
                          renderInput={params => <CustomTextField {...params} fullWidth />}
                          loading={loading}
                          onChange={(event, value) =>
                            handleRowChange(rowIndex, 'tenantId', value ? value.tenantId : '')
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          placeholder='Nhập Resource code'
                          onChange={e => handleRowChange(rowIndex, 'resourceCode', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          placeholder='Nhập Resource name'
                          onChange={e => handleRowChange(rowIndex, 'resourceName', e.target.value)}
                        />
                      </TableCell>
                      {['get', 'list', 'update', 'create', 'delete'].map(scope => (
                        <TableCell key={scope}>
                          <FormControlLabel
                            sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                            control={
                              <Checkbox
                                size='small'
                                id={`${rowIndex}-${scope}`}
                                onChange={() => togglePermission(rowIndex, scope)}
                              />
                            }
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton onClick={() => deleteRow(rowIndex)} color='secondary'>
                          <Icon variant='contained' icon='mdi:trash' />
                        </IconButton>
                      </TableCell>
                      <TableCell></TableCell>
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
        <Button aria-label='Bộ lọc' variant='contained' onClick={handleAddRows}>
          Thêm mới
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserList
