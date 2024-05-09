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
import { IconButton } from '@mui/material'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import DeletePopup from './popup/delete'
import DetailPopup from './detail/detailCameraGroup'
import CameraGroupAdd from './popup/add'

const CameraGroup = ({ apiData }) => {
  const [value, setValue] = useState('')

  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupAdd, setOpenPopupAdd] = useState(false)

  const [openPopupId, setOpenPopupId] = useState(null);

  const [openPopupDetail, setOpenPopupDetail] = useState(false)

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [cameras, setCamera] = useState([])

  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [status1, setStatus1] = useState(25)

  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePageChange = newPage => {
    setPage(newPage)
  }


  const handleOpenPopup = (id) => {
    setOpenPopupId(id);
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

  const handleOpenPopupDetail = (id) => {
    setOpenPopupId(id);
    setOpenPopupDetail(true)
  }
  
  const handleCloseDelete = () => {
    setOpenPopupDetail(false)
  }
  const handleCloseDetail= () => {
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



  console.log(total, 'totalpage')
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
      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups', config)
      setCamera(response.data.data)
      console.log(response.data.data[0].id)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }
  
  useEffect(() => {
    fetchFilteredOrAllCameraGroup();
  }, [page, pageSize, total, value]);

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])
  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <div></div>
          <Grid container spacing={2}>
            <Grid item xs={0.1}></Grid>

            <Grid container item xs={12} alignItems="center">
              <Grid container spacing={2}>
                  <Grid item xs = {7} style={{color:'orange', marginLeft: '2%'}}><h3>Danh sách nhóm Camera</h3></Grid>
                  <Grid item xs ={2} style={{marginTop:'1%', marginLeft:'4%', fontSize:'14px'}}> 
                  <IconButton onClick={() => handleOpenPopupAdd()}>
                        <Icon icon='tabler:plus' />
                  </IconButton>
                  Thêm nhóm
                  </Grid>
                  <Grid item xs = {2} style={{marginTop:'1%'}}>                  
                    <CustomTextField
                      value={value}
                      placeholder='Search Group'
                      onChange={e => handleFilter(e.target.value)}
                  />
                  </Grid>
                  </Grid>

              <Table>
                <TableHead>
                  <TableRow>
                  
                    <TableCell sx={{ padding: '13px' }}>STT</TableCell>
                    <TableCell sx={{ padding: '13px' }}>Tên nhóm</TableCell>
                    <TableCell sx={{ padding: '13px' }}>Mô tả</TableCell>
                    <TableCell sx={{ padding: '13px' }}>Số lượng camera</TableCell>
                    <TableCell sx={{ padding: '13px' }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log(cameras)}
                  {cameras && cameras.map((camera, index) => (
                    <TableRow key={camera.id}>
                      <TableCell sx={{ padding: '16px' }}>{(page - 1) * pageSize + index + 1} </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{camera.name}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{camera.description}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{camera.cameras ? camera.cameras.length : 0}</TableCell>

                      <TableCell sx={{ padding: '16px' }}>
                        <Grid container spacing={2}>
                        <IconButton onClick={() => handleOpenPopupDetail(camera.id)}>
                            <Icon icon='tabler:edit' />
                          </IconButton>
                          <IconButton onClick={() => handleOpenPopup(camera.id)}>
                            {console.log(camera.id)}
                          <Icon icon='tabler:trash' />
                          </IconButton>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <br></br>
              <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={1.5} style={{ padding: 0 }}>
                  <IconButton onClick={handleOpenMenu}>
                    <Icon icon='tabler:selector' />
                    <p style={{ fontSize: 15 }}>{pageSize} dòng/trang</p>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                    {pageSizeOptions.map(size => (
                      <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                        {size}
                      </MenuItem>
                    ))}
                  </Menu>
                </Grid>
                <Grid item xs={6}>
                  <Pagination count={total} color='primary' onChange={(event, page) => handlePageChange(page)} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {console.log(openPopupId)}
      {
        openPopup && (
          <DeletePopup open={openPopup} onClose={handleClose} id={openPopupId} onSuccess={fetchFilteredOrAllCameraGroup} />
        )
      }

      {
        openPopupDetail && (
          <DetailPopup open={openPopupDetail} onClose={handleCloseDetail} id ={openPopupId} onSuccess={fetchFilteredOrAllCameraGroup}/>
        )
      }

      {
        openPopupAdd && (
          <CameraGroupAdd open={openPopupAdd} onClose={handleCloseAdd} onSuccess={fetchFilteredOrAllCameraGroup}/>
        )
      }
    </Grid>
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
