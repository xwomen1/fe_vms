import { useState, useEffect, useCallback, Fragment } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  Typography
} from '@mui/material'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserDetails from '../detail/index'
import Link from 'next/link'
import { fetchChatsContacts } from 'src/store/apps/chat'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import ListItem from '@mui/material/ListItem'
import { useDropzone } from 'react-dropzone'
import { GROUP_API } from 'src/@core/components/api-url'
import { getApi } from 'src/@core/utils/requestUltils'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [valueGroup, setValueGroup] = useState('')

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [userData, setUserData] = useState([])
  const [total, setTotal] = useState([1])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [groups, setGroups] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const [contractName, setContractName] = useState('')
  const [contractTypes, setContractTypes] = useState({})
  const [openImportDialog, setOpenImportDialog] = useState(false)
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  })

  const renderFilePreview = file => {
    return <Icon icon='tabler:file-spreadsheet' fontSize='1.75rem' />
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map(file => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  // ** Hàm xử lý upload files
  const handleUploadFiles = async () => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('file', file)
    })

    try {
      const response = await axios.post('https://dev-ivi.basesystem.one/smc/iam/api/v0/import-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Upload thành công:', response.data)
      setOpenImportDialog(false)
      fetchFilteredOrAllUsers()
      Swal.fire({
        title: 'Successful!',
        text: 'Import Successful',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    } catch (error) {
      console.error('Lỗi khi upload:', error)
    }
  }

  const importValue = () => {
    setOpenImportDialog(true)
  }

  const handleCloseImportDialog = () => {
    setOpenImportDialog(false)
  }

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleViewDetails = userId => {
    router.push(`/${userId}`)
  }

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Confirm',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Ok',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Cancel',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      },
      confirmButtonColor: '#002060'
    }

    return Swal.fire({ ...defaultProps, ...options })
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

  const fetchRegionName = async regionId => {
    try {
      const response = await axios.get(`https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/${regionId}`)

      return response.data.name
    } catch (error) {
      console.error('Error fetching region name:', error)

      return ''
    }
  }
  useEffect(() => {
    const fetchAllRegionNames = async () => {
      const newContractTypes = {}
      for (const user of userData) {
        if (user.contractType) {
          const regionName = await fetchRegionName(user.contractType)
          newContractTypes[user.contractType] = regionName
        }
      }
      setContractTypes(newContractTypes)
    }

    fetchAllRegionNames()
  }, [userData])

  const GroupCheckbox = ({ group, checked, onChange }) => {
    return (
      <div>
        <input
          type='checkbox'
          id={`group-${group.groupId}`}
          checked={checked}
          onChange={e => onChange(group.groupId, e.target.checked)}
        />
        <label htmlFor={`group-${group.groupId}`}>{group.groupName}</label>
      </div>
    )
  }

  const handleGroupCheckboxChange = (groupId, checked) => {
    if (checked) {
      setSelectedGroups(prevGroups => [...prevGroups, { groupId }])
    } else {
      setSelectedGroups(prevGroups => prevGroups.filter(g => g.groupId !== groupId))
    }
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getApi(`${GROUP_API.SEARCH}?keyword=${valueGroup}`)
        const dataWithChildren = addChildrenField(response.data)
        const rootGroups = findRootGroups(dataWithChildren)
        setGroups(rootGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [pageSize, valueGroup])

  const addChildrenField = (data, parentId = null) => {
    return data.map(group => {
      const children = data.filter(child => child.parentId === group.groupId)
      if (children.length > 0) {
        group.children = children
      }

      return group
    })
  }

  const renderGroup = group => (
    <TreeItem
      key={group.groupId}
      nodeId={group.groupId}
      label={
        <GroupCheckbox
          group={group}
          checked={selectedGroups.some(g => g.groupId === group.groupId)}
          onChange={handleGroupCheckboxChange}
        />
      }
      style={{ marginTop: '5%' }}
    >
      {group.children && group.children.map(childGroup => renderGroup(childGroup))}
    </TreeItem>
  )

  const findRootGroups = data => {
    const rootGroups = []
    data.forEach(group => {
      if (!data.some(item => item.groupId === group.parentId)) {
        rootGroups.push(group)
      }
    })

    return rootGroups
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleFilterGroup = event => {
    setValueGroup(event)
  }

  console.log(total, 'totalpage')

  const fetchFilteredOrAllUsers = async () => {
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
      let url
      if (selectedGroups.length > 0) {
        url = `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?groupIds=${selectedGroups
          .map(g => g.groupId)
          .join(',')}`
      } else {
        url = 'https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search'
      }
      const response = await axios.get(url, config)
      setUserData(response.data.rows)
      setContractName(response.data.rows.contractType)
      setTotal(response.data.totalPage)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleDelete = idDelete => {
    showAlertConfirm({
      text: 'Are you sure you want to delete?'
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        if (!token) {
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        let urlDelete = `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire({
              title: 'Successful!',
              text: 'Delete Successful',
              icon: 'success',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#002060'
                  confirmButton.style.color = 'white'
                }
              }
            })
            const updatedData = userData.filter(user => user.userId !== idDelete)
            fetchFilteredOrAllUsers()
            setUserData(updatedData)
            fetchData()
          })
          .catch(err => {
            Swal.fire('error', err.message, 'error')
          })
      }
    })
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  useEffect(() => {
    const fetchFilteredOrAllUsers = async () => {
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
        let url
        if (selectedGroups.length > 0) {
          url = `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?groupIds=${selectedGroups
            .map(g => g.groupId)
            .join(',')}`
        } else {
          url = 'https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search'
        }
        const response = await axios.get(url, config)
        setUserData(response.data.rows)
        setContractName(response.data.rows.contractType)
        setTotal(response.data.totalPage)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchFilteredOrAllUsers()
  }, [selectedGroups, page, pageSize, total, value])

  return (
    <Grid style={{ minWidth: '1000px' }}>
      <Card>
        <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} importValue={importValue} />
        <Grid container spacing={2}>
          <Dialog open={openImportDialog} onClose={handleCloseImportDialog}>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogContent>
              {/* Thêm nội dung hoặc thành phần upload file ở đây */}
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      mb: 8.75,
                      width: 48,
                      height: 48,
                      display: 'flex',
                      borderRadius: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                    }}
                  >
                    <Icon icon='tabler:upload' fontSize='1.75rem' />
                  </Box>
                  <Typography variant='h4' sx={{ mb: 2.5 }}>
                    Drop files here or click to upload.
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>(Only Excel files are accepted)</Typography>
                </Box>
              </div>
              {files.length ? (
                <Fragment>
                  <List>{fileList}</List>
                  <div className='buttons'>
                    <Button color='error' variant='outlined' onClick={handleRemoveAllFiles} style={{ marginRight: 30 }}>
                      Remove All
                    </Button>
                    <Button variant='contained' onClick={handleUploadFiles} style={{ marginRight: 30 }}>
                      Upload Files
                    </Button>
                    <Button variant='contained' onClick={handleCloseImportDialog}>
                      Close
                    </Button>
                  </div>
                </Fragment>
              ) : null}
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
          {/* <Grid item xs={0.1}></Grid> */}
          <Grid item xs={0.2}></Grid>

          <Grid item xs={2} component={Paper}>
            <div>
              <CustomTextField
                value={valueGroup}
                sx={{ mr: 4 }}
                placeholder='Search Department'
                onChange={e => handleFilterGroup(e.target.value)}
              />
              <TreeView
                sx={{ minHeight: 240 }}
                defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
              >
                {groups.map(rootGroup => renderGroup(rootGroup))}
              </TreeView>
            </div>
          </Grid>
          <Grid item xs={9.8}>
            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>NO.</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Access code</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Full Name</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Email</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Phone Number </TableCell>
                    <TableCell sx={{ padding: '16px' }}>Department</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Contract Type</TableCell>

                    <TableCell sx={{ padding: '16px' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData.map((user, index) => (
                    <TableRow key={user.userId}>
                      <TableCell sx={{ padding: '16px' }}>{(page - 1) * pageSize + index + 1} </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.accessCode}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.fullName}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.email}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.phoneNumber}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{user.userGroup[0]?.groupName}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {contractTypes[user.contractType] || 'Không thời hạn'}
                      </TableCell>

                      <TableCell sx={{ padding: '16px' }}>
                        <Grid container spacing={2}>
                          <IconButton
                            size='small'
                            component={Link}
                            href={`/apps/user/detail/${user.userId}`}
                            sx={{ color: 'text.secondary' }}
                          >
                            <Icon icon='tabler:info-circle' />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(user.userId)}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <br></br>
            <Grid container spacing={2} style={{ padding: 10 }}>
              <Grid item xs={3}></Grid>
              <Grid item xs={1.5} style={{ padding: 0 }}>
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
              </Grid>
              <Grid item xs={6}>
                <Pagination count={total} color='primary' onChange={(event, page) => handlePageChange(page)} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
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

export default UserList
