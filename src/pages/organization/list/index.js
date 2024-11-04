import React, { useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import axios from 'axios'
import Icon from 'src/@core/components/icon'
import {
  Button,
  IconButton,
  Typography,
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import DeletePopup from '../popup/delete'
import DetailPopup from '../detail/detailInfra'
import AddPopup from '../popup/add'
import PopUpAdd from '../popup/AddChild'
import { node } from 'stylis'

const OrganizationalStructure = () => {
  const [infra, setInfra] = useState([])
  const [selectedTab, setSelectedTab] = useState(null)
  const selectedTabRef = useRef(selectedTab)
  const [treeData, setTreeData] = useState([])
  const [expandedNodes, setExpandedNodes] = useState([])
  const [childData, setChildData] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupId, setOpenPopupId] = useState(null)
  const [openPopupCode, setOpenPopupCode] = useState(null)
  const [openPopupDetail, setOpenPopupDetail] = useState(false)
  const [openPopupAdd, setOpenPopupAdd] = useState(false)
  const [selectedGroups, setSelectedGroups] = useState([])
  const [openPopupAddChild, setOpenPopupAddChild] = useState(false)
  const [selectId, setSelectIds] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [operationType, setOperationType] = useState(null)
  const [info, setInffo] = useState({})
  const [idGroup, setIdGroup] = useState(null)
  useEffect(() => {
    selectedTabRef.current = selectedTab
  }, [selectedTab])

  const handleOpenPopup = id => {
    setOpenPopupId(id)
    setOpenPopupCode(id.code)
    setOpenPopup(true)
    setOperationType('delete')
  }

  const handleOpenPopupDetail = id => {
    setOpenPopupCode(id.code)
    setOpenPopupId(id.id)
    setOpenPopupDetail(true)
    setOperationType('detail')
  }

  const handleCloseDetail = () => {
    setOpenPopupDetail(false)
  }

  const handleClose = () => {
    setOpenPopup(false)
  }

  const handleCloseAdd = () => {
    setOpenPopupAdd(false)
  }

  const handleOpenAdd = () => {
    setOpenPopupAdd(true)
    setOperationType('add')
  }

  const fetchFilter = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 10,
          page: 1,
          keyword: ''
        }
      }

      const response = await axios.get('https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/adults', config)
      setInfra(response.data)

      if (response.data.length > 0) {
        const parentId = response.data[selectedTab]?.code

        await fetchChildData(parentId)
        expandedNodes.forEach(async nodeId => {
          await fetchChildData(nodeId)
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleAddPClick = id => {
    setOpenPopupAddChild(true)
    setOpenPopupCode(id.code)
    setSelectIds(id.id)
    setOperationType('addChild')
  }

  const handleClosePPopup = () => {
    setOpenPopupAddChild(false)
    fetchChildrenById()
  }

  const fetchId = async nodeId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/code?code=${nodeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setInffo(response.data[0])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSuccess = async code => {
    if (operationType === 'delete') {
      setInffo(null)
      setIdGroup(infra[selectedTab] || {})
      fetchChildDataNote(infra[selectedTab].code)
    }

    if (operationType === 'detail') {
      const effectiveCode = code.type || infra[selectedTab].code
      fetchId(effectiveCode)
      fetchChildDataNote(effectiveCode)
    }
    if (operationType === 'addChild') {
      fetchId(openPopupCode)
      fetchChildDataNote(openPopupCode)
    }

    await fetchFilter()

    if (selectedNodeId) {
      const nodeId = selectedNodeId
      const parentId = treeData[nodeId]?.code

      if (parentId) {
        await fetchChildData(parentId)
      }
      await fetchChildData(nodeId)
    }

    setOperationType(null) // Reset operation type
  }

  const fetchChildDataNote = async parentId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setChildData(response.data || [])
    } catch (error) {
      console.error('Error fetching children:', error)
      setChildData([])
      setSelectedTab(null)
    }
  }

  const addChildrenField = data => {
    return data.map(group => {
      const children = data.filter(child => child.parentID === group.id)
      if (children.length > 0) {
        group.children = children
      }

      return group
    })
  }

  const findRootGroups = data => {
    const rootGroups = []
    data.forEach(group => {
      if (!data.some(item => item.id === group.parentID)) {
        rootGroups.push(group)
      }
    })

    return rootGroups
  }

  const handleGroupCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectedGroups(prevGroups => [...prevGroups, { id }])
    } else {
      setSelectedGroups(prevGroups => prevGroups.filter(g => g.id !== id))
    }
  }

  const GroupCheckbox = ({ group, checked, onChange }) => {
    const handleNameClick = async () => {
      await fetchId(group.code)
      await fetchChildDataNote(group.code)
    }

    return (
      <Box
        onClick={handleNameClick}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        style={{ width: '100%' }}
      >
        <Typography onClick={handleNameClick} style={{ flexGrow: 1, cursor: 'pointer', height: '100%' }}>
          {group.name}
        </Typography>
        <Box display='flex' alignItems='center'>
          <IconButton
            size='small'
            onClick={() => {
              handleOpenPopupDetail(group)
            }}
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton
            onClick={() => {
              handleOpenPopup(group.id)
            }}
            size='small'
          >
            <Icon icon='tabler:trash' />
          </IconButton>
          <IconButton
            onClick={() => {
              handleAddPClick(group)
            }}
            size='small'
          >
            <Icon icon='tabler:plus' />
          </IconButton>
        </Box>
      </Box>
    )
  }

  const fetchChildData = async parentId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const dataWithChildren = addChildrenField(response.data)
      const rootGroups = findRootGroups(dataWithChildren)
      setTreeData(rootGroups)
    } catch (error) {
      console.error('Error fetching children:', error)
    }
  }

  useEffect(() => {
    fetchFilter()
  }, [])

  const handleChangeTab = async id => {
    setSelectedTab(id)
    setInffo(null)
    setExpandedNodes([])
    await fetchChildData(infra[id]?.code)
    await fetchChildDataNote(infra[id]?.code)
    setIdGroup(infra[id])
  }

  const fetchChildrenById = async parentId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setChildData(response.data || [])

      return response.data
    } catch (error) {
      console.error('Error fetching children:', error)

      return []
    }
  }

  const currentTabInfra = infra[selectedTab] || {}

  const getIdFromValue = value => {
    if (!info && !currentTabInfra) return null
    if (info && info.name === value) return info
    if (currentTabInfra && currentTabInfra.name === value) return currentTabInfra

    return null
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
      expandIcon={group.isParent ? <Icon icon='tabler:chevron-right' /> : null}
      collapseIcon={<Icon icon='tabler:chevron-down' />}
    >
      {group.children && group.children.map(childGroup => renderGroup(childGroup))}
    </TreeItem>
  )

  return (
    <>
      <Card>
        <CardHeader
          title={
            <>
              <Button variant='contained'>Organizational Structure</Button>
            </>
          }
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center'],
            width: '100%'
          }}
          action={
            <Grid container spacing={2}>
              <Box display='flex' alignItems='center'>
                <Typography variant='body2' style={{ marginRight: '16px' }}>
                  <Button variant='contained' onClick={() => handleOpenAdd()}>
                    Add
                  </Button>
                </Typography>
              </Box>
            </Grid>
          }
        />

        <Grid container spacing={0}>
          {infra.length > 0 && (
            <Grid container spacing={2} style={{ height: '100%' }}>
              <Grid item xs={2.5}>
                <Paper elevation={3} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    {infra.map((infraItem, index) => (
                      <Box
                        key={index}
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '8px' }}
                      >
                        <Button
                          onClick={() => handleChangeTab(index)}
                          variant={selectedTab === index ? 'contained' : 'outlined'}
                          style={{
                            marginRight: '8px',
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: selectedTab === index ? '#1976d2' : 'transparent',
                            color: selectedTab === index ? '#fff' : 'inherit'
                          }}
                        >
                          <span>{infraItem.name}</span>
                          <Box style={{ display: 'flex' }}>
                            <IconButton
                              style={{
                                marginRight: '8px',
                                color: selectedTab === index ? '#fff' : 'inherit'
                              }}
                              onClick={() => handleOpenPopupDetail(infraItem)}
                            >
                              <Icon icon='tabler:edit' />
                            </IconButton>
                            <IconButton
                              style={{
                                color: selectedTab === index ? '#fff' : 'inherit'
                              }}
                              onClick={() => handleAddPClick(infraItem)}
                            >
                              <Icon icon='tabler:plus' />
                            </IconButton>
                            <IconButton
                              size='small'
                              onClick={() => {
                                handleOpenPopup(infraItem.id)
                              }}
                            >
                              <Icon icon='tabler:trash' />
                            </IconButton>
                          </Box>
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={2.5} style={{ display: 'flex', flexDirection: 'column' }}>
                <Paper elevation={3} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {selectedTab !== null && (
                    <Button onClick={() => handleAddPClick(idGroup)}>
                      <Icon icon='tabler:plus' />
                    </Button>
                  )}

                  <TreeView
                    sx={{ minHeight: 240 }}
                    defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                    defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                  >
                    {treeData.length > 0 &&
                      treeData[0].children &&
                      treeData[0].children.map(childGroup => renderGroup(childGroup))}
                  </TreeView>
                </Paper>
              </Grid>
              <Grid item xs={7} style={{ display: 'flex', flexDirection: 'column' }}>
                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                  <CustomTextField
                    label='Name'
                    type='text'
                    value={info ? info?.name : currentTabInfra.name || ''}
                    fullWidth
                    style={{ marginBottom: '16px' }}
                    disabled={selectedTab === null} // Vô hiệu hóa nếu selectedTab là null
                    onClick={() =>
                      handleOpenPopupDetail(getIdFromValue(info ? info?.name : currentTabInfra.name || ''))
                    }
                  />
                  <CustomTextField
                    label='Code'
                    type='text'
                    value={info ? info?.code : currentTabInfra.code || ''}
                    fullWidth
                    style={{ marginBottom: '16px' }}
                    disabled={selectedTab === null} // Vô hiệu hóa nếu selectedTab là null
                    onClick={() =>
                      handleOpenPopupDetail(getIdFromValue(info ? info?.name : currentTabInfra.name || ''))
                    }
                  />
                  <CustomTextField
                    label='Detail'
                    type='text'
                    value={info ? info?.detail : currentTabInfra.detail || ''}
                    fullWidth
                    disabled={selectedTab === null} // Vô hiệu hóa nếu selectedTab là null
                    onClick={() =>
                      handleOpenPopupDetail(getIdFromValue(info ? info?.name : currentTabInfra.name || ''))
                    }
                  />
                </Paper>

                <Paper elevation={3} style={{ padding: '16px', flexGrow: 1 }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>NO.</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {childData.length > 0 &&
                          childData.map((child, index) => (
                            <TableRow key={child.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{child.name}</TableCell>
                              <TableCell>{child.code}</TableCell>
                              <TableCell sx={{ padding: '16px' }}>
                                <IconButton size='small'>
                                  <Icon icon='tabler:edit' onClick={() => handleOpenPopupDetail(child)} />
                                </IconButton>
                                <IconButton onClick={() => handleOpenPopup(child.id)}>
                                  <Icon icon='tabler:trash' />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {openPopup && (
            <DeletePopup open={openPopup} onClose={handleClose} id={openPopupId} onSuccess={handleSuccess} />
          )}

          {openPopupAdd && <AddPopup open={openPopupAdd} onClose={handleCloseAdd} onSuccess={handleSuccess} />}
          {openPopupDetail && (
            <DetailPopup
              open={openPopupDetail}
              onClose={handleCloseDetail}
              id={openPopupId}
              onSuccess={handleSuccess}
            />
          )}
          {openPopupAddChild && (
            <>
              <PopUpAdd open={openPopupAddChild} onClose={handleClosePPopup} id={selectId} onSuccess={handleSuccess} />
            </>
          )}
        </Grid>
      </Card>
    </>
  )
}

export default OrganizationalStructure
