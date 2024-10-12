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
import { IconButton, Typography, Box } from '@mui/material'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserDetails from '../detail/index'
import Link from 'next/link'
import { fetchChatsContacts } from 'src/store/apps/chat'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [valueGroup, setValueGroup] = useState('')

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
  const [contractName, setContractName] = useState('')
  const [contractTypes, setContractTypes] = useState({})

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleViewDetails = userId => {
    router.push(`/${userId}`)
  }

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Accept',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Yes',
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
      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions/${regionId}`)

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
        if (user.contractType) {
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
      <Box display='flex' alignItems='center' style={{ marginLeft: '5%' }}>
        <Typography>
          {' '}
          <label htmlFor={`group-${group.id}`}>{group.name}</label>
        </Typography>{' '}
        <IconButton style={{ marginLeft: 'auto' }} size='small' onClick={() => handleDeleteInf(group.id)}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
    )
  }

  const handleGroupCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectedGroups(prevGroups => [...prevGroups, { id }])
    } else {
      setSelectedGroups(prevGroups => prevGroups.filter(g => g.id !== id))
    }
  }

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

      const response = await axios.get(
        'https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions/parentsID?parentID=f963e9d4-3d6b-45df-884d-15f93452f2a2',
        config
      )
      const dataWithChildren = addChildrenField(response.data)
      const rootGroups = findRootGroups(dataWithChildren)
      setGroups(rootGroups)
    } catch (error) {
      console.error('Error fetching data:', error)
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

        const response = await axios.get(
          'https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions/parentsID?parentID=f963e9d4-3d6b-45df-884d-15f93452f2a2',
          config
        )
        const dataWithChildren = addChildrenField(response.data)
        const rootGroups = findRootGroups(dataWithChildren)
        setGroups(rootGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [pageSize, valueGroup])

  const addChildrenField = (data, parentID = null) => {
    return data.map(group => {
      const children = data.filter(child => child.parentID === group.id)
      if (children.length > 0) {
        group.children = children
      }

      return group
    })
  }

  const handleDeleteInf = id => {
    showAlertConfirm({
      text: 'Do you agree to delete it?'
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
        let urlDelete = `https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions/${id}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Deleted successfully', '', 'success')
            fetchGroupData()
          })
          .catch(err => {
            console.log(err)
            Swal.fire('Đã xảy ra lỗi', err?.response?.statusText, 'error')
          })
      }
    })
  }

  const renderGroup = group => (
    <TreeItem
      key={group.id}
      nodeId={group.id}
      label={
        <GroupCheckbox
          group={group}
          checked={selectedGroups.some(g => g.id === group.id)}
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
      if (!data.some(item => item.id === group.parentID)) {
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

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid style={{ minWidth: '1000px' }}>
      <Card>
        <Grid container spacing={2}>
          {/* <Grid item xs={0.1}></Grid> */}
          <Grid item xs={0.2}></Grid>

          <Grid item xs={2} component={Paper}>
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
