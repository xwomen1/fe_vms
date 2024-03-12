// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
// import IconButton from '@mui/material/IconButton'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import authConfig from 'src/configs/auth'
// import { Table } from 'reactstrap';
import Table from '@mui/material/Table';

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { IconButton, Tooltip ,Badge} from '@mui/material';
import Swal from 'sweetalert2';

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'
import { useRouter } from 'next/router';

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import { style } from '@mui/system'

// ** renders client column
const userRoleObj = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  author: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  subscriber: { icon: 'tabler:user', color: 'warning' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** renders client column
const renderClient = row => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href='/apps/user/view/account'
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

function showAlertConfirm(options, intl) {
  const defaultProps = {
    title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
    imageWidth: 213,
    showCancelButton: true,
    showCloseButton: true,
    showConfirmButton: true,
    focusCancel: true,
    reverseButtons: true,
    confirmButtonText: intl
      ? intl.formatMessage({ id: 'app.button.OK' })
      : 'Đồng ý',
    cancelButtonText: intl
      ? intl.formatMessage({ id: 'app.button.cancel' })
      : 'Hủy',
    customClass: {
      content: 'content-class',
      confirmButton: 'swal-btn-confirm',
    },
  };
  return Swal.fire({ ...defaultProps, ...options });
}
const columns = [
  { field: 'index', headerName: 'STT', flex: 0.05 },
  { field: 'userId', headerName: 'ID', flex: 0.25 },
  { field: 'fullName', headerName: 'Full Name', flex: 0.25 },
  { field: 'email', headerName: 'Email', flex: 0.25 },
  // { field: 'role', headerName: 'Role', flex: 0.25 },
  { field: 'userCode', headerName: 'userCode', flex: 0.25 },
  { field: 'identityNumber', headerName: 'identityNumber', flex: 0.25 },
  { field: 'userStatus', headerName: 'Status', flex: 0.25 },
  
];
const UserList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const paginatedData = userData.slice(page * pageSize, (page + 1) * pageSize);
  const router = useRouter();
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1)
  };
  // ** Hooks
  const dispatch = useDispatch()
  const [reload, setReload] = useState(0);
  const [groupOptions, setGroupOptions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const token = localStorage.getItem(authConfig.storageTokenKeyName);
    const [filteredUserData, setFilteredUserData] = useState([]);

  const GroupCheckbox = ({ group, checked, onChange }) => {
    return (
      <div>
        <input
          type="checkbox"
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
    const fetchFilteredUsers = async () => {
      try {
        // ** Lấy token từ local storage
        const token = localStorage.getItem(authConfig.storageTokenKeyName);
  
        // ** Đặt header Authorization bằng token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        // ** Gọi API với token
        const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?groupIds=${selectedGroups.map(g => g.groupId).join(',')}`, config);
        setUserData(response.data.data.rows);
      } catch (error) {
        console.error('Error fetching filtered users:', error);
      }
    };
  
    if (selectedGroups.length > 0) {
      fetchFilteredUsers();
    } else {
      // Clear userData if no groups are selected
      // setUserData(response.data.data.rows);
    }
  }, [selectedGroups]);
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
        setGroupOptions(response.data.data);
        console.log('user', response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGroupData(); // ** Fetch data from API when component mounts
  }, []);
  const store = useSelector(state => state.user)
  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

 
 
  const handleDelete = (idDelete) => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?',
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName);
  
        if (!token) {
          // Xử lý khi không có token
          return;
        }
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        let urlDelete = `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${idDelete}`;
  
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Xóa thành công', '', 'success');
            // Cập nhật lại danh sách dữ liệu sau khi xóa thành công
            const updatedData = userData.filter(user => user.userId !== idDelete);
            setUserData(updatedData);
            fetchData()
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.message, 'error');
          });
      }
    });
  };
  
  
  // const handlePlanChange = useCallback(e => {
  //   setPlan(e.target.value)
  // }, [])

  // const handleStatusChange = useCallback(e => {
  //   setStatus(e.target.value)
  // }, [])
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  useEffect(() => {
    const fetchFilteredOrAllUsers = async () => {
      try {
        // ** Lấy token từ local storage
        const token = localStorage.getItem(authConfig.storageTokenKeyName);
  
        // ** Đặt header Authorization bằng token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        let url;
  
        if (selectedGroups.length > 0) {
          // If there are selected groups, fetch filtered users
          url = `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?groupIds=${selectedGroups.map(g => g.groupId).join(',')}`;
        } else {
          // If no groups are selected, fetch all users
          url = 'https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search';
        }
  
        // ** Gọi API với token
        const response = await axios.get(url, config);
        setUserData(response.data.data.rows);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchFilteredOrAllUsers();
  }, [selectedGroups]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ** Lấy token từ local storage
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)
        // ** Đặt header Authorization bằng token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: pageSize,
            page: page
          }
        };

        // ** Gọi API với token
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search', config);
        setUserData(response.data.data.rows);
        setPaginationModel({
          page: response.data.data.page,
          pageSize: response.data.data.limit
        });
        console.log('user', response.data.data.limit)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData(); // ** Fetch data from API when component mounts
  }, [page, pageSize, selectedGroup]);
  const totalPages = Math.ceil(userData.length / pageSize);

  // Tạo một mảng các số từ 1 đến tổng số trang
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Function để chuyển đến trang cụ thể
  const goToPage = (pageNumber) => {
    setPage(pageNumber);
  };
  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
      
          <TableHeader value={value} 
          handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          {console.log(userData)}
          < Grid container spacing={2}>
          <Grid item xs={2}>
        {/* Treeselect để chọn nhóm */}
        <div>
          {groupOptions.map((group) => (
            <GroupCheckbox
              key={group.groupId}
              group={group}
              checked={selectedGroups.some((g) => g.groupId === group.groupId)}
              onChange={handleGroupCheckboxChange}
            />
          ))}
        </div>
      </Grid>
      <Grid item xs={10}>
      <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => handlePageChange(page + 1)}>Next</button>
      <select value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
  <option value={25}>25 dòng/trang</option>
  <option value={50}>50 dòng/trang </option>
  <option value={100}>100 dòng/trang</option>
</select>
        {/* Bảng danh sách người dùng */}
        <Table>
                <TableHead>
                  <TableRow>
                  <TableCell sx={{ padding: '16px' }}>STT</TableCell>

                    <TableCell sx={{ padding: '16px' }}>Mã định danh</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Full Name</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Email</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Số điện thoại </TableCell>
                    <TableCell sx={{ padding: '16px' }}>Đơn vị</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData.map((user, index) => (
                    <TableRow key={user.userId}>
                    <TableCell sx={{ padding: '16px' }}>{((page - 1) * pageSize) + index + 1} </TableCell> 

                      <TableCell sx={{ padding: '16px' }}>{user.accessCode}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.fullName}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.email}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.phoneNumber}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.mainGroupName}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        <Grid container spacing={2}>
                          <IconButton>
                            <Icon icon='tabler:info-circle' />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(user.userId)}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

      </Grid>
 </Grid>

        </Card>
      </Grid>

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
