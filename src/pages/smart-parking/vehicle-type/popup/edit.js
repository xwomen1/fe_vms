import { forwardRef, useState, useEffect } from 'react'
import { Autocomplete, Button, DialogActions, Fade, Grid, IconButton, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

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

const Edit = ({ open, onClose, fetchGroupData, assetId }) => {
  const [assetType, setAssetType] = useState([])
  const [name, setName] = useState(null)
  const [code, setCode] = useState(null)
  const [detail, setDetail] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetchAssetType()
  }, [assetId])

  const fetchAssetType = () => {
    axios
      .get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/type/find/${assetId}`)
      .then(response => {
        // Lọc nhóm khác với groupName hiện tại
        setAssetType(response.data)
        setName(response.data.vehicleName)
        setCode(response.data.vehicleCode)
        setDetail(response.data.vehicleDetail)
        setStatus(response.data.vehicleStatus)
      })
      .catch(error => {
        console.error('Error fetching groups:', error)
      })
  }

  const handleCancel = () => {
    onClose()
  }

  const handleFullNameChange = event => {
    setName(event.target.value)
  }

  const handleCodeChange = event => {
    setCode(event.target.value)
  }

  const handleDetailChange = event => {
    setDetail(event.target.value)
  }

  const handleOk = () => {
    const params = {
      detail: detail,
      name: name
    }

    axios
      .put(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/asset/type/${assetId}
`,
        params
      )
      .then(response => {
        console.log(' successfully:', response.data)
        toast.success('Chuyển nhóm thành công')
        onClose()
        fetchGroupData() // Gọi lại fetch để cập nhật danh sách nhóm
      })
      .catch(error => {
        console.error('Error moving group:', error)
      })
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
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomTextField label='Tên loại phương tiện' value={name} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField label='Mã loại phương tiện' value={code} onChange={handleCodeChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              rows={4}
              multiline
              label='Ghi chú'
              value={detail}
              onChange={handleDetailChange}
              id='textarea-outlined-static'
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Huỷ</Button>
        <Button variant='contained' onClick={handleOk}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Edit
