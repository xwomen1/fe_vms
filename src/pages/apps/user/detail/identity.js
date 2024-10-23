import { useRouter } from 'next/router'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, IconButton, Button, Switch, TextField } from '@mui/material'
import { CircularProgress } from '@material-ui/core'
import Icon from 'src/@core/components/icon'
import Autocomplete from '@mui/material/Autocomplete'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import Swal from 'sweetalert2'
import EditIcon from '@mui/icons-material/Edit'
import ImageForm from './popup/ImageForm'
import ImagePopup from './popup/ImagePopup'

const UserDetails = () => {
  const router = useRouter()
  const { userId } = router.query
  const [openPopup, setOpenPopup] = useState(false)
  const [user, setUser] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [editing, setEditing] = useState(false)
  const [status1, setStatus1] = useState('')
  const [showPlusColumn, setShowPlusColumn] = useState(false)
  const [userCode, setUserCode] = useState('')
  const accessCodeUser = useRef('')
  const availableAtUser = useRef(0)
  const [face, setFaces] = useState([])
  const [isFaceEnabled, setIsFaceEnabled] = useState(false)
  const [fingerIdentifyUpdatedAt, setFingerIdentifyUpdatedAt] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [isOpenUpdateImgUser, setIsOpenUpdateImgUser] = useState(false)
  const [rows1, setRows1] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [faceType, setFaceType] = useState(null) // State để Save faceType của Image được chọn
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleEditImageButtonClick = (faceType, imageUrl) => {
    setFaceType(faceType)
    setImageUrl(imageUrl)
    setIsOpenUpdateImgUser(true)
  }

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Accept',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Yes',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleStatusChange = () => {
    setStatus1(status1 === true ? false : true)
    setIsFaceEnabled(!isFaceEnabled)
  }

  const statusText = status1 ? 'Đang hoạt động' : 'Không hoạt động'

  const statusText1 = !fingerIdentifyUpdatedAt ? 'Đã định danh' : 'Chưa định danh'

  const toggleEdit = () => {
    setReadOnly(false)
    setEditing(true)
    setShowPlusColumn(!showPlusColumn)
  }

  const saveChanges = async () => {
    setReadOnly(true)
    setEditing(false)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      await axios.post(
        `
        https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access/${userId}/authen-settings
        `,
        {
          enableFaceAuthen: status1,
          enableCardAuthen: false,
          enableFingerprintAuthen: false,
          listUpdateAssignCards: [],
          listUpdateReturnCardIds: []
        },
        config
      )
      Swal.fire('Success!', 'Data has been updated successfully', 'success')
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('error!', 'An error occurred while updating data', 'error')
    }
  }

  const convertTimeArrayToString = timeArray => {
    if (Array.isArray(timeArray) && timeArray.length >= 2) {
      const [hour, minute] = timeArray

      const formattedMinute = minute < 10 ? `0${minute}` : minute

      return `${hour}:${formattedMinute}`
    } else {
      console.error('Invalid timeArray:', timeArray)

      return null
    }
  }

  const updateAccessCodeAndAvaibleAtByIdUser = async () => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config)
    setUserCode(res.data.accessCode)

    if (res && res.data) {
      accessCodeUser.current = res.data.accessCode
      availableAtUser.current = res.data.availableAt
    }
  }
  useEffect(() => {
    if (userId) {
      updateAccessCodeAndAvaibleAtByIdUser()
    }
  }, [userId])
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
          `https://dev-ivi.basesystem.one/smc/iam/api/v0/cards/user-card/${userId}`,
          config
        )

        // setPolicyOption(response.data.rows)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access/${userId}/authentications`,
        config
      )
      setStatus1(response.data.isEnableFace)
      setFingerIdentifyUpdatedAt(response.data.fingerIdentifyUpdatedAt)
      setUser(response.data)
      console.log(response.data, 'face')
      console.log(response.data.faces, 'face')
      const faces = response.data.faces

      const order = ['LEFT', 'RIGHT', 'CENTER', 'ABOVE', 'BOTTOM']

      faces.sort((a, b) => {
        return order.indexOf(a.faceType) - order.indexOf(b.faceType)
      })

      setFaces(faces)
      if (response.data) {
        accessCodeUser.current = response.data.accessCode
        if (response.data.cards) {
          response.data.cards = response.data.cards.map((item, index) => ({
            ...item,
            key: index,
            isDisable: true
          }))
        } else {
          response.data.cards = []
        }
      } else {
        let user = {
          cards: []
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  const ImgCards = ({ data, imgTitle }) => {
    const emptyImages = [
      { faceType: 'LEFT', imageFileUrl: '/images/user.jpg', imageBase64: null },
      { faceType: 'RIGHT', imageFileUrl: '/images/user.jpg', imageBase64: null },
      { faceType: 'CENTER', imageFileUrl: '/images/user.jpg', imageBase64: null },
      { faceType: 'ABOVE', imageFileUrl: '/images/user.jpg', imageBase64: null },
      { faceType: 'BOTTOM', imageFileUrl: '/images/user.jpg', imageBase64: null }
    ]

    const buildUrlWithToken = url => {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      return `${url}?token=${token}`
    }

    const imageData = data.length === 0 ? emptyImages : data

    const openImagePopup = imageUrl => {
      setSelectedImage(imageUrl)
      setIsPopupOpen(true)
    }

    const closeImagePopup = () => {
      setIsPopupOpen(false)
      setSelectedImage(null)
    }

    return (
      <>
        <div style={{ display: 'flex', gap: '34px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Img
              src={imageData[0].imageFileUrl ? buildUrlWithToken(imageData[0].imageFileUrl) : null}

              /* Thêm sự kiện bấm vào ảnh mở popup fullscreen imageData[0] */
              onClick={() =>
                openImagePopup(
                  imageData[0].imageFileUrl ? buildUrlWithToken(imageData[0].imageFileUrl) : '/images/user.jpg'
                )
              }
            />
            <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>{imgTitle} 1</p>
            {editing && (
              <IconButton
                size='small'
                onClick={() => {
                  setOpenPopup(true)
                  handleEditImageButtonClick(imageData[0].faceType, imageData[0].imageFileUrl)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Img
              src={imageData[1].imageFileUrl ? buildUrlWithToken(imageData[1].imageFileUrl) : null}

              /* Thêm sự kiện bấm vào ảnh mở popup fullscreen imageData[1] */
              onClick={() =>
                openImagePopup(
                  imageData[1].imageFileUrl ? buildUrlWithToken(imageData[1].imageFileUrl) : '/images/user.jpg'
                )
              }
            />
            <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>{imgTitle} 2</p>
           {editing && (
              <IconButton
                size='small'
                onClick={() => {
                  setOpenPopup(true)
                  handleEditImageButtonClick(imageData[1].faceType, imageData[1].imageFileUrl)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Img
              src={imageData[2].imageFileUrl ? buildUrlWithToken(imageData[2].imageFileUrl) : null}

              /* Thêm sự kiện bấm vào ảnh mở popup fullscreen imageData[2] */
              onClick={() =>
                openImagePopup(
                  imageData[2].imageFileUrl ? buildUrlWithToken(imageData[2].imageFileUrl) : '/images/user.jpg'
                )
              }
            />
            <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>{imgTitle} 3</p>
            {editing && (
              <IconButton
                size='small'
                onClick={() => {
                  setOpenPopup(true)
                  handleEditImageButtonClick(imageData[2].faceType, imageData[2].imageFileUrl)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Img
              src={imageData[3].imageFileUrl ? buildUrlWithToken(imageData[3].imageFileUrl) : null}

              /* Thêm sự kiện bấm vào ảnh mở popup fullscreen imageData[3] */
              onClick={() =>
                openImagePopup(
                  imageData[3].imageFileUrl ? buildUrlWithToken(imageData[3].imageFileUrl) : '/images/user.jpg'
                )
              }
            />
            <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>{imgTitle} 4</p>
            {editing && (
              <IconButton
                size='small'
                onClick={() => {
                  setOpenPopup(true)
                  handleEditImageButtonClick(imageData[3].faceType, imageData[3].imageFileUrl)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Img
              src={imageData[4].imageFileUrl ? buildUrlWithToken(imageData[4].imageFileUrl) : null}

              /* Thêm sự kiện bấm vào ảnh mở popup fullscreen imageData[4] */
              onClick={() =>
                openImagePopup(
                  imageData[4].imageFileUrl ? buildUrlWithToken(imageData[4].imageFileUrl) : '/images/user.jpg'
                )
              }
            />
            <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>{imgTitle} 5</p>
            {editing && (
              <IconButton
                size='small'
                onClick={() => {
                  setOpenPopup(true)
                  handleEditImageButtonClick(imageData[4].faceType, imageData[4].imageFileUrl)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
        </div>
        <ImagePopup isOpen={isPopupOpen} imageSrc={selectedImage} onClose={closeImagePopup} />
      </>
    )
  }

  const processImageData = data => {

    // Nếu data trống hoặc không tồn tại, trả về mảng chứa các giá trị faceType mặc định
    const defaultImage = {
      imageFileUrl: '/images/user.jpg', // Đường dẫn Image mặc định
      imageBase64: null
    }

    if (!data || data.length === 0) {
      return Array.from({ length: 5 }, (_, index) => ({
        ...defaultImage,
        faceType: getFaceTypeFromIndex(index)
      }))
    }

    // Tạo một bản sao của data để tránh thay đổi trực tiếp
    const clonedData = [...data]

    // Nếu data có ít hơn 5 Image, thêm các ô Image trống vào để đạt được 5 Image
    while (clonedData.length < 5) {
      clonedData.push({
        ...defaultImage,
        faceType: null
      })
    }

    // Tạo mảng kết quả cho 5 ô hình ảnh
    const result = Array.from({ length: 5 }, (_, index) => ({
      ...defaultImage,
      faceType: getFaceTypeFromIndex(index)
    }))

    // Gán faceType cho từng ảnh dựa trên giá trị faceType của item
    clonedData.forEach(item => {
      const index = getFaceIndex(item.faceType) // Lấy index dựa trên faceType
      if (index !== -1) {
        result[index] = {
          ...item,
          faceType: item.faceType // Giữ nguyên faceType từ item
        }
      }
    })

    return result
  }

  // Helper function to get face type based on index
  const getFaceTypeFromIndex = index => {
    const faceTypes = ['LEFT', 'RIGHT', 'CENTER', 'ABOVE', 'BOTTOM']
    
    return faceTypes[index] || 'BOTTOM'
  }

  // Helper function to get the index based on faceType
  const getFaceIndex = faceType => {
    const faceTypes = ['LEFT', 'RIGHT', 'CENTER', 'ABOVE', 'BOTTOM']

    return faceTypes.indexOf(faceType)
  }

  // Sử dụng useMemo để gọi hàm processImageData mỗi khi user thay đổi

  const processedImages = processImageData(face)
  console.log(processedImages, 'processedImages')

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
                  width: '100px',
                  height: '100px',
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
          alt='Image'
          onLoad={() => setLoaded(true)}
          style={loaded ? { width: '100px', height: '100px' } : { display: 'none' }}
        />
      </>
    )
  })

  const handleDeleteRow = (userId, groupId) => {
    showAlertConfirm({
      text: 'Do you agree to delete it?'
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

        let urlDelete = `https://dev-ivi.basesystem.one/smc/iam/api/v0/user-groups/${userId}/remove?groupId=${groupId}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Deleted successfully', '', 'success')

            // Tùy chỉnh việc cập nhật dữ liệu sau khi xóa
            fetchUserData()
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.message, 'error')
          })
      }
    })
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access/${userId}/authentications`,
          config
        )
        setStatus1(response.data.isEnableFace)
        setFingerIdentifyUpdatedAt(response.data.fingerIdentifyUpdatedAt)
        setUser(response.data)
        const faces = response.data.faces

        const order = ['LEFT', 'RIGHT', 'CENTER', 'ABOVE', 'BOTTOM']

        faces.sort((a, b) => {
          return order.indexOf(a.faceType) - order.indexOf(b.faceType)
        })

        setFaces(faces)
        if (response.data) {
          accessCodeUser.current = response.data.accessCode
          if (response.data.cards) {
            response.data.cards = response.data.cards.map((item, index) => ({
              ...item,
              key: index,
              isDisable: true
            }))
          } else {
            response.data.cards = []
          }
        } else {
          let user = {
            cards: []
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }
    if (userId) {
      fetchUserData()
    }
  }, [])

  const handleCancel = () => {
    fetchUserData()

    setReadOnly(true)
    setEditing(false)
    setShowPlusColumn(!showPlusColumn)
  }

  const handleClose = () => {
    setIsOpenUpdateImgUser(false)
    fetchUserData()
  }

  return (
    <div>
      {user ? (
        <div>
          <Grid container spacing={3} component={Paper}>
            <Grid style={{ borderRadius: '0.05%' }}>
              {/* <Grid container spacing={2}>
                <h3 style={{ color: 'black', marginLeft: '1%' }}> Information</h3>
              </Grid> */}

              <Grid container spacing={2} style={{ color: 'black', marginLeft: '1%' }}>
                <Grid container spacing={2}>
                  {' '}
                  <Grid item xs={3}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Face Identify</h2>
                  </Grid>
                  <Grid container spacing={2}>
                    <div style={{ width: '80%' }}></div>
                    {editing ? (
                      <>
                        <Button variant='contained' onClick={handleCancel} sx={{ marginRight: '1%' }}>
                          Cancel
                        </Button>
                        <Button variant='contained' onClick={saveChanges}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button variant='contained' onClick={toggleEdit}>
                        Edit
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={3}>
                    <DatePicker
                      selected={new Date(user?.faceIdentifyUpdatedAt)}
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption='Time'
                      dateFormat='hh:mm dd/MM/yyyy'
                      disabled={true}
                      customInput={<CustomInput label='Date Update' />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField label='Status' value={statusText} InputProps={{ readOnly: readOnly }} fullWidth />
                  </Grid>
                  <Grid item xs={4} style={{ marginTop: '1.1%' }}>
                    <Switch
                      checked={status1 === true}
                      onChange={handleStatusChange}
                      color='primary'
                      label='Status'
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={12}>
                    <h2 style={{ color: 'black', marginLeft: '15%' }}> Image</h2>
                  </Grid>
                  <div>
                    {(face?.length && (
                      <>
                        <div style={{ display: 'flex' }}>
                          <ImgCards data={processedImages} imgTitle='Image' />
                        </div>
                      </>
                    )) || (
                      <>
                        <h4 style={{ fontSize: '16px' }}>Image</h4>
                        <div style={{ display: 'flex' }}>
                          <ImgCards data={[]} imgTitle='Image' />
                        </div>
                      </>
                    )}

                    {isOpenUpdateImgUser && (
                      <ImageForm
                        onClose={() => handleClose()}
                        open={openPopup}
                        userId={userId}
                        faceType={faceType}
                        imageUrl={imageUrl}
                        accessCode={userCode}
                        fetchUserData={fetchUserData}
                      />
                    )}
                  </div>
                  <Grid item xs={12}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Identify fingerprint</h2>
                  </Grid>
                  <Grid item xs={3}>
                    <DatePicker
                      selected={new Date(user?.fingerIdentifyUpdatedAt)}
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption='Time'
                      dateFormat='hh:mm dd/MM/yyyy'
                      disabled={true}
                      customInput={<CustomInput label='Date Update' />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField label='Status' value={statusText1} InputProps={{ readOnly: readOnly }} fullWidth />
                  </Grid>
                  <Grid item xs={12} style={{ height: 20 }}></Grid>
                  {user.fingerprints.length === 0 && (
                    <Grid item xs={12} style={{ alignContent: 'center' }}>
                      <img
                        src='/images/finger.png'
                        alt='Fingerprint'
                        style={{ width: '15%', height: '100%', marginLeft: '20%' }}
                      />
                      <p style={{ color: 'black', marginLeft: '20%' }}> Fingerprint is not available</p>
                    </Grid>
                  )}
                  <Grid item xs={4}></Grid>
                </Grid>
              </Grid>
              <br></br>
              <br></br>
              <Grid container spacing={2} style={{ marginLeft: 10 }}>
                <Grid item xs={12}>
                  <h2 style={{ color: 'black', marginLeft: '1%' }}> Cards</h2>
                </Grid>
                <Grid item xs={11.8}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>NO.</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell>Status</TableCell>

                          <TableCell align='center'>
                            <Button variant='contained' size='small'>
                              Add <Icon icon='bi:plus' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows1.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Autocomplete
                                options={policy}
                                getOptionLabel={option => option.policyName}
                                value={row.name}
                                onChange={(event, newValue) => {
                                  const updatedRows = [...rows1]
                                  updatedRows[index].policyName = newValue.policyName
                                  updatedRows[index].description = newValue.description
                                  updatedRows[index].policyId = newValue.policyId
                                  setRows(updatedRows)
                                }}
                                renderInput={params => <TextField {...params} label='Group' />}
                              />
                            </TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell align='center'>
                              {index > 0 && (
                                <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                                  <Icon icon='bi:trash' />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <br></br>
        </div>
      ) : (
        <p>
          <Grid container spacing={3}>
            <Grid style={{ borderRadius: '0.05%' }}>
              <Grid container spacing={2}>
                {/* <h3 style={{ color: 'black', marginLeft: '1%' }}> Information</h3> */}
              </Grid>
              <Grid container spacing={2}>
                <div style={{ width: '80%' }}></div>
                {editing ? (
                  <>
                    <Button variant='contained' onClick={saveChanges} sx={{ marginRight: '10px' }}>
                      Save
                    </Button>
                    <Button variant='contained' onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant='contained' onClick={toggleEdit}>
                    Edit
                  </Button>
                )}
              </Grid>

              <Grid container spacing={2} style={{ marginLeft: 10 }}>
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Face Identify</h2>
                  </Grid>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={3}>
                    <DatePicker
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption='Time'
                      dateFormat='hh:mm dd/MM/yyyy'
                      disabled={true}
                      customInput={<CustomInput label='Date Update' />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      label='Status'
                      value={'Không hoạt động'}
                      InputProps={{ readOnly: readOnly }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={12}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Image</h2>
                  </Grid>
                  <Grid item xs={12} style={{ alignContent: 'center' }}>
                    <img
                      src='/images/image.png'
                      alt='Fingerprint'
                      style={{ width: '15%', height: '100%', marginLeft: '20%' }}
                    />
                    <p style={{ color: 'black', marginLeft: '20%' }}> Người dùng chưa được định danh khuôn mặt</p>
                  </Grid>

                  <Grid item xs={12}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Identify fingerprint</h2>
                  </Grid>
                  <Grid item xs={3}>
                    <DatePicker
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption='Time'
                      dateFormat='hh:mm dd/MM/yyyy'
                      disabled={true}
                      customInput={<CustomInput label='Date Update' />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      label='Status'
                      value={'Chưa định danh'}
                      InputProps={{ readOnly: readOnly }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} style={{ height: 20 }}></Grid>
                  <Grid item xs={12} style={{ alignContent: 'center' }}>
                    <img
                      src='/images/finger.png'
                      alt='Fingerprint'
                      style={{ width: '15%', height: '100%', marginLeft: '20%' }}
                    />
                    <p style={{ color: 'black', marginLeft: '20%' }}> Fingerprint is not available</p>
                  </Grid>
                  <Grid item xs={4}></Grid>
                </Grid>
              </Grid>
              <br></br>
              <br></br>
              <Grid container spacing={2} style={{ marginLeft: 10 }}>
                <Grid item xs={12}>
                  <h2 style={{ color: 'black', marginLeft: '1%' }}> Cards</h2>
                </Grid>
                <Grid item xs={11.8}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>NO.</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell>Status</TableCell>

                          <TableCell align='center'>
                            <IconButton size='small' sx={{ marginLeft: '10px', color: 'blue' }}>
                              Add <Icon icon='bi:plus' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </p>
      )}
    </div>
  )
}

export default UserDetails
