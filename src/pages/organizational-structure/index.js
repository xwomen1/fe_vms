import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import axios from 'axios';
import Icon from 'src/@core/components/icon';
import {
  Button,
  IconButton,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import authConfig from 'src/configs/auth';
import CustomTextField from 'src/@core/components/mui/text-field';
import DeletePopup from './popup/delete';
import DetailPopup from './detail/detailInfra';
import AddPopup from './popup/add';
import PopUpAdd from './popup/AddChild';

const OrganizationalStructure = () => {
  const [infra, setInfra] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [treeData, setTreeData] = useState({});
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [childData, setChildData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupId, setOpenPopupId] = useState(null);
  const [openPopupDetail, setOpenPopupDetail] = useState(false);
  const [openPopupAdd, setOpenPopupAdd] = useState(false);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const [openPopupAddChild, setOpenPopupAddChild] = useState(false);
  const [selectId, setSelectIds] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleShowItemDetail = (item) => {
    setSelectedItemDetail(item);
  };

  const handleOpenPopup = id => {
    setOpenPopupId(id);
    setOpenPopup(true);
  };

  const handleOpenPopupDetail = id => {
    setOpenPopupId(id);
    setOpenPopupDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenPopupDetail(false);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };

  const handleCloseAdd = () => {
    setOpenPopupAdd(false);
  };

  const handleOpenAdd = () => {
    setOpenPopupAdd(true);
  };

  const fetchFilter = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 10,
          page: 1,
          keyword: ''
        }
      };
      const response = await axios.get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions/adults', config);
      setInfra(response.data);

      // Fetch child data for the first tab after infra data is loaded
      if (response.data.length > 0) {
        fetchChildData(response.data[0].id);
        fetchTreeData(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddPClick = id => {
    setOpenPopupAddChild(true);
    setSelectIds(id);
    console.log(id, 'nodeid');
  };

  const handleClosePPopup = () => {
    setOpenPopupAddChild(false);
    fetchChildrenById();
  };

  const handleSuccess = async () => {
    await fetchFilter();
    setSelectedTab(0);
    if (selectedNodeId) {
      await fetchChildData(selectedNodeId);
    }
  };

  const fetchChildData = async parentId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName);

      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setChildData(response.data);
      setTreeData(prevTreeData => ({
        ...prevTreeData,
        [parentId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  useEffect(() => {
    fetchFilter();
  }, []);

  const handleChangeTab = async (event, newValue) => {
    setSelectedTab(newValue);
    setTreeData({});
    setExpandedNodes([]);
    await fetchChildData(infra[newValue]?.id);
  };

  const fetchChildrenById = async parentId => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName);

      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setChildData(response.data);
      
return response.data;
    } catch (error) {
      console.error('Error fetching children:', error);
      
return [];
    }
  };

  const handleFetchChildren = async (nodeId) => {
    const isExpanded = expandedNodes.includes(nodeId);
    if (isExpanded) {
      setExpandedNodes(expandedNodes.filter(id => id !== nodeId));
    } else {
      const childrenData = await fetchChildrenById(nodeId);
      setTreeData(prevTreeData => ({
        ...prevTreeData,
        [nodeId]: childrenData
      }));
      setExpandedNodes([...expandedNodes, nodeId]);
      setSelectedNodeId(nodeId);
    }
    setShowPlusIcon(true);
  };

  const renderTreeItems = nodes => {
    return nodes.map(node => {
      const hasChildren = treeData[node.id] && treeData[node.id].length > 0;

      return (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={
            <Box display='flex' alignItems='center' style={{ marginLeft: '5%' }} onClick={() => fetchChildData(node.id)}>
              <Typography>{node.name}</Typography>
              <IconButton style={{ marginLeft: 'auto' }} size='small' onClick={() => handleAddPClick(node.id)}>
                <Icon icon='bi:plus' />
              </IconButton>
            </Box>
          }
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
      );
    });
  };

  const currentTabInfra = infra[selectedTab] || {};
  const rootNodes = treeData[currentTabInfra.id] || [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center'>
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            variant='scrollable'
            scrollButtons='auto'
            style={{ marginRight: '30%' }}
          >
            {infra.map((infraItem, index) => (
              <Tab key={index} label={infraItem.name} style={{ fontSize: '120%' }} />
            ))}
          </Tabs>
          <Box display='flex' alignItems='center'>
            <Typography variant='body2' style={{ marginRight: '16px' }}>
              <Button variant='contained' onClick={() => handleOpenAdd()}>
                Thêm
              </Button>
            </Typography>
            <Typography variant='body2'>
              <Button variant='contained' onClick={() => handleOpenPopup(infra[selectedTab]?.id)}>
                Xóa
              </Button>
            </Typography>
          </Box>
        </Box>
      </Grid>
      {infra.length > 0 && (
        <Grid container spacing={2} style={{ height: '100%' }}>
          <Grid item xs={2.5} style={{ display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <TreeView
                defaultCollapseIcon={<Icon icon='bi:chevron-down' />}
                defaultExpandIcon={<Icon icon='bi:chevron-right' />}
                expanded={expandedNodes}
              >
                {renderTreeItems([{ id: currentTabInfra.id, name: currentTabInfra.name, isParent: true }])}
              </TreeView>
            </Paper>
          </Grid>
          <Grid item xs={9.5} style={{ display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
              <Box onClick={() => handleOpenPopupDetail(currentTabInfra.id)}>
                <CustomTextField
                  label='Tên'
                  type='text'
                  value={currentTabInfra.name}
                  fullWidth
                  style={{ marginBottom: '16px' }}
                />
              </Box>

              <CustomTextField
                label='Mã'
                type='text'
                value={currentTabInfra.type}
                fullWidth
                style={{ marginBottom: '16px' }}
              />
              <CustomTextField label='Ghi chú' type='text' value={currentTabInfra.detail} fullWidth />
            </Paper>
            <Paper elevation={3} style={{ padding: '16px', flexGrow: 1 }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên địa phương</TableCell>
                      <TableCell>Mã địa phương</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {childData.length > 0 &&
                      childData.map((child, index) => (
                        <TableRow key={child.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{child.name}</TableCell>
                          <TableCell>{child.type}</TableCell>
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
      {openPopup && <DeletePopup open={openPopup} onClose={handleClose} id={openPopupId} onSuccess={handleSuccess} />}

      {openPopupAdd && <AddPopup open={openPopupAdd} onClose={handleCloseAdd} onSuccess={handleSuccess} />}
      {openPopupDetail && (
        <DetailPopup open={openPopupDetail} onClose={handleCloseDetail} id={openPopupId} onSuccess={handleSuccess} />
      )}
      {openPopupAddChild && (
        <>
          <PopUpAdd open={openPopupAddChild} onClose={handleClosePPopup} id={selectId} onSuccess={handleSuccess} />
        </>
      )}
    </Grid>
  )
}

export default OrganizationalStructure
