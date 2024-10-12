import { useState, forwardRef, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  styled
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

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

const initValueFilter = {
  location: null,
  cameraName: null,
  startTime: null,
  endTime: null,
  title: 'Họ tên', // Default value for title
  operator: 'Is Equal to', // Default value for operator
  enterValue: '' // Default value for enterValue
}

const Filter = ({ show, onClose, valueFilter, callback, direction }) => {
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [locations, setLocations] = useState([])
  const [cameras, setCameras] = useState([])
  const [rules, setRules] = useState([initValueFilter])

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {}
  }

  const fetchLocations = async () => {
    try {
      const res = await axios.get(
        `https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions/children-lv1/me/?parentId=7cac40af-6b9e-47e6-9aba-8d458722d5a4`,
        config
      )
      setLocations(res.data)
    } catch (error) {
      console.error('Error fetching locations: ', error)
    }
  }

  const fetchCameras = async () => {
    try {
      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras`, config)
      setCameras(res.data)
    } catch (error) {
      console.error('Error fetching cameras: ', error)
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues: initValueFilter })

  useEffect(() => {
    fetchLocations()
    fetchCameras()
  }, [])

  const onReset = () => {
    reset(initValueFilter) // Reset to initial values
    onClose()
  }

  const onSubmit = data => {
    const detail = {
      ...data,
      startTime: startTime.getTime(),
      endTime: endTime.getTime()
    }
    callback(detail)
    onClose()
  }

  const addRule = () => {
    setRules([...rules, initValueFilter])
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Bộ lọc
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {rules.map((rule, index) => (
              <Grid container spacing={2} key={index} sx={{ mt: index !== 0 ? 2 : 0 }}>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id='filter-title-label'>Title</InputLabel>
                    <Controller
                      name={`rules[${index}].title`}
                      control={control}
                      render={({ field }) => (
                        <Select {...field} labelId='filter-title-label' id={`filter-title-select-${index}`}>
                          <MenuItem value='Họ tên'>Họ tên</MenuItem>
                          <MenuItem value='Tên gọi khác'>Tên gọi khác</MenuItem>
                          <MenuItem value='Ngày sinh'>Ngày sinh</MenuItem>
                          <MenuItem value='Nơi sinh'>Nơi sinh</MenuItem>
                          <MenuItem value='Quê quán'>Quê quán</MenuItem>
                          <MenuItem value='Giới tính'>Giới tính</MenuItem>
                          <MenuItem value='Dân tộc'>Dân tộc</MenuItem>
                          <MenuItem value='Tôn giáo'>Tôn giáo</MenuItem>
                          <MenuItem value='Nghề nghiệp'>Nghề nghiệp</MenuItem>
                          <MenuItem value='Đăng ký hộ khẩu thường chú'>Đăng ký hộ khẩu thường chú</MenuItem>
                          <MenuItem value='Nơi ở hiện nay'>Nơi ở hiện nay</MenuItem>
                          <MenuItem value='Ngày tuyển dụng'>Ngày tuyển dụng</MenuItem>
                          <MenuItem value='Cơ quan tuyển dụng'>Cơ quan tuyển dụng</MenuItem>
                          <MenuItem value='Chức vụ'>Chức vụ</MenuItem>
                          <MenuItem value='Công việc được giao'>Công việc được giao</MenuItem>
                          <MenuItem value='Ngạch công chức'>Ngạch công chức</MenuItem>
                          <MenuItem value='Mã ngách'>Mã ngách</MenuItem>
                          <MenuItem value='Bậc lương'>Bậc lương</MenuItem>
                          <MenuItem value='Hệ số'>Hệ số</MenuItem>
                          <MenuItem value='Ngày hưởng'>Ngày hưởng</MenuItem>
                          <MenuItem value='Phụ cấp chức vụ'>Phụ cấp chức vụ</MenuItem>
                          <MenuItem value='Phụ cấp khác'>Phụ cấp khác</MenuItem>
                          <MenuItem value='Trình độ giáo dục phổ thông'>Trình độ giáo dục phổ thông</MenuItem>
                          <MenuItem value='Trình độ chuyên môn cao nhất'>Trình độ chuyên môn cao nhất</MenuItem>
                          <MenuItem value='Lý luận chính trị'>Lý luận chính trị</MenuItem>
                          <MenuItem value='Quản lý nhà nước'>Quản lý nhà nước</MenuItem>
                          <MenuItem value='Ngoại ngữ'>Ngoại ngữ</MenuItem>
                          <MenuItem value='Tin học'>Tin học</MenuItem>
                          <MenuItem value='Ngày vào Đảng'>Ngày vào Đảng</MenuItem>
                          <MenuItem value='Ngày chính thức'>Ngày chính thức</MenuItem>
                          <MenuItem value='Ngày tham gia tổ chức chính trị - xã hội'>
                            Ngày tham gia tổ chức chính trị - xã hội
                          </MenuItem>
                          <MenuItem value='Ngày nhập ngũ'>Ngày nhập ngũ</MenuItem>
                          <MenuItem value='Ngày xuất ngũ'>Ngày xuất ngũ</MenuItem>
                          <MenuItem value='Quân hàm cao nhất'>Quân hàm cao nhất</MenuItem>
                          <MenuItem value='Danh hiệu được phân cao nhất'>Danh hiệu được phân cao nhất</MenuItem>
                          <MenuItem value='Sức khỏe'>Sức khỏe</MenuItem>
                          <MenuItem value='Chiều cao'>Chiều cao</MenuItem>
                          <MenuItem value='Cân nặng'>Cân nặng</MenuItem>
                          <MenuItem value='Nhóm máu'>Nhóm máu</MenuItem>
                          <MenuItem value='Thương binh loại'>Thương binh loại</MenuItem>
                          <MenuItem value='Gia đình chính sách'>Gia đình chính sách</MenuItem>
                          <MenuItem value='Sở trường công tác'>Sở trường công tác</MenuItem>
                          <MenuItem value='Khen thưởng'>Khen thưởng</MenuItem>
                          <MenuItem value='Kỷ luật'>Kỷ luật</MenuItem>
                          <MenuItem value='Lịch sử bản thân'>Lịch sử bản thân</MenuItem>
                          <MenuItem value='Đặc điểm lịch sử bản thân'>Đặc điểm lịch sử bản thân</MenuItem>
                          <MenuItem value='Quan hệ gia đình'>Quan hệ gia đình</MenuItem>
                          <MenuItem value='Đặc điểm kinh tế gia đình'>Đặc điểm kinh tế gia đình</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id={`operator-label-${index}`}>Operator</InputLabel>
                    <Controller
                      name={`rules[${index}].operator`}
                      control={control}
                      render={({ field }) => (
                        <Select {...field} labelId={`operator-label-${index}`} id={`operator-select-${index}`}>
                          <MenuItem value='Is Equal to'>Is Equal to</MenuItem>
                          <MenuItem value='Contains'>Contains</MenuItem>
                          <MenuItem value='Greater Than'>Greater Than</MenuItem>
                          <MenuItem value='Less Than'>Less Than</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id={`enter-value-label-${index}`}>Enter Value</InputLabel>
                    <Controller
                      name={`rules[${index}].enterValue`}
                      control={control}
                      render={({ field }) => <Input {...field} id={`enter-value-input-${index}`} />}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            ))}
            <Box sx={{ mt: 2 }}>
              <Button onClick={addRule} variant='outlined' color='primary'>
                Add Rule
              </Button>
            </Box>
            <Box sx={{ marginLeft: '40%' }}>
              <Button onClick={onReset} variant='contained' color='secondary' style={{ marginRight: '5%' }}>
                Hủy
              </Button>
              <Button onClick={onReset} variant='contained' color='primary'>
                Lọc
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default Filter
