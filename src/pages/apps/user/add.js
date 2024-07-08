import { useRouter } from 'next/router'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import {
  Grid,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material'
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
import RolePopup from './detail/popup/AddGroup'
import PolicyPopup from './detail/popup/AddPolicy'
import Swal from 'sweetalert2'
import Link from 'next/link'

const Add = () => {
  const router = useRouter()
  const [timeValidity, setTimeValidity] = useState('Custom')
  const [user, setUser] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [params, setParams] = useState({})
  const [editing, setEditing] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [policy, setPolicy] = useState([])
  const [status, setStatus] = useState('ACTIVE')
  const [status1, setStatus1] = useState('ACTIVE')
  const [availableAt, setAvailableAt] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [note, setNote] = useState('')
  const [rows, setRows] = useState([])
  const [rows1, setRows1] = useState([])
  const [createAccount, setCreateAccount] = useState(true)
  const [timeEndMorning, setTimeEndMorning] = useState(new Date())
  const [timeStartAfternoon, setTimeStartAfternoon] = useState(new Date())
  const [timeEndAfternoon, setTimeEndAfternoon] = useState(new Date())
  const [dateTime, setDateTime] = useState(new Date())
  const [fullNameValue, setFullNameValue] = useState('')
  const [account, setAccount] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [identityNumber, setIdentityNumber] = useState('')
  const [userCode, setUserCode] = useState('')
  const [syncCode, setSyncCode] = useState('')
  const [ava1, setAva1] = useState(null)
  const [ava2, setAva2] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userId, setUserId] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectContract, setSelectContract] = useState('')
  const [contractOptions, setContractOptions] = useState([])
  const [filteredRegionOptions, setFilteredRegionOptions] = useState(user?.level)
  const [filteredContractOptions, setFilteredContractOptions] = useState(user?.contractType)
  const [gender, setGender] = useState('')
  let groupACIds = []
  const [regionOptions, setRegionOptions] = useState([])

  const handleAddRow = () => {
    const newRow = { groupName: '', code: '', id: '' } // Thêm groupId vào đây
    setRows([...rows, newRow])
  }

  const handleAddRow1 = () => {
    const newRow1 = { policyName: '', description: '' }
    setRows1([...rows1, newRow1])
  }

  const handleCreateAccountChange = event => {
    setCreateAccount(event.target.checked)
  }

  const handleStartDateChange = date => {
    setAvailableAt(date)
    setAva1(isoToEpoch(date))
  }

  const handleEndDateChange = date => {
    setExpiredAt(date)
    setAva2(isoToEpoch(date))
  }
  console.log('New start date:', isoToEpoch(availableAt))
  function isoToEpoch(isoDateString) {
    var milliseconds = Date.parse(isoDateString)

    var epochSeconds = Math.round(milliseconds)

    return epochSeconds
  }

  const handleFullNameChange = event => {
    setFullNameValue(event.target.value)
  }

  const handleAccountChange = event => {
    setAccount(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
  }

  const handleStatusChange = () => {
    setStatus1(status1 === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handlePhoneNumberChange = event => {
    setPhoneNumber(event.target.value)
  }

  const handleNoteChange = event => {
    setNote(event.target.value)
  }

  const handleIdentityNumberChange = event => {
    setIdentityNumber(event.target.value)
  }

  const handleUserCodeChange = event => {
    setUserCode(event.target.value)
  }

  const handleSyncCodeChange = event => {
    setSyncCode(event.target.value)
  }
  const policyList = rows1.map(row => row.policyId)
  console.log(policyList, 'ploust')

  const handleGenderChange = event => {
    setGender(event.target.value)
  }

  const handleTimeValidityChange = event => {
    setTimeValidity(event.target.value)
  }
  useEffect(() => {
    if (timeValidity === 'Undefined') {
      setAvailableAt(null)
      setExpiredAt(null)
    }
  }, [timeValidity])

  // const userGroups = rows.map(row => ({
  //   groupId: row.id,
  //   policyName: true,
  //   isLeader: false
  // }))
  const fetchRegionName = async regionId => {
    try {
      const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${regionId}`)

      return response.data.name
    } catch (error) {
      console.error('Error fetching region name:', error)

      return ''
    }
  }

  const handleRegionChange = selectedOption => {
    setSelectedRegion(selectedOption)

    const selectedRegionId = selectedOption ? selectedOption.id : null
    const filteredRegions = regionOptions.filter(region => region.parentId === selectedRegionId)
    setFilteredRegionOptions(selectedRegionId)
    console.log(selectedOption, 'filterregion')
  }

  const handleContractChange = selectedOption => {
    setSelectContract(selectedOption)

    const selectedContractId = selectedOption ? selectedOption.id : null
    setFilteredContractOptions(selectedContractId)
  }

  const userPolicy = rows1.map(row => ({
    policyId: row.policyId
  }))

  const saveChanges = async () => {
    if (password !== confirmPassword) {
      Swal.fire('Lỗi!', 'Mật khẩu và xác nhận mật khẩu không khớp nhau.', 'error')

      return
    }
    if (!fullNameValue || fullNameValue.length <= 3) {
      Swal.fire('Lỗi!', 'Tên không được để trống và độ dài phải >3', 'error')

      return
    }
    if (!email) {
      Swal.fire('Lỗi!', 'Email không được để trống', 'error')

      return
    }
    if (!phoneNumber) {
      Swal.fire('Lỗi!', 'Số điện thoại không được để trống', 'error')

      return
    }
    if (!identityNumber) {
      Swal.fire('Lỗi!', 'Số giấy tờ không được để trống', 'error')

      return
    }
    if (!userCode) {
      Swal.fire('Lỗi!', 'Mã người dùng không được để trống', 'error')

      return
    }
    if (!syncCode) {
      Swal.fire('Lỗi!', 'Mã đồng bộ không được để trống', 'error')

      return
    }
    if (!account) {
      Swal.fire('Lỗi!', 'Tên tài khoản không được để trống', 'error')

      return
    }
    if (userGroups.length === 0) {
      Swal.fire('Lỗi!', 'Nhóm người dùng không được để trống.', 'error')

      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Swal.fire('Lỗi!', 'Địa chỉ email không hợp lệ.', 'error')

      return
    }

    if (password.length < 6) {
      Swal.fire('Lỗi!', 'Mật khẩu phải chứa ít nhất 6 ký tự.', 'error')

      return
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/
    if (!passwordRegex.test(password)) {
      Swal.fire(
        'Lỗi!',
        'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.',
        'error'
      )

      return
    }
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      const processedGroups = await userGroups(rows) // Call the userGroups function passing rows
      const genderMapping = { MALE: 'MALE', FEMALE: 'FEMALE', OTHER: 'OTHER' }

      if (processedGroups.length === 0) {
        Swal.fire('Lỗi!', 'Nhóm người dùng không được để trống.', 'error')

        return
      }
      console.log()

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        `https://dev-ivi.basesystem.one/smc/iam/api/v0/users`,
        {
          ...params,
          userId: userId,
          fullName: fullNameValue,
          email: email,
          phoneNumber: phoneNumber,
          identityNumber: identityNumber,
          userCode: userCode,
          syncCode: syncCode,
          userStatus: status1,
          timeEndAfternoon: convertStringToTimeArray(timeEndAfternoon),
          timeStartAfternoon: convertStringToTimeArray(timeStartAfternoon),
          timeStartMorning: convertStringToTimeArray(dateTime),
          timeEndMorning: convertStringToTimeArray(timeEndMorning),
          availableAt: ava1 || null,
          expiredAt: ava2 || null,
          gender: gender,
          note: note,
          policyIds: policyList,
          level: filteredRegionOptions || selectedRegion.id,
          contractType: filteredContractOptions || selectContract.id,
          userGroups: processedGroups,
          userAccount: {
            accStatus: 'ACTIVE',
            username: account,
            password: password
          }
        },
        config
      )

      if (groupACIds.length > 0) {
        await addMemberToGroup(groupACIds, response.data.userId)
      } else {
        console.error('Không có groupACId nào trong mảng')
      }

      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')

      router.push(`/apps/user/detail/${response.data.userId}`)
    } catch (error) {
      console.error('Error updating user details:', error)
      Swal.fire('Lỗi!', error?.response?.data?.message, 'error')
    }
  }

  const createNewGroup = async (groupName, groupCode) => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://dev-ivi.basesystem.one/smc/iam/api/v0/groups',
        {
          groupName: groupName,
          groupCode: groupCode,
          isPnLVGR: false
        },
        config
      )
      if (response.data && response.data.groupACId) {
        groupACIds.push(response.data.groupACId)
      } else {
        throw new Error('Không lấy được groupACId từ API')
      }

      return response.data.groupId
    } catch (error) {
      throw error
    }
  }

  const addMemberToGroup = async (groupId, userId) => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-access`,
        { userGroupIds: groupId, userId: userId },
        config
      )

      return response.data
    } catch (error) {
      console.error('Error adding member to group:', error)
      throw error
    }
  }

  const userGroups = async rows => {
    try {
      const processedGroups = []
      for (const row of rows) {
        const groupId = await createNewGroup(row.name, row.code)

        const userGroup = {
          groupId: groupId,
          policyName: true,
          isLeader: false
        }
        processedGroups.push(userGroup)
        console.log(userGroup)
      }

      return processedGroups
    } catch (error) {
      throw error
    }
  }

  const convertStringToTimeArray = timeString => {
    const date = new Date(timeString)
    const hour = date.getHours()
    const minute = date.getMinutes()

    return [hour, minute]
  }

  const handleDeleteRow = index => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          'https://sbs.basesystem.one/ivis/infrares/api/v0/regions/parentsID?parentID=953a140f-76e4-4841-9871-b9f30b3a37a7'
        )

        const regions = response.data.map(region => ({
          value: region.name,
          label: region.name,
          id: region.id
        }))
        setRegionOptions(regions)

        console.log(regions)
      } catch (error) {
        console.error('Error fetching regions:', error)
      }
    }

    fetchRegions()
  }, [])
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          'https://sbs.basesystem.one/ivis/infrares/api/v0/regions/parentsID?parentID=17a24f4a-4402-4a3f-b341-2afa8e67fba6'
        )

        const regions = response.data.map(region => ({
          value: region.name,
          label: region.name,
          id: region.id
        }))
        setContractOptions(regions)

        console.log(regions)
      } catch (error) {
        console.error('Error fetching regions:', error)
      }
    }

    fetchRegions()
  }, [])

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
          'https://sbs.basesystem.one/ivis/infrares/api/v0/regions/parentsID?parentID=f963e9d4-3d6b-45df-884d-15f93452f2a2',
          config
        )

        setGroupOptions(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])
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
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/policies/search', config)

        setPolicy(response.data.rows)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])
  const formatIsLeader = isLeader => <Checkbox checked={isLeader} disabled />

  const handleTimeChange = newValue => {
    setDateTime(newValue)
  }

  const handleTimeEndMorningChange = newValue => {
    setTimeEndMorning(newValue)
  }

  const handleTimeStartAfetrnoonChange = newValue => {
    setTimeStartAfternoon(newValue)
  }

  const handleTimeEndAfternoonChange = newValue => {
    setTimeEndAfternoon(newValue)
  }

  console.log('param', params)

  return (
    <div>
      <Grid container spacing={3} component={Paper}>
        <Grid style={{ borderRadius: '0.05%' }}>
          <Grid container spacing={2} item xs={5}>
            <IconButton size='small' component={Link} href={`/apps/user/list`} sx={{ color: 'text.secondary' }}>
              <Icon icon='tabler:chevron-left' />
            </IconButton>

            <h2 style={{ color: 'black' }}>Thêm mới người dùng: </h2>
          </Grid>
          <Grid container spacing={2}>
            <div style={{ width: '80%' }}></div>
            <>
              <Button variant='contained' component={Link} href={`/apps/user/list`}>
                Huỷ
              </Button>
              <Button variant='contained' onClick={saveChanges} sx={{ marginLeft: '10px' }}>
                Lưu
              </Button>
            </>
          </Grid>
          <Grid item xs={12} style={{ height: 10 }}>
            {' '}
          </Grid>
          <Grid container spacing={2} style={{ marginLeft: 10 }}>
            <Grid item xs={4}>
              <TextField label='Tên' onChange={handleFullNameChange} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <TextField label='Email' onChange={handleEmailChange} fullWidth />
            </Grid>
            <Grid item xs={3.8}>
              <TextField label='Số điện thoại' onChange={handlePhoneNumberChange} fullWidth />
            </Grid>
            <Grid item xs={4}>
              {/* Update Select to use the gender state */}
              <FormControl fullWidth>
                <InputLabel id='gender-label'>Giới tính</InputLabel>
                <Select
                  labelId='gender-label'
                  id='gender-select'
                  value={gender} // Use the gender state
                  onChange={handleGenderChange} // Update onChange handler
                >
                  {/* MenuItems for gender options */}
                  <MenuItem value='MALE'>Nam</MenuItem>
                  <MenuItem value='FEMALE'>Nữ</MenuItem>
                  <MenuItem value='OTHER'>Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField label='Số giấy tờ' onChange={handleIdentityNumberChange} fullWidth />
            </Grid>

            <Grid item xs={2} style={{ marginTop: '1.1%' }}>
              Trạng thái
              <Switch checked={status1 === 'ACTIVE'} onChange={handleStatusChange} color='primary' label='Trạng thái' />
            </Grid>

            <Grid item xs={11.8}>
              <TextField rows={4} multiline label='Ghi chú' onChange={handleNoteChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5'>Đơn vị</Typography>
            </Grid>
            <Grid item xs={11.8}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Đơn vị</TableCell>
                      <TableCell>Mã đơn vị</TableCell>
                      <TableCell align='right'>Là lãnh đạo đơn vị</TableCell>
                      <TableCell align='center'>
                        <IconButton size='small' onClick={handleAddRow} sx={{ marginLeft: '10px' }}>
                          <Icon icon='bi:plus' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Autocomplete
                            options={groupOptions}
                            getOptionLabel={option => option.name}
                            value={row.name}
                            onChange={(event, newValue) => {
                              const updatedRows = [...rows]
                              updatedRows[index].name = newValue.name
                              updatedRows[index].code = newValue.code

                              // updatedRows[index].id = newValue.id
                              setRows(updatedRows)
                            }}
                            renderInput={params => <TextField {...params} label='Đơn vị' />}
                          />
                        </TableCell>
                        {console.log(rows)}
                        <TableCell>{row.code}</TableCell>
                        <TableCell align='right'>{formatIsLeader(row.isLeader)}</TableCell>
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

          <Grid container spacing={2} style={{ marginLeft: 10 }}></Grid>
          <br></br>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={createAccount} onChange={handleCreateAccountChange} color='primary' />}
              label='Tạo tài khoản đăng nhập'
              labelPlacement='start'
            />
          </Grid>
          {createAccount && (
            <Grid container spacing={2} style={{ marginLeft: 10 }}>
              <Grid item xs={12}>
                <Typography variant='h5'>Thông tin tài khoản</Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField label='Tài khoản' onChange={handleAccountChange} fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label='Mật khẩu' type='password' onChange={handlePasswordChange} fullWidth />
              </Grid>
              <Grid item xs={3.8}>
                <TextField label='Xác nhận mật khẩu' type='password' onChange={handleConfirmPasswordChange} fullWidth />
              </Grid>
              <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={status === 'ACTIVE'}
                      onChange={e => {
                        setStatus(status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                      }}
                      color='primary'
                    />
                  }
                  label='Trạng thái'
                  labelPlacement='start'
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5'>Vai trò</Typography>
              </Grid>
              <Grid item xs={11.8}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên vai trò</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell align='center'>
                          <IconButton onClick={handleAddRow1} size='small' sx={{ marginLeft: '10px' }}>
                            <Icon icon='bi:plus' />
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
                                setRows1(updatedRows)
                              }}
                              renderInput={params => <TextField {...params} label='Vai trò' />}
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
          )}
        </Grid>
      </Grid>
      <br></br>
    </div>
  )
}

export default Add
