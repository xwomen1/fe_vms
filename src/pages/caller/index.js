import React, { useState, useEffect } from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Icon from 'src/@core/components/icon';
import authConfig from 'src/configs/auth';
import axios from 'axios';
import { Grid } from '@mui/material';

const TreeViewBasic = ({ direction }) => {
  const ExpandIcon = direction === 'rtl' ? 'tabler:chevron-left' : 'tabler:chevron-right';

  // State để lưu trữ dữ liệu từ API
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const GroupCheckbox = ({ group, checked, onChange }) => {
    return (
      <div>
        <input
          type="checkbox"
          id={`group-${group.groupId}`}
          checked={checked}
          onChange={(e) => onChange(group.groupId, e.target.checked)}
        />
        <label htmlFor={`group-${group.groupId}`}>{group.groupName}</label>
      </div>
    );
  };

  const handleGroupCheckboxChange = (groupId, checked) => {
    if (checked) {
      setSelectedGroups(prevGroups => [...prevGroups, { groupId }]);
    } else {
      setSelectedGroups(prevGroups => prevGroups.filter(g => g.groupId !== groupId));
    }
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // ** Lấy token từ local storage
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)
        // ** Đặt header Authorization bằng token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // ** Gọi API với token 
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config);
        const dataWithChildren = addChildrenField(response.data.data);
        const rootGroups = findRootGroups(dataWithChildren);
        setGroups(rootGroups);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGroupData(); // ** Fetch data from API when component mounts
  }, []);

  const addChildrenField = (data, parentId = null) => {
    return data.map(group => {
      const children = data.filter(child => child.parentId === group.groupId);
      if (children.length > 0) {
        group.children = children;
      }
      return group;
    });
  };

  const renderGroup = group => (
    <TreeItem key={group.groupId} nodeId={group.groupId} label={<GroupCheckbox group={group} checked={selectedGroups.some(g => g.groupId === group.groupId)} onChange={handleGroupCheckboxChange} />}>
      {group.children && group.children.map(childGroup => renderGroup(childGroup))}
    </TreeItem>
  );

  const findRootGroups = (data) => {
    const rootGroups = [];
    data.forEach(group => {
      if (!data.some(item => item.groupId === group.parentId)) {
        rootGroups.push(group);
      }
    });
    return rootGroups;
  };

  return (
    <div>
      <TreeView
        sx={{ minHeight: 240 }}
        defaultExpandIcon={<Icon icon={ExpandIcon} />}
        defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
      >
        {groups.map(rootGroup => renderGroup(rootGroup))}
      </TreeView>
    </div>
  );
};

export default TreeViewBasic;
