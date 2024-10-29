import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Input,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { delApi, postApi } from 'src/@core/utils/requestUltils'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'

const buildUrlWithToken = url => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  if (token) {
    return `${url}?token=${token}`
  }

  return url
}

const columns1 = [
  {
    id: 1,
    flex: 0.25,
    maxWidth: 150,
    align: 'center',
    field: 'data',
    label: 'Image',
    renderCell: data => {
      const value = data?.find(item => item.faceType === 'CENTER')

      return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={(value?.imageFileUrl)}
            alt=''
            style={{ width: 100, height: 100, objectFit: 'contain' }}
          />
        </Box>
      )
    }
  },
  {
    id: 2,
    flex: 0.15,
    maxWidth: 150,
    align: 'center',
    field: 'member_id',
    label: 'ID'
  },
  {
    id: 3,
    flex: 0.15,
    maxWidth: 150,
    align: 'center',
    field: 'quality',
    label: 'Quality'
  },
  {
    id: 4,
    flex: 0.15,
    maxWidth: 150,
    align: 'center',
    field: 'distance',
    label: 'Similarity level'
  }
]

const columns = [
  {
    id: 1,
    flex: 0.25,
    maxWidth: 150,
    align: 'center',
    field: 'data',
    label: 'Image',
    renderCell: data => {
      const value = data?.find(item => item.faceType === 'CENTER')

      return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={buildUrlWithToken(value?.imageFileUrl)}
            alt=''
            style={{ width: 100, height: 100, objectFit: 'contain' }}
          />
        </Box>
      )
    }
  },
  {
    id: 2,
    flex: 0.15,
    maxWidth: 150,
    align: 'center',
    field: 'member_id',
    label: 'ID'
  },
  {
    id: 3,
    flex: 0.15,
    maxWidth: 150,
    align: 'center',
    field: 'quality',
    label: 'Quality'
  },
  {
    id: 4,
    flex: 0.15,
    maxWidth: 150,
    align: 'center',
    field: 'distance',
    label: 'Similarity level'
  }
]

const form_filter = [
  {
    name: 'threshold',
    label: 'Threshold',
    placeholder: '0.1',
    type: 'TextField',
    require: true,
    width: 6
  },
  {
    name: 'topk',
    label: 'Similarity',
    placeholder: '5',
    type: 'TextField',
    require: true,
    width: 6
  }
]

const Blacklist = () => {
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(0)

  const [total, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)

  const [blacklist, setBlacklist] = useState([])
  const [memberList, setMemberList] = useState([])

  const [isOpenDel, setIsOpenDel] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [base64, setBase64] = useState('')
  const [image, setImage] = useState(null)

  const [keyword, setKeyword] = useState('')
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState(form_filter)
  const [typeDel, setTypeDel] = useState(null)
  const [valueFilter, setValueFilter] = useState({ image: null, threshold: null, topk: null })

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  useEffect(() => {
    if (detail) {
      setDetailFormValue()
    }
  }, [detail])

  const setDetailFormValue = () => {
    reset(detail)
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      const base64WithoutPrefix = base64String.replace(/^data:image\/[a-z]+;base64,/, '')
      setBase64(base64WithoutPrefix)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (valueFilter.image !== null, valueFilter.threshold !== null, valueFilter.topk !== null) {
      fetchData(valueFilter)
    }
  }, [valueFilter, reload])

  const fetchData = async values => {
    setLoading(true)

    const params = {
      ...values
    }

    try {
      const res = await postApi(`https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/search`, params)
      const topBlacklist = res.data?.topk_blacklists
      const topMember = res.data?.topk_members
      setBlacklist(topBlacklist)
      setMemberList(topMember)
    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = e => {
    setKeyword(e.target.value)
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

  const onSubmit = values => {
    var detail = {
      image: base64,
      threshold: parseFloat(values?.threshold),
      topk: parseInt(values?.topk)
    }

    setValueFilter({ image: detail.image, threshold: detail.threshold, topk: detail.topk })
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
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

  const handleDeleteMember = idDelete => {
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
          },
          
        }
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${idDelete}?type=member`
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
            setReload(reload + 1);    
          })
          .catch(err => {
            Swal.fire('error', err.message, 'error')

          })
      }
    })
  }

  const handleDeleteBlacklist = idDelete => {
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
          },
          
        }
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${idDelete}?type=blacklist`
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
            setReload(reload + 1);
          })
          .catch(err => {
            Swal.fire('error', err.message, 'error')
            setReload(reload + 1);           

          })
      }
    })
  }
  
  const handleDelete = async () => {
    if (deleteId !== null && typeDel !== null) {
      setLoading(true)

      const id = deleteId

      try {
        await delApi(`https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${id}?type=${typeDel}`)
        toast.success('Delete Successful')
      } catch (error) {
        if (error && error?.response?.data) {
          console.error('error', error)
          toast.error(error?.response?.data?.message)
        } else {
          console.error('Error fetching data:', error)
          toast.error(error)
        }
      } finally {
        setLoading(false)
        setDeleteId(null)
        setTypeDel(null)
        setReload(reload + 1)
      }
    }
  }

  const DeleteView = () => (
    <Dialog
      open={isOpenDel}
      maxWidth='sm'
      scroll='body'
      onClose={() => setIsOpenDel(false)}
      onBackdropClick={() => setIsOpenDel(false)}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            Accept
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Do you want to delete it?</Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button
          variant='contained'
          onClick={() => {
            handleDelete()
            setIsOpenDel(false)
          }}
        >
          Agree
        </Button>
        <Button variant='tonal' color='secondary' sx={{ mr: 1 }} onClick={() => setIsOpenDel(false)}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      {loading === true && (
        <Box
          sx={{ width: '100%', height: ' 100%', position: 'absolute', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <CircularProgress />
        </Box>
      )}
      <div style={{ padding: '30px' }}>
        <Typography variant='h3' sx={{ marginBottom: '30px' }}>
          Blacklist
        </Typography>

        <Card>
          <CardContent>
            <form>
              <Grid container spacing={5}>
                <Grid item container xs={12} spacing={3}>
                  <Grid item xs={4}>
                    <Button variant='outlined' color='secondary' component='label' sx={{ mt: 2 }}>
                      <Input type='file' hidden onChange={handleImageChange} inputProps={{ accept: 'image/*' }} />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    container
                    spacing={3}
                    xs={5}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}
                  >
                    {form.map((item, index) => {
                      return (
                        <Grid item xs={item.width} key={item.name}>
                          <Controller
                            name={item.name}
                            control={control}
                            rules={{ required: item.require }}
                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                fullWidth
                                value={value || ''}
                                label={item.label}
                                onChange={onChange}
                                placeholder={item.placeholder}
                                error={Boolean(errors[item.name])}
                                aria-describedby='validation-basic-first-name'
                                {...(errors[item.name] && { helperText: 'This field is required' })}
                              />
                            )}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                  <Grid item xs={3}>
                    <CustomTextField
                      value={keyword}
                      label={'Search'}
                      placeholder='Search đối tượng'
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 2, display: 'flex' }}>
                            <Icon fontSize='1.25rem' icon='tabler:search' />
                          </Box>
                        ),
                        endAdornment: (
                          <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                            <Icon fontSize='1.25rem' icon='tabler:x' />
                          </IconButton>
                        )
                      }}
                      onChange={e => handleSearch(e)}
                      sx={{
                        width: {
                          xs: 1,
                          sm: 'auto'
                        },
                        '& .MuiInputBase-root > svg': {
                          mr: 2
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button variant='contained' color='secondary' sx={{ margin: 2, float: 'right' }}>
                    Delete all
                  </Button>
                  <Button
                    variant='contained'
                    type='submit'
                    sx={{ margin: 2, float: 'right' }}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <br />
        <Card>
          <CardHeader title='Blacklist' />
          <CardContent>
            <Grid container spacing={0}>
              <TableContainer component={Paper} sx={{ maxHeight: 1000 }}>
                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: '20px' }}>NO.</TableCell>
                      {columns1.map(column => (
                        <TableCell key={column.id} align={column.align} sx={{ maxWidth: column.maxWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                      <TableCell style={{ maxWidth: '50px' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {blacklist?.slice(0, pageSize).map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell>{index + 1}</TableCell>
                          {columns1.map(({ field, renderCell, align, maxWidth }) => {
                            const value = row[field]

                            return (
                              <TableCell
                                key={field}
                                align={align}
                                sx={{ maxWidth, wordBreak: 'break-word', flexWrap: 'wrap' }}
                              >
                                {renderCell ? renderCell(value) : value}
                              </TableCell>
                            )
                          })}
                          <TableCell>
                            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                              <IconButton
                              onClick={() => handleDeleteBlacklist(row?.member_id)}

                              >
                                <Icon icon='tabler:trash' />
                              </IconButton>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </CardContent>
        </Card>
        <br />
        <Card>
          <CardHeader title='Member' />
          <CardContent>
            <Grid container spacing={0}>
              <TableContainer component={Paper} sx={{ maxHeight: 1000 }}>
                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: '20px' }}>NO.</TableCell>
                      {columns.map(column => (
                        <TableCell key={column.id} align={column.align} sx={{ maxWidth: column.maxWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                      <TableCell style={{ maxWidth: '50px' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {memberList?.slice(0, pageSize).map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell>{index + 1}</TableCell>
                          {columns.map(({ field, renderCell, align, maxWidth }) => {
                            const value = row[field]

                            return (
                              <TableCell
                                key={field}
                                align={align}
                                sx={{ maxWidth, wordBreak: 'break-word', flexWrap: 'wrap' }}
                              >
                                {renderCell ? renderCell(value) : value}
                              </TableCell>
                            )
                          })}
                          <TableCell>
                            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                              <IconButton
                               onClick={() => handleDeleteMember(row?.member_id)}
                              >
                                <Icon icon='tabler:trash' />
                              </IconButton>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </CardContent>
        </Card>
      </div>
      {isOpenDel && DeleteView()}
    </>
  )
}

export default Blacklist
