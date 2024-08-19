import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'

import authConfig from 'src/configs/auth'
import Paper from '@mui/material/Paper'
import Icon from 'src/@core/components/icon'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/user/list/index'
import CustomTextField from 'src/@core/components/mui/text-field'
import { IconButton, Typography, Box } from '@mui/material'
import Edit from '../popup/editGroup'

const UserList = ({ apiData }) => {
  const [valueGroup, setValueGroup] = useState('')
  const [valueGroupIn, setValueGroupIn] = useState('')

  const [selectedGroups, setSelectedGroups] = useState([])
  const [selectedGroupsIn, setSelectedGroupsIn] = useState([])
  const [groupIds, setGroupIds] = useState(null)

  const [groups, setGroups] = useState([])
  const [groupsIn, setGroupsIn] = useState([])
  const [groupName, setGroupName] = useState(false)
  const [openPopupP, setOpenPopupP] = useState(false)

  const handleAddPClick = (groupIds, groupName) => {
    setOpenPopupP(true)
    setGroupIds(groupIds)
    setGroupName(groupName)
  }

  const handleClosePPopup = () => {
    setOpenPopupP(false) // Đóng Popup khi cần thiết
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
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Agree',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

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
        let urlDelete = `https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Deleted successfully', '', 'success')
            fetchGroupData()
          })
          .catch(err => {
            console.log(err)
            Swal.fire('Đã xảy ra lỗi', err?.response?.data?.message, 'error')
          })
      }
    })
  }

  const GroupCheckbox = ({ group, checked, onChange }) => {
    return (
      <Box display='flex' alignItems='center' justifyContent='space-between' style={{ marginLeft: '5%' }}>
        <Typography>
          <label htmlFor={`group-${group.groupId}`}>{group.groupName}</label>
        </Typography>
        <Box display='flex'>
          <IconButton size='small' onClick={() => handleAddPClick(group.groupId, group.groupName)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton size='small' onClick={() => handleDelete(group.groupId)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      </Box>
    )
  }

  const handleGroupCheckboxChange = (groupId, checked) => {
    if (checked) {
      setSelectedGroups(prevGroups => [...prevGroups, { groupId }])
    } else {
      setSelectedGroups(prevGroups => prevGroups.filter(g => g.groupId !== groupId))
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
      const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config)
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
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config)
        const dataWithChildren = addChildrenField(response.data)
        const rootGroups = findRootGroups(dataWithChildren)
        setGroups(rootGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [valueGroup])

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

  const handleFilterGroup = event => {
    setValueGroup(event)
  }

  const GroupCheckboxIn = ({ group, checked, onChange }) => {
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

  const handleGroupCheckboxChangeIn = (id, checked) => {
    if (checked) {
      setSelectedGroupsIn(prevGroups => [...prevGroups, { id }])
    } else {
      setSelectedGroupsIn(prevGroups => prevGroups.filter(g => g.id !== id))
    }
  }

  const fetchGroupDataIn = async () => {
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
        'https://sbs.basesystem.one/ivis/infrares/api/v0/regions/parentsID?parentID=f963e9d4-3d6b-45df-884d-15f93452f2a2',
        config
      )
      const dataWithChildren = addChildrenFieldIn(response.data)
      const rootGroups = findRootGroupsIn(dataWithChildren)
      setGroupsIn(rootGroups)
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
          'https://sbs.basesystem.one/ivis/infrares/api/v0/regions/parentsID?parentID=f963e9d4-3d6b-45df-884d-15f93452f2a2',
          config
        )
        const dataWithChildren = addChildrenFieldIn(response.data)
        const rootGroups = findRootGroupsIn(dataWithChildren)
        setGroupsIn(rootGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [valueGroupIn])

  const addChildrenFieldIn = (data, parentID = null) => {
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
        let urlDelete = `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${id}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Deleted successfully', '', 'success')
            fetchGroupDataIn()
          })
          .catch(err => {
            console.log(err)
            Swal.fire('Đã xảy ra lỗi', err?.response?.statusText, 'error')
          })
      }
    })
  }

  const renderGroupIn = group => (
    <TreeItem
      key={group.id}
      nodeId={group.id}
      label={
        <GroupCheckboxIn
          group={group}
          checked={selectedGroupsIn.some(g => g.id === group.id)}
          onChange={handleGroupCheckboxChangeIn}
        />
      }
      style={{ marginTop: '5%' }}
    >
      {group.children && group.children.map(childGroup => renderGroupIn(childGroup))}
    </TreeItem>
  )

  const findRootGroupsIn = data => {
    const rootGroups = []
    data.forEach(group => {
      if (!data.some(item => item.id === group.parentID)) {
        rootGroups.push(group)
      }
    })

    return rootGroups
  }

  const handleFilterGroupIn = event => {
    setValueGroupIn(event)
  }

  return (
    <Grid style={{ minWidth: '1000px' }}>
      <Card>
        <TableHeader />
        <Grid container spacing={2}>
          {/* <Grid item xs={0.1}></Grid> */}
          <Grid item xs={2.5}></Grid>

          <Grid item xs={3} component={Paper}>
            <div>
              <h2>Nhóm người dùng</h2>
              <CustomTextField
                value={valueGroup}
                sx={{ mr: 4 }}
                placeholder='Tìm kiếm Phòng ban'
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
          <Grid item xs={1}></Grid>
          <Grid item xs={3} component={Paper}>
            <div>
              <h2>Nhóm cơ cấu tổ chức</h2>

              <CustomTextField
                value={valueGroupIn}
                sx={{ mr: 4 }}
                placeholder='Tìm kiếm cơ cấu tổ chức'
                onChange={e => handleFilterGroupIn(e.target.value)}
              />
              <TreeView
                sx={{ minHeight: 240 }}
                defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
              >
                {groupsIn.map(rootGroup => renderGroupIn(rootGroup))}
              </TreeView>
            </div>
          </Grid>
        </Grid>
      </Card>
      {openPopupP && (
        <>
          <Edit
            open={openPopupP}
            onClose={handleClosePPopup}
            groupId={groupIds}
            groupName={groupName}
            fetchGroupData={fetchGroupData}
          />
        </>
      )}
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
