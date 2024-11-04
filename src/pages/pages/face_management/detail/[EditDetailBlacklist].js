import { useRouter } from 'next/router'
import { Fragment, useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import CustomTextField from 'src/@core/components/mui/text-field'
import FileUploader from 'devextreme-react/file-uploader'
import Icon from 'src/@core/components/icon'
import ModalImage from '../ModalImage'
import Link from 'next/link'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Switch,
  Autocomplete,
  TextField,
  Input,
  CircularProgress
} from '@mui/material'

const EditFaceManagement = () => {
  const classes = useStyles()
  const router = useRouter()
  const id = router.query.EditDetailBlacklist
  const [loading, setLoading] = useState(false)
  const [avatarImage, setAvatarImage] = useState(null)
  const [listFileId, setListFileId] = useState([])
  const [listImage, setListImage] = useState([])
  const listFileUrl = []
  const [imgs, setImgs] = useState([])
  const [person, setPerson] = useState([])
  const [listFileUpload, setListFileUpload] = useState([])
  const [fileAvatarId, setFileAvatarId] = useState(null)
  const [name, setName] = useState(null)
  const [note, setNote] = useState(null)
  const [status1, setStatus1] = useState('')
  const [showLoading, setShowLoading] = useState(false)
  const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.gif', '.png']
  const [modalImage, setModalImage] = useState(null)
  const [img0, setImg0] = useState(null)
  const [img1, setImg1] = useState(null)
  const [img2, setImg2] = useState(null)
  const [img3, setImg3] = useState(null)
  const [img4, setImg4] = useState(null)
  const [title1, setTitle1] = useState('')
  const [errorType, setErrorType] = useState(false)

  useEffect(() => {
    setListImage([img0, img1, img2, img3, img4])
  }, [])

  useEffect(() => {
    const listImg = imgs.map(img => ({
      id: img.id,
      urlImage: img.urlImage,
      name: img.name
    }))

    setListImage(listImg)
  }, [imgs])

  const handleStatusChange = () => {
    setStatus1(status1 === true ? false : true)
  }

  const fetchFilteredOrAllUserss = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 25,
          page: 1,
          keyword: ''
        }
      }

      if (id) {
        const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${id}`, config)
        const imgs = [...response.data.imgs]
        setStatus1(response.data.status)
        setFileAvatarId(response.data.mainImageId)
        setListFileUpload(response.data.imgs)
        setListFileId(
          imgs.map(img => ({
            id: img.id,
            urlImage: img.urlImage,
            name: img.name
          }))
        )
        setListImage(imgs.map(img => img.imgs))
        setAvatarImage(response.data.mainImageUrl)
        setImgs(response.data.imgs)
        setImg0(imgs[0]?.urlImage)
        setImg1(imgs[1]?.urlImage)
        setImg2(imgs[2]?.urlImage)
        setImg3(imgs[3]?.urlImage)
        setImg4(imgs[4]?.urlImage)
        setName(response.data.name)
        setNote(response.data.note)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchFilteredOrAllUsers = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: 25,
            page: 1,
            keyword: ''
          }
        }

        if (id) {
          const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${id}`, config)
          const imgs = [...response.data.imgs]
          setStatus1(response.data.status)
          setTitle1(response.data?.type)
          setFileAvatarId({
            mainImageId: response.data.mainImageId,
            mainImageUrl: response.data.mainImageUrl
          })
          setListFileUpload(response.data?.imgs)
          setListFileId(
            imgs.map(img => ({
              id: img.id,
              urlImage: img.urlImage,
              name: img.name
            }))
          )
          setListImage(imgs.map(img => img.imgs))
          setAvatarImage(response.data.mainImageUrl)
          setImg0(imgs[0]?.urlImage)
          setImgs(response.data.imgs)
          setImg1(imgs[1]?.urlImage)
          setImg2(imgs[2]?.urlImage)
          setImg3(imgs[3]?.urlImage)
          setImg4(imgs[4]?.urlImage)
          setName(response.data.name)
          setNote(response.data.note)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilteredOrAllUsers()
  }, [id])

  const fetchChildData = useCallback(async parentCode => {
    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=${parentCode}`
      )

      return response.data
    } catch (error) {
      console.error('Error fetching child data:', error)
      toast.error(error)

      return []
    }
  }, [])

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/code?code=person_specify&sort=%2Bcreated_at&page=1'
      )
      const parentData = response.data[0]

      const allChildData = await fetchChildData(parentData.code)

      const childDataOnly = allChildData.filter(child => child.code !== parentData.code)

      setPerson(childDataOnly)
    } catch (error) {
      console.error('Error fetching initial data:', error)
      toast.error(error)
    }
  }, [fetchChildData])

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  const renderOption = (props, option) => (
    <li {...props} style={{ paddingLeft: `${option.level * 20}px` }}>
      {option.code}
    </li>
  )

  const handleOptionChange = (event, newValue) => {
    setErrorType(!newValue)
    setTitle1(newValue)
  }

  const handleUpdate = async () => {
    setLoading(true)

    if (!selectedOption) {
      setErrorType(true)
      setLoading(false)
      setShowLoading(false)

      return
    }
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const params = {
        name: name,
        note: note,
        status: status1,
        mainImageId: fileAvatarId.mainImageId || fileAvatarId.id,
        mainImageUrl: fileAvatarId.mainImageUrl || fileAvatarId.urlImage,
        imgs: listFileId.map((id, index) => ({
          id: id.id,
          name: id.name,
          urlImage: id.urlImage
        })),
        type: {
          id: title1.id,
          code: title1.code,
          name: title1.name
        }
      }

      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${id}`, params, config)
      Swal.fire({
        title: 'Successfully!',
        text: 'Data has been updated successfully.',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
      fetchFilteredOrAllUserss()
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
      fetchFilteredOrAllUserss()
      console.error('Error adding member to group:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedOption = person.find(option => option.code === title1?.code)

  const onDragDropImage = async () => {
    const files = await filePickerDialog()

    if (files.length > 0) {
      if (files.length + listImage.length > 5) {
        Swal.fire({
          text: 'Up to 5 images',
          icon: 'error',
          confirmButtonColor: '#40a574',
          confirmButtonText: 'Close',
          customClass: { content: 'content-class' }
        })
      } else {
        setShowLoading(true)
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        const config = { headers: { Authorization: `Bearer ${token}` } }

        const newImageUrls = [...listImage] // Bắt đầu với các URL hiện có

        for (const file of files) {
          const formData = new FormData()
          formData.append('files', file)

          try {
            const res = await axios.post('https://sbs.basesystem.one/ivis/vms/api/v0/images/upload', formData, config)
            if (res.data) {
              newImageUrls.push({
                id: res.data.id,
                name: res.data.name,
                urlImage: res.data.urlImage
              })
            }
          } catch (error) {
            console.error('Error occurred during upload:', error.response || error.message)
            Swal.fire({
              text: 'Upload failed: ' + (error.response ? error.response.data.message : error.message),
              icon: 'error',
              confirmButtonColor: '#40a574',
              confirmButtonText: 'Close',
              customClass: { content: 'content-class' }
            })
          }
        }

        // Cập nhật listImage với tối đa 5 URL
        setListImage(newImageUrls.slice(0, 5))
        setListFileUpload(newImageUrls.slice(0, 5))
        setListFileId(newImageUrls.slice(0, 5))
        setShowLoading(false)
      }
    }
  }

  const filePickerDialog = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      input.accept = 'image/*'

      input.onchange = () => {
        const files = Array.from(input.files)
        resolve(files)
      }

      input.click()
    })
  }

  return (
    <>
      <Grid container spacing={6.5}>
        <div>
          {loading && (
            <CircularProgress style={{ marginLeft: '50%', marginTop: '25%', position: 'absolute', zIndex: '2' }} />
          )}
        </div>
        <div>
          {showLoading && (
            <CircularProgress style={{ marginLeft: '50%', marginTop: '25%', position: 'absolute', zIndex: '2' }} />
          )}
        </div>
        <Grid item xs={12} style={{ position: 'relative', zIndex: '1' }}>
          <Card>
            <CardHeader
              title='Details Object'
              titleTypographyProps={{ sx: { mb: [2, 0] } }}
              action={
                <Grid container spacing={2}>
                  <Grid item>
                    <Box sx={{ float: 'right' }}>
                      <Button
                        style={{ background: '#E0D7D7', color: '#000000', right: '20px' }}
                        component={Link}
                        href={`/pages/face_management/list`}
                        sx={{ color: 'blue' }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpdate} variant='contained' disabled={loading}>
                        {loading ? 'Updating...' : 'Save'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              }
              sx={{
                py: 4,
                flexDirection: ['column', 'row'],
                '& .MuiCardHeader-action': { m: 0 },
                alignItems: ['flex-start', 'center']
              }}
            />

            <Grid item xs={12}>
              {modalImage && (
                <ModalImage
                  imageUrl={modalImage}
                  onClose={() => {
                    setModalImage(null)
                  }}
                />
              )}
              <div className={classes.container}>
                <div className={classes.avatar_container}>
                  <div
                    style={{
                      textAlign: 'center',
                      width: '192px'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '18px',
                        lineHeight: '22px',
                        margin: '0px'
                      }}
                    >
                      Avatar
                    </p>
                    <div
                      style={{
                        background: '#CED1D7',
                        borderRadius: '8px',
                        display: 'flex',
                        margin: 'auto',
                        width: '192px',
                        height: '192px'
                      }}
                    >
                      <img
                        alt=''
                        src={avatarImage || fileAvatarId?.urlImage}
                        style={{
                          marginBottom: `${avatarImage || fileAvatarId?.urlImage ? '' : '-10%'}`,
                          objectFit: 'contain',
                          width: `${avatarImage || fileAvatarId?.urlImage ? '100%' : ''}`,
                          height: `${avatarImage || fileAvatarId?.urlImage ? '100%' : ''}`
                        }}
                      />
                    </div>
                    <div
                      style={{
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '10px',
                        marginTop: '10px',
                        textAlign: 'center'
                      }}
                    >
                      <CustomTextField
                        disabled={loading == true}
                        id='eventName'
                        eventname='eventName'
                        placeholder={`Name`}
                        defaultValue=''
                        value={name || ''}
                        onInput={e => {
                          setName(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: '300px',
                    width: '65%',
                    marginTop: '-265px'
                  }}
                >
                  <p
                    style={{
                      fontSize: '18px',
                      lineHeight: '22px',
                      margin: '0px'
                    }}
                  >
                    Description
                  </p>
                  <TextField
                    disabled={loading == true}
                    rows={4}
                    multiline
                    variant='standard'
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: '10px',
                      width: '100%'
                    }}
                    defaultValue=''
                    placeholder='Description'
                    value={`${note}` || ''}
                    onInput={e => {
                      setNote(e.target.value)
                    }}
                    id='textarea-standard-static'
                  />
                  <div>
                    <p
                      style={{
                        fontSize: '18px',
                        lineHeight: '22px',
                        margin: '0px'
                      }}
                    >
                      Status
                    </p>
                    <Switch checked={status1 === true} onChange={handleStatusChange} />
                  </div>
                  <p
                    style={{
                      fontSize: '18px',
                      lineHeight: '22px',
                      margin: '0px'
                    }}
                  >
                    Object Type
                  </p>
                  <Autocomplete
                    value={title1}
                    options={person}
                    getOptionLabel={option => option.code || title1}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        placeholder={!title1 || Object.keys(title1).length === 0 ? 'No data' : ''}
                        error={errorType}
                        helperText={errorType ? 'Please select object type' : ''}
                      />
                    )}
                    renderOption={renderOption}
                    onChange={handleOptionChange}
                    loading={loading}
                    noOptionsText='No data'
                  />
                </div>

                {listImage.length === 0 && (
                  <p style={{ margin: '35px 0px 0px 0px', marginTop: '150px', marginLeft: '20px' }}>
                    <div></div>

                    {`Photos of the object : ( Up to 5 photos)`}
                  </p>
                )}

                {listImage.length > 0 && (
                  <p style={{ margin: '35px 0px 0px 0px', marginTop: '150px', marginLeft: '10px' }}>
                    {`Photos of the object: ${listImage.length}/5`}
                  </p>
                )}
                <div
                  style={{
                    marginTop: '50px',
                    minHeight: '422px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {[...Array(5)].map((_, index) => (
                    <div key={index} style={{ position: 'relative', width: '192px', height: '192px', margin: '1%' }}>
                      <div
                        style={{
                          background: '#CED1D7',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        {listImage[index] ? (
                          <img
                            alt=''
                            src={listImage[index].urlImage}
                            style={{
                              objectFit: 'contain',
                              width: '100%',
                              borderRadius: '8px',
                              height: '100%'
                            }}
                            onDoubleClick={() => setFileAvatarId(listImage[index])}
                          />
                        ) : (
                          MaskGroup
                        )}
                      </div>

                      <div style={{ display: 'flex', marginTop: '5%', marginLeft: '15%' }}>
                        {index > 0 && !listImage[index - 1] && !listImage[index] ? (
                          <Button variant='contained' style={{ marginLeft: '20%' }} disabled>
                            <Icon icon='tabler:plus' />
                          </Button>
                        ) : listImage[index] ? (
                          <Button variant='contained'>
                            <Icon icon='tabler:edit' />
                          </Button>
                        ) : (
                          <Button
                            variant='contained'
                            style={{ marginLeft: '20%' }}
                            onClick={() => onDragDropImage(index)}
                          >
                            <Icon icon='tabler:plus' />
                          </Button>
                        )}

                        {listImage[index] ? (
                          <Button
                            variant='contained'
                            onClick={() => {
                              const listFileUploadImgId = [...listFileId]
                              const listFileUploadTmp = [...listImage]

                              // Tìm index của ảnh cần xóa
                              const indexId = listFileUploadTmp.findIndex(img => img.id === listImage[index].id)

                              if (indexId !== -1) {
                                listFileUploadImgId.splice(indexId, 1)
                                listFileUploadTmp.splice(indexId, 1)
                                setListFileId(listFileUploadImgId)
                                setListFileUpload(listFileUploadTmp)
                                setListImage(listFileUploadTmp)
                              }
                            }}
                            style={{ marginLeft: '5%' }}
                          >
                            <Icon icon='tabler:trash' />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

const MaskGroup = (
  <svg width='100%' height='100%' viewBox='0 0 193 173' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0)'>
      <path
        d='M176.833 147.216C154.238 134.408 126.747 128.909 123.96 120.697C121.173 112.485 120.571 104.423 123.132 98.3208C125.692 92.2183 128.705 92.9717 130.211 86.1911C130.211 86.1911 133.977 86.9445 136.99 82.4242C140.003 77.9038 140.756 70.3698 140.756 66.6029C140.756 62.8359 135.484 60.5757 135.484 60.5757C135.484 60.5757 140.756 46.2612 137.743 31.9467C134.73 17.6322 124.939 -0.449244 92.553 1.05755V1.28356C66.1168 2.71501 57.6813 18.9883 54.8945 32.1727C51.8819 46.4872 57.1541 60.8017 57.1541 60.8017C57.1541 60.8017 51.8819 63.0619 51.8819 66.8289C51.8819 70.5959 52.635 78.1298 55.6477 82.6502C58.6604 87.1705 62.4262 86.4171 62.4262 86.4171C63.9326 93.1977 66.9453 92.4443 69.506 98.5468C72.0668 104.649 71.4643 112.786 68.6775 120.923C65.8908 129.059 38.4001 134.634 15.8051 147.442C-6.79001 160.25 -4.5305 173.058 -4.5305 173.058L197.319 172.907C197.168 172.831 199.428 160.024 176.833 147.216Z'
        fill='#797979'
      />
    </g>
    <defs>
      <clipPath id='clip0'>
        <rect width='202' height='172' fill='white' transform='translate(-4.75635 0.982422)' />
      </clipPath>
    </defs>
  </svg>
)

const useStyles = makeStyles(() => ({
  cancelBtn: {
    width: '116px',
    height: '40px',
    background: '#E2E2E2',
    border: '1px solid #DDDDDD',
    boxSizing: 'border-box',
    borderRadius: '8px',
    '& .dx-button-content': { display: 'block' }
  },
  addBtn: {
    width: '104px',
    height: '40px',
    background: '#00554A',
    boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
    borderRadius: '8px',
    color: '#fff',
    '& .dx-button-content': { display: 'block' }
  },
  container: {
    padding: '30px 50px 0px 50px',
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
    borderRadius: '10px'
  },
  avatar_container: {
    width: '100%',
    '& .cropper': {
      height: '422px',
      float: 'left'
    },
    '& .cropper .box': {
      display: 'inline-block',
      padding: '10px',
      boxSizing: 'border-box'
    },
    '& .cropper .img-preview': {
      overflow: 'hidden'
    }
  },
  related_image: {
    height: '179px',
    width: '100%',
    marginTop: '28px'
  },
  vertical: {
    height: '180px',
    position: 'relative',
    float: 'right',
    marginTop: '-226.04px',
    marginRight: '28.9px'
  },
  icon: {
    float: 'right',
    position: 'relative',
    marginTop: '-420px',
    padding: '10px',
    color: '#fff'
  },
  cardImageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'wrap',
    '& .add-btn': {
      border: '1.5px dashed rgba(0, 0, 0, 0.48)'
    },
    '& .card-img': {
      position: 'relative',
      width: '230px',
      height: '230px',
      display: 'flex',
      margin: '10px',
      '& .hover-image': {
        width: '100%',
        height: '100%',
        background: 'rgb(206, 209, 215)',
        objectFit: 'contain',
        borderRadius: '8px'
      }
    },
    '& .card-img .close': {
      display: 'none',
      padding: '0px',
      position: 'absolute',
      top: '10px',
      width: '25px',
      right: '5px',
      backgroundColor: '#fff',
      '& .MuiIconButton-label': {
        width: '24px',
        height: '24px'
      }
    },
    '& .card-img:hover .close': {
      display: 'block'
    },
    '& .card-img .full': {
      display: 'none',
      padding: '0px',
      position: 'absolute',
      right: '5px',
      bottom: '5px',
      width: '25px',
      height: '25px',
      backgroundColor: '#fff',
      '& .MuiIconButton-label': {
        width: '24px',
        height: '24px'
      }
    },
    '& .card-img:hover .full': {
      display: 'block'
    }
  }
}))

export default EditFaceManagement
