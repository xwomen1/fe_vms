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
  const [assetType, setAssetType] = useState({})
  const [name, setName] = useState(null)
  const [code, setCode] = useState(null)
  const [detail, setDetail] = useState(null)
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [donvi, setDonVi] = useState([])
  const [selectDonvi, setSelectDonvi] = useState(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    fetchGroups()
    fetchUnit()
  }, [])

  const fetchGroups = () => {
    axios
      .get('https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions/children-lv1/children/code?parentCode=phankhu')
      .then(response => {
        setGroups(response.data)
      })
      .catch(error => {
        console.error('Error fetching groups:', error)
      })
  }

  const fetchUnit = () => {
    axios
      .get('https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions/children-lv1/children/code?parentCode=dv')
      .then(response => {
        setDonVi(response.data)
      })
      .catch(error => {
        console.error('Error fetching units:', error)
      })
  }

  const fetchAssetType = () => {
    axios
      .get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/parking/find/${assetId}`)
      .then(response => {
        const data = response.data
        setAssetType(data)
        setName(data.name)
        setCode(data.codeParking)
        setDetail(data.detail)
      })
      .catch(error => {
        console.error('Error fetching asset type:', error)
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
      name: name,
      managementUnitId: selectDonvi?.id,
      subdivisionId: selectedGroup?.id
    }

    axios
      .post(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/parking/create
`,
        params
      )
      .then(response => {
        console.log('Successfully updated:', response.data)
        toast.success('Cập nhật thành công')
        onClose()
        fetchGroupData()
      })
      .catch(error => {
        console.error('Error updating group:', error)
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
            <CustomTextField label='Tên bãi đỗ xe' value={name} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField label='Mã bãi đỗ xe' value={code} onChange={handleCodeChange} fullWidth />
          </Grid>
          <>
            <Grid item xs={6}>
              <Autocomplete
                value={selectedGroup}
                onChange={(event, newValue) => {
                  setSelectedGroup(newValue)
                }}
                options={groups}
                getOptionLabel={option => option.name}
                renderInput={params => <CustomTextField {...params} label='Phân khu' variant='outlined' fullWidth />}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                value={selectDonvi}
                onChange={(event, newValue) => {
                  setSelectDonvi(newValue)
                }}
                options={donvi}
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <CustomTextField {...params} label='Đơn vị quản lý' variant='outlined' fullWidth />
                )}
              />
            </Grid>
          </>
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
