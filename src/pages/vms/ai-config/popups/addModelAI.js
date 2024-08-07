import React, { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  styled
} from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
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

const format_form = [
  {
    name: 'type',
    label: 'Mã Model AI',
    placeholder: 'Nhập mã model AI',
    type: 'TextField',
    require: true,
    width: 6
  },
  {
    name: 'modelName',
    label: 'Tên Model AI',
    placeholder: 'Nhập tên Model AI',
    type: 'TextField',
    require: true,
    width: 6
  }
]

const AddModelAI = ({ show, onClose, setReload, data, id, typePopup }) => {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState(format_form)
  const [characteristic, setCharacteristic] = useState([])
  const [characteristicsIndex, setCharacteristicsIndex] = useState(0)

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {}
  }

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  useEffect(() => {
    if (data) {
      handleUpdateForm(data)
      handleUpdateDetail(data)
      setCharacteristicsIndex(data?.characteristic?.length)
    }
  }, [data])

  useEffect(() => {
    if (detail) {
      setDetailFormValue()
    }
  }, [detail])

  const setDetailFormValue = () => {
    reset(detail)
  }

  const onReset = values => {
    var detail = {}
    callback(detail)
    onClose()
  }

  const handleUpdateDetail = data => {
    const characteristicData = {}
    const characteristicList = data?.characteristic || []

    for (let i = 0; i < data?.characteristic?.length; i++) {
      const item = characteristicList[i]
      characteristicData[`characteristics[${i}].characteristicType`] = item.characteristicType
      characteristicData[`characteristics[${i}].characteristicName`] = item.characteristicName
      characteristicData[`characteristics[${i}].characteristicValue`] = item.characteristicValue
    }

    const formData = {
      ...data,
      ...characteristicData
    }

    setDetail(formData)
  }

  const handleUpdateForm = data => {
    const characteristicForm = []

    for (let i = 0; i < data?.characteristic?.length; i++) {
      characteristicForm.push(
        {
          name: `characteristics[${i}].characteristicType`,
          label: 'Mã thông số',
          placeholder: 'Nhập mã thông số',
          type: 'TextField',
          require: true,
          width: 4
        },
        {
          name: `characteristics[${i}].characteristicName`,
          label: 'Tên thông số',
          placeholder: 'Nhập tên thông số',
          type: 'TextField',
          require: true,
          width: 4
        },
        {
          name: `characteristics[${i}].characteristicValue`,
          label: 'Giá trị thông số',
          placeholder: '35',
          type: 'TextField',
          require: true,
          width: 4,
          defaultValue: '35'
        }
      )
    }

    setForm(prevForm => [...prevForm, ...characteristicForm])
  }

  const handleAddNewField = () => {
    setForm(prevForm => [
      ...prevForm,
      {
        name: `characteristics[${characteristicsIndex}].characteristicType`,
        label: 'Mã thông số',
        placeholder: 'Nhập mã thông số',
        type: 'TextField',
        require: true,
        width: 4
      },
      {
        name: `characteristics[${characteristicsIndex}].characteristicName`,
        label: 'Tên thông số',
        placeholder: 'Nhập tên thông số',
        type: 'TextField',
        require: true,
        width: 4
      },
      {
        name: `characteristics[${characteristicsIndex}].characteristicValue`,
        label: 'Giá trị thông số',
        placeholder: '35',
        type: 'TextField',
        require: true,
        width: 4,
        defaultValue: '35'
      }
    ])
    setCharacteristicsIndex(characteristicsIndex + 1)
  }

  const handleRemoveField = () => {
    let startIndex = 0
    let endIndex = form?.length - 3

    const formNew = form.slice(startIndex, endIndex)
    setForm(formNew)

    characteristic.pop()
    setCharacteristicsIndex(characteristicsIndex - 1)
  }

  const onSubmit = values => {
    // Lấy giá trị từ form
    const { type, modelName, characteristics } = values

    // Tạo đối tượng detail để gửi đi
    const detail = {
      modelName: modelName,
      type: type,
      characteristic: characteristics.map(characteristic => ({
        characteristicName: characteristic.characteristicName,
        characteristicType: characteristic.characteristicType,
        characteristicValue: characteristic.characteristicValue
      }))
    }

    if (data) {
      handleUpdate(detail)
    } else {
      handleAdd(detail)
    }

    onClose()
  }

  const handleAdd = values => {
    const params = {
      ...values
    }

    setLoading(true)
    axios
      .post(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai`, { ...params }, config)
      .then(() => {
        toast.success('Thêm mới thành công')
        setReload()
        onClose()
      })
      .catch(error => {
        if (error && error?.response?.data) {
          console.error('error', error)
          toast.error(error?.response?.data?.message)
        } else {
          console.error('Error fetching data:', error)
          toast.error(error)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleUpdate = values => {
    const params = {
      ...values
    }

    setLoading(true)
    axios
      .put(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai/${data.id}`, { ...params }, config)
      .then(() => {
        toast.success('Dữ liệu thay đổi thành công')
        setReload()
        onClose()
      })
      .catch(error => {
        if (error && error?.response?.data) {
          console.error('error', error)
          toast.error(error?.response?.data?.message)
        } else {
          console.error('Error fetching data:', error)
          toast.error(error)
        }
      })
      .finally(() => {
        setLoading(false)
      })
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
          <Box sx={{ mb: 8, textAlign: 'left' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Model AI
            </Typography>
          </Box>
          <form>
            <Grid container spacing={2}>
              {form.map((item, index) => {
                if (item.type === 'TextField') {
                  return (
                    <Grid item xs={item.width} key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name={item.name}
                        control={control}
                        rules={{ required: item.require }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            disabled={typePopup === 'view'}
                            value={value}
                            label={item.label}
                            onChange={onChange}
                            placeholder={item.placeholder}
                            error={Boolean(errors[item.name])}
                            aria-describedby='validation-basic-last-name'
                            {...(errors[item.name] && { helperText: 'Trường này bắt buộc' })}
                          />
                        )}
                      />
                    </Grid>
                  )
                }
              })}
              {typePopup !== 'view' && (
                <Grid item xs={12}>
                  <Typography sx={{ mb: 3, fontSize: '16px', fontStyle: 'italic', color: '#FF9F43' }}>
                    Thêm các thông số Model AI
                  </Typography>
                  <Button variant='contained' color='primary' sx={{ margin: '10px' }} onClick={handleAddNewField}>
                    Thêm
                  </Button>
                  {/* {form.length > 2 &&
                                        <Button variant='contained' color='error' sx={{ margin: '10px' }} onClick={() => handleRemoveField()} >
                                            Xóa
                                        </Button>
                                    } */}
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'right',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button
            variant={typePopup === 'view' ? 'contained' : 'tonal'}
            color={typePopup === 'view' ? 'primary' : 'secondary'}
            onClick={onClose}
          >
            {typePopup === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {typePopup === 'add' && (
            <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
              Lưu
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default AddModelAI
