import { forwardRef, useEffect, useState } from 'react'
import {
  Card,
  Fade,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Box
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import httpStatusMessages from 'src/message'
import { fetchChatsContacts } from 'src/store/apps/chat'
import toast from 'react-hot-toast'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const SalaryRulePage = ({ isOpen, onClose, camera }) => {
  const [rows, setRows] = useState([])
  const [salaryRule, setSalaryRule] = useState({})
  const [isEditing, setIsEditing] = useState(true)
  const [editedTimeHourDay, setEditedTimeHourDay] = useState('')
  const [editedTimeDayMonth, setEditedTimeDayMonth] = useState('')
  const [othour, setOT] = useState('')
  const [businessDay, setBussiness] = useState('')
  const [httpMessage, setHttpMessage] = useState('') // State to hold HTTP status message
  const [labelColor, setLabelColor] = useState('')
  const [BHXH, setBhxh] = useState('')
  const [BHYT, setBhyt] = useState('')

  const fetchSalaryData = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/salary/regulation/', config)
      setRows(response.data.salaryLevels)
      setSalaryRule(response.data)
      setEditedTimeHourDay(response.data.timeHourDay)
      setEditedTimeDayMonth(response.data.timeDayMonth)
      setOT(response.data.othour)
      setBussiness(response.data.businessDay)
      setBhxh(response.data?.bhxh)
      setBhyt(response.data?.bhyt)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/salary/regulation/', config)
        setRows(response.data.salaryLevels)
        setSalaryRule(response.data)
        setEditedTimeHourDay(response.data.timeHourDay)
        setEditedTimeDayMonth(response.data.timeDayMonth)
        setOT(response.data.othour)
        setBussiness(response.data.businessDay)
        setBhxh(response.data?.bhxh)
        setBhyt(response.data?.bhyt)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchSalaryData()
  }, [])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleClose = () => {
    setHttpMessage('') // Reset HTTP message when closing dialog
    onClose() // Call the onClose function passed from parent component
  }

  const handleSalaryLevelChange = (index, event) => {
    const newRows = [...rows]
    newRows[index].salaryLevel = event.target.value
    setRows(newRows)
  }

  const handleCoefficientChange = (index, event) => {
    const newRows = [...rows]
    newRows[index].coefficient = event.target.value
    setRows(newRows)
  }

  const handleDeleteRow = index => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }

  const handleAddRow = () => {
    const newRow = { level: '', coefficient: '' }
    setRows([...rows, newRow])
  }

  const getHttpStatusMessage = statusCode => {
    return httpStatusMessages[statusCode] || 'Unknown Status' // Default to 'Unknown Status' if code not found
  }

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const data = {
        ...salaryRule,
        timeHourDay: editedTimeHourDay,
        timeDayMonth: editedTimeDayMonth,
        othour: othour,
        businessDay: businessDay,
        salaryLevels: rows.map(row => ({
          salaryLevel: parseInt(row.salaryLevel),
          coefficient: parseFloat(row.coefficient)
        }))
      }

      const response = await axios.put(
        'https://dev-ivi.basesystem.one/smc/iam/api/v0/salary/regulation/update/c952ce18-867d-47b6-b4b5-9fa96917d8dc',
        data,
        config
      )
      const statusMessage = getHttpStatusMessage(response.status)
      setHttpMessage(statusMessage)
      if (response.status >= 200 && response.status <= 299) {
        setLabelColor('green')
      } else {
        setLabelColor('red')
      }
      setSalaryRule(data)
      toast.success(httpMessage)
    } catch (error) {
      console.error('Error saving data:', error)
      toast.error(error.message)
    }
  }

  const handleCancel = () => {
    fetchSalaryData()

    // setShowPlusColumn(!showPlusColumn)
  }
  useEffect(() => {
    fetchSalaryData()
  }, [])

  return (
    <div component={Paper} style={{ backgroundColor: 'white' }}>
      {' '}
      <DialogTitle>
        <h2>QUY ĐỊNH VỀ LƯƠNG</h2>
      </DialogTitle>
      <Grid container spacing={2}>
        <div style={{ width: '80%' }}></div>
        {/* {editing ? ( */}
        <>
          <Button variant='contained' onClick={handleCancel} sx={{ marginRight: '10px' }}>
            Huỷ
          </Button>
          <Button variant='contained' onClick={handleSaveClick}>
            Lưu
          </Button>
        </>

        {/* )} */}
      </Grid>
      <DialogContent>
        <Grid>
          <h3> SỐ GIỜ</h3>
          <>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                {' '}
                <p style={{ fontSize: 20 }}>Số giờ tính công trên 1 ngày:</p>
              </Grid>
              <Grid item xs={4} style={{ marginTop: '2%' }}>
                <CustomTextField
                  value={editedTimeHourDay || 0}
                  onChange={e => setEditedTimeHourDay(parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={2}>
                {' '}
                <p style={{ fontSize: 20 }}> (giờ)</p>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                {' '}
                <p style={{ fontSize: 20 }}> Số ngày tính công trên 1 tháng:</p>
              </Grid>
              <Grid item xs={4} style={{ marginTop: '2%' }}>
                <CustomTextField
                  value={editedTimeDayMonth || 0}
                  onChange={e => setEditedTimeDayMonth(parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={2}>
                {' '}
                <p style={{ fontSize: 20 }}> (ngày)</p>
              </Grid>
            </Grid>
          </>
        </Grid>
        <hr></hr>
        <Grid>
          <h3> MỨC LƯƠNG OT-CÔNG TÁC</h3>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              {' '}
              <p style={{ fontSize: 20 }}> Mức lương OT/giờ: </p>
            </Grid>
            <Grid item xs={4} style={{ marginTop: '2%' }}>
              <CustomTextField value={othour || 0} onChange={e => setOT(parseInt(e.target.value))} />
            </Grid>
            <Grid item xs={2}>
              {' '}
              <p style={{ fontSize: 20 }}> (đồng)</p>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              {' '}
              <p style={{ fontSize: 20 }}> Mức lương công tác/ngày: </p>
            </Grid>
            <Grid item xs={4} style={{ marginTop: '2%' }}>
              <CustomTextField value={businessDay || 0} onChange={e => setBussiness(parseInt(e.target.value))} />
            </Grid>
            <Grid item xs={2}>
              {' '}
              <p style={{ fontSize: 20 }}> (đồng)</p>
            </Grid>
          </Grid>
          <hr></hr>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              {' '}
              <p style={{ fontSize: 20 }}> Bảo hiểm xã hội: </p>
            </Grid>
            <Grid item xs={4} style={{ marginTop: '2%' }}>
              <CustomTextField value={BHXH || 0} onChange={e => setBhxh(parseInt(e.target.value))} />
            </Grid>
            <Grid item xs={2}>
              {' '}
              <p style={{ fontSize: 20 }}> (%)</p>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              {' '}
              <p style={{ fontSize: 20 }}> Bảo hiểm y tế: </p>
            </Grid>
            <Grid item xs={4} style={{ marginTop: '2%' }}>
              <CustomTextField value={BHYT || 0} onChange={e => setBhyt(parseInt(e.target.value))} />
            </Grid>
            <Grid item xs={2}>
              {' '}
              <p style={{ fontSize: 20 }}> (%)</p>
            </Grid>
          </Grid>
          <Grid></Grid>
        </Grid>
      </DialogContent>
    </div>
  )
}

export default SalaryRulePage
