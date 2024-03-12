// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** MUI Imports
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useSnackbar } from 'notistack';
import axios from 'axios'

const TreeViewControlled = ({ direction }) => {
  // ** States
  const [expanded, setExpanded] = useState([])
  const [selected, setSelected] = useState([])
  const [groups, setGroups] = useState([]);
  const [groupchild, setGroupChild] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds)
  }

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds)
  }
  const ExpandIcon = direction === 'rtl' ? 'tabler:chevron-left' : 'tabler:chevron-right'
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
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search?level=0', config);
        setGroups(response.data.data);
        console.log('group', response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGroupData(); // ** Fetch data from API when component mounts
  }, [enqueueSnackbar]);
  const fetchChildren = async (groupId) => {
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
      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/${groupId}/child`, config);
      setGroupChild(response.data.data)
      console.log('groupchild', response.data.data)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const renderTreeItems = useMemo(() => {
    return (group) => (
      <TreeItem
        nodeId={group.groupId}label={
          <>
            {groupchild && groupchild.length > 0 ? (
              <Icon icon="tabler:chevron-right" />
            ) : null}
            {group.groupName}
          </>
        }
        onLabelClick={async () => {
          await fetchChildren(group.groupId);

          // Thực hiện các xử lý khác tại đây nếu cần
        }}
      >
        {groupchild && groupchild.map((child) => (
          <TreeItem key={child.id} nodeId={child.id} label={child.groupName} />
        ))}
      </TreeItem>
    );
  }, [fetchChildren, groupchild]);
  return (
  <div>
      <TreeView
    expanded={expanded}
    selected={selected}
    sx={{ minHeight: 240 }}
    onNodeToggle={handleToggle}
    onNodeSelect={handleSelect}
    defaultExpandIcon={<Icon icon={ExpandIcon} />}
  >
    {groups.map((group) => renderTreeItems(group))}
  </TreeView>
  
  </div>
   
  );
}

export default TreeViewControlled
