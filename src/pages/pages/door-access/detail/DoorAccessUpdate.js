import { useEffect, useState, forwardRef } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Card,
  Dialog,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  Table,
  styled,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Autocomplete, TextField } from '@mui/material'

const DoorAccessUpdate = ({ show, onClose, id }) => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [door, setDoor] = useState([])
  const [groupOptions, setGroupOptions] = useState([])
  const [selectedParentId, setSelectedParentId] = useState(null)

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

  useEffect(() => {
    fetchDataList1()
  }, [])

  const fetchDataList1 = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-accesses/${id}`,
        config
      )
      setDoor(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
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

        // Function to recursively fetch child groups
        const fetchChildGroups = async parentId => {
          const childResponse = await axios.get(
            `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1?parentId=${parentId}`,
            config
          )
          const childGroups = childResponse.data
          for (let childGroup of childGroups) {
            if (childGroup.isParent) {
              // Recursively fetch child groups if it's a parent
              childGroup.children = await fetchChildGroups(childGroup.id)
            }
          }
          return childGroups
        }

        // Process each parent group to fetch its children recursively
        const processedGroups = []
        for (let parentGroup of parentGroups) {
          if (parentGroup.isParent) {
            parentGroup.children = await fetchChildGroups(parentGroup.id)
          }
          processedGroups.push(parentGroup)
        }

        // Flatten nested structure for Autocomplete options
        const flattenGroups = flattenNestedGroups(processedGroups)
        setGroupOptions(flattenGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchParentData()
  }, [])

  // Function to flatten nested groups
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
  const handleAutocompleteChange = async (newValue, rowIndex) => {
    setDoor(prevDoor => {
      const updatedPolicies = [...prevDoor.policies]
      updatedPolicies[rowIndex] = {
        ...updatedPolicies[rowIndex],
        doorGroupId: newValue ? newValue.id : null
      }
      return {
        ...prevDoor,
        policies: updatedPolicies
      }
    })
  }
  return (
    <>
      <Card>
        <Dialog
          open={show}
          maxWidth='md'
          scroll='body'
          TransitionComponent={Transition}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={onClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 8, textAlign: 'left' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                Chi tiết quản lý truy cập cửa
              </Typography>
            </Box>
          </DialogContent>
          <div style={{ margin: '1%' }}>
            <Grid container spacing={1}>
              <Grid item xs={5.5}>
                <CustomTextField
                  label='Tên cấp truy cập'
                  value={door ? door.name : ''}
                  onChange={e => handleInputChange('name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5.5}>
                <CustomTextField
                  value={door ? door.description : ''}
                  label='Mô tả'
                  onChange={e => handleInputChange('description', e.target.value)}
                  fullWidth
                />
              </Grid>
              <p>Danh sách cửa và lịch</p>
              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontSize: '12px', textTransform: 'none' }}>Nhóm</TableCell>
                        <TableCell style={{ fontSize: '12px', textTransform: 'none' }}>Cửa</TableCell>
                        <TableCell style={{ fontSize: '12px', textTransform: 'none' }}>Lịch hoạt động</TableCell>
                        <TableCell align='center' style={{ fontSize: 'small' }}>
                          <IconButton size='small' sx={{ marginLeft: '10px' }}>
                            <Icon icon='bi:plus' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {door.policies?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Autocomplete
                              name={`doorGroupId-${index}`}
                              value={groupOptions.find(option => option.id === row.doorGroupId) || null}
                              options={groupOptions}
                              getOptionLabel={option => option?.name || ''}
                              onChange={(event, newValue) => handleAutocompleteChange(newValue, index)}
                              renderInput={params => <CustomTextField {...params} />}
                            />
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              options={groupOptions || []}
                              getOptionLabel={option => option?.name || ''}
                              renderInput={params => <CustomTextField {...params} />}
                            />
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              options={groupOptions || []}
                              getOptionLabel={option => option?.name || ''}
                              renderInput={params => <CustomTextField {...params} />}
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton size='small'>
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
          </div>
        </Dialog>
      </Card>
    </>
  )
}

export default DoorAccessUpdate
