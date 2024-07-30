import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  Grid,
  Table,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableRow
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
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

const Add = ({ open, setReload, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [dataType, setDataType] = useState({})
  const [vehicleType, setVehicleType] = useState([])
  const [paking, setPaking] = useState([])
  const [allOptions, setAllOptions] = useState([])
  const [formattedOptions, setFormattedOptions] = useState([])
  const [tableError, setTableError] = useState('')
  const [rows, setRows] = useState([])
  const statusOptions = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
  ]
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const fetchDataPaking = async () => {
    try {
      const response = await axios.get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/parking/`, config)
      console.log(response, 'paking')
      setPaking(response.data.rows)
    } catch (error) {
      console.error('Error fetching vehicle data:', error)
    }
  }

  const fetchVehicleTypes = async () => {
    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/type/`,
        config
      )
      setVehicleType(response.data.rows)
    } catch (error) {
      console.error('Error fetching vehicle types:', error)
    }
  }

  const fetchChildren = async parentId => {
    try {
      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`,
        config
      )
      return response.data
    } catch (error) {
      console.error('Error fetching children:', error)
      return []
    }
  }

  const fetchParentData = async parentId => {
    try {
      const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${parentId}`, config)
      return response.data
    } catch (error) {
      console.error('Error fetching parent data:', error)
      return null
    }
  }

  const fetchAllChildrenRecursively = async (parentId, collectedChildren = []) => {
    const children = await fetchChildren(parentId)
    collectedChildren.push(...children)

    for (const child of children) {
      if (child.isParent) {
        await fetchAllChildrenRecursively(child.id, collectedChildren)
      }
    }

    return collectedChildren
  }

  const fetchBrandData = async () => {
    try {
      const response = await axios.get(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/code?Code=honda&sort=%2Bcreated_at&page=1`,
        config
      )

      if (response.data.length > 0) {
        const parentId = response.data[0].id
        const parentData = await fetchParentData(parentId)
        const allChildren = await fetchAllChildrenRecursively(parentId)

        const allOptions = [parentData, ...allChildren]
        setAllOptions(allOptions)

        const formatted = allOptions.map(item => ({
          ...item,
          parentName: item.parentId ? allOptions.find(parent => parent.id === item.parentId)?.name : ''
        }))
        setFormattedOptions(formatted)
      }
    } catch (error) {
      console.error('Error fetching brand data:', error)
    }
  }

  useEffect(() => {
    fetchVehicleTypes()
    fetchBrandData()
    fetchDataPaking()
  }, [])

  const handleAddRow = () => {
    setRows(prevRows => [
      ...prevRows,
      {
        id: '',
        name: '',
        codeParking: '',
        subdivisionId: '',
        nameSubdivision: '',
        detail: ''
      }
    ])
  }
  const handleRowChange = (index, key, value) => {
    setRows(prevRows => {
      const updatedRows = [...prevRows]
      updatedRows[index][key] = value
      return updatedRows
    })
  }

  const getAvailableOptions = selectedIds => {
    return paking.filter(option => !selectedIds.includes(option.id))
  }

  const handleAutocompleteChange = (index, newValue) => {
    if (newValue) {
      handleRowChange(index, 'id', newValue.id)
      handleRowChange(index, 'name', newValue.name)
      handleRowChange(index, 'codeParking', newValue.codeParking)
      handleRowChange(index, 'subdivisionId', newValue.subdivisionId)
      handleRowChange(index, 'nameSubdivision', newValue.nameSubdivision)
      handleRowChange(index, 'detail', newValue.detail)
    } else {
      handleRowChange(index, 'id', '')
      handleRowChange(index, 'name', '')
      handleRowChange(index, 'codeParking', '')
      handleRowChange(index, 'subdivisionId', '')
      handleRowChange(index, 'nameSubdivision', '')
      handleRowChange(index, 'detail', '')
    }
  }

  const handleRowDelete = index => {
    setRows(prevRows => prevRows.filter((_, i) => i !== index))
  }

  const handleAdd = async () => {
    if (!dataType.plateNumber || !dataType.brandId || !dataType.status || !dataType.vehicleType) {
      setTableError('Vui lòng điền đầy đủ thông tin ')
      return
    }

    for (const row of rows) {
      if (!row.id || !row.name || !row.codeParking || !row.subdivisionId || !row.nameSubdivision || !row.detail) {
        setTableError('Vui lòng điền đầy đủ thông tin ')
        return
      }
    }
    const params = {
      plateNumber: dataType.plateNumber || '',
      brandId: dataType.brandId || null,
      status: dataType.status || '',
      detail: dataType.detail || '',
      vehicleType: {
        id: dataType.vehicleType?.id || null
      },
      parking: rows.map(row => ({
        id: row.id || ''
      }))
    }
    try {
      const response = await axios.post(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/create`,
        params,
        config
      )
      console.log('Add successful:', response.data)
      toast.success('Thêm thành công')
      setReload()
      onClose()
    } catch (error) {
      console.error('Error updating vehicle:', error)
      toast.error(error.response?.data?.message || error.message)
      onClose()
    }
  }

  const handleInputChange = (field, value) => {
    setDataType(prevDevice => ({
      ...prevDevice,
      [field]: value
    }))
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={onClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      <DialogTitle>Thêm phương tiện</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <CustomTextField
              label='Biển kiểm soát'
              onChange={e => handleInputChange('plateNumber', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              options={vehicleType}
              getOptionLabel={option => option.name}
              onChange={(event, newValue) => setDataType(prev => ({ ...prev, vehicleType: newValue }))}
              renderInput={params => <CustomTextField {...params} label='Loại phương tiện' fullWidth />}
              loading={loading}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              options={formattedOptions}
              groupBy={option => option.parentName}
              getOptionLabel={option => option.name || ''}
              onChange={(event, newValue) => {
                setDataType(prev => ({
                  ...prev,
                  brandId: newValue ? newValue.id : null,
                  brandName: newValue ? newValue.name : ''
                }))
              }}
              renderInput={params => <CustomTextField {...params} label='Hãng' fullWidth />}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Mô tả' onChange={e => handleInputChange('detail', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField disabled label='Mã thuê bao' fullWidth />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField disabled label='Mã thẻ' fullWidth />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              options={statusOptions}
              getOptionLabel={option => option.label}
              onChange={(event, newValue) => {
                setDataType(prev => ({
                  ...prev,
                  status: newValue ? newValue.value : ''
                }))
              }}
              renderInput={params => <CustomTextField {...params} label='Trạng thái kích hoạt' fullWidth />}
            />
          </Grid>
          <Grid item xs={12}>
            <p>Danh sách bãi đỗ xe phương tiện đã đăng ký</p>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã bãi đỗ xe</TableCell>
                    <TableCell>Tên bãi đỗ xe</TableCell>
                    <TableCell>Phân khu</TableCell>
                    <TableCell>Vị trí</TableCell>
                    <TableCell align='center'>
                      <IconButton size='small' onClick={handleAddRow}>
                        <Icon icon='bi:plus' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length > 0 ? (
                    rows.map((park, index) => {
                      const selectedIds = rows.filter((_, i) => i !== index).map(row => row.id)
                      const availableOptions = getAvailableOptions(selectedIds)

                      return (
                        <TableRow key={index}>
                          <TableCell style={{ width: '30%' }}>
                            <Autocomplete
                              options={availableOptions}
                              getOptionLabel={option => option.name}
                              onChange={(event, newValue) => handleAutocompleteChange(index, newValue)}
                              renderInput={params => <CustomTextField {...params} />}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              value={park.name || ''}
                              onChange={e => handleRowChange(index, 'name', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              value={park.nameSubdivision || ''}
                              onChange={e => handleRowChange(index, 'nameSubdivision', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <CustomTextField
                              value={park.detail || ''}
                              onChange={e => handleRowChange(index, 'detail', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton size='small' onClick={() => handleRowDelete(index)}>
                              <Icon icon='bi:trash' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align='center'>
                        Thêm bãi đỗ xe ..!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {tableError && (
                <Typography color='error' variant='body2' sx={{ mt: 2, textAlign: 'center' }}>
                  {tableError}
                </Typography>
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button variant='contained' onClick={handleAdd}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Add
