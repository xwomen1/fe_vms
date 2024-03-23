import React, { useState, useEffect } from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Icon from 'src/@core/components/icon';
import authConfig from 'src/configs/auth';
import axios from 'axios';
import { Grid } from '@mui/material';

const GroupTreeView = ({
    groups = [],
    handleGroupChange,
    valueGroup,
    handleFilterGroup,
    GroupCheckbox,
    handleGroupCheckboxChange,
    selectedGroups
  }) => {
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
  
    useEffect(() => {
      setExpanded(groups.map((group) => group?.groupId));
      setSelected(groups.map((group) => group?.groupId));
    }, [groups]);
  
    const addChildrenField = (data, parentId = null) => {
      return data.map((group) => {
        const children = data.filter((child) => child.parentId === group?.groupId);
        if (children.length > 0) {
          group.children = children;
        }

        return group;
      });
    };
  
    const findRootGroups = (data) => {
      constrootGroups = [];
      data.forEach((group) => {
        if (!data.some((item) => item.parentId === group?.groupId)) {
          rootGroups.push(group);
        }
      });

      return rootGroups;
    };
  
    const renderGroup = (group) => {
      return (
        <TreeItem
          key={group?.groupId}
          nodeId={group?.groupId}
          label={group?.groupName}
          onClick={() => handleGroupChange(group)}
        >
          {Array.isArray(group?.children)
            ? group.children.map((child) => renderGroup(child))
            : null}
        </TreeItem>
      );

    };
    
    const renderGroups = group => (
        <TreeItem
        key={group?.groupId}
        nodeId={group?.groupId}
        label={group?.groupName}
        onClick={() => handleGroupChange(group)}
      >
          {group?.children && group?.children.map(childGroup => renderGroup(childGroup))}
        </TreeItem>
      );
    
   
    return (

    //   <TreeView
    //     sx={{ minHeight: 240, width: 300 }}
    //     defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
    //     defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
    //     expanded={expanded}
    //     selected={selected}
    //     onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
    //     onNodeSelect={(event, nodeIds) => setSelected(nodeIds)}
    //   >
    //     {groups.map((rootGroup) => renderGroups(rootGroup))}
    //   </TreeView>
    <TreeView
        sx={{ minHeight: 240 }}
        defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
        defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
      >
        {groups.map(rootGroup => renderGroup(rootGroup))}
      </TreeView>
    );
  };
  
  export default GroupTreeView;