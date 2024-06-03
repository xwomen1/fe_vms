import { useRouter } from 'next/router'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { CircularProgress } from '@material-ui/core'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import FileUploader from 'devextreme-react/file-uploader'
import ModalImage from '../ModalImage'
import Link from 'next/link'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tab,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Input
} from '@mui/material'
import Fullscreen from '@material-ui/icons/Fullscreen'

const UpDateCar = () => {
  const classes = useStyles()
  const router = useRouter()
  const id = router.query.UpDateCar
  const [loading, setLoading] = useState(false)
  const [avatarImage, setAvatarImage] = useState(null)
  const [listFileId, setListFileId] = useState([])
  const [listImage, setListImage] = useState([])
  const listFileUrl = []
  const [listFileUpload, setListFileUpload] = useState([])
  const [fileAvatarImg, setFileAvatarImg] = useState(null)
  const [showCropper, setShowCopper] = useState(false)
  const [fileAvatarId, setFileAvatarId] = useState(null)
  const [name, setName] = useState(null)
  const [note, setNote] = useState(null)
  const fileUploader1 = useRef(null)

  const fileUploader2 = useRef(null)
  const [showLoading, setShowLoading] = useState(false)
  const [isDoubleClick, setIsDoubleClick] = useState(false)
  const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.gif', '.png']
  const [modalImage, setModalImage] = useState(null)
  const [img0, setImg0] = useState(null)
  const [img1, setImg1] = useState(null)
  const [img2, setImg2] = useState(null)
  const [img3, setImg3] = useState(null)
  const [img4, setImg4] = useState(null)

  const buildUrlWithToken = url => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    if (token) {
      return `${url}?token=${token}`
    }

    return url
  }

  useEffect(() => {
    setListImage([img0, img1, img2, img3, img4])
  }, [])

  useEffect(() => {
    const listImg = listFileId.map(id =>
      buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${id}`)
    )
    setListImage(listImg)
  }, [listFileId])

  const Img = React.memo(props => {
    const [loaded, setLoaded] = useState(false)

    const { src } = props

    return (
      <>
        <div
          style={
            loaded
              ? { display: 'none' }
              : {
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  backgroundColor: '#C4C4C4',
                  placeItems: 'center'
                }
          }
        >
          <CircularProgress size={20} />
        </div>
        <img
          {...props}
          src={src}
          alt='Ảnh'
          onLoad={() => setLoaded(true)}
          style={loaded ? { width: '100%', height: '100%' } : { display: 'none' }}
        />
      </>
    )
  })

  const onDragDropImage = async e => {
    if (e.value.length > 0) {
      if (e.value.length + listFileUpload.length > 5) {
        Swal.fire({
          text: 'Tối đa 5 file',
          icon: 'error',
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: true,
          focusConfirm: true,
          confirmButtonColor: '#40a574',
          confirmButtonText: 'Đóng',
          customClass: {
            content: 'content-class'
          }
        })
      } else {
        const files = listFileUpload.concat(e.value)

        const formData = new FormData()

        for (const file of files) {
          formData.append('files', file)
        }
        setShowLoading(true)

        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        try {
          const res = await axios.post(
            `https://sbs.basesystem.one/ivis/storage/api/v0/libraries/upload/multi`,
            formData,
            config
          )
          setListFileUpload(files)

          const fileIds = res.data.map(x => x.id)

          const arr = [...listFileId, ...fileIds]

          setListFileId([...arr].slice(0, 5))
        } catch (error) {
          console.error('Error occurred during upload:', error)
        } finally {
          setShowLoading(false)
        }
      }
      if (fileUploader2?.current?.instance) {
        fileUploader2.current.instance.reset()
      }
      if (fileUploader1?.current?.instance) {
        fileUploader1.current.instance.reset()
      }
    }
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
        const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/licenseplates/${id}`, config)
        const imgs = response.data.imgs ? [...response.data.imgs] : [] // Kiểm tra nếu response.data.imgs tồn tại
        setFileAvatarId(response.data.mainImageId)
        setListFileUpload(
          imgs.map(img =>
            buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${img.id}`)
          )
        )
        setListFileId(imgs.map(img => img.id))
        setListImage(
          imgs.map(img =>
            buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${img.id}`)
          )
        )
        if (response.data.mainImageId.length > 0) {
          console.log('đúng')
          setAvatarImage(
            buildUrlWithToken(
              `https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${response.data.mainImageId}`
            )
          )
        } else {
          setAvatarImage(null)
          console.log('sai')
        }

        setImg0(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[0]?.id}`))
        setImg1(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[1]?.id}`))
        setImg2(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[2]?.id}`))
        setImg3(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[3]?.id}`))
        setImg4(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[4]?.id}`))
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
          const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/licenseplates/${id}`, config)
          const imgs = response.data.imgs ? [...response.data.imgs] : [] // Kiểm tra nếu response.data.imgs tồn tại
          setFileAvatarId(response.data.mainImageId)
          setListFileUpload(
            imgs.map(img =>
              buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${img.id}`)
            )
          )
          setListFileId(imgs.map(img => img.id))
          setListImage(
            imgs.map(img =>
              buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${img.id}`)
            )
          )
          if (response.data.mainImageId.length > 0) {
            console.log('đúng')
            setAvatarImage(
              buildUrlWithToken(
                `https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${response.data.mainImageId}`
              )
            )
          } else {
            setAvatarImage(null)
            console.log('sai')
          }
          setImg0(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[0]?.id}`))
          setImg1(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[1]?.id}`))
          setImg2(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[2]?.id}`))
          setImg3(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[3]?.id}`))
          setImg4(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[4]?.id}`))
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

  const handleUpdate = async () => {
    setLoading(true)
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
        mainImageId: fileAvatarId,
        imgs: listFileId.map((id, index) => ({
          id: id,
          urlImage: listFileUrl[id]
        }))
      }
      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/licenseplates/${id}`, params, config)
      Swal.fire('Sửa thành công', '', 'success')
      fetchFilteredOrAllUserss()
    } catch (error) {
      Swal.fire('Sửa không thành công', error.response.data.message, 'error')

      console.error('Error adding member to group:', error)
    }
  }
  console.log(avatarImage, 'avatarImage')

  return (
    <>
      {showLoading || loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Grid container spacing={6.5}>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title='Đối tượng danh sách'
                  titleTypographyProps={{ sx: { mb: [2, 0] } }}
                  action={
                    <Grid container spacing={2}>
                      <Grid item>
                        <Box sx={{ float: 'right' }}>
                          <Button
                            style={{ background: '#E0D7D7', color: '#000000', right: '20px' }}
                            component={Link}
                            href={`/pages/car_management/list`}
                            sx={{ color: 'blue' }}
                          >
                            Hủy
                          </Button>
                          <Button onClick={handleUpdate} variant='contained'>
                            Cập nhật
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
                  <TableContainer>
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
                            Ảnh đại diện
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
                            {avatarImage ? (
                              <img
                                alt=''
                                src={avatarImage}
                                style={{
                                  marginBottom: `${avatarImage ? '' : '-10%'}`,
                                  objectFit: 'contain',
                                  width: `${avatarImage ? '100%' : ''}`,
                                  height: `${avatarImage ? '100%' : ''}`
                                }}
                              />
                            ) : (
                              <Img
                                style={{
                                  objectFit: 'contain',
                                  width: '100%',
                                  height: '100%'
                                }}
                                src={`data:image/svg+xml;utf8,${encodeURIComponent(MaskGroup)}`}
                                alt='Placeholder Image'
                              />
                            )}
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
                              id='eventName'
                              eventname='eventName'
                              placeholder={`Tên đối tượng`}
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
                          Ghi chú
                        </p>

                        <TextField
                          rows={4}
                          multiline
                          variant='standard'
                          style={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '10px',
                            width: '100%'
                          }}
                          defaultValue=''
                          placeholder='  Nhập ghi chú ...!'
                          value={`${note}` || ''}
                          onInput={e => {
                            setNote(e.target.value)
                          }}
                          id='textarea-standard-static'
                        />
                      </div>
                      {listFileUpload.length === 0 && (
                        <p style={{ margin: '35px 0px 0px 0px', marginTop: '250px', marginLeft: '20px' }}>
                          <div></div>

                          {`Ảnh của đối tượng : ( tối đa 5 ảnh)`}
                        </p>
                      )}
                      {listFileUpload.length > 0 && (
                        <p style={{ margin: '35px 0px 0px 0px', marginTop: '200px', marginLeft: '10px' }}>
                          {`Ảnh của đối tượng: ${listFileUpload.length}/5`}
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
                        {listFileUpload.length === 0 && (
                          <Fragment>
                            <div
                              className='cropper'
                              style={{
                                display: 'flex'
                              }}
                              id='dropzone-external'
                            >
                              <div
                                style={{
                                  margin: 'auto',
                                  alignSelf: 'center',
                                  textAlign: 'center'
                                }}
                              >
                                <div>
                                  <img alt='' src={`data:image/svg+xml;utf8,${encodeURIComponent(svgPath)}`} />
                                </div>
                                <p
                                  style={{
                                    fontSize: '16px',
                                    lineHeight: '19px'
                                  }}
                                >
                                  {`Kéo thả ảnh`}
                                </p>
                                <p
                                  style={{
                                    fontSize: '16px',
                                    lineHeight: '19px'
                                  }}
                                >
                                  {`Hoặc`}
                                </p>
                                <Button
                                  style={{
                                    width: '200px',
                                    height: '50px'
                                  }}
                                  variant='contained'
                                  color='primary'
                                >
                                  {`Tải ảnh lên`}
                                </Button>
                              </div>
                            </div>
                            <FileUploader
                              style={{ opacity: '0' }}
                              id='file-uploader'
                              dialogTrigger='#dropzone-external'
                              dropZone='#dropzone-external'
                              multiple
                              allowedFileExtensions={ALLOWED_FILE_EXTENSIONS}
                              uploadMode='useButtons'
                              visible={false}
                              onValueChanged={onDragDropImage}
                              ref={fileUploader1}
                            />
                          </Fragment>
                        )}
                        {listFileUpload.length > 0 && listImage.length > 0 && (
                          <div className={classes.cardImageContainer}>
                            {listImage.length < 5 && (
                              <div className='add-btn card-img' id='dropzone-external-2'>
                                <div style={{ alignSelf: 'center', margin: 'auto', marginLeft: '100px' }}>
                                  <Icon icon='tabler:plus' />
                                </div>
                                <FileUploader
                                  style={{ opacity: '0' }}
                                  id='file-uploader-2'
                                  dialogTrigger='#dropzone-external-2'
                                  dropZone='#dropzone-external-2'
                                  multiple
                                  allowedFileExtensions={ALLOWED_FILE_EXTENSIONS}
                                  uploadMode='useButtons'
                                  visible={false}
                                  onValueChanged={e => {
                                    onDragDropImage(e)
                                  }}
                                  ref={fileUploader2}
                                />
                              </div>
                            )}
                            {listImage.map((image, index) => (
                              <div className='card-img' key={index}>
                                <img
                                  src={image}
                                  alt=''
                                  className='hover-image'
                                  onDoubleClick={() => {
                                    // setShowCopper(true);

                                    setAvatarImage(image)
                                    setFileAvatarImg(listFileUpload[listImage.indexOf(image)])
                                    setFileAvatarId(listFileId[listImage.indexOf(image)])
                                  }}
                                />
                                <IconButton
                                  className='close'
                                  onClick={() => {
                                    const listFileUploadImgId = [...listFileId]
                                    const listFileUploadTmp = [...listFileUpload]
                                    const indexId = listFileUploadTmp.indexOf(image)
                                    listFileUploadImgId.splice(indexId, 1)
                                    listFileUploadTmp.splice(indexId, 1)
                                    setListFileId(listFileUploadImgId)
                                    setListFileUpload(listFileUploadTmp)
                                    setListImage(listFileUploadTmp)
                                  }}
                                  color='primary'
                                >
                                  -
                                </IconButton>
                                <IconButton
                                  className='full'
                                  color='primary'
                                  onClick={() => {
                                    setModalImage(image)
                                  }}
                                >
                                  <Icon icon='tabler:maximize' />
                                </IconButton>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableContainer>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  )
}

const MaskGroup = `<svg width="21" height="23" viewBox="0 0 193 173" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M176.833 147.216C154.238 134.408 126.747 128.909 123.96 120.697C121.173 112.485 120.571 104.423 123.132 98.3208C125.692 92.2183 128.705 92.9717 130.211 86.1911C130.211 86.1911 133.977 86.9445 136.99 82.4242C140.003 77.9038 140.756 70.3698 140.756 66.6029C140.756 62.8359 135.484 60.5757 135.484 60.5757C135.484 60.5757 140.756 46.2612 137.743 31.9467C134.73 17.6322 124.939 -0.449244 92.553 1.05755V1.28356C66.1168 2.71501 57.6813 18.9883 54.8945 32.1727C51.8819 46.4872 57.1541 60.8017 57.1541 60.8017C57.1541 60.8017 51.8819 63.0619 51.8819 66.8289C51.8819 70.5959 52.635 78.1298 55.6477 82.6502C58.6604 87.1705 62.4262 86.4171 62.4262 86.4171C63.9326 93.1977 66.9453 92.4443 69.506 98.5468C72.0668 104.649 71.4643 112.786 68.6775 120.923C65.8908 129.059 38.4001 134.634 15.8051 147.442C-6.79001 160.25 -4.5305 173.058 -4.5305 173.058L197.319 172.907C197.168 172.831 199.428 160.024 176.833 147.216Z" fill="#797979"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="202" height="172" fill="white" transform="translate(-4.75635 0.982422)"/>
</clipPath>
</defs>
</svg>
`

const svgPath = `<svg width="85" height="84" viewBox="0 0 85 84" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.4" clip-path="url(#clip0)">
<mask id="path-1-inside-1" fill="white">
<path d="M69.6415 0.322754H62.091V2.2308H69.6415V0.322754ZM54.5404 0.322754H46.9899V2.2308H54.5404V0.322754ZM39.4393 0.322754H33.7764V2.2308H39.4393V0.322754ZM35.664 9.86298H33.7764V17.4952H35.664V9.86298ZM35.664 25.1273H33.7764V32.7595H35.664V25.1273ZM35.664 40.3917H33.7764V48.0239H35.664V40.3917ZM45.1022 49.9319H37.5516V51.84H45.1022V49.9319ZM60.2033 49.9319H52.6528V51.84H60.2033V49.9319ZM75.3045 49.9319H67.7539V51.84H75.3045V49.9319ZM84.7427 46.1159H82.855V49.9319V51.84H84.7427V46.1159ZM84.7427 30.8515H82.855V38.4837H84.7427V30.8515ZM84.7427 15.5871H82.855V23.2193H84.7427V15.5871ZM84.7427 0.322754H77.1921V2.2308H82.855V7.95494H84.7427V0.322754Z"/>
</mask>
<path d="M69.6415 0.322754H62.091V2.2308H69.6415V0.322754ZM54.5404 0.322754H46.9899V2.2308H54.5404V0.322754ZM39.4393 0.322754H33.7764V2.2308H39.4393V0.322754ZM35.664 9.86298H33.7764V17.4952H35.664V9.86298ZM35.664 25.1273H33.7764V32.7595H35.664V25.1273ZM35.664 40.3917H33.7764V48.0239H35.664V40.3917ZM45.1022 49.9319H37.5516V51.84H45.1022V49.9319ZM60.2033 49.9319H52.6528V51.84H60.2033V49.9319ZM75.3045 49.9319H67.7539V51.84H75.3045V49.9319ZM84.7427 46.1159H82.855V49.9319V51.84H84.7427V46.1159ZM84.7427 30.8515H82.855V38.4837H84.7427V30.8515ZM84.7427 15.5871H82.855V23.2193H84.7427V15.5871ZM84.7427 0.322754H77.1921V2.2308H82.855V7.95494H84.7427V0.322754Z" fill="black"/>
<path d="M69.6415 0.322754H72.6415V-2.67725H69.6415V0.322754ZM62.091 0.322754V-2.67725H59.091V0.322754H62.091ZM62.091 2.2308H59.091V5.2308H62.091V2.2308ZM69.6415 2.2308V5.2308H72.6415V2.2308H69.6415ZM54.5404 0.322754H57.5404V-2.67725H54.5404V0.322754ZM46.9899 0.322754V-2.67725H43.9899V0.322754H46.9899ZM46.9899 2.2308H43.9899V5.2308H46.9899V2.2308ZM54.5404 2.2308V5.2308H57.5404V2.2308H54.5404ZM39.4393 0.322754H42.4393V-2.67725H39.4393V0.322754ZM33.7764 0.322754V-2.67725H30.7764V0.322754H33.7764ZM33.7764 2.2308H30.7764V5.2308H33.7764V2.2308ZM39.4393 2.2308V5.2308H42.4393V2.2308H39.4393ZM35.664 9.86298H38.664V6.86298H35.664V9.86298ZM33.7764 9.86298V6
.86298H30.7764V9.86298H33.7764ZM33.7764 17.4952H30.7764V20.4952H33.7764
V17.4952ZM35.664 17.4952V20.4952H38.664V17.4952H35.664ZM35.664 25.1273H38.66
4V22.1273H35.664V25.1273ZM33.7764 25.1273V22.1273H30.7764V25.1273H33.7764ZM33.7764 32.7595H30.7764V35.7595H33
.7764V32.7595ZM35.664 32.7595V35.7595H38.664V32.7595H35.664ZM35.664 40.3917H38.664V37.3917H35.664V40.3917ZM33.7764 40
.3917V37.3917H30.7764V40.3917H33.7764ZM33.7764 48.0239H30.7764V51.0239H33.7764V48.0239ZM35.664 48.0239V51.0239H38.664V48.0239H3
5.664ZM45.1022 49.9319H48.1022V46.9319H45.1022V49.9319ZM37.5516 49.9319V46.9319H34.5516V49.9319H37.5516ZM37.5516 51.84H34.5516V54
.84H37.5516V51.84ZM45.1022 51.84V54.84H48.1022V51.84H45.1022ZM60.2033 49.9319H63.2033V46.9319H60.2033V49.9319ZM52.6528 49.9319V46.
9319H49.6528V49.9319H52.6528ZM52.6528 51.84H49.6528V54.84H52.6528V51.84ZM60.2033 51.84V54.84H63.2033V51.84H60.2033ZM75.3045 49.9319H78.3045V46.9319H75.3045V49.9319ZM67.7539 49.9319V46.9319H64.7539V49.9319H67.7539ZM67.7539 51.84H64.7539V54.84H67.7539V51.84ZM75.3045 51.84V54.84H78.3045V51.84H75.3045ZM84.7427 46.1159H87.7427V43.1159H84.7427V46.1159ZM82.855 46.1159V43.1159H79.855V46.1159H82.855ZM82.855 51.84H79.855V54.84H82.855V51.84ZM84.7427 51.84V54.84H87.7427V51.84H84.7427ZM84.7427 30.8515H87.7427V27.8515H84.7427V30.8515ZM82.855 30.8515V27.8515H79.855V30.8515H82.855ZM82.855 38.4837H79.855V41.4837H82.855V38.4837ZM84.7427 38.4837V41.4837H87.7427V38.
4837H84.7427ZM84.7427 15.5871H87.7427V12.5871H84.7427V15.5871ZM82.855 15.5871V12.5871H79.855V15.5871H82.855ZM82.855 23.2193H79.855V26.2193H82.855V23.2193ZM84.7427 23.2193V26.2193H87.7427V23.2193H84.7427ZM84.7427 0.322754H87.7427V-2.67725H84.7427V0.322754ZM77.1921 0.322754V-2.67725H74.1921V0.322754H77.1921ZM77.1921 2.2308H74.1921V5.2308H77.1921V2.2308ZM82.855 2.2308H85.855V-0.7692H82.855V2.2308ZM82.855 7.95494H79.855V10.9549H82.855V7.95494ZM84.7427 7.95494V10.9549H87.7427V7.95494H84.7427ZM69.6415 -2.67725H62.091V3.32275H69.6415V-2.67725ZM59.091 0.322754V2.2308H65.091V0.322754H59.091ZM62.091 5.2308H69.6415V-0.7692H62.091V5.2308ZM72.6415 2.2308V0.322754H66
.6415V2.2308H72.6415ZM54.5404 -2.67725H46.9899V3.32275H54.5404V-2.67725ZM43.9899 0.322754V2.2308H49.9899V0.322754H43.9899ZM46.9899 5.2308H54.5404V-0.7692H46.9899V5.2308ZM57.5404 2.2308V0.322754H51.5404V2.2308H57.5404ZM39.4393 -2.67725H33.7764V3.32275H39.4393V-2.67725ZM30.7764 0.322754V2.2308H36.7764V0.322754H30.7764ZM33.7764 5.2308H39.4393V-0.7692H33.7764V5.2308ZM42.4393 2.2308V0.322754H36.4393V2.2308H42.4393ZM35.664 6.86298H33.7764V12.863H35.664V6.86298ZM30.7764 9.86298V17.4952H36.7764V9.86298H30.7764ZM33.7764 20.4952H35.664V14.4952H33.7764V20.4952ZM38.664 17.4952V9.86298H32.664V17.4952H38.664ZM35.664 22.1273H33.7764V28.1273H35.664V22.1273ZM30.7764 25.1273V32.7595H36.7764V25.1273H30.7764ZM33.7764 35.7595H35.664V29.7595H33.7764V35.7595ZM38.664 32.7595V25.1273H32.664V32.7595H38.664ZM35.664 37.3917H33.7764V43.3917H35.664V37.3917ZM30.7764 40.3917V48.0239H36.7764V40.3917H30.7764ZM33.7764 51.0239H35.664V45.0239H33.7764V51.0239ZM38.664 48.0239V40.3917H32.664V48.0239H38.664ZM45.1022 46.9319H37.5516V52.9319H45.1022V46.9319ZM34.5516 49.9319V51.84H40.5516V49.9319H34.5516ZM37.5516 54.84H45.1022V48.84H37.5516V54.84ZM48.1022 51.84V49.9319H42.1022V51.84H48.1022ZM60.2033 46.9319H52.6528V52.9319H60.2033V46.9319ZM49.6528 49.9319V51.84H55.6528V49.9319H49.6528ZM52.6528 54.84H60.2033V48.84H52.6528V54.84ZM63.2033 51.84V49.9319H57.2033V51.84H63.2033ZM75.3045 46.9319H67.7539V52.9319H75.3045V46.9319ZM64.7539 49.9319V51.84H70.7539V49.9319H64.7539ZM67.7539 54.84H75.3045V48.84H67.7539V54.84ZM78.3045 51.84V49.9319H72.3045V51.84H78.3045ZM84.7427 43.1159H82.855V49.1159H84.7427V43.1159ZM79.855 46.1159V49.9319H85.855V46.1159H79.855ZM79.855 49.9319V51.84H85.855V49.9319H79.855ZM82.855 54.84H84.7427V48.84H82.855V54.84ZM87.7427 51.84V46.1159H81.7427V51.84H87.7427ZM84.7427 27.8515H82.855V33.8515H84.7427V27.8515ZM79.855 30.8515V38.4837H85.855V30.8515H79.855ZM82.855 41.4837H84.7427V35.4837H82.855V41.4837ZM87.7427 38.4837V30.8515H81.7427V38.4837H87.7427ZM84.7427 12.5871H82.855V18.5871H84.7427V12.5871ZM79.855 15.5871V23.2193H85.855V15.5871H79.855ZM82.855 26.2193H84.7427V20.2193H82.855V26.2193ZM87.7427 23.2193V15.5871H81.7427V23.2193H87.7427ZM84.7427 -2.67725H77.1921V3.32275H84.7427V-2.67725ZM74.1921 0.322754V2.2308H80.1921V0.322754H74.1921ZM77.1921 5.2308H82.855V-0.7692H77.1921V5.2308ZM79.855 2.2308V7.95494H85.855V2.2308H79.855ZM82.855 10.9549H84.7427V4.95494H82.855V10.9549ZM87.7427 7.95494V0.322754H81.7427V7.95494H87.7427Z" fill="black" mask="url(#path-1-inside-1)"/>
<path d="M41.327 30.8516H1.68652V82.3688H52.6528V44.2079" fill="white"/>
<path d="M41.327 30.8516H1.68652V82.3688H52.6528V44.2079" stroke="black" stroke-width="3" stroke-miterlimit="10"/>
<path d="M63.035 22.4561L34.9092 51.0767" stroke="black" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M44.5361 23.6008L64.1676 21.502L61.9024 41.1548" stroke="black" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="84" height="83" fill="white" transform="translate(0.742676 0.322754)"/>
</clipPath>
</defs>
</svg>

`

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

export default UpDateCar
