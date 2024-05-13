import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid' // Import Grid from Material-UI
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import axios from 'axios'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';

const OrganizationalStructure = ({ apiData }) => {
  const [infra, setInfra] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [value, setValue] = useState('')
  const [selectedTab, setSelectedTab] = useState(0)
  const [children, setChildren] = useState([])
  const [expandedNodes, setExpandedNodes] = useState({}) // State to track expanded nodes

  const fetchFilter = async () => {
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
      const response = await axios.get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions/adults', config)
      setInfra(response.data)
      setTotal(response.data.total)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchFilter()
  }, [page, pageSize, total, value])

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue)
    setChildren([])
  }

  const fetchChildrenById = async (parentId) => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Error fetching children:', error)

      return []
    }
  }

  const handleFetchChildren = async (nodeId) => {
    // Check if the node is already expanded
    const isExpanded = expandedNodes[nodeId];
    
    if (isExpanded) {
      // If expanded, just collapse the node
      setExpandedNodes(prevState => {
        const newState = { ...prevState };
        delete newState[nodeId];
        
return newState;
      });
    } else {
      // If collapsed, fetch and expand the children
      const childrenData = await fetchChildrenById(nodeId);
      setChildren(childrenData);
    
      // Create a set to store all expanded nodes
      const expandedSet = new Set(Object.keys(expandedNodes));
    
      // Add the current node to the expanded set
      expandedSet.add(nodeId);
    
      // Add all children nodes to the expanded set
      childrenData.forEach(child => expandedSet.add(child.id));
    
      // Add all parent nodes to the expanded set (without removing other expanded nodes)
      let parentId = nodeId;
      while (infra.find(item => item.id === parentId)) {
        const parent = infra.find(item => item.id === parentId);
        expandedSet.add(parent.id);
        parentId = parent.parentID;
      }
    
      // Convert the expanded set back to an object
      const newExpandedNodes = {};
      expandedSet.forEach(node => {
        newExpandedNodes[node] = true;
      });
    
      // Update the expanded nodes state
      setExpandedNodes(newExpandedNodes);
    }
  };
  
  
  
  const renderTree = (nodes) => (
    <TreeView
      defaultCollapseIcon={<Icon icon="bi:chevron-down" />}
      defaultExpandIcon={<Icon icon="bi:chevron-right" />}
    >
      {Array.isArray(nodes) ? nodes.map((node) => (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={node.name}
          expanded={expandedNodes[node.id] || false} // Set expanded state based on expandedNodes
          onLabelClick={() => {
            if (node.isParent) {
              handleFetchChildren(node.id);
            }
          }}
          sx={{ marginLeft: '3%', marginTop: '2%' }}
          icon={node.isParent ? (
            <IconButton style={{ padding: '0px' }} onClick={() => handleFetchChildren(node.id)}>
              <Icon icon='tabler:chevron-right' />
            </IconButton>
          ) : null}
        >
          {Array.isArray(node.children) ? node.children.map((child) => (
            <TreeItem
              key={child.id}
              nodeId={child.id}
              label={child.name}
              sx={{ marginLeft: '3%', marginTop: '2%' }}
              icon={child.isParent ? (
                <IconButton style={{ padding: '0px' }} onClick={() => handleFetchChildren(child.id)}>
                  <Icon icon='tabler:chevron-right' />
                </IconButton>
              ) : null} // Icon for children with "isParent": true
            />
          )) : null}
        </TreeItem>
      )) : null}
    </TreeView>
  );
  
  

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Tabs value={selectedTab} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
          {infra.map((infraItem, index) => (
            <Tab key={index} label={infraItem.name} style={{fontSize:'130%'}}/>
          ))}
        </Tabs>
      </Grid>
      {infra.length > 0 && (
        <Grid item xs={12}>
            <Grid item xs = {3}>
            <IconButton style={{padding:'0px'}} onClick={() => handleFetchChildren(infra[selectedTab].id)}>
              <Icon icon='tabler:chevron-right' />
            </IconButton>
            {infra[selectedTab].name}
          {renderTree(children)}
            </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default OrganizationalStructure
