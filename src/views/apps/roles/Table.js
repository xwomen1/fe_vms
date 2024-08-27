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
        toast.success(`Add tài nguyên hàng ${rowIndex + 1} thành công!`)
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
    get: 'Get',
    list: 'Find by ID',
    update: 'Put',
    create: 'Add',
    delete: 'Delete'
  }

  return (
    <Dialog open={show} onClose={onClose} maxWidth='xl' fullWidth>
      <DialogTitle>Add</DialogTitle>
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
                    <TableCell>Select Service</TableCell>
                    <TableCell>Insert Resource code</TableCell>
                    <TableCell>Insert Resource name</TableCell>
                    <TableCell>Get</TableCell>
                    <TableCell>Find by ID</TableCell>
                    <TableCell>Put</TableCell>
                    <TableCell>Add</TableCell>
                    <TableCell>Delete</TableCell>
                    <TableCell>Action</TableCell>
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
                      <TableCell style={{ width: '35%' }}>
                        <CustomTextField
                          placeholder='Insert Resource code'
                          onChange={e => handleRowChange(rowIndex, 'resourceCode', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell style={{ width: '35%' }}>
                        <CustomTextField
                          placeholder='Insert Resource name'
                          onChange={e => handleRowChange(rowIndex, 'resourceName', e.target.value)}
                          fullWidth
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
        <Button onClick={onClose}>Cancel</Button>
        <Button aria-label='Bộ lọc' variant='contained' onClick={handleAddRows}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserList
