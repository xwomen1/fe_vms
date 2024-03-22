// Trong file pages/[userId].js
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, IconButton, Button,  FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Switch, TextField } from '@mui/material';
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import { Button as ReactstrapButton } from 'reactstrap';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Autocomplete from '@mui/material/Autocomplete';
import GroupTreeView from './GroupTreeView';
import CustomAutocomplete from './CustomAutocomplete';

const UserDetails = ( ) => {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const [readOnly, setReadOnly] = useState(true);
  const [editing, setEditing] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [valueGroup, setValueGroup] = useState('')
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [defaultGroup, setDefaultGroup] = useState(null);
  const [leaderOfUnit, setLeaderOfUnit] = useState('');
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState({});

  const renderGroup = group => (
    <TreeItem key={group.groupId} nodeId={group.groupId} label={<GroupCheckbox group={group} checked={selectedGroups.some(g => g.groupId === group.groupId)} onChange={handleGroupCheckboxChange} />}>
      {group.children && group.children.map(childGroup => renderGroup(childGroup))}
    </TreeItem>
  );
  
   
  const handleNodeToggle = (groupId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [groupId]: !prevExpanded[groupId], // Đảo ngược trạng thái mở hoặc đóng của TreeView khi người dùng bấm vào biểu tượng mở rộng hoặc thu gọn
    }));
  };
  
  const handleOptionClick = (option) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [option.groupId]: !prevExpanded[option.groupId], // Đảo ngược trạng thái mở hoặc đóng của TreeView khi người dùng bấm vào một option
    }));
  };
  const toggleEdit = () => {
    setOriginalUser(user); // Lưu trữ giá trị người dùng ban đầu

    setReadOnly(false);
    setEditing(true);
  };
  const handleGroupChange = (event, newValue) => {
    setDefaultGroup(newValue); // Cập nhật giá trị defaultGroup thành giá trị mới được chọn
    console.log(newValue)
  };

  const cancelEdit = () => {
    setUser(originalUser); // Khôi phục giá trị người dùng ban đầu

    setReadOnly(true);
    setEditing(false);
  };
  const saveChanges = async () => {
    setOriginalUser(user); // Cập nhật giá trị người dùng ban đầu

    // Logic to save changes
    setReadOnly(true);
    setEditing(false);
  };
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
const handleFilterGroup = async val => {
  setValueGroup(val);
  try {
    const token = localStorage.getItem(authConfig.storageTokenKeyName);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        keyword: val,
      },
    };
    const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config);
    const dataWithChildren = addChildrenField(response.data.data);
    const rootGroups = findRootGroups(dataWithChildren);
    setGroups(rootGroups);
  } catch (error) {
    console.error('Error fetching group data:', error);
  }
};

  const addChildrenField = (data, parentId = null) => {
    return data.map(group => {
      const children = data.filter(child => child.parentId === group.groupId);
      if (children.length > 0) {
        group.children = children;
      }
      return group;
    });
  };


  const findRootGroups = (data) => {
    const rootGroups = [];
    data.forEach(group => {
      if (!data.some(item => item.groupId === group.parentId)) {
        rootGroups.push(group);
      }
    });
    return rootGroups;
  };
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            keyword: valueGroup
          }
        };
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config);
        const dataWithChildren = addChildrenField(response.data.data);
        const rootGroups = findRootGroups(dataWithChildren);
        setGroups(rootGroups);
        setGroupOptions(rootGroups); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGroupData(); 
  }, [valueGroup]);
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config);
      setUser(response.data.data);
      setOriginalUser(response.data.data);
      if (response.data.data.userGroups && response.data.data.userGroups.length > 0) {
        setDefaultGroup(response.data.data.userGroups[0]); // Cập nhật defaultGroup với đối tượng nhóm
      }
      if (response.data.data.userAccount && response.data.data.userAccount.length > 0) {
        setStatus(response.data.data.userAccount[0].accStatus); // Cập nhật defaultGroup với đối tượng nhóm
      }
      console.log(defaultGroup);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config);
        setUser(response.data.data);
        setOriginalUser(response.data.data);
        setLeaderOfUnit(response.data.data.userGroups[0].isLeader);
        
        if (response.data.data.userGroups && response.data.data.userGroups.length > 0) {
          setDefaultGroup(response.data.data.userGroups[0]); // Cập nhật defaultGroup với đối tượng nhóm
        }

        console.log(leaderOfUnit);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);
  const renderGroupInSelect = (group, selected) => (
    <TreeItem key={group.groupId} nodeId={group.groupId} label={group.groupName} selected={selected === group.groupName}>
      {group.children && group.children.map(childGroup => renderGroupInSelect(childGroup, selected))}
    </TreeItem>
  );
  const renderOption = (option, { depth = 0 }) => {
    const spacer = Array(depth * 2).join(' ');
    return (
      <div>
        <span>{spacer}{option.groupName}</span>
        {Array.isArray(option.children) && option.children.length > 0 && option.children.map(child => renderOption(child, { depth: depth + 1 }))}
      </div>
    );
  };
  
  const handleCancel = () => {
    fetchUserData(); // Load lại dữ liệu từ API khi huỷ chỉnh sửa
    setReadOnly(true);
    setEditing(false);
    // Reset các giá trị nhập về rỗng
    setUser({
      ...user,
      fullName: '', // Thêm các trường khác nếu cần
      email: '',
      //Thêm các trường khác nếu cần
    });
  };


  return (
    <div>
      {user ? (
        <div>
      
      <Grid container spacing={3}>
      <Grid container spacing={2} item xs={3}>
        <IconButton
                          size='small'
                          component={Link}
                          href={`/apps/user/list`} // Truyền userId vào đường dẫn
                          sx={{ color: 'text.secondary' }}
                        >
                          <Icon icon='tabler:chevron-left' />
                        </IconButton>
    
      <h2 style={{color: 'black'}}>Chi tiết người dùng: </h2></Grid>
<Grid item xs={3}>       
</Grid>      
     <Grid item xs={6} style={{marginTop: '1%'}}>
     <IconButton
                          size='small'
                          component={Link}
                          href={`/apps/user/detail/${user.userId}`} // Truyền userId vào đường dẫn
                          sx={{ color: 'orange' }}
                        >
                          <u>                         Thông tin cá nhân |
</u>
                        </IconButton>


                        <Button
              variant='contained'
              size='small'
              component={Link}
              href={`/apps/user/detail/${user.userId}`} // Truyền userId vào đường dẫn
              sx={{ backgroundColor: '#DCDCDC', color: 'black' }}
            >
              Thông tin định danh | 
            </Button>
            <Button
              variant='contained'
              size='small'
              component={Link}
              href={`/apps/user/detail/${user.userId}`} // Truyền userId vào đường dẫn
              sx={{ backgroundColor: '#DCDCDC', color: 'black' }}
            >
              Kiểm soát vào ra |
            </Button>
            <Button
              variant='contained'
              size='small'
              component={Link}
              href={`/apps/user/detail/${user.userId}`} // Truyền userId vào đường dẫn
              sx={{ backgroundColor: '#DCDCDC', color: 'black', marginRight: '10px' }}
            >
              Thông tin gửi xe
            </Button>
     </Grid>
      </Grid>
      <br></br>

      <Grid style={{backgroundColor:'white', borderRadius: '0.05%'}}>
    <Grid container spacing = {2} >
    <h3 style={{color: 'black', marginLeft: '1%'}}>   Thông tin người dùng</h3>

           
    </Grid>
    <Grid container spacing={2}><div style={{width: '80%'}}></div>
    {editing ? (
              <>
                <Button variant='contained' onClick={saveChanges} sx={{ marginRight: '10px' }}>
                  Lưu
                </Button>
                <Button variant='contained' onClick={handleCancel}>
                  Huỷ
                </Button>
              </>
            ) : (
              <Button variant='contained' onClick={toggleEdit}>
                Chỉnh sửa
              </Button>
            )}
           
</Grid>
<Grid container spacing={2} style={{ marginLeft: 10 }}>
  <Grid item xs={4}>
    <CustomTextField
      label='Tên'
      defaultValue={user.fullName}
      id='form-props-read-only-input'
      InputProps={{ readOnly: readOnly }}
      fullWidth
    />
  </Grid>
  <Grid item xs={4}> {/* Sửa đổi xs={4} thành xs={8} */}
    <CustomTextField
      label='Email'
      defaultValue={user.email}
      id='form-props-read-only-input'
      InputProps={{ readOnly: readOnly }}
      fullWidth // Thêm thuộc tính fullWidth vào đây
    />
  </Grid>
  <Grid item xs={3.8}> {/* Sửa đổi xs={4} thành xs={8} */}
    <CustomTextField
      label='Số điện thoại'
      defaultValue={user.phoneNumber}
      id='form-props-read-only-input'
      InputProps={{ readOnly: readOnly }}
      fullWidth // Thêm thuộc tính fullWidth vào đây
    />
  </Grid>
  <Grid item xs={4}>
    <CustomTextField
      label='Số giấy tờ'
      defaultValue={user.identityNumber}
      id='form-props-read-only-input'
      InputProps={{ readOnly: readOnly }}
      fullWidth
    />
  </Grid>
  <Grid item xs={4}>
    <CustomTextField
      label='Mã người dùng'
      defaultValue={user.userCode}
      id='form-props-read-only-input'
      InputProps={{ readOnly: readOnly }}
      fullWidth
    />
  </Grid>
  <Grid item xs={3.8}>
    <CustomTextField
      label='Mã đồng bộ'
      defaultValue={user.syncCode}
      id='form-props-read-only-input'
      InputProps={{ readOnly: readOnly }}
      fullWidth
    />
  </Grid>

  <Grid item xs={4}>
          <FormControl fullWidth>
            <Autocomplete
              options={groupOptions}
              getOptionLabel={(option) => option.groupName}
              value={defaultGroup}
              onChange={(event, newValue) => handleGroupChange(event, newValue)}
              disabled={readOnly}
              renderInput={(params) => <CustomTextField {...params} label="Đơn vị" />}
              renderOption={(props, option, { selected }) => (
                <div {...props}>
                
                  <div>
        <CustomTextField
          value={valueGroup}
          sx={{ mr: 4 }}
          placeholder='Search Group'
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
                  
                </div>
              )}
            />
          </FormControl>
        </Grid>
<Grid item xs={4} style={{marginTop:'1.1%'}}>
          <FormControlLabel
  control={<Checkbox checked={leaderOfUnit}
  onChange={(e) => setLeaderOfUnit(e.target.checked)}
  disabled={readOnly} />} // Sử dụng state leaderOfUnit để đánh dấu checkbox
  label="Là lãnh đạo đơn vị"
/>
        </Grid>
        <Grid item xs={4} style={{marginTop:'1.1%'}} >
    <FormControlLabel
      control={
        <Switch
          checked={status}
          onChange={(e) => setStatus(e.target.checked)}
          color="primary"
          disabled={readOnly}
        />
      }
      label="Trạng thái"
      labelPlacement="start"
    />
  </Grid>
  <Grid item xs={3.8}>
    <CustomTextField
      label='Thời gian hiệu lực
      '
      defaultValue={user?.customizeTime}
      id='form-props-read-only-input'
      InputProps={{ readOnly: readOnly }}
      fullWidth
    />
  </Grid>
</Grid>

    <CustomAutocomplete
      groupOptions={groupOptions}
      defaultGroup={defaultGroup}
      handleGroupChange={handleGroupChange}
      valueGroup={valueGroup}
      handleFilterGroup={handleFilterGroup}
    />
<FormControl fullWidth>
  <Autocomplete
    options={groupOptions}
    getOptionLabel={(option) => option.groupName}
    value={defaultGroup}
    onChange={(event, newValue) => handleGroupChange(event, newValue)}
    renderInput={(params) => (
      <CustomTextField
        {...params}
        label="Đơn vị"
      />
    )}
    renderOption={(props, option, { selected }) => (
      <div {...props} onClick={() => handleOptionClick(option)}>
        <TreeView
          sx={{ minHeight: 240 }}
          defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
          defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
          expanded={expanded[option.groupId]} // Sử dụng state expanded để xác định trạng thái mở hoặc đóng của TreeView
          onNodeToggle={() => handleNodeToggle(option.groupId)} // Sử dụng hàm handleNodeToggle để cập nhật trạng thái mở hoặc đóng của TreeView khi người dùng bấm vào biểu tượng mở rộng hoặc thu gọn
        >
          {renderGroup(option)}
        </TreeView>
      </div>
    )}
  />
</FormControl>

      </Grid>   
          {/* Other user details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDetails;
