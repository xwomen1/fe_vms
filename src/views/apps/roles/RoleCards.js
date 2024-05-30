import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import {
  Box,
  Grid,
  Card,
  Button,
  Avatar,
  Dialog,
  Tooltip,
  Checkbox,
  Switch,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  FormControl,
  DialogTitle,
  AvatarGroup,
  CardContent,
  DialogActions,
  DialogContent,
  TableContainer,
  FormControlLabel,
  Table
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'

const RolesCards = () => {
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)
  const [idDelete, setIdDelete] = useState(null)
  const [rolesArr, setRolesArr] = useState([])
  const [currentPolicyId, setCurrentPolicyId] = useState(null)
  const [policy, setPolicy] = useState([])
  const [loading, setLoading] = useState(false)
  const [policyData, setPolicyData] = useState(null)
  const [isOpenDel, setIsOpenDel] = useState(false)
  const [userCounts, setUserCounts] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAdminAccessActive, setIsAdminAccessActive] = useState(false)

  const fetchDataPolicies = async () => {
    try {
      const token = localStorage.getItem('authConfig.storageTokenKeyName')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/policies/search', config)
      const policies = response.data.rows || []
      setPolicy(policies)

      const userCounts = {}
      for (const policy of policies) {
        if (policy.policyId) {
          const userResponse = await axios.get(
            `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?policyIds=${policy.policyId}`,
            config
          )
          userCounts[policy.policyId] = userResponse.data.count
        } else {
          console.error('Policy ID is undefined:', policy)
        }
      }
      setUserCounts(userCounts)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    fetchDataPolicies()
  }, [])

  useEffect(() => {
    setIsIndeterminateCheckbox(selectedCheckbox.length > 0 && selectedCheckbox.length < rolesArr.length * 4)
  }, [selectedCheckbox, rolesArr])

  const handleClickOpen = async (policyId = null) => {
    const token = localStorage.getItem('authConfig.storageTokenKeyName')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      if (policyId) {
        setIsEditMode(true) // Set to edit mode
        setCurrentPolicyId(policyId) // Save policyId when opening dialog
        const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/policies/${policyId}`, config)
        const policyData = response.data
        setPolicyData(policyData)
        console.log(policyData, 'uni')

        const scopes = policyData.scopes.map(scope => `${scope.resourceName}-${scope.scope}`)
        setSelectedCheckbox(prevSelected => {
          // Check if any of the new scopes are already selected
          const newSelected = scopes.filter(scope => prevSelected.includes(scope))
          return newSelected.length > 0 ? newSelected : scopes
        })

        const uniqueResources = [...new Set(policyData.scopes.map(scope => scope.resourceName))]
        console.log(uniqueResources, 'uni')
        setRolesArr(uniqueResources)
      } else {
        setIsEditMode(false) // Set to add mode
        setPolicyData({
          policyName: '',
          policyCode: '',
          description: '',
          scopes: [],
          status: 'INACTIVE'
        })
        setSelectedCheckbox([])
        setRolesArr([])
        setDialogTitle('Add')
      }

      const resourcesResponse = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/resources', config)
      const resourcesData = resourcesResponse.data

      setRolesArr(prevRolesArr => {
        const allResources = new Set([...prevRolesArr, ...resourcesData.map(resource => resource.resourceName)])
        return Array.from(allResources)
      })
    } catch (error) {
      console.error('Error fetching policy details or resources:', error)
    }

    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }
  const handleSwitchChange = () => {
    // Cập nhật trạng thái của policyData dựa trên trạng thái hiện tại của isAdminAccessActive
    const newStatus = isAdminAccessActive ? 'INACTIVE' : 'ACTIVE'
    setPolicyData(prevPolicyData => ({
      ...prevPolicyData,
      status: newStatus
    }))
  }
  const handleRoleNameChange = e => {
    const updatedPolicy = { ...policyData, policyName: e.target.value }
    setPolicyData(updatedPolicy)
  }

  // Hàm cập nhật thông tin trong trường Role Code
  const handleRoleCodeChange = e => {
    const updatedPolicy = { ...policyData, policyCode: e.target.value }
    setPolicyData(updatedPolicy)
  }
  const handleUpdate = async () => {
    console.log(currentPolicyId, 'currentPolicyId')
    if (!currentPolicyId) {
      console.error('Policy ID is not set')
      return
    }

    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const params = {
        policyName: policyData.policyName,
        policyCode: policyData.policyCode,
        description: policyData.description,
        resourceScopes: policyData.scopes.map(scope => ({
          scope: scope.scope,
          resourceCode: scope.resourceCode,
          tenantId: scope.tenantId
        })),
        status: policyData.status
      }

      const response = await axios.put(
        `https://dev-ivi.basesystem.one/smc/iam/api/v0/policies/${currentPolicyId}`,
        params,
        config
      )
      fetchDataPolicies()
      handleClose()
      Swal.fire('Sửa thành công', '', 'success')
    } catch (error) {
      console.error('Lỗi khi tạo nhóm mới:', error)
    }
  }
  const togglePermission = async (resource, scope) => {
    const permission = `${resource}-${scope}`
    const isChecked = selectedCheckbox.includes(permission)

    try {
      const token = localStorage.getItem('authConfig.storageTokenKeyName')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      // Lấy thông tin từ API về resourceCode và tenantId tương ứng với resource
      const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/resources', config)
      const resourcesData = response.data
      const selectedResource = resourcesData.find(item => item.resourceName === resource)

      if (selectedResource) {
        // Thực hiện cập nhật payload ngay sau khi nhận được thông tin từ API
        const newScopes = isChecked
          ? policyData.scopes.filter(item => !(item.resourceName === resource && item.scope === scope))
          : policyData.scopes
        setPolicyData(prevPolicyData => ({
          ...prevPolicyData,
          scopes: isChecked
            ? newScopes
            : [
                ...newScopes,
                {
                  resourceName: resource,
                  scope,
                  tenantId: selectedResource.tenantId,
                  resourceCode: selectedResource.resourceCode
                }
              ]
        }))
      } else {
        console.error(`Resource not found: ${resource}`)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    }

    // Cập nhật trạng thái của ô checkbox
    setSelectedCheckbox(prevPermissions => {
      return isChecked ? prevPermissions.filter(item => item !== permission) : [...prevPermissions, permission]
    })
  }

  useEffect(() => {
    setIsIndeterminateCheckbox(selectedCheckbox.length > 0 && selectedCheckbox.length < rolesArr.length * 5)
  }, [selectedCheckbox, rolesArr])

  useEffect(() => {
    // Kiểm tra xem policyData có dữ liệu không và trạng thái của nó là gì
    if (policyData) {
      // Kiểm tra trạng thái của policyData
      const isActive = policyData.status === 'ACTIVE'
      setIsAdminAccessActive(isActive)
    }
  }, [policyData])

  const handleAdd = async () => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const params = {
        policyName: policyData.policyName,
        policyCode: policyData.policyCode,
        description: policyData.description,
        resourceScopes: policyData.scopes.map(scope => ({
          scope: scope.scope,
          resourceCode: scope.resourceCode,
          tenantId: scope.tenantId
        })),
        status: policyData.status
      }

      const response = await axios.post(`https://dev-ivi.basesystem.one/smc/iam/api/v0/policies`, params, config)
      fetchDataPolicies()
      handleClose()
      Swal.fire('Thêm thành công', '', 'success')
    } catch (error) {
      console.error('Lỗi khi tạo nhóm mới:', error)
    }
  }

  const DeleteView = () => (
    <Dialog
      open={isOpenDel}
      maxWidth='sm'
      scroll='body'
      onClose={() => setIsOpenDel(false)}
      onBackdropClick={() => setIsOpenDel(false)}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            Xác nhận
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Bạn có chắc chắn muốn xóa không ?</Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button
          variant='contained'
          onClick={() => {
            handleDelete()
            setIsOpenDel(false)
          }}
        >
          Đồng ý
        </Button>
        <Button variant='tonal' color='secondary' sx={{ mr: 1 }} onClick={() => setIsOpenDel(false)}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  )

  const handleDelete = () => {
    if (idDelete != null) {
      setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      axios
        .delete(`https://dev-ivi.basesystem.one/smc/iam/api/v0/policies/${idDelete}`, config)
        .then(() => {
          toast.success('Xóa thành công')
          setIdDelete(null)
          fetchDataPolicies()
        })
        .catch(error => {
          toast.error(error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }
  const renderCards = () =>
    policy.map((item, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>{`Total ${
                userCounts[item.policyId] || 0
              } users`}</Typography>
              <AvatarGroup
                max={4}
                className='pull-up'
                sx={{
                  '& .MuiAvatar-root': { width: 32, height: 32, fontSize: theme => theme.typography.body2.fontSize }
                }}
              >
                {item.avatars?.map((img, index) => (
                  <Avatar key={index} alt={item.title} src={`/images/avatars/${img}`} />
                ))}
              </AvatarGroup>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography variant='h4' sx={{ mb: 1 }}>
                  {item.policyName}
                </Typography>
                <Typography
                  href='/'
                  component={Link}
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                  onClick={e => {
                    e.preventDefault()
                    handleClickOpen(item.policyId)
                  }}
                >
                  Edit Role
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setIdDelete(item.policyId)
                  setIsOpenDel(true)
                }}
                size='small'
                sx={{ color: 'text.disabled' }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))

  return (
    <>
      <Grid container spacing={6} className='match-height'>
        {renderCards()}
        <Grid item xs={12} sm={6} lg={4}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen()}>
            <Grid container sx={{ height: '100%' }}>
              <Grid item xs={5}>
                <Box
                  sx={{
                    height: '100%',
                    minHeight: 140,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                  }}
                >
                  <img height={122} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
                </Box>
              </Grid>
              <Grid item xs={7}>
                <CardContent sx={{ pl: 0, height: '100%' }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Button variant='contained' sx={{ mb: 3, whiteSpace: 'nowrap' }} onClick={() => handleClickOpen()}>
                      Add New Role
                    </Button>
                    <Typography sx={{ color: 'text.secondary' }}>Add role, if it doesn't exist.</Typography>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
          <DialogTitle
            component='div'
            sx={{
              textAlign: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Typography variant='h3'>{`${dialogTitle} Role`}</Typography>
            <Typography color='text.secondary'>Set Role Permissions</Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(5)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
            }}
          >
            <Box sx={{ my: 4 }}>
              <FormControl fullWidth>
                <CustomTextField
                  fullWidth
                  label='Role Name'
                  placeholder='Enter Role Name'
                  value={policyData ? policyData.policyName : ''}
                  onChange={handleRoleNameChange}
                />
              </FormControl>
            </Box>
            <Box sx={{ my: 4 }}>
              <FormControl fullWidth>
                <CustomTextField
                  fullWidth
                  label='Role Code'
                  placeholder='Enter Role ID'
                  value={policyData ? policyData.policyCode : ''}
                  onChange={handleRoleCodeChange}
                />
              </FormControl>
            </Box>
            <Typography variant='h4'>Role Permissions</Typography>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: '0 !important' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          whiteSpace: 'nowrap',
                          alignItems: 'center',
                          textTransform: 'capitalize',
                          '& svg': { ml: 1, cursor: 'pointer' },
                          color: theme => theme.palette.text.secondary,
                          fontSize: theme => theme.typography.h6.fontSize
                        }}
                      >
                        Administrator Access
                        <Tooltip placement='top' title='Allows a full access to the system'>
                          <Box sx={{ display: 'flex' }}>
                            <Icon icon='tabler:info-circle' fontSize='1.25rem' />
                          </Box>
                        </Tooltip>
                        <Switch checked={isAdminAccessActive} onChange={handleSwitchChange} />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <div className='scrollable-table'>
                    {rolesArr.map((resource, index) => {
                      const id = resource.toLowerCase().split(' ').join('-')
                      const resourceScopes = (policyData.scopes || []).filter(scope => scope.resourceName === resource)
                      return (
                        <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              fontSize: theme => theme.typography.h6.fontSize
                            }}
                          >
                            {resource}
                          </TableCell>
                          {['get', 'list', 'update', 'create', 'delete'].map(scope => (
                            <TableCell key={scope}>
                              <FormControlLabel
                                label={scope.charAt(0).toUpperCase() + scope.slice(1)}
                                sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                                control={
                                  <Checkbox
                                    size='small'
                                    id={`${id}-${scope}`}
                                    onChange={() => togglePermission(resource, scope)}
                                    checked={resourceScopes.some(s => s.scope === scope)}
                                  />
                                }
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                  </div>
                </TableBody>
              </Table>
            </TableContainer>

            <style jsx>{`
              .scrollable-table {
                height: 400px; /* Adjust the height as per your requirement */
              }
            `}</style>
          </DialogContent>
          <DialogActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Box className='demo-space-x'>
              <Button type='submit' variant='contained' onClick={isEditMode ? handleUpdate : handleAdd}>
                {isEditMode ? 'Sửa' : 'Thêm'}
              </Button>
              <Button color='secondary' variant='tonal' onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Grid>
      {isOpenDel && DeleteView()}
    </>
  )
}

export default RolesCards
