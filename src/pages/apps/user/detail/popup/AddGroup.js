import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'

const RolePopup = ({ open, onClose, onSelect, userId }) => {
  const [selectedRole, setSelectedRole] = useState(null)
  const [groupName, setGroupName] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null) // Thêm trạng thái để lưu trữ id của nhóm được chọn
  const [groupOptions, setGroupOptions] = useState([])
  const [groupCode, setGroupCode] = useState([])

  const handleGroupChange = (event, newValue) => {
    setDefaultGroup(newValue)
    console.log(newValue.id)
    if (newValue) {
      setGroupName(newValue.name)
      setGroupCode(newValue.code)
      console.log(defaultGroup, 'nameee')
    }
  }

  const createNewGroup = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://dev-ivi.basesystem.one/smc/iam/api/v0/groups',
        {
          groupCode: groupCode,
          groupName: groupName,
          isPnLVGR: false
        },
        config
      )

      return response.data.groupId
    } catch (error) {
      throw error
    }
  }

  const searchGroupId = async groupName => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search?keyword=${groupName}`,
        config
      )

      if (response.data.length > 0) {
        return response.data[0].groupId
      } else {
        return null // Trả về null nếu không tìm thấy groupId
      }
    } catch (error) {
      throw error
    }
  }

  const handleRoleSelect = async () => {
    try {
      let newGroupId = await searchGroupId(defaultGroup.name)
      console.log(newGroupId, ' newgrouid')

      // Kiểm tra xem newGroupId có giá trị null không
      if (newGroupId === null) {
        // Nếu nhóm chưa tồn tại, tạo mới
        newGroupId = await createNewGroup()
      }

      if (newGroupId) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        await axios.post(
          `https://dev-ivi.basesystem.one/smc/iam/api/v0/user-groups`,
          {
            groupId: newGroupId,
            default: false,
            leader: false,
            userId: userId
          },
          config
        )
        Swal.fire('Thêm thành công', '', 'success')

        onSelect(selectedRole)
        onClose()
      } else {
        console.error('Error: Cannot get groupId for the selected group.')
      }
    } catch (error) {
      onClose()

      console.error('Error adding member to group:', error.message)
    }
  }

  const handleCancel = () => {
    onClose()
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(
          'https://sbs.basesystem.one/ivis/infrares/api/v0/regions?limit=25&page=1&parentID=f963e9d4-3d6b-45df-884d-15f93452f2a2',
          config
        )

        setGroupOptions(response.data)
        console.log(response.data, 'go')
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Role</DialogTitle>
      <DialogContent>
        <Autocomplete
          value={defaultGroup}
          onChange={(event, newValue) => handleGroupChange(event, newValue)}
          options={groupOptions}
          getOptionLabel={option => option.name}
          renderInput={params => <TextField {...params} label='Nhóm' variant='outlined' />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleRoleSelect}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RolePopup
