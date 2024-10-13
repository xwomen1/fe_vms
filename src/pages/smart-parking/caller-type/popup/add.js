import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'

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
  const [rows1, setRows1] = useState([])
  const [groupOptions, setGroupOptions] = useState([])
  const [groups, setGroup] = useState([])
  const [policyOption, setPolicyOption] = useState([])
  const [policies, setPolicies] = useState([])
  const [activationStatus, setActivationStatus] = useState('')

  const handleAddRow1 = () => {
    const newRow = { name: '', description: '', id: '', code: '' } // Thêm groupId vào đây
    setPolicies([...policies, newRow])
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
          'https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=dv',
          config
        )

        setPolicyOption(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  const filteredPolicyOptions = policyOption.filter(
    option => !policies || !policies.some(policies => policies.name === option.name)
  )

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
      code: code,
      groupIds: [policies.id],
      status: activationStatus === 'Yes' ? 'YES' : 'NO'
    }

    axios
      .post(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/sub/type/create
`,
        params
      )
      .then(response => {
        console.log(' successfully:', response.data)
        toast.success('Thêm thành công')
        onClose()
        fetchGroupData() // Gọi lại fetch để cập nhật danh sách nhóm
      })
      .catch(error => {
        console.error('Error moving group:', error)
        toast.error(error?.response?.data || 'Thất bại')
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
          <Grid item xs={4}>
            <TextField label='Mã Loại thuê bao' value={name} onChange={handleFullNameChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <TextField label='Tên loại thuê bao' value={code} onChange={handleCodeChange} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id='activation-status-label'>Trạng thái kích hoạt</InputLabel>
              <Select
                labelId='activation-status-label'
                id='activation-status-select'
                value={activationStatus}
                onChange={event => setActivationStatus(event.target.value)}
              >
                <MenuItem value='Yes'>Đã kích hoạt</MenuItem>
                <MenuItem value='No'>Chưa kích hoạt</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              rows={4}
              multiline
              label='Mô tả'
              value={detail}
              onChange={handleDetailChange}
              id='textarea-outlined-static'
              fullWidth
            />
          </Grid>
          <Grid item xs={11.8}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên đơn vị</TableCell>
                    <TableCell>Mã đơn vị</TableCell>
                    {/* {showPlusColumn && ( */}
                    <TableCell align='center'>
                      <IconButton onClick={handleAddRow1} size='small' sx={{ marginLeft: '10px' }}>
                        <Icon icon='bi:plus' />
                      </IconButton>
                    </TableCell>
                    {/* )} */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {policies.map((policy, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {' '}
                        <Autocomplete
                          options={filteredPolicyOptions}
                          getOptionLabel={option => option.name}
                          value={policyOption.find(option => option.name === policy.name) || null}
                          onChange={(event, newValue) => {
                            const updatedRows = [...policies]
                            updatedRows[index].name = newValue.name
                            updatedRows[index].code = newValue.code
                            updatedRows[index].description = newValue.description
                            updatedRows[index].id = newValue.id

                            // updatedRows[index].id = newValue.id
                            setPolicies(updatedRows)
                          }}
                          renderInput={params => <TextField {...params} label='Vai trò' />}
                        />
                        {console.log(policies)}
                      </TableCell>
                      <TableCell>{policy.code}</TableCell>

                      <TableCell align='center'>
                        <IconButton onClick={() => handleDeleteRow1(index)}>
                          <Icon icon='bi:trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
