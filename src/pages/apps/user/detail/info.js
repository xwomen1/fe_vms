import { useRouter } from 'next/router'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'

// import TextField from 'src/@core/components/mui/text-field'
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
  Autocomplete,
  Paper,
  TextField
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import Box from '@mui/material/Box'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import Swal from 'sweetalert2'

const UserDetails = () => {
  const router = useRouter()
  const { userId } = router.query
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupPolicy, setOpenPopupPolicy] = useState(false)
  const [timeValidity, setTimeValidity] = useState('Custom')
  const [user, setUser] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [readOnlys, setReadOnlys] = useState(true)
  const [rows, setRows] = useState([])

  const [params, setParams] = useState({})
  const [editing, setEditing] = useState(false)
  const [groupOptions, setGroupOptions] = useState([])
  const [policyOption, setPolicyOption] = useState([])

  const [defaultGroup, setDefaultGroup] = useState(null)
  const [leaderOfUnit, setLeaderOfUnit] = useState('')
  const [status, setStatus] = useState('')
  const [status1, setStatus1] = useState('')
  const [availableAt, setAvailableAt] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [note, setNote] = useState('')
  const [username, setUserName] = useState('')
  const [level, setLevel] = useState('') // Add isLoading state
  const [contractName, setContractName] = useState('') // Add isLoading state

  const [filteredRegionOptions, setFilteredRegionOptions] = useState(user?.level)
  const [filteredContractOptions, setFilteredContractOptions] = useState(user?.contractType)

  const [timeEndMorning, setTimeEndMorning] = useState(new Date())
  const [timeStartAfternoon, setTimeStartAfternoon] = useState(new Date())
  const [timeEndAfternoon, setTimeEndAfternoon] = useState(new Date())
  const [showPlusColumn, setShowPlusColumn] = useState(true)

  const [dateTime, setDateTime] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const [fullNameValue, setFullNameValue] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [identityNumber, setIdentityNumber] = useState('')
  const [gender, setGender] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectContract, setSelectContract] = useState('')
  const [contractOptions, setContractOptions] = useState([])

  const [regionOptions, setRegionOptions] = useState([])
  const [regionName, setRegionName] = useState([])

  const [userCode, setUserCode] = useState('')
  const [syncCode, setSyncCode] = useState('')

  const [groups, setGroup] = useState([])
  const [policies, setPolicies] = useState([])
  const [piId, setPiId] = useState(null)
  const [ava1, setAva1] = useState(null)
  const [ava2, setAva2] = useState(null)
  const [data, setData] = useState(null)
  let groupACIds = []
  const [isLeader, setIsLeader] = useState(false)

  const handleAddRoleClickPolicy = () => {
    setOpenPopupPolicy(true)
  }

  const handleAddRow1 = () => {
    const newRow = { policyName: '', description: '', policyId: '', policyCode: '' } // Thêm groupId vào đây
    setPolicies([...policies, newRow])
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
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          'https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=level'
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
          'https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=contracttype'
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

  const fetchRegionName = async regionId => {
    try {
      const response = await axios.get(`https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/${regionId}`)

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
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Cancle',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      },
      confirmButtonColor: '#002060'
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleFullNameChange = event => {
    setFullNameValue(event.target.value)
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

  const handleUserNameChange = event => {
    setUserName(event.target.value)
  }

  const handleIdentityNumberChange = event => {
    setIdentityNumber(event.target.value)
  }

  const handleGenderChange = event => {
    setGender(event.target.value)
  }

  const handleUserCodeChange = event => {
    setUserCode(event.target.value)
  }

  const handleSyncCodeChange = event => {
    setSyncCode(event.target.value)
  }

  const handleClosePopupPolicy = () => {
    setOpenPopupPolicy(false) // Đóng Popup khi cần thiết
  }

  const handleAddRoleClick = () => {
    setOpenPopup(true)
  }

  const handleAddRow = () => {
    const newRow = { groupName: '', groupCode: '', id: '', parentId: '' } // Thêm groupId vào đây
    setGroup([...groups, newRow])
  }

  const handleClosePopup = () => {
    setOpenPopup(false) // Đóng Popup khi cần thiết
  }

  const handleTimeValidityChange = event => {
    setTimeValidity(event.target.value)
  }

  const handleRoleSelect = selectedRole => {
    console.log('Selected Role:', selectedRole)
    fetchUserData()
  }

  const handleRoleSelectPolicy = selectedRole => {
    console.log('Selected Role:', selectedRole)
    fetchUserData()
  }

  const toggleEdit = () => {
    setReadOnly(false)
    setEditing(true)
    setShowPlusColumn(!showPlusColumn)
  }

  const handleGroupChange = (event, newValue) => {
    setDefaultGroup(newValue)
    console.log(newValue)
  }
  console.log(groups)

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

  const saveChanges = async regionId => {
    setReadOnly(true)
    setEditing(false)
    const genderMapping = { MALE: 'MALE', FEMALE: 'FEMALE', OTHER: 'OTHER' }
    const genderValue = genderMapping[gender]
    if (!fullNameValue || fullNameValue.length <= 3) {
      Swal.fire({
        title: 'error!',
        text: 'error!, Name cannot be blank and length must be >3',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (!gender) {
      Swal.fire({
        title: 'error!',
        text: 'error! Gender cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (!email) {
      Swal.fire({
        title: 'error!',
        text: 'error! Email cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (!phoneNumber) {
      Swal.fire({
        title: 'error!',
        text: 'error! Phone Number  cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }

    if (userGroups.length === 0) {
      Swal.fire({
        title: 'error!',
        text: 'error! Department cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (!userCode) {
      Swal.fire({
        title: 'error!',
        text: 'error! userCode  cannot be blank',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'error!',
        text: 'error! Invalid email address',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }

    const phoneRegex = /^\d+$/
    if (!phoneRegex.test(phoneNumber)) {
      Swal.fire({
        title: 'error!',
        text: 'error! Phone Number invalid',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    if (!phoneNumber || phoneNumber.length <= 9) {
      Swal.fire({
        title: 'error!',
        text: 'error! Phone Number invalid',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      return
    }
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      const processedGroups = await userGroups(groups) // Call the userGroups function passing rows
      if (processedGroups.length === 0) {
        Swal.fire({
          title: 'error!',
          text: 'error! Department User cannot leave blank.',
          willOpen: () => {
            const confirmButton = Swal.getConfirmButton()
            if (confirmButton) {
              confirmButton.style.backgroundColor = '#002060'
              confirmButton.style.color = 'white'
            }
          }
        })

        return
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      if (selectedRegion) {
        console.log('Selected region:', selectedRegion)

        // Perform any further actions here, such as fetching data based on selected region ID
      }

      const response = await axios.put(
        `https://dev-ivi.basesystem.one/smc/iam/api/v0/users`,
        {
          ...params,
          userId: userId,
          fullName: fullNameValue,
          email: email,
          phoneNumber: phoneNumber,
          identityNumber: identityNumber,
          userCode: userCode,
          userStatus: status1,
          userGroups: processedGroups,
          policyIds: policyList,
          gender: gender, // Gửi giá trị gender đã được cập nhật
          timeEndAfternoon: convertStringToTimeArray(timeEndAfternoon),
          timeStartAfternoon: convertStringToTimeArray(timeStartAfternoon),
          timeStartMorning: convertStringToTimeArray(dateTime),
          timeEndMorning: convertStringToTimeArray(timeEndMorning),
          availableAt: ava1 || availableAt,
          expiredAt: ava2 || expiredAt,
          level: filteredRegionOptions || selectedRegion.id,
          contractType: filteredContractOptions || selectContract.id,
          note: note
        },
        config
      )
      if (groupACIds.length > 0) {
        await addMemberToGroup(groupACIds, userId)
      } else {
        console.error('There is no groupACId in the array')
      }

      Swal.fire({
        title: 'Successful!',
        text: 'Data has been updated successfully',
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
      console.error('Error updating user details:', error)
      Swal.fire('error!', error?.response?.data?.message, 'error')
    }
    fetchUserData()
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
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config)

        // setGroupOptions(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])
  const formatIsLeader = isLeader => <Checkbox checked={isLeader} />

  const policyList = policies.map(row => row.policyId)

  const fetchUserData = async userId => {
    if (userId != null) {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config)
        const userData = response.data
        setData(userData)
        if (userData.userGroups && userData.userGroups.length > 0) {
          const userGroupsData = userData.userGroups.map(group => ({
            ...group,
            isLeader: group.isLeader || false // Đảm bảo có giá trị mặc định
          }))
          setGroup(userGroupsData)
        }

        setPolicies(response.data.policies)
        setPiId(response.data.piId)
        setFullNameValue(response.data.fullName)
        setEmail(response.data.email)
        setPhoneNumber(response.data.phoneNumber)
        setIdentityNumber(response.data.identityNumber)
        setGender(response.data.gender)

        setUserCode(response.data.userCode)
        setSyncCode(response.data.syncCode)
        setStatus1(response.data.userStatus)
        setAvailableAt(response.data.availableAt)
        setExpiredAt(response.data.expiredAt)
        setUser(response.data)
        setNote(response.data.note)
        setStatus(response.data.userAccount.accStatus)
        setLevel(response.data.level)
        setContractName(response.data.contractType)
        if (level) {
          const regionName = await fetchRegionName(response?.data?.level)
          setSelectedRegion({ id: response.data.level, name: regionName })
          console.log(regionName, 'regionsname')
        }

        if (contractName) {
          const contractName = await fetchRegionName(response?.data?.contractType)
          setSelectContract({ id: response.data.contractType, name: contractName })
        }
        if (response.data.userGroups && response.data.userGroups.length > 0) {
          setDefaultGroup(response.data.userGroups[0])
        }
        if (response.data.userAccount && response.data.userAccount.length > 0) {
          setStatus(response.data.userAccount.accStatus)
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }
  }

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

  const handleDeleteRow = index => {
    const updatedRows = [...groups]
    updatedRows.splice(index, 1)
    setGroup(updatedRows)
  }

  const handleDeleteRow1 = index => {
    const updatedRows = [...policies]
    updatedRows.splice(index, 1)
    setPolicies(updatedRows)
  }
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
          'https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=company',

          config
        )

        const regions = response.data.map(region => ({
          value: region.name,
          label: region.name,
          id: region.id,
          parentId: region.parentID // Lưu lại parentID của regions
        }))
        setRegionName(regions)

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

        setPolicyOption(response.data.rows)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

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
  console.log(groupACIds, 'groupACs')

  const userGroups = async rows => {
    try {
      const processedGroups = []
      for (const row of rows) {
        const groupId = await createNewGroup(row.groupName, row.groupCode)

        const userGroup = {
          groupId: groupId,
          policyName: true,
          isLeader: row.isLeader
        }
        processedGroups.push(userGroup)
        console.log(userGroup)
      }

      return processedGroups
    } catch (error) {
      throw error
    }
  }

  const filteredGroupOptions = groupOptions.filter(
    option => !groups || !groups.some(group => group.groupName === option.name)
  )

  const filteredPolicyOptions = policyOption.filter(
    option => !policies || !policies.some(policies => policies.policyName === option.policyName)
  )
  useEffect(() => {
    if (timeValidity === 'Undefined') {
      setAvailableAt(null)
      setAva1(null)
      setExpiredAt(null)
      setAva2(null)
    }
  }, [timeValidity])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config)
        setData(response.data) // store the fetched data in the state
        setUser(response.data)
        setGroup(response.data.userGroups)
        setPolicies(response.data.policies)
        setPiId(response.data.piId)
        setFullNameValue(response.data.fullName)
        setEmail(response.data.email)
        setPhoneNumber(response.data.phoneNumber)
        setIdentityNumber(response.data.identityNumber)
        setUserCode(response.data.userCode)
        setSyncCode(response.data.syncCode)
        setStatus1(response.data.userStatus)
        setAvailableAt(response.data.availableAt)
        setExpiredAt(response.data.expiredAt)
        setLeaderOfUnit(response.data.userGroups[0].isLeader)
        setNote(response.data.note)
        setStatus(response.data.userAccount.accStatus)
        setGender(response.data.gender)

        if (response.data.level) {
          const regionName = await fetchRegionName(response.data.level)
          setSelectedRegion({ id: response.data.level, name: regionName })
          console.log(regionName, 'regionsname')
        }
        if (response.data.contractType) {
          const contractName = await fetchRegionName(response.data.contractType)
          setSelectContract({ id: response.data.contractType, name: contractName })
        }
        if (response.data.timeStartMorning) {
          const [hour, minute] = response.data.timeStartMorning
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setDateTime(defaultTime)
        }
        console.log(timeEndMorning) // Kết quả mong muốn

        if (response.data.timeEndMorning) {
          const [hour, minute] = response.data.timeEndMorning
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeEndMorning(defaultTime)
        }
        if (response.data.timeStartAfternoon) {
          const [hour, minute] = response.data.timeStartAfternoon
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeStartAfternoon(defaultTime)
        }
        if (response.data.timeEndAfternoon) {
          const [hour, minute] = response.data.timeEndAfternoon
          const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
          const defaultTime = new Date()
          defaultTime.setHours(hour)
          defaultTime.setMinutes(minute)
          setTimeEndAfternoon(defaultTime)
        }

        // setDateTime(convertTimeArrayToString(response.data.timeEndMorning))
        console.log(convertTimeArrayToString(response.data.timeEndMorning))
        if (response.data.userGroups && response.data.userGroups.length > 0) {
          setDefaultGroup(response.data.userGroups[0])
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }
    if (userId) {
      fetchUserData(userId)
    }
  }, [userId, leaderOfUnit])

  const handleCancel = () => {
    fetchUserData(userId)

    setReadOnly(true)
    setEditing(false)

    // setShowPlusColumn(!showPlusColumn)
  }
  useEffect(() => {
    fetchUserData(userId)
  }, [userId])
  console.log('param', params)

  return (
    <div>
      {user ? (
        <div>
          <Grid container spacing={3} component={Paper}>
            <Grid style={{ borderRadius: '0.05%', marginLeft: 10 }}>
              <Grid container spacing={2}>
                <h2 style={{ color: 'black', marginLeft: '1%' }}> Information</h2>
              </Grid>
              <Grid container spacing={2}>
                <div style={{ width: '80%' }}></div>
                {/* {editing ? ( */}
                <>
                  <Button variant='contained' onClick={handleCancel} sx={{ marginRight: '10px' }}>
                    Cancel
                  </Button>
                  <Button variant='contained' onClick={saveChanges}>
                    Save
                  </Button>
                </>

                {/* )} */}
              </Grid>

              <Grid item xs={12} style={{ height: 10 }}>
                {' '}
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField label='Name*' value={fullNameValue} onChange={handleFullNameChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Email*' value={email} onChange={handleEmailChange} fullWidth />
                </Grid>

                <Grid item xs={3.8}>
                  {' '}
                  {/* Sửa đổi xs={4} thành xs={8} */}
                  <TextField
                    label='Phone Number*'
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    fullWidth // Thêm thuộc tính fullWidth vào đây
                  />
                </Grid>
                <Grid item xs={4}>
                  {/* Update Select to use the gender state */}
                  <FormControl fullWidth>
                    <InputLabel id='gender-label'>Gender*</InputLabel>
                    <Select
                      labelId='gender-label'
                      id='gender-select'
                      value={gender} // Use the gender state
                      onChange={handleGenderChange} // Update onChange handler
                    >
                      {/* MenuItems for gender options */}
                      <MenuItem value='MALE'>MALE</MenuItem>
                      <MenuItem value='FEMALE'>FEMALE</MenuItem>
                      <MenuItem value='OTHER'>OTHER</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label='Identify number*'
                    value={identityNumber}
                    onChange={handleIdentityNumberChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3.8}>
                  <TextField label='Code*' defaultValue={userCode} onChange={handleUserCodeChange} fullWidth />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label='Synchronize code'
                    defaultValue={syncCode}
                    onChange={handleSyncCodeChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id='region-label'>Level</InputLabel>
                    <Select
                      labelId='region-label'
                      id='region-select'
                      value={selectedRegion ? selectedRegion.id : ''}
                      onChange={e => handleRegionChange(regionOptions.find(opt => opt.id === e.target.value))}
                    >
                      {regionOptions.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3.8}>
                  <FormControl fullWidth>
                    <InputLabel id='region-label'>Contract Type</InputLabel>
                    <Select
                      labelId='region-label'
                      id='region-select'
                      value={selectContract ? selectContract.id : ''}
                      onChange={e => handleContractChange(contractOptions.find(opt => opt.id === e.target.value))}
                    >
                      {contractOptions.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>{' '}
                </Grid>
                <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                  Status
                  <Switch checked={status1 === 'ACTIVE'} onChange={handleStatusChange} color='primary' label='Status' />
                </Grid>

                <Grid item xs={1} style={{ marginTop: '2%' }}>
                  Morning shift:
                </Grid>

                <Grid item xs={1}>
                  <DatePickerWrapper>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                      <div>
                        <DatePicker
                          showTimeSelect
                          selected={dateTime}
                          timeIntervals={15}
                          showTimeSelectOnly
                          dateFormat='HH:mm' // Hiển thị theo định dạng 24 giờ
                          timeFormat='HH:mm' // Định dạng giờ 24 giờ
                          id='time-only-picker'
                          onChange={date => handleTimeChange(date)}
                          customInput={<CustomInput />}
                          timeCaption='Time' // Chú thích giờ
                        />
                      </div>
                    </Box>
                  </DatePickerWrapper>
                </Grid>
                <Grid item xs={1}>
                  <DatePickerWrapper>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                      <div>
                        <DatePicker
                          showTimeSelect
                          selected={timeEndMorning}
                          timeIntervals={15}
                          showTimeSelectOnly
                          dateFormat='HH:mm' // Hiển thị theo định dạng 24 giờ
                          timeFormat='HH:mm' // Định dạng giờ 24 giờ
                          id='time-only-picker'
                          onChange={date => handleTimeEndMorningChange(date)}
                          customInput={<CustomInput />}
                          timeCaption='Time' // Chú thích giờ
                        />
                      </div>
                    </Box>
                  </DatePickerWrapper>
                </Grid>
                <Grid item xs={1} style={{ marginTop: '2%' }}>
                  Afternoon shift:
                </Grid>
                <Grid item xs={1}>
                  <DatePickerWrapper>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                      <div>
                        <DatePicker
                          showTimeSelect
                          selected={timeStartAfternoon}
                          timeIntervals={15}
                          showTimeSelectOnly
                          dateFormat='HH:mm' // Hiển thị theo định dạng 24 giờ
                          timeFormat='HH:mm' // Định dạng giờ 24 giờ
                          id='time-only-picker'
                          onChange={date => handleTimeStartAfetrnoonChange(date)}
                          customInput={<CustomInput />}
                          timeCaption='Time' // Chú thích giờ
                        />
                      </div>
                    </Box>
                  </DatePickerWrapper>
                </Grid>
                <Grid item xs={1}>
                  <DatePickerWrapper>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                      <div>
                        <DatePicker
                          showTimeSelect
                          selected={timeEndAfternoon}
                          timeIntervals={15}
                          showTimeSelectOnly
                          dateFormat='HH:mm' // Hiển thị theo định dạng 24 giờ
                          timeFormat='HH:mm' // Định dạng giờ 24 giờ
                          id='time-only-picker'
                          onChange={date => handleTimeEndAfternoonChange(date)}
                          customInput={<CustomInput />}
                          timeCaption='Time' // Chú thích giờ
                        />
                      </div>
                    </Box>
                  </DatePickerWrapper>
                </Grid>
                {/* <Grid item ={1} style={{ marginTop: '2%' }}></Grid> */}
                <Grid item xs={3.8}>
                  <FormControl fullWidth>
                    <InputLabel id='time-validity-label'>Validity period</InputLabel>
                    <Select
                      labelId='time-validity-label'
                      id='time-validity-select'
                      value={timeValidity}
                      onChange={handleTimeValidityChange}
                    >
                      <MenuItem value='Custom'>Custom</MenuItem>
                      <MenuItem value='Undefined'>None</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {timeValidity === 'Custom' &&
                  (user.availableAt ? (
                    <Grid item xs={8}>
                      <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <DatePickerWrapper>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                              <div>
                                <DatePicker
                                  selected={availableAt}
                                  onChange={handleStartDateChange}
                                  dateFormat='dd/MM/yyyy'
                                  customInput={<CustomInput label='Start date' />}
                                />
                              </div>
                            </Box>
                          </DatePickerWrapper>
                        </Grid>
                        {user.expiredAt && (
                          <Grid item xs={8}>
                            <DatePickerWrapper>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                                <div>
                                  <DatePicker
                                    selected={expiredAt}
                                    onChange={handleEndDateChange}
                                    dateFormat='dd/MM/yyyy'
                                    customInput={<CustomInput label='End date' />}
                                  />
                                </div>
                              </Box>
                            </DatePickerWrapper>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={0.1}></Grid>
                      <Grid item xs={2}>
                        <DatePickerWrapper>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                            <div>
                              <DatePicker
                                selected={availableAt}
                                onChange={handleStartDateChange}
                                dateFormat='dd/MM/yyyy'
                                customInput={<CustomInput label='Start date' />}
                              />
                            </div>
                          </Box>
                        </DatePickerWrapper>
                      </Grid>
                      <Grid item xs={4}>
                        <DatePickerWrapper>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                            <div>
                              <DatePicker
                                selected={expiredAt}
                                onChange={handleEndDateChange}
                                dateFormat='dd/MM/yyyy'
                                customInput={<CustomInput label='End date' />}
                              />
                            </div>
                          </Box>
                        </DatePickerWrapper>
                      </Grid>
                    </Grid>
                  ))}

                <Grid item xs={11.8}>
                  <TextField
                    rows={4}
                    multiline
                    label='Note'
                    value={note}
                    onChange={handleNoteChange}
                    id='textarea-outlined-static'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h5'>Department*</Typography>
                </Grid>
                <Grid item xs={11.8}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Department</TableCell>
                          <TableCell>Department Code</TableCell>
                          <TableCell align='right'>Is Leader</TableCell>
                          {showPlusColumn && (
                            <TableCell align='center'>
                              <IconButton onClick={handleAddRow} size='small' sx={{ marginLeft: '10px' }}>
                                <Icon icon='bi:plus' />
                              </IconButton>
                              {/* <RolePopup
                                open={openPopup}
                                onClose={handleClosePopup}
                                onSelect={handleRoleSelect}
                                userId={userId}
                              /> */}
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groups.map((group, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Autocomplete
                                options={filteredGroupOptions}
                                getOptionLabel={option => option.name}
                                value={
                                  groupOptions.find(option => option.name === group.groupName)
                                    ? groupOptions.find(option => option.name === group.groupName)
                                    : { name: group.groupName }
                                }
                                onChange={async (event, newValue) => {
                                  const updatedRows = [...groups]
                                  updatedRows[index].groupName = newValue?.name || ''
                                  updatedRows[index].groupCode = newValue?.code || ''
                                  updatedRows[index].parentId = newValue?.parentID || ''

                                  console.log('Updated group name:', newValue?.name)
                                  console.log('Updated group name:', newValue?.name)
                                  console.log('Parent ID:', newValue?.parentID) // Log ra parentId

                                  const parentName = await fetchRegionName(newValue?.parentID)
                                  updatedRows[index].parentName = parentName || ''

                                  console.log('Parent name:', parentName) // Log ra tên của parentId
                                  setGroup(updatedRows)
                                  console.log(updatedRows, 'hihih')
                                }}
                                renderInput={params => <TextField {...params} label='Department' />}
                              />
                            </TableCell>
                            {console.log('Group:', group)}
                            <TableCell>{group.groupCode}</TableCell>
                            <TableCell align='right'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={group.isLeader}
                                    onChange={event => {
                                      const updatedRows = [...groups]
                                      updatedRows[index].isLeader = event.target.checked // Cập nhật giá trị isLeader
                                      setGroup(updatedRows)
                                      setIsLeader(event.target.checked) // Cập nhật state isLeader
                                    }}
                                  />
                                }
                                label='Is Leader'
                              />
                            </TableCell>

                            {showPlusColumn && (
                              <TableCell align='center'>
                                <IconButton onClick={() => handleDeleteRow(index)}>
                                  <Icon icon='bi:trash' />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <br></br>
              {user?.userAccount && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h5'>Account Information</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label='Account*'
                      defaultValue={user?.userAccount?.username || ''}
                      onChange={handleUserNameChange}
                      id='form-props-read-only-input'
                      InputProps={{ readOnly: readOnlys }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label='Account Type'
                      defaultValue={user?.userAccount.identityProviderType || ''}
                      id='form-props-read-only-input'
                      InputProps={{ readOnly: readOnlys }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2} style={{ marginTop: '1.1%' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={status === 'ACTIVE' || ''}
                          onChange={e => {
                            setStatus(status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                            const newStatus = e.target.checked ? 'true' : 'false'
                            const token = localStorage.getItem(authConfig.storageTokenKeyName)
                            fetch(
                              `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}/enable-account?enabled=${newStatus}`,
                              {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}` // Passing the token as a bearer token
                                }
                              }
                            )
                              .then(response => {
                                if (!response.ok) {
                                  throw new Error('Failed to update account status')
                                }

                                return response.json()
                              })
                              .then(data => {
                                console.log('Account status updated:', data)
                              })
                              .catch(error => {
                                console.error('Error updating account status:', error)
                              })
                          }}
                          color='primary'
                        />
                      }
                      label='Status'
                      labelPlacement='start'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h5'>Role</Typography>
                  </Grid>
                  <Grid item xs={11.8}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Details</TableCell>
                            {/* {showPlusColumn && ( */}
                            <TableCell align='center'>
                              <IconButton onClick={handleAddRow1} size='small' sx={{ marginLeft: '10px' }}>
                                <Icon icon='bi:plus' />
                              </IconButton>
                            </TableCell>
                            {/* )} */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {policies.map((policy, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {' '}
                                <Autocomplete
                                  options={filteredPolicyOptions}
                                  getOptionLabel={option => option.policyName}
                                  value={policyOption.find(option => option.policyName === policy.policyName) || null}
                                  onChange={(event, newValue) => {
                                    const updatedRows = [...policies]
                                    updatedRows[index].policyName = newValue.policyName
                                    updatedRows[index].policyCode = newValue.policyCode
                                    updatedRows[index].description = newValue.description
                                    updatedRows[index].policyId = newValue.policyId

                                    // updatedRows[index].id = newValue.id
                                    setPolicies(updatedRows)
                                  }}
                                  renderInput={params => <TextField {...params} label='Role' />}
                                />
                              </TableCell>
                              <TableCell>{policy.policyCode}</TableCell>

                              <TableCell>{policy.description}</TableCell>

                              {showPlusColumn && (
                                <TableCell align='center'>
                                  <IconButton onClick={() => handleDeleteRow1(index)}>
                                    <Icon icon='bi:trash' />
                                  </IconButton>
                                </TableCell>
                              )}
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default UserDetails
