import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import authConfig from 'src/configs/auth';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import axios from 'axios';
import Icon from 'src/@core/components/icon';
import { IconButton } from '@mui/material';

const OrganizationalStructure = () => {
  const [infra, setInfra] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [children, setChildren] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});

  const fetchFilter = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: pageSize,
          page: page,
          keyword: value
        }
      };
      const response = await axios.get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions/adults', config);
      setInfra(response.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchFilter();
  }, [page, pageSize, total, value]);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
    setChildren([]);
  };

  const fetchChildrenById = async (parentId) => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName);

      const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
return response.data;
    } catch (error) {
      console.error('Error fetching children:', error);
      
return [];
    }
  };

  const handleFetchChildren = async (nodeId) => {
    const isExpanded = expandedNodes[nodeId];
    if (isExpanded) {
      const newExpandedNodes = { ...expandedNodes };
      newExpandedNodes[nodeId] = false;
      setExpandedNodes(newExpandedNodes);
      setChildren(prevChildren => prevChildren.filter(child => child.parentId !== nodeId));
      
return;
    }
    const childrenData = await fetchChildrenById(nodeId);
    const newExpandedNodes = { ...expandedNodes };
    newExpandedNodes[nodeId] = true;
    setExpandedNodes(newExpandedNodes);
    setChildren(prevChildren => [
      ...prevChildren.filter(child => child.parentId !== nodeId),
      { parentId: nodeId, children: childrenData }
    ]);
  };

  const renderTreeItems = (nodes) => {
    return nodes.map((parent) => (
      <TreeItem
        key={parent.parentId}
        nodeId={parent.parentId}
        label={infra.find(item => item.id === parent.parentId)?.name}
        sx={{ marginLeft: '3%', marginTop: '2%' }}
        icon={
          <IconButton style={{ padding: '0px' }} onClick={() => handleFetchChildren(parent.parentId)}>
            <Icon icon='tabler:chevron-right' />
          </IconButton>
        }
      >
        {parent.children.map((child) => (
          <TreeItem
            key={child.id}
            nodeId={child.id}
            label={child.name}
            sx={{ marginLeft: '3%', marginTop: '2%' }}
            icon={
              child.isParent ? (
                <IconButton style={{ padding: '0px' }} onClick={() => handleFetchChildren(child.id)}>
                  <Icon icon='tabler:chevron-right' />
                </IconButton>
              ) : null
            }
          />
        ))}
      </TreeItem>
    ));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Tabs value={selectedTab} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
          {infra.map((infraItem, index) => (
            <Tab key={index} label={infraItem.name} style={{ fontSize: '130%' }} />
          ))}
        </Tabs>
      </Grid>
      {infra.length > 0 && (
        <Grid item xs={12}>
          <Grid item xs={3}>
            <IconButton style={{ padding: '0px' }} onClick={() => handleFetchChildren(infra[selectedTab].id)}>
              <Icon icon='tabler:chevron-right' />
            </IconButton>
            {infra[selectedTab].name}
            <TreeView
              defaultCollapseIcon={<Icon icon="bi:chevron-down" />}
              defaultExpandIcon={<Icon icon="bi:chevron-right" />}
              expanded={Object.keys(expandedNodes)}
            >
              {renderTreeItems(children)}
            </TreeView>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default OrganizationalStructure;
