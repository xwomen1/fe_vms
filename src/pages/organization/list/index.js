import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  IconButton,
  TableRow
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import PopUpAdd from '../popups/add'
import PopUpAddInfa from '../popups/addInfa'
import Delete from '../popups/delete'
import DetailPopup from '../detail/detailInfra'

const Organization = () => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [adults, setAdults] = useState([])
  const [treeData, setTreeData] = useState({})
  const [currentNodeId, setCurrentNodeId] = useState(null)
  const [expandedNodes, setExpandedNodes] = useState([])
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState(null)
  const [loadingNodes, setLoadingNodes] = useState({})
  const [loadingChildren, setLoadingChildren] = useState(false)
  const [openPopupDetail, setOpenPopupDetail] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [selectedCode, setSelectedCode] = useState('')
  const [selectedDetail, setSelectedDetail] = useState('')
  const [childrenData, setChildrenData] = useState([]) // State để lưu dữ liệu con
  const [openPopupId, setOpenPopupId] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupInfa, setOpenPopupInfa] = useState(false)
  const [openPopupDelete, setOpenPopupDelete] = useState(false)

  useEffect(() => {
    fetchData()
  }, [reload])

  const fetchData = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions/adults', config)
      const data = response.data
      setAdults(data)
    } catch (error) {
      console.error('Error fetching adults:', error)
      toast.error(error.message || 'Error fetching adults')
    } finally {
      setLoading(false)
    }
  }

  const fetchChildren = async parentId => {
    setLoadingChildren(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`,
        config
      )
      const data = response.data
      setTreeData(prev => ({
        ...prev,
        [parentId]: data
      }))
      setChildrenData(data) // Cập nhật dữ liệu con vào state
    } catch (error) {
      console.error('Error fetching children:', error)
      toast.error(error.message || 'Error fetching children')
    } finally {
      setLoadingChildren(false)
    }
  }

  const handleNodeToggle = async (event, nodeId) => {
    setLoadingNodes(prev => ({ ...prev, [nodeId]: true }))

    try {
      await fetchChildren(nodeId) // Gọi API để tải dữ liệu
    } catch (error) {
      console.error('Error fetching children:', error)
    } finally {
      setLoadingNodes(prev => ({ ...prev, [nodeId]: false })) // Tắt trạng thái đang tải sau khi tải xong
    }

    // Cập nhật trạng thái expandedNodes
    setExpandedNodes(prev => {
      const isNodeExpanded = prev.includes(nodeId)
      if (isNodeExpanded) {
        return prev.filter(id => id !== nodeId)
      } else {
        return [...prev, nodeId]
      }
    })
  }

  const renderTreeItems = (nodes = []) => {
    return nodes.map(node => {
      const hasChildren = treeData[node.id] && treeData[node.id].length > 0
      const isLoading = loadingNodes[node.id]
      const isSelected = selectedId === node.id

      return (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              onClick={() => {
                setSelectedId(node.id)
                setSelectedName(node.name)
                setSelectedCode(node.code)
                setSelectedDetail(node.detail)
                handleNodeToggle(null, node.id)
                setCurrentNodeId(node.id)
              }}
              sx={{
                backgroundColor: isSelected ? '#e0e0e0' : 'inherit',
                borderRadius: '4px',
                padding: '0.5rem',
                width: '120%',
                marginLeft: '-15%',
                boxSizing: 'border-box'
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {node.name}
              </Typography>
              <Box display='flex' alignItems='center'>
                {node.isParent && (
                  <Icon
                    icon={expandedNodes.includes(node.id) ? 'tabler:chevron-down' : 'tabler:chevron-right'}
                    style={{ fontSize: '20px', marginRight: '8px' }} // Ensure same fontSize for both icons
                  />
                )}
                <IconButton size='small' onClick={() => handleAddNode(node.id)}>
                  <Icon icon='tabler:plus' />
                </IconButton>
                <IconButton>
                  <Icon icon='tabler:trash' onClick={() => handleOpenPopupDelete(node.id)} />
                </IconButton>
                <IconButton>
                  <Icon icon='tabler:edit' onClick={() => handleOpenPopupDetail(node.id)} />
                </IconButton>
              </Box>
            </Box>
          }
          sx={{ marginLeft: '3%', marginTop: '4%' }}
        >
          {expandedNodes.includes(node.id) && hasChildren && renderTreeItems(treeData[node.id])}
        </TreeItem>
      )
    })
  }

  useEffect(() => {
    if (currentNodeId) {
      fetchChildren(currentNodeId)
    }
  }, [currentNodeId, reload])

  useEffect(() => {
    if (selectedParentId) {
      fetchChildren(selectedParentId)
    }
  }, [selectedParentId, reload])

  const handleAddMe = id => {
    setOpenPopup(true)
    setOpenPopupId(id)
  }

  const handleAddInfa = () => {
    setOpenPopupInfa(true)
  }

  const handleAddNode = id => {
    setOpenPopup(true)
    setOpenPopupId(id)
  }

  const handleClose = () => {
    setOpenPopup(false)
  }

  const handleCloseDelete = () => {
    setOpenPopupDelete(false)
  }

  const handleOpenPopupDetail = id => {
    console.log(id, 'id')
    setOpenPopupId(id)
    setOpenPopupDetail(true)
  }

  const handleOpenPopupDelete = id => {
    setOpenPopupId(id)
    setOpenPopupDelete(true)
  }

  const handleCloseDetail = () => {
    setOpenPopupDetail(false)
    setReload(prev => prev + 1)
  }

  const handleCloseInfa = () => {
    console.log('đóng')

    setOpenPopupInfa(false)
  }

  return (
    <>
      <Card>
        <CardHeader
          title={<Button variant='contained'>Manage Organizational Structure</Button>}
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button variant='contained' onClick={() => handleAddInfa()}>
                    Add <Icon icon='tabler:plus' />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          }
        />
      </Card>
      <Grid style={{ margin: '0.3rem' }}></Grid>
      <Grid container spacing={2} style={{ height: '90%' }}>
        <Grid item xs={2.5} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            <Grid container spacing={1}>
              {adults.map(org => (
                <Grid item xs={12} key={org.id}>
                  <Paper
                    elevation={2}
                    style={{
                      padding: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: selectedParentId === org.id ? '#f0f0f0' : 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => {
                      setSelectedParentId(org.id)
                      setSelectedId(org.id)
                      setSelectedName(org.name)
                      setSelectedCode(org.code)
                      setSelectedDetail(org.detail)
                      setCurrentNodeId(org.id)
                    }}
                  >
                    <Typography variant='subtitle1'>{org.name}</Typography>
                    <Box display='flex' alignItems='center'>
                      <Button onClick={() => handleAddMe(org.id)} style={{ marginRight: '0.3rem' }}>
                        <Icon icon='tabler:plus' />
                      </Button>
                      <Button>
                        <Icon icon='tabler:trash' onClick={() => handleOpenPopupDelete(org.id)} />
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={2.5} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper
            elevation={3}
            style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '1rem', width: '100%' }}
          >
            <Typography variant='h6'>List</Typography>
            {loadingChildren ? (
              <Typography variant='body1'>Loading data...</Typography>
            ) : (
              <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
                <TreeView aria-label='treeview' sx={{ width: '100%', height: '100%' }} expanded={expandedNodes}>
                  {renderTreeItems(treeData[selectedParentId] || [])}
                </TreeView>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Card>
            <CardHeader title='Detail' />
            <Paper>
              <Grid container spacing={3} style={{ padding: '1rem' }}>
                <Grid item xs={12}>
                  <CustomTextField fullWidth label='Name' value={selectedName} />
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField fullWidth label='Code' value={selectedCode} />
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField fullWidth label='Detail' value={selectedDetail} />
                </Grid>
              </Grid>
            </Paper>
          </Card>
          <Card>
            <CardHeader title='List ' />
            <Paper>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>NO.</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>Detail</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {childrenData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>Data is not available</TableCell>
                      </TableRow>
                    ) : (
                      childrenData.map((child, index) => (
                        <TableRow key={child.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{child.name}</TableCell>
                          <TableCell>{child.code}</TableCell>
                          <TableCell>{child.detail}</TableCell>
                          <TableCell>
                            <IconButton>
                              <Icon icon='tabler:edit' onClick={() => handleOpenPopupDetail(child.id)} />
                            </IconButton>
                            <IconButton>
                              <Icon icon='tabler:trash' onClick={() => handleOpenPopupDelete(child.id)} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Card>
        </Grid>
      </Grid>
      {openPopupInfa && (
        <PopUpAddInfa open={openPopupInfa} onClose={handleCloseInfa} setReload={() => setReload(reload + 1)} />
      )}
      {openPopup && (
        <PopUpAdd open={openPopup} onClose={handleClose} id={openPopupId} setReload={() => setReload(reload + 1)} />
      )}
      {openPopupDetail && (
        <DetailPopup
          open={openPopupDetail}
          onClose={handleCloseDetail}
          id={openPopupId}
          setReload={() => setReload(reload + 1)}
        />
      )}
      {openPopupDelete && (
        <Delete
          open={openPopupDelete}
          onClose={handleCloseDelete}
          id={openPopupId}
          setReload={() => setReload(reload + 1)}
        />
      )}
    </>
  )
}

export default Organization
