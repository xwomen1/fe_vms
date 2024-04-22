import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Grid,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import Swal from 'sweetalert2'
import Link from 'next/link'

const UserDetails = () => {
  const router = useRouter()
  const { userId } = router.query
  const [readOnly, setReadOnly] = useState(false)
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [group, setGroup] = useState([])

  const [rows, setRows] = useState([])
  const [showPlusColumn, setShowPlusColumn] = useState(false)

  const handleAddRow = () => {
    const newRow = { groupName: '', groupCode: '', id: '', description: '' } // Thêm groupId vào đây
    setRows([...rows, newRow])
  }

  const handleCancel = () => {
    setReadOnly(true)
    setEditing(false)
    setShowPlusColumn(!showPlusColumn)
    router.reload()
    setUser({
      ...user,
      fullName: '',
      email: ''
    })
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access/${userId}/detail-groups`,
          config
        )

        const userGroups = response.data.data.groupMappings.map(groupMapping => groupMapping.userGroup)

        if (Array.isArray(userGroups)) {
          // Nếu userGroups là một mảng, bạn có thể sử dụng nó trực tiếp
          setRows(
            userGroups.map(group => ({
              groupName: group.name,
              groupCode: group.code,
              id: group.id,
              description: '' // Placeholder, sẽ được cập nhật trong bước tiếp theo
            }))
          )
        } else {
          // Nếu userGroups là một đối tượng, bạn cần xử lý nó một cách thích hợp
          // Dưới đây là một cách để chuyển đổi đối tượng thành một mảng để sử dụng
          const groupsArray = Object.values(userGroups)
          setRows(
            groupsArray.map(group => ({
              groupName: group.name,
              groupCode: group.code,
              id: group.id,
              description: '' // Placeholder, sẽ được cập nhật trong bước tiếp theo
            }))
          )
        }

        // Lặp qua từng user group để gọi API và lấy mô tả, sau đó cập nhật vào state
        for (const group of userGroups) {
          const description = await getListAccessGroupNamesByUserGroupId(group.id)
          setRows(prevRows => {
            const updatedRows = [...prevRows]
            const rowIndex = updatedRows.findIndex(row => row.id === group.id)
            if (rowIndex !== -1) {
              updatedRows[rowIndex].description = description
            }

            return updatedRows
          })
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const getListAccessGroupNamesByUserGroupId = async userGroupId => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const res = await axios.get(
      `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/${userGroupId}`,
      config
    )

    if (res && res.data.data.accessGroupList) {
      return res.data.data.accessGroupList.map(item => item.name).join(', ')
    }

    return ''
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getListAccessGroupNamesByUserGroupId('5e64fe0c-f914-4267-8b1d-0d9c9f410979')
      console.log(result + 'testtt')
    }
    fetchData()
  }, [])
  const userGroupIds = rows.map(row => row.id)

  const saveChanges = async () => {
    setEditing(false)
    setShowPlusColumn(!showPlusColumn)

    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access`,
        {
          accessGroupIds: [],
          userGroupIds: userGroupIds,
          userId: userId
        },
        config
      )
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
      router.push(`/apps/user/detail/${response.data.data.userId}`)
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
    }
  }

  const handleDeleteRow = index => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups', config)
        setGroupOptions(response.data.data.rows)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchGroupData()
  }, [])

  const toggleEdit = () => {
    setReadOnly(false)
    setEditing(true)
    setShowPlusColumn(!showPlusColumn)
  }

  return (
    <Grid container spacing={3}>
      <Grid container spacing={2} item xs={12}>
        <IconButton size='small' component={Link} href={`/apps/user/list`} sx={{ color: 'text.secondary' }}>
          <Icon icon='tabler:chevron-left' />
        </IconButton>
        <h2 style={{ color: 'black' }}>Thêm mới người dùng: </h2>
      </Grid>
      <Grid container spacing={2}>
        <div style={{ width: '80%' }}></div>
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

      <Grid item xs={12}>
        <TableContainer component={Paper} style={{ width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 300 }}>Đơn vị</TableCell>
                <TableCell sx={{ minWidth: 300 }}>Mã đơn vị</TableCell>

                {showPlusColumn && (
                  <TableCell align='center'>
                    <IconButton size='small' onClick={handleAddRow} sx={{ marginLeft: '10px' }}>
                      <Icon icon='bi:plus' />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Autocomplete
                      options={groupOptions.filter(option => !rows.some(row => row.id === option.id))}
                      getOptionLabel={option => option.name}
                      value={groupOptions.find(option => option.name === row.groupName) || null}
                      onChange={async (event, newValue) => {
                        if (editing) {
                          // Chỉ cho phép thay đổi khi đang trong trạng thái chỉnh sửa
                          const updatedRows = [...rows]
                          updatedRows[index].groupName = newValue ? newValue.name : ''
                          updatedRows[index].id = newValue ? newValue.id : ''
                          updatedRows[index].description = await getListAccessGroupNamesByUserGroupId(
                            newValue ? newValue.id : ''
                          )

                          setRows(updatedRows)
                        }
                      }}
                      disabled={!editing} // Tắt khi không trong trạng thái chỉnh sửa
                      renderInput={params => <TextField {...params} label='Đơn vị' />}
                    />
                  </TableCell>
                  <TableCell>
                    {row.description}
                    {console.log(rows)}
                  </TableCell>
                  {showPlusColumn && (
                    <TableCell align='center'>
                      {index >= 0 && (
                        <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                          <Icon icon='bi:trash' />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default UserDetails
