import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'

const RolePopup = ({ open, onClose, onSelect, userId }) => {
  const [selectedRole, setSelectedRole] = useState(null)
  const [roleOptions, setRoleOptions] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null) // Thêm trạng thái để lưu trữ id của nhóm được chọn
  const [groupOptions, setGroupOptions] = useState([])

  const handleGroupChange = (event, newValue) => {
    setDefaultGroup(newValue)
    console.log(newValue.groupId)
    if (newValue) {
      setSelectedGroupId(newValue.groupId) // Cập nhật trạng thái với id của nhóm được chọn
    }
  }

  const handleRoleSelect = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      await axios.post(
        `https://dev-ivi.basesystem.one/smc/iam/api/v0/user-groups`,
        {
          groupId: selectedGroupId,
          default: false,
          leader: false,
          userId: userId
        },
        config
      )
      Swal.fire('Thêm thành công', '', 'success')

      onSelect(selectedRole)
      onClose()
    } catch (error) {
      onClose()

      Swal.fire('Đã xảy ra lỗi', error.message, 'error')

      console.error('Error adding member to group:', error)
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
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config)

        setGroupOptions(response.data.data)
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
          getOptionLabel={option => option.groupName}
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
