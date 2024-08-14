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

const OrganizationalStructure = () => {
  const [infra, setInfra] = useState([])
  const [selectedTab, setSelectedTab] = useState(0)
  const selectedTabRef = useRef(selectedTab)
  const [treeData, setTreeData] = useState({})
  const [expandedNodes, setExpandedNodes] = useState([])
  const [childData, setChildData] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupId, setOpenPopupId] = useState(null)
  const [openPopupDetail, setOpenPopupDetail] = useState(false)
  const [openPopupAdd, setOpenPopupAdd] = useState(false)
  const [showPlusIcon, setShowPlusIcon] = useState(false)
  const [openPopupAddChild, setOpenPopupAddChild] = useState(false)
  const [selectId, setSelectIds] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [operationType, setOperationType] = useState(null)
  const [info, setInffo] = useState([])
  useEffect(() => {
    selectedTabRef.current = selectedTab
  }, [selectedTab])

  const handleShowItemDetail = item => {
    setSelectedItemDetail(item)
  }

  const handleOpenPopup = id => {
    setOpenPopupId(id)
    setOpenPopup(true)
    setOperationType('delete')
  }

  const handleOpenPopupDetail = id => {
    setOpenPopupId(id)
    setOpenPopupDetail(true)
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
      const response = await axios.get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions/adults', config)
      setInfra(response.data)

      if (response.data.length > 0) {
        fetchChildData(response.data[selectedTab].id)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleAddPClick = id => {
    setOpenPopupAddChild(true)
    setSelectIds(id)
    setOperationType('addChild')
    console.log(id, 'nodeid')
  }

  const handleClosePPopup = () => {
    setOpenPopupAddChild(false)
    fetchChildrenById()
  }

  const handleSuccess = async () => {
    await fetchFilter()
    if (operationType === 'delete') {
      if (selectedTabRef.current > 0) {
        setSelectedTab(selectedTabRef.current)
      } else {
        setSelectedTab(0)
      }
    } else if (operationType === 'add') {
      setSelectedTab(infra.length)
    } else {
      setSelectedTab(selectedTabRef.current)
    }
    if (selectedNodeId) {
      await fetchChildData(selectedNodeId)
    }
    setOperationType(null)
  }

  const fetchChildData = async parentId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setChildData(response.data)
      setTreeData(prevTreeData => ({
        ...prevTreeData,
        [parentId]: response.data
      }))
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
    setTreeData({})
    setExpandedNodes([])
    await fetchChildData(infra[id]?.id)
  }

  const fetchChildrenById = async parentId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setChildData(response.data)

      return response.data
    } catch (error) {
      console.error('Error fetching children:', error)

      return []
    }
  }

  const handleFetchChildren = async nodeId => {
    const isExpanded = expandedNodes.includes(nodeId)
    if (isExpanded) {
      setExpandedNodes(expandedNodes.filter(id => id !== nodeId))
    } else {
      const childrenData = await fetchChildrenById(nodeId)
      setTreeData(prevTreeData => ({
        ...prevTreeData,
        [nodeId]: childrenData
      }))
      setExpandedNodes([...expandedNodes, nodeId])
      setSelectedNodeId(nodeId)
    }
    setShowPlusIcon(true)
  }

  const renderTreeItems = nodes => {
    return nodes.map(node => {
      const hasChildren = treeData[node.id] && treeData[node.id].length > 0

      return (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={
            <Box display='flex' alignItems='center' style={{ marginLeft: '5%' }}>
              <Typography>{node.name}</Typography>
              <IconButton
                style={{ marginLeft: 'auto' }}
                size='small'
                onClick={() => {
                  handleAddPClick(node.id)
                  console.log(node.id)
                }}
              >
                <Icon icon='bi:plus' />
              </IconButton>
              <IconButton
                size='small'
                onClick={() => {
                  handleOpenPopup(node.id)
                  console.log(node.id)
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
              <IconButton size='small'>
                <Icon icon='tabler:edit' onClick={() => handleOpenPopupDetail(node.id)} />
              </IconButton>
            </Box>
          }
          onClick={() => console.log(node.id)}
          sx={{ marginLeft: '3%', marginTop: '4%' }}
          icon={
            node.isParent ? (
              <Box display='flex' alignItems='center'>
                <IconButton style={{ padding: '0px' }} onClick={() => handleFetchChildren(node.id)}>
                  <Icon icon={expandedNodes.includes(node.id) ? 'bi:chevron-down' : 'tabler:chevron-right'} />
                </IconButton>
              </Box>
            ) : null
          }
        >
          {hasChildren && renderTreeItems(treeData[node.id])}
        </TreeItem>
      )
    })
  }

  const currentTabInfra = infra[selectedTab] || {}
  const rootNodes = treeData[currentTabInfra.id] || []

  const fetchId = async nodeId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${nodeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setInffo(response.data)
    } catch (error) {
      console.error('Error fetching children:', error)

      return []
    }
  }

  const getIdFromValue = value => {
    if (!info && !currentTabInfra) return null
    if (info && info.name === value) return info.id
    if (currentTabInfra && currentTabInfra.name === value) return currentTabInfra.id

    return null
  }

  const handleNodeSelect = (event, nodeId) => {
    console.log(nodeId)
    fetchId(nodeId)
  }

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
                              onClick={() => handleOpenPopupDetail(infraItem.id)}
                            >
                              <Icon icon='tabler:edit' />
                            </IconButton>
                            <IconButton
                              style={{
                                color: selectedTab === index ? '#fff' : 'inherit'
                              }}
                              onClick={() => handleAddPClick(infraItem.id)}
                            >
                              <Icon icon='tabler:plus' />
                            </IconButton>
                            <IconButton
                              size='small'
                              onClick={() => {
                                handleOpenPopup(infraItem.id)
                                console.log(infraItem.id)
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
                  <TreeView
                    aria-label='file system navigator'
                    defaultCollapseIcon={<Icon icon='mdi:folder-open-outline' />}
                    defaultExpandIcon={<Icon icon='mdi:folder-outline' />}
                    expanded={expandedNodes}
                    sx={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}
                    onNodeSelect={handleNodeSelect}
                  >
                    {renderTreeItems(rootNodes)}
                  </TreeView>
                </Paper>
              </Grid>
              <Grid item xs={7} style={{ display: 'flex', flexDirection: 'column' }}>
                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                  <CustomTextField
                    label='Name'
                    type='text'
                    value={info ? info.name : currentTabInfra.name || ''}
                    fullWidth
                    style={{ marginBottom: '16px' }}
                    onClick={() => handleOpenPopupDetail(getIdFromValue(info ? info.name : currentTabInfra.name || ''))}
                  />
                  <CustomTextField
                    label='Code'
                    type='text'
                    value={info ? info.code : currentTabInfra.code || ''}
                    fullWidth
                    style={{ marginBottom: '16px' }}
                    onClick={() => handleOpenPopupDetail(getIdFromValue(info ? info.code : currentTabInfra.code || ''))}
                  />
                  <CustomTextField
                    label='Detail'
                    type='text'
                    value={info ? info.detail : currentTabInfra.detail || ''}
                    fullWidth
                    onClick={() =>
                      handleOpenPopupDetail(getIdFromValue(info ? info.detail : currentTabInfra.detail || ''))
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
                                  <Icon icon='tabler:edit' onClick={() => handleOpenPopupDetail(child.id)} />
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
