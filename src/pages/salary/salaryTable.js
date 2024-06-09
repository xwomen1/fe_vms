import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/user/list/Salary'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import { fetchChatsContacts } from 'src/store/apps/chat'
import SalaryRulePage from '../salaryRule/salaryRule'
import toast from 'react-hot-toast'
import httpStatusMessages from 'src/message'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [valueGroup, setValueGroup] = useState('')
  const [editRow, setEditRow] = useState(null) // New state for edit mode
  const [editData, setEditData] = useState({}) // State for holding row data being edited
  const [httpMessage, setHttpMessage] = useState('') // State to hold HTTP status message

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [userData, setUserData] = useState([])
  const [total, setTotal] = useState([1])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [groups, setGroups] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const [KPCD, setKpcd] = useState('')
  const [BHXH, setBhxh] = useState('')
  const [BHYT, setBhyt] = useState('')
  const [BHTN, setBhtn] = useState('')

  const [contractTypes, setContractTypes] = useState({})
  const [isSalaryRuleOpen, setIsSalaryRuleOpen] = useState(false)

  const toggleSalaryRule = () => {
    setIsSalaryRuleOpen(!isSalaryRuleOpen)
  }

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleViewDetails = userId => {
    router.push(`/${userId}`)
  }

  const handleEdit = user => {
    setEditRow(user.userId)
    setEditData(user)
  }

  const handleChange = (field, value) => {
    setEditData({
      ...editData,
      salary: {
        ...editData.salary,
        ...editData.salaryLevel,

        ...editData.responsibilityAllowance,
        ...editData.lunchAllowance,
        ...editData.carAllowance,
        ...editData.phoneAllowance,
        ...editData.brandAllowance,

        [field]: value
      }
    })
  }

  const getHttpStatusMessage = statusCode => {
    return httpStatusMessages[statusCode] || 'Unknown Status' // Default to 'Unknown Status' if code not found
  }

  const handleSave = async userId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.put(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users`, editData, config)
      fetchFilteredOrAllUsers()

      const statusMessage = getHttpStatusMessage(response.status)
      setHttpMessage(statusMessage)

      toast.success('Sửa thành công')

      // Refresh user data
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(error.message)
    } finally {
      setEditRow(null)
      setEditData({})
    }
  }

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/salary/regulation/', config)
        setBhtn(response.data?.bhtn)
        setBhxh(response.data?.bhxh)
        setKpcd(response.data?.kpcd)
        setBhyt(response.data?.bhyt)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchSalaryData()
  }, [])
  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
  }

  const fetchRegionName = async regionId => {
    try {
      const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${regionId}`)

      return response.data.name
    } catch (error) {
      console.error('Error fetching region name:', error)

      return ''
    }
  }
  useEffect(() => {
    const fetchAllRegionNames = async () => {
      const newContractTypes = {}
      for (const user of userData) {
        if (contractTypes) {
          const regionName = await fetchRegionName(user.contractType)
          newContractTypes[user.contractType] = regionName
        }
      }
      setContractTypes(newContractTypes)
    }

    fetchAllRegionNames()
  }, [userData])

  const GroupCheckbox = ({ group, checked, onChange }) => {
    return (
      <div>
        <input
          type='checkbox'
          id={`group-${group.groupId}`}
          checked={checked}
          onChange={e => onChange(group.groupId, e.target.checked)}
        />
        <label htmlFor={`group-${group.groupId}`}>{group.groupName}</label>
      </div>
    )
  }

  const handleGroupCheckboxChange = (groupId, checked) => {
    if (checked) {
      setSelectedGroups(prevGroups => [...prevGroups, { groupId }])
    } else {
      setSelectedGroups(prevGroups => prevGroups.filter(g => g.groupId !== groupId))
    }
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            keyword: valueGroup
          }
        }
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config)
        const dataWithChildren = addChildrenField(response.data)
        const rootGroups = findRootGroups(dataWithChildren)
        setGroups(rootGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [pageSize, valueGroup])

  const addChildrenField = (data, parentId = null) => {
    return data.map(group => {
      const children = data.filter(child => child.parentId === group.groupId)
      if (children.length > 0) {
        group.children = children
      }

      return group
    })
  }

  const renderGroup = group => (
    <TreeItem
      key={group.groupId}
      nodeId={group.groupId}
      label={
        <GroupCheckbox
          group={group}
          checked={selectedGroups.some(g => g.groupId === group.groupId)}
          onChange={handleGroupCheckboxChange}
        />
      }
      style={{ marginTop: '5%' }}
    >
      {group.children && group.children.map(childGroup => renderGroup(childGroup))}
    </TreeItem>
  )

  const findRootGroups = data => {
    const rootGroups = []
    data.forEach(group => {
      if (!data.some(item => item.groupId === group.parentId)) {
        rootGroups.push(group)
      }
    })

    return rootGroups
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleFilterGroup = event => {
    setValueGroup(event)
  }

  console.log(total, 'totalpage')

  const handleDelete = idDelete => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?'
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        if (!token) {
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        let urlDelete = `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Xóa thành công', '', 'success')
            const updatedData = userData.filter(user => user.userId !== idDelete)
            setUserData(updatedData)
            fetchData()
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.message, 'error')
          })
      }
    })
  }

  const fetchFilteredOrAllUsers = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: pageSize,
          page: page,
          keyword: value
        }
      }
      let url
      if (selectedGroups.length > 0) {
        url = `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?groupIds=${selectedGroups
          .map(g => g.groupId)
          .join(',')}`
      } else {
        url = 'https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search'
      }
      const response = await axios.get(url, config)
      setUserData(response.data.rows)
      setContractTypes(response.data.contractType)
      setTotal(response.data.totalPage)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  useEffect(() => {
    const fetchFilteredOrAllUsers = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: pageSize,
            page: page,
            keyword: value
          }
        }
        let url
        if (selectedGroups.length > 0) {
          url = `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?groupIds=${selectedGroups
            .map(g => g.groupId)
            .join(',')}`
        } else {
          url = 'https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search'
        }
        const response = await axios.get(url, config)
        setUserData(response.data.rows)
        setContractTypes(response.data.contractType)
        setTotal(response.data.totalPage)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchFilteredOrAllUsers()
  }, [selectedGroups, page, pageSize, total, value])

  return (
    <Grid style={{ minWidth: '1000px' }}>
      <Card>
        <TableHeader value={value} handleFilter={handleFilter} toggle={toggleSalaryRule} />

        <Grid container spacing={2}>
          {/* <Grid item xs={0.1}></Grid> */}
          <Grid item xs={0.2}></Grid>

          <Grid item xs={1.5} component={Paper}>
            <div>
              <CustomTextField
                value={valueGroup}
                sx={{ mr: 4 }}
                placeholder='Search Group'
                onChange={e => handleFilterGroup(e.target.value)}
              />
              <TreeView
                sx={{ minHeight: 240 }}
                defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
              >
                {groups.map(rootGroup => renderGroup(rootGroup))}
              </TreeView>
            </div>
          </Grid>
          <Grid item xs={10.3}>
            <Paper elevation={3}>
              <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Mã định danh</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Full Name</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Đơn vị</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Lương chính</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Bậc lương</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Phụ cấp trách nhiệm</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Phụ cấp ăn trưa</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Phụ cấp xăng xe</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Phụ cấp điện thoại</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Phụ cấp khác</TableCell>
                    <TableCell sx={{ padding: '16px' }}>KPCĐ</TableCell>
                    <TableCell sx={{ padding: '16px' }}>BHXH</TableCell>
                    <TableCell sx={{ padding: '16px' }}>BHYT</TableCell>
                    <TableCell sx={{ padding: '16px' }}>BHTN</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Hành động</TableCell> {/* Add this line */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {userData.map((user, index) => (
                    <TableRow key={user.userId}>
                      <TableCell sx={{ padding: '16px' }}>{(page - 1) * pageSize + index + 1}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.accessCode}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.fullName}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.userGroup[0]?.groupName}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {editRow === user.userId ? (
                          <CustomTextField
                            value={editData.salary?.salary}
                            onChange={e => handleChange('salary', e.target.value)}
                          />
                        ) : (
                          user?.salary?.salary || '0'
                        )}
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {editRow === user.userId ? (
                          <CustomTextField
                            value={editData.salary?.salaryLevel}
                            onChange={e => handleChange('salaryLevel', e.target.value)}
                          />
                        ) : (
                          user?.salary?.salaryLevel || '0'
                        )}
                      </TableCell>

                      <TableCell sx={{ padding: '16px' }}>
                        {editRow === user.userId ? (
                          <CustomTextField
                            value={editData.salary?.responsibilityAllowance}
                            onChange={e => handleChange('responsibilityAllowance', e.target.value)}
                          />
                        ) : (
                          user?.salary?.responsibilityAllowance || '0'
                        )}
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {editRow === user.userId ? (
                          <CustomTextField
                            value={editData.salary?.lunchAllowance}
                            onChange={e => handleChange('lunchAllowance', e.target.value)}
                          />
                        ) : (
                          user?.salary?.lunchAllowance || '0'
                        )}
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {editRow === user.userId ? (
                          <CustomTextField
                            value={editData.salary?.carAllowance}
                            onChange={e => handleChange('carAllowance', e.target.value)}
                          />
                        ) : (
                          user?.salary?.carAllowance || '0'
                        )}
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {editRow === user.userId ? (
                          <CustomTextField
                            value={editData.salary?.phoneAllowance}
                            onChange={e => handleChange('phoneAllowance', e.target.value)}
                          />
                        ) : (
                          user?.salary?.phoneAllowance || '0'
                        )}
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {editRow === user.userId ? (
                          <CustomTextField
                            value={editData.salary?.brandAllowance}
                            onChange={e => handleChange('brandAllowance', e.target.value)}
                          />
                        ) : (
                          user?.salary?.brandAllowance || '0'
                        )}
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.salary?.salary * KPCD || '0'}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.salary?.salary * BHXH || '0'}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.salary?.salary * BHYT || '0'}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.salary?.salary * BHTN || '0'}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {editRow === user.userId ? (
                          <IconButton onClick={() => handleSave(user.userId)}>
                            <Icon icon='tabler:check' />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => handleEdit(user)}>
                            <Icon icon='tabler:pencil' />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <br></br>
            <Grid container spacing={2} style={{ padding: 10 }}>
              <Grid item xs={3}></Grid>
              <Grid item xs={1.5} style={{ padding: 0 }}>
                <IconButton onClick={handleOpenMenu}>
                  <Icon icon='tabler:selector' />
                  <p style={{ fontSize: 15 }}>{pageSize} dòng/trang</p>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                  {pageSizeOptions.map(size => (
                    <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                      {size}
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
              <Grid item xs={6}>
                <Pagination count={total} color='primary' onChange={(event, page) => handlePageChange(page)} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
