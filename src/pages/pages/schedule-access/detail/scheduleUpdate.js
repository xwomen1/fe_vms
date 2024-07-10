import React, { useEffect, useState, forwardRef } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Card,
  Dialog,
  DialogContent,
  Slide,
  Grid,
  IconButton,
  Typography,
  DialogActions,
  Button
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Daily from '../mocdata/daily'

const dataDailyDefault = [
  { label: 'Thứ 2', dayOfWeek: 'MONDAY', value: 2 },
  { label: 'Thứ 3', dayOfWeek: 'TUESDAY', value: 3 },
  { label: 'Thứ 4', dayOfWeek: 'WEDNESDAY', value: 4 },
  { label: 'Thứ 5', dayOfWeek: 'THURSDAY', value: 5 },
  { label: 'Thứ 6', dayOfWeek: 'FRIDAY', value: 6 },
  { label: 'Thứ 7', dayOfWeek: 'SATURDAY', value: 7 }
]

const DoorAccessUpdate = ({ show, onClose, id, setReload }) => {
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [schedule, setSchedule] = useState(null)
  const [dataDailyState, setDataDailyState] = useState([])
  const [dataDaily, setDataDaily] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (show) {
      fetchDataList1()
    }
  }, [show])

  const fetchDataList1 = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/schedules/${id}`,
        config
      )
      setName(response.data.name) // Cập nhật giá trị ban đầu của name
      setDescription(response.data.description)
      setSchedule(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const ViewContent = () => {
    const transformCalendarDays = listScheduleWeekly => {
      console.log('listScheduleWeekly', listScheduleWeekly)

      const transformedData = dataDailyDefault.map(day => {
        const foundDay = listScheduleWeekly.find(item => item.dayOfWeek === day.dayOfWeek)

        return {
          ...day,
          times: foundDay ? foundDay.times : []
        }
      })

      return transformedData
    }

    useEffect(() => {
      if (schedule && schedule.listScheduleWeekly) {
        const transformedData = transformCalendarDays(schedule.listScheduleWeekly)
        setDataDailyState(transformedData)
        setDataDaily(transformedData)
      }
    }, [schedule])

    return (
      <div>
        <div
          style={{
            color: '#333',
            margin: '20px 0 20px 0'
          }}
        >
          <span>Bảng cấu hình thời gian</span>
        </div>

        <div
          style={{
            width: '100%'
          }}
        >
          <div
            style={{
              marginLeft: 50,
              width: 'calc(100% - 150px)',
              position: 'relative',
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: 14,
              display: 'flex'
            }}
          >
            {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((time, index) => (
              <div
                key={index.toString()}
                style={{
                  width: `${100 / 6}%`,
                  textAlign: 'center',
                  padding: '8px 0'
                }}
              >
                {time}
              </div>
            ))}
            <div
              style={{
                position: 'absolute',
                right: -70,
                textAlign: 'center',
                padding: '8px 0'
              }}
            >
              24:00
            </div>
          </div>

          <Daily
            callbackOfDaily={v => {
              setDataDaily(v)
              setDataDailyState(v)
            }}
            dataDailyProps={dataDailyState}
          />
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      // Chuyển đổi dataDailyState thành định dạng yêu cầu

      const scheduleWeeklyRequest = dataDailyState.map(day => ({
        dayOfWeek: day.dayOfWeek,
        times:
          day.times && day.times.length > 0
            ? day.times
                .map(time => ({
                  startTimeInMinute: time.startTimeInMinute || 0,
                  endTimeInMinute: time.endTimeInMinute || 0
                }))
                .filter(time => time.startTimeInMinute !== 0 || time.endTimeInMinute !== 0)
            : []
      }))

      const formData = {
        name: name || (schedule ? schedule.name : ''),
        description: description || (schedule ? schedule.description : ''),
        scheduleWeeklyRequest: scheduleWeeklyRequest,
        listHoliday: [] // Nếu không có listHoliday, trả về một mảng rỗng
      }

      await axios.put(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/schedules/${id}`, formData, config)

      setReload()
      toast.success('Cập nhật thành công')
    } catch (error) {
      console.error('Error updating data: ', error)
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleInputChange = (field, value) => {
    if (field === 'name') {
      setName(value)
    } else if (field === 'description') {
      setDescription(value)
    }
  }

  return (
    <>
      <Card>
        <Dialog
          open={show}
          maxWidth='md'
          scroll='body'
          TransitionComponent={Slide}
          onClose={onClose}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                color: 'grey.500'
              }}
            >
              <IconButton onClick={onClose}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </IconButton>
            </Box>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Chi tiết lịch hoạt động
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <CustomTextField
                  label='Tên lịch hoạt động'
                  value={name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  label='Mô tả'
                  value={description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <span style={{ color: '#f5963a', fontSize: 20, position: 'relative' }}>
                  Cấu hình thời gian hoạt động
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: -10,
                      display: 'inline-block',
                      content: '',
                      width: '100%',
                      height: '5px',
                      background: '#7ebbfc',
                      borderRadius: 25
                    }}
                  />
                </span>
                {ViewContent()}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'flex-end',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button onClick={handleSave} variant='contained' color='primary'>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  )
}

export default DoorAccessUpdate
