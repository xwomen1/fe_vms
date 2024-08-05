import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
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
  IconButton
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
import Add from '../../../views/apps/roles/Table'

const UserList = () => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState([])
  const [resources, setResources] = useState([])
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    fetchDataTenants()
    fetchResources()
  }, [reload])

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

  const fetchResources = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/resources`, config)
      setResources(response?.data || [])
      console.log(response?.data, 'response?.data')
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast.error(error.message || 'Error fetching resources')
    } finally {
      setLoading(false)
    }
  }

  const handelUpdate = id => {
    console.log(id)
  }

  const togglePermission = (resourceIndex, scope) => {
    const updatedResources = [...resources]
    const resource = updatedResources[resourceIndex]

    if (!resource.allowScopes) {
      resource.allowScopes = []
    }

    const scopeIndex = resource.allowScopes.findIndex(s => s.scope === scope)

    if (scopeIndex >= 0) {
      resource.allowScopes.splice(scopeIndex, 1)
    } else {
      resource.allowScopes.push({ scope, scopeName: scopeLabels[scope] })
    }

    setResources(updatedResources)
  }

  const scopeLabels = {
    get: 'xem danh sách',
    list: 'xem chi tiết',
    update: 'cập nhật',
    create: 'thêm mới',
    delete: 'xóa'
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Danh sách tài nguyên'
              action={
                <Grid container spacing={2}>
                  <Grid item>
                    <Box sx={{ float: 'right' }}>
                      <Button aria-label='Bộ lọc' variant='contained' onClick={() => setIsOpenAdd(true)}>
                        Thêm mới <Icon icon='mdi:plus'></Icon>
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              }
              titleTypographyProps={{ sx: { mb: [2, 0] } }}
              sx={{
                py: 4,
                flexDirection: ['column', 'row'],
                '& .MuiCardHeader-action': { m: 0 },
                alignItems: ['flex-start', 'center']
              }}
            />
            <Grid container spacing={0}>
              <Grid
                container
                item
                component={Paper}
                style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
              >
                <TableContainer component={Paper} style={{ maxHeight: 'calc(90vh - 200px)', overflow: 'auto' }}>
                  <Table>
                    <TableHead style={{ background: '#F6F6F7', position: 'sticky', top: 0, zIndex: 1 }}>
                      <TableRow>
                        <TableCell>Tên service</TableCell>
                        <TableCell>Resource code</TableCell>
                        <TableCell>Resource name</TableCell>
                        {['get', 'list', 'update', 'create', 'delete'].map(scope => (
                          <TableCell key={scope}>{scopeLabels[scope]}</TableCell>
                        ))}
                        <TableCell>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resources.map((resource, resourceIndex) => (
                        <TableRow key={resourceIndex}>
                          <TableCell>
                            {tenants.find(tenant => tenant.tenantId === resource.tenantId)?.tenantName}
                          </TableCell>
                          <TableCell>{resource.resourceCode}</TableCell>
                          <TableCell>{resource.resourceName}</TableCell>
                          {['get', 'list', 'update', 'create', 'delete'].map(scope => (
                            <TableCell key={scope}>
                              <FormControlLabel
                                sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                                control={
                                  <Checkbox
                                    disabled
                                    size='small'
                                    checked={resource.allowScopes?.some(s => s.scope === scope)}
                                    onChange={() => togglePermission(resourceIndex, scope)}
                                  />
                                }
                              />
                            </TableCell>
                          ))}
                          <TableCell>
                            <Button
                              variant='contained'
                              onClick={() => {
                                handelUpdate(resource.tenantId)
                              }}
                              disabled
                            >
                              <Icon icon='mdi:edit'></Icon>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {isOpenAdd && (
        <Add show={isOpenAdd} onClose={() => setIsOpenAdd(false)} setReload={() => setReload(reload + 1)} />
      )}
    </>
  )
}

export default UserList
