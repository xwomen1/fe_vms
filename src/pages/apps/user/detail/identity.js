import { useRouter } from 'next/router'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Grid,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { CircularProgress } from '@material-ui/core'
import Icon from 'src/@core/components/icon'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import RolePopup from './popup/AddGroup'
import PolicyPopup from './popup/AddPolicy'
import Swal from 'sweetalert2'
import Tooltip from 'src/@core/theme/overrides/tooltip'
import useAxios from 'axios-hooks'
import EditIcon from '@mui/icons-material/Edit'
import { Popup } from './popup/ImageForm'
import ImageForm from './popup/ImageForm'

const UserDetails = () => {
  const router = useRouter()
  const { userId } = router.query
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupPolicy, setOpenPopupPolicy] = useState(false)
  const [timeValidity, setTimeValidity] = useState('Custom')
  const [user, setUser] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [params, setParams] = useState({})
  const [editing, setEditing] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [leaderOfUnit, setLeaderOfUnit] = useState('')
  const [status, setStatus] = useState('')
  const [status1, setStatus1] = useState('')
  const [availableAt, setAvailableAt] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [note, setNote] = useState('')

  const [timeEndMorning, setTimeEndMorning] = useState('')
  const [timeStartAfternoon, setTimeStartAfternoon] = useState('')
  const [timeEndAfternoon, setTimeEndAfternoon] = useState('')
  const [showPlusColumn, setShowPlusColumn] = useState(false)

  const [dateTime, setDateTime] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [fullNameValue, setFullNameValue] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [identityNumber, setIdentityNumber] = useState('')
  const [userCode, setUserCode] = useState('')
  const [syncCode, setSyncCode] = useState('')
  const accessCodeUser = useRef('')
  const availableAtUser = useRef(0)
  const [group, setGroup] = useState(null)
  const [policies, setPolicies] = useState(null)
  const [piId, setPiId] = useState(null)
  const [ava1, setAva1] = useState(null)
  const [ava2, setAva2] = useState(null)
  const [isFaceEnabled, setIsFaceEnabled] = useState(false)
  const [fingerIdentifyUpdatedAt, setFingerIdentifyUpdatedAt] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [isOpenUpdateImgUser, setIsOpenUpdateImgUser] = useState(false)
  const originIdentityData = useRef()
  const [identityData, setIdentityData] = useState(null)

  const [rows1, setRows1] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [faceType, setFaceType] = useState(null) // State để lưu faceType của ảnh được chọn

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const handleEditImageButtonClick = (faceType, imageUrl) => {
    setFaceType(faceType)
    setImageUrl(imageUrl)
    setIsOpenUpdateImgUser(true)
  }

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
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

  const statusText = isFaceEnabled ? 'Không hoạt động' : 'Đang hoạt động'

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
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
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

  const convertStringToTimeArray = timeString => {
    const date = new Date(timeString)
    const hour = date.getHours()
    const minute = date.getMinutes()

    return [hour, minute]
  }

  const updateAccessCodeAndAvaibleAtByIdUser = async () => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config)
    setUserCode(res.data.data.accessCode)

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
    if (user) {
      accessCodeUser.current = user.accessCode
      if (user.cards) {
        user.cards = user.cards.map((item, index) => ({
          ...item,
          key: index,
          isDisable: true
        }))
      } else {
        user.cards = []
      }
    } else {
      let user = {
        cards: []
      }
    }

    setIdentityData(user)
    originIdentityData.current = user
  }, [user])

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

      setStatus1(response.data.data.isEnableFace)
      setFingerIdentifyUpdatedAt(response.data.data.fingerIdentifyUpdatedAt)
      setUser(response.data.data)
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  const ImgCards = ({ data, imgTitle }) => {
    const emptyImages = Array.from({ length: 5 }, (_, index) => ({
      // Tạo dữ liệu mẫu cho 5 ô ảnh trống
      imageFileUrl: '/images/user.jpg',
      imageBase64: null,
      faceType: index === 0 ? 'LEFT' : index === 1 ? 'RIGHT' : index === 2 ? 'CENTER' : index === 3 ? 'ABOVE' : 'BOTTOM'
    }))
    const hasFaceImages = data && data.length > 0

    const buildUrlWithToken = url => {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      if (token) {
        return `${url}?token=${token}`
      }

      return url
    }

    // Tạo dữ liệu cho các ảnh từ API trả về hoặc dùng dữ liệu mẫu
    const imagesToShow = useMemo(() => {
      if (data.length === 0) {
        return emptyImages
      } else {
        const filledImages = data.map((item, index) => ({
          ...item,
          faceType:
            item.faceType ||
            (index === 0 ? 'LEFT' : index === 1 ? 'RIGHT' : index === 2 ? 'CENTER' : index === 3 ? 'ABOVE' : 'BOTTOM')
        }))

        // Nếu dữ liệu ít hơn 5 ảnh, thêm các ô ảnh trống vào
        while (filledImages.length < 5) {
          filledImages.push(emptyImages[filledImages.length])
        }

        return filledImages
      }
    }, [data, emptyImages])

    return (
      <div style={{ display: 'flex', gap: '34px' }}>
        {imagesToShow.map((item, index) => (
          <div
            key={index} // Đảm bảo mỗi ô ảnh có một key duy nhất
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Img
              src={
                item
                  ? item.imageFileUrl
                    ? buildUrlWithToken(item.imageFileUrl)
                    : `data:image/jpeg;base64,${item.imageBase64}`
                  : null
              }
            />
            <p style={{ margin: 0, marginTop: '5px', whiteSpace: 'nowrap' }}>
              {imgTitle} {index + 1}
            </p>
            {editing && ( // Hiển thị nút chỉ khi đang ở chế độ chỉnh sửa
              <IconButton
                size='small'
                onClick={() => {
                  setOpenPopup(true)
                  handleEditImageButtonClick(item.faceType, item.imageFileUrl)
                  setIsOpenUpdateImgUser(true)
                  setFaceType(item.faceType)
                  setImageUrl(item.imageFileUrl)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
        ))}
      </div>
    )
  }

  const processImageData = data => {
    // Nếu data trống hoặc không tồn tại, trả về mảng rỗng
    if (!data || data.length === 0) {
      return Array.from({ length: 5 }, (_, index) => ({
        imageFileUrl: '/images/user.jpg', // Đường dẫn ảnh mặc định
        imageBase64: null,
        faceType: getFaceTypeFromIndex(index)
      }))
    }

    // Nếu data có ít hơn 5 ảnh, thêm các ô ảnh trống vào để đạt được 5 ảnh
    while (data.length < 5) {
      data.push({
        imageFileUrl: '/images/user.jpg', // Đường dẫn ảnh mặc định
        imageBase64: null,
        faceType: null
      })
    }

    // Lấy giá trị faceType từ ảnh đầu tiên của API
    const firstImageFaceType = data[0].faceType

    // Tạo một mảng chứa các giá trị faceType có thể được sử dụng cho các ảnh còn lại
    const availableFaceTypes = ['LEFT', 'RIGHT', 'CENTER', 'ABOVE', 'BOTTOM'].filter(
      type => type !== firstImageFaceType
    )

    // Lặp qua mảng data và điền các giá trị faceType
    const processedData = data.map((item, index) => ({
      ...item,
      faceType: index === 0 ? firstImageFaceType : availableFaceTypes[index - 1]
    }))

    return processedData
  }

  const getFaceTypeFromIndex = index => {
    // Xác định faceType dựa trên index của ảnh
    switch (index) {
      case 0:
        return 'LEFT'
      case 1:
        return 'RIGHT'
      case 2:
        return 'CENTER'
      case 3:
        return 'ABOVE'
      default:
        return 'BOTTOM'
    }
  }

  // Sử dụng useMemo để gọi hàm processImageData mỗi khi user thay đổi

  const processedImages = useMemo(() => processImageData(identityData?.faces), [identityData?.faces])

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
          alt='Ảnh'
          onLoad={() => setLoaded(true)}
          style={loaded ? { width: '100px', height: '100px' } : { display: 'none' }}
        />
      </>
    )
  })

  const handleDeleteRow = (userId, groupId) => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?'
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
            Swal.fire('Xóa thành công', '', 'success')

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
        setUser(response.data.data)
        setStatus1(response.data.data.isEnableFace)
        setFingerIdentifyUpdatedAt(response.data.data.fingerIdentifyUpdatedAt)
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }
    if (userId) {
      fetchUserData()
    }
  }, [userId, leaderOfUnit])

  const handleCancel = () => {
    fetchUserData()

    setReadOnly(true)
    setEditing(false)
    setShowPlusColumn(!showPlusColumn)
  }
  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <div>
      {user ? (
        <div>
          <Grid container spacing={3}>
            <Grid style={{ borderRadius: '0.05%' }}>
              {/* <Grid container spacing={2}>
                <h3 style={{ color: 'black', marginLeft: '1%' }}> Thông tin người dùng</h3>
              </Grid> */}

              <Grid container spacing={2} style={{ marginLeft: 10 }}>
                <Grid container spacing={2}>
                  {' '}
                  <Grid item xs={9}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Thông tin định danh khuôn mặt</h2>
                  </Grid>
                  <Grid item xs={3} style={{ marginTop: '1.1%' }}>
                    <Switch
                      checked={status1 === true}
                      onChange={handleStatusChange}
                      color='primary'
                      label='Trạng thái'
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid container spacing={2}>
                    <div style={{ width: '80%' }}></div>
                    {editing ? (
                      <>
                        <Button variant='contained' onClick={saveChanges} sx={{ marginRight: '10px' }}>
                          Lưu
                        </Button>
                        <Button variant='contained' onClick={handleCancel}>
                          Huỷ
                        </Button>
                      </>
                    ) : (
                      <Button variant='contained' onClick={toggleEdit}>
                        Chỉnh sửa
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
                      customInput={<CustomInput label='Thời gian cập nhật' />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      label='Trạng thái'
                      value={statusText}
                      InputProps={{ readOnly: readOnly }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={12}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Hình ảnh khuôn mặt</h2>
                  </Grid>
                  <div>
                    {(identityData?.faces?.length && (
                      <>
                        <div style={{ display: 'flex' }}>
                          <ImgCards data={processedImages} imgTitle='Ảnh' />
                        </div>
                      </>
                    )) || (
                      <>
                        <h4 style={{ fontSize: '16px' }}>Hình ảnh khuôn mặt</h4>
                        <div style={{ display: 'flex' }}>
                          <ImgCards data={[]} imgTitle='Ảnh' />
                        </div>
                      </>
                    )}

                    {isOpenUpdateImgUser && (
                      <ImageForm
                        onClose={() => setIsOpenUpdateImgUser(false)}
                        open={openPopup}
                        userId={userId}
                        faceType={faceType}
                        imageUrl={imageUrl}
                        accessCode={userCode}
                      />
                    )}
                  </div>
                  <Grid item xs={12}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Thông tin định danh vân tay</h2>
                  </Grid>
                  <Grid item xs={3}>
                    <DatePicker
                      selected={new Date(user?.fingerIdentifyUpdatedAt)}
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption='Time'
                      dateFormat='hh:mm dd/MM/yyyy'
                      disabled={true}
                      customInput={<CustomInput label='Thời gian cập nhật' />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      label='Trạng thái'
                      value={statusText1}
                      InputProps={{ readOnly: readOnly }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} style={{ height: 20 }}></Grid>
                  {user.fingerprints.length === 0 && (
                    <Grid item xs={12} style={{ alignContent: 'center' }}>
                      <img
                        src='/images/finger.png'
                        alt='Fingerprint'
                        style={{ width: '15%', height: '100%', marginLeft: '20%' }}
                      />
                      <p style={{ color: 'black', marginLeft: '20%' }}> Chưa có định danh cho vân tay người này</p>
                    </Grid>
                  )}
                  <Grid item xs={4}></Grid>
                </Grid>
              </Grid>
              <br></br>
              <br></br>
              <Grid container spacing={2} style={{ marginLeft: 10 }}>
                <Grid item xs={12}>
                  <h2 style={{ color: 'black', marginLeft: '1%' }}> Danh sách thẻ</h2>
                </Grid>
                <Grid item xs={11.8}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>STT</TableCell>
                          <TableCell>Thời gian</TableCell>
                          <TableCell>Mã số thẻ</TableCell>
                          <TableCell>Trạng thái</TableCell>

                          <TableCell align='center'>
                            <IconButton size='small' sx={{ marginLeft: '10px', color: 'blue' }}>
                              Thêm thẻ <Icon icon='bi:plus' />
                            </IconButton>
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
                                renderInput={params => <TextField {...params} label='Đơn vị' />}
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
                {/* <h3 style={{ color: 'black', marginLeft: '1%' }}> Thông tin người dùng</h3> */}
              </Grid>
              <Grid container spacing={2}>
                <div style={{ width: '80%' }}></div>
                {editing ? (
                  <>
                    <Button variant='contained' onClick={saveChanges} sx={{ marginRight: '10px' }}>
                      Lưu
                    </Button>
                    <Button variant='contained' onClick={handleCancel}>
                      Huỷ
                    </Button>
                  </>
                ) : (
                  <Button variant='contained' onClick={toggleEdit}>
                    Chỉnh sửa
                  </Button>
                )}
              </Grid>

              <Grid container spacing={2} style={{ marginLeft: 10 }}>
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Thông tin định danh khuôn mặt</h2>
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
                      customInput={<CustomInput label='Thời gian cập nhật' />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      label='Trạng thái'
                      value={'Không hoạt động'}
                      InputProps={{ readOnly: readOnly }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={12}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Hình ảnh khuôn mặt</h2>
                  </Grid>

                  <Grid item xs={12}>
                    <h2 style={{ color: 'black', marginLeft: '1%' }}> Thông tin định danh vân tay</h2>
                  </Grid>
                  <Grid item xs={3}>
                    <DatePicker
                      showTimeSelect
                      timeIntervals={15}
                      timeCaption='Time'
                      dateFormat='hh:mm dd/MM/yyyy'
                      disabled={true}
                      customInput={<CustomInput label='Thời gian cập nhật' />}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomTextField
                      label='Trạng thái'
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
                    <p style={{ color: 'black', marginLeft: '20%' }}> Chưa có định danh cho vân tay người này</p>
                  </Grid>
                  <Grid item xs={4}></Grid>
                </Grid>
              </Grid>
              <br></br>
              <br></br>
              <Grid container spacing={2} style={{ marginLeft: 10 }}>
                <Grid item xs={12}>
                  <h2 style={{ color: 'black', marginLeft: '1%' }}> Danh sách thẻ</h2>
                </Grid>
                <Grid item xs={11.8}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>STT</TableCell>
                          <TableCell>Thời gian</TableCell>
                          <TableCell>Mã số thẻ</TableCell>
                          <TableCell>Trạng thái</TableCell>

                          <TableCell align='center'>
                            <IconButton size='small' sx={{ marginLeft: '10px', color: 'blue' }}>
                              Thêm thẻ <Icon icon='bi:plus' />
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
