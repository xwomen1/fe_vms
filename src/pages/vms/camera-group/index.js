import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { Box, Button, CardContent, CardHeader, IconButton, Paper, TableContainer } from '@mui/material'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import DeletePopup from './popup/delete'
import DetailPopup from './detail/detailCameraGroup'
import CameraGroupAdd from './popup/add'

const CameraGroup = ({ apiData }) => {
  const [value, setValue] = useState('')

  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupAdd, setOpenPopupAdd] = useState(false)

  const [openPopupId, setOpenPopupId] = useState(null)

  const [openPopupDetail, setOpenPopupDetail] = useState(false)

  const [cameras, setCamera] = useState([])

  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleOpenPopup = id => {
    setOpenPopupId(id)
    setOpenPopup(true)
  }

  const handleOpenPopupAdd = () => {
    setOpenPopupAdd(true)
  }

  const handleClose = () => {
    setOpenPopup(false)
  }

  const handleCloseAdd = () => {
    setOpenPopupAdd(false)
  }

  const handleOpenPopupDetail = id => {
    setOpenPopupId(id)
    setOpenPopupDetail(true)
  }

  const handleCloseDelete = () => {
    setOpenPopupDetail(false)
  }

  const handleCloseDetail = () => {
    setOpenPopupDetail(false)
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
  }

  const fetchFilteredOrAllCameraGroup = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: pageSize,
          page: page,
          keyword: value
        }
      }
      const response = await axios.get('https://votv.ivms.vn/votv/vms/api/v0/camera-groups', config)
      setCamera(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchFilteredOrAllCameraGroup()
  }, [page, pageSize, total, value])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  return (
    <>
      <Card>
        <CardHeader
          title='Camera group list'
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
          action={
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button variant='contained' onClick={() => handleOpenPopupAdd()}>
                  <Icon icon='tabler:plus' />
                  Add group
                </Button>
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  value={value}
                  placeholder='Search Group'
                  onChange={e => handleFilter(e.target.value)}
                />
              </Grid>
            </Grid>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>NO.</TableCell>
                      <TableCell align='center'>Group name</TableCell>
                      <TableCell align='center'>Description</TableCell>
                      <TableCell align='center'>Numbers of cameras</TableCell>
                      <TableCell align='center'>Active</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cameras.length > 0 &&
                      cameras.map((camera, index) => (
                        <TableRow key={camera.id}>
                          <TableCell align='center'>{(page - 1) * pageSize + index + 1} </TableCell>
                          <TableCell align='center'>{camera.name}</TableCell>
                          <TableCell align='center'>{camera.description}</TableCell>
                          <TableCell align='center'>{camera.cameras ? camera.cameras.length : 0}</TableCell>
                          <TableCell align='center'>
                            <IconButton onClick={() => handleOpenPopupDetail(camera.id)}>
                              <Icon icon='tabler:edit' />
                            </IconButton>
                            <IconButton onClick={() => handleOpenPopup(camera.id)}>
                              <Icon icon='tabler:trash' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid item xs={3}></Grid>

                <Grid item xs={1} style={{ padding: 0 }}>
                  <Box>
                    <IconButton onClick={handleOpenMenu}>
                      <Icon icon='tabler:selector' />
                      <p style={{ fontSize: 15 }}>{pageSize} line/page</p>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                      {pageSizeOptions.map(size => (
                        <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                          {size}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Pagination count={total} page={page} color='primary' onChange={handlePageChange} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {openPopup && (
        <DeletePopup
          open={openPopup}
          onClose={handleClose}
          id={openPopupId}
          onSuccess={fetchFilteredOrAllCameraGroup}
        />
      )}

      {openPopupDetail && (
        <DetailPopup
          open={openPopupDetail}
          onClose={handleCloseDetail}
          id={openPopupId}
          onSuccess={fetchFilteredOrAllCameraGroup}
        />
      )}

      {openPopupAdd && (
        <CameraGroupAdd open={openPopupAdd} onClose={handleCloseAdd} onSuccess={fetchFilteredOrAllCameraGroup} />
      )}
    </>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default CameraGroup
