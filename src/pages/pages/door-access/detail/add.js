import { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Card,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Table,
  Button,
  TableBody,
  TableCell,
  DialogActions,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Autocomplete } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const DoorAccessUpdate = ({ show, onClose, setReload }) => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [door, setDoor] = useState({ name: '', description: '' })
  const [groupOptions, setGroupOptions] = useState([])
  const [doorOptions, setDoorOptions] = useState([]) // doorOptions là mảng chứa các lựa chọn cửa cho từng hàng
  const [scheduleOptions, setScheduleOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [doorGroupIds, setDoorGroupIds] = useState([]) // doorGroupIds là mảng chứa các doorGroupId cho từng hàng

  const fetchAllSchedules = async () => {
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      let allSchedules = []
      let page = 1
      let hasMoreData = true

      while (hasMoreData) {
        const response = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/schedules?keyword=&limit=50&page=${page}`,
          config
        )

        if (response.data.rows.length > 0) {
          allSchedules = [...allSchedules, ...response.data.rows]
          page++
        } else {
          hasMoreData = false
        }
      }

      setScheduleOptions(allSchedules)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show) {
      fetchAllSchedules()
    }
  }, [show])

  useEffect(() => {
    if (show) {
      const fetchParentData = async () => {
        try {
          setLoading(true)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(
            'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1?',
            config
          )
          const parentGroups = response.data

          const fetchChildGroups = async parentId => {
            const childResponse = await axios.get(
              `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1?parentId=${parentId}`,
              config
            )
            const childGroups = childResponse.data
            for (let childGroup of childGroups) {
              if (childGroup.isParent) {
                childGroup.children = await fetchChildGroups(childGroup.id)
              }
            }

            return childGroups
          }

          const processedGroups = []
          for (let parentGroup of parentGroups) {
            if (parentGroup.isParent) {
              parentGroup.children = await fetchChildGroups(parentGroup.id)
            }
            processedGroups.push(parentGroup)
          }

          const flattenGroups = flattenNestedGroups(processedGroups)
          setGroupOptions(flattenGroups)
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchParentData()
    }
  }, [show])

  useEffect(() => {
    const fetchDoorsByGroupId = async (doorGroupId, rowIndex) => {
      if (doorGroupId) {
        try {
          setLoading(true)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(
            `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors?keyword=&limit=50&page=1&doorGroupIds=${doorGroupId}`,
            config
          )

          setDoorOptions(prevDoorOptions => {
            const newDoorOptions = [...prevDoorOptions]
            newDoorOptions[rowIndex] = response.data.rows

            return newDoorOptions
          })
        } catch (error) {
          console.error('Error fetching doors by group ID:', error)
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
      }
    }

    doorGroupIds.forEach((doorGroupId, index) => {
      fetchDoorsByGroupId(doorGroupId, index)
    })
  }, [doorGroupIds, token])

  const flattenNestedGroups = groups => {
    const flattenedGroups = []

    const flattenRecursive = group => {
      flattenedGroups.push(group)
      if (group.children) {
        for (let child of group.children) {
          flattenRecursive(child)
        }
      }
    }
    for (let group of groups) {
      flattenRecursive(group)
    }

    return flattenedGroups
  }

  const handleClose = () => {
    onClose()
  }

  const handleInputChange = (field, value) => {
    setDoor(prevDevice => ({
      ...prevDevice,
      [field]: value
    }))
  }

  const handleGroupChange = (event, value, rowIndex) => {
    if (value) {
      setDoorGroupIds(prevDoorGroupIds => {
        const newDoorGroupIds = [...prevDoorGroupIds]
        newDoorGroupIds[rowIndex] = value.id

        return newDoorGroupIds
      })
    } else {
      setDoorGroupIds(prevDoorGroupIds => {
        const newDoorGroupIds = [...prevDoorGroupIds]
        newDoorGroupIds[rowIndex] = null

        return newDoorGroupIds
      })
    }
  }

  const handleAddRow = () => {
    setDoorGroupIds(prevDoorGroupIds => [...prevDoorGroupIds, null])
    setDoorOptions(prevDoorOptions => [...prevDoorOptions, []])
  }

  const handleDeleteRow = rowIndex => {
    setDoorGroupIds(prevDoorGroupIds => prevDoorGroupIds.filter((_, index) => index !== rowIndex))
    setDoorOptions(prevDoorOptions => prevDoorOptions.filter((_, index) => index !== rowIndex))
  }

  const handleSave = async () => {
    const payload = {
      description: door.description,
      name: door.name,
      policies: doorGroupIds.map((doorGroupId, index) => ({
        applyMode: 'CUSTOMIZE',
        doorId: doorOptions[index]?.[0]?.id || '', // Lấy doorId của cửa đầu tiên trong danh sách cho hàng đó
        scheduleId: scheduleOptions[index]?.id || ''
      }))
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-accesses',
        payload,
        config
      )
      toast.success('Lưu thành công!')
      setReload()
    } catch (error) {
      console.error('Error saving data:', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
      setReload()
      onClose()
    }
  }

  return (
    <Card>
      <Dialog open={show} maxWidth='md' scroll='body' onClose={handleClose}>
        <DialogContent>
          <IconButton style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={handleClose}>
            <Icon icon='tabler:x' />
          </IconButton>
          <Typography variant='h3' gutterBottom>
            Chi tiết quản lý truy cập cửa
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomTextField
                onChange={e => handleInputChange('name', e.target.value)}
                label='Tên cấp truy cập'
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                label='Mô tả'
                onChange={e => handleInputChange('description', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nhóm</TableCell>
                      <TableCell>Cửa</TableCell>
                      <TableCell>Lịch hoạt động</TableCell>
                      <TableCell align='center'>
                        <IconButton size='small' onClick={handleAddRow}>
                          <Icon icon='bi:plus' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doorGroupIds.map((doorGroupId, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Autocomplete
                            options={groupOptions}
                            getOptionLabel={option => option.name}
                            onChange={(event, value) => handleGroupChange(event, value, index)}
                            renderInput={params => <CustomTextField {...params} />}
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            options={doorOptions[index] || []}
                            getOptionLabel={option => option.name}
                            renderInput={params => <CustomTextField {...params} />}
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            options={scheduleOptions}
                            getOptionLabel={option => option.name}
                            renderInput={params => <CustomTextField {...params} />}
                          />
                        </TableCell>
                        <TableCell align='center'>
                          <IconButton size='small' onClick={() => handleDeleteRow(index)}>
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
        <DialogActions sx={{ pr: 4, pb: 8 }}>
          <Button onClick={onClose} variant='contained' color='primary'>
            Hủy
          </Button>
          <Button onClick={handleSave} variant='contained' color='primary'>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DoorAccessUpdate
