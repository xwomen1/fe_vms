import { forwardRef, useState, useEffect } from 'react'
import { Autocomplete, Button, DialogActions, Fade, Grid, IconButton, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const Edit = ({ open, onClose, groupId, groupName, fetchGroupData }) => {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(() => {
    fetchGroups()
  }, [groupName])

  const fetchGroups = () => {
    axios
      .get('https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups')
      .then(response => {
        // Lọc nhóm khác với groupName hiện tại
        const filteredGroups = response.data.rows.filter(group => group.name !== groupName)
        setGroups(filteredGroups)
      })
      .catch(error => {
        console.error('Error fetching groups:', error)
      })
  }

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    if (selectedGroup) {
      const params = {
        name: groupName,
        parentId: selectedGroup.id // Giả sử ID của group là 'groupId'
      }

      axios
        .put(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/${groupId}`, params)
        .then(response => {
          console.log('Group moved successfully:', response.data)
          toast.success('Chuyển nhóm thành công')
          onClose()
          fetchGroupData() // Gọi lại fetch để cập nhật danh sách nhóm
        })
        .catch(error => {
          console.error('Error moving group:', error)
        })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={onClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      <Button>Chuyển Phòng ban vào Phòng ban khác</Button>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={3}>
            <Typography>Từ:</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField value={groupName} disabled={true} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <Typography>Đến:</Typography>
          </Grid>
          <Grid item xs={9}>
            <Autocomplete
              value={selectedGroup}
              onChange={(event, newValue) => {
                setSelectedGroup(newValue)
              }}
              options={groups}
              getOptionLabel={option => option.name}
              renderInput={params => <TextField {...params} label='Chọn Group' variant='outlined' fullWidth />}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' onClick={handleOk}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Edit
