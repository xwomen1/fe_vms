import { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, MenuItem, Typography, styled } from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import Daily from '../mocdata/daily'
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
        data: [],
        require: true,
        width: 6,
    },
    {
        name: 'modelName',
        label: 'Tên Model AI',
        placeholder: 'Nhập tên Model AI',
        type: 'TextField',
        data: [],
        require: true,
        width: 6,
    },
    {
        name: 'characteristicType',
        label: 'Mã thông số',
        placeholder: 'Nhập mã thông số',
        type: 'TextField',
        data: [],
        require: true,
        width: 6,
    },
    {
        name: 'characteristicName',
        label: 'Tên thông số',
        placeholder: 'Nhập tên thông số',
        type: 'TextField',
        data: [],
        require: true,
        width: 6,
    },
]

const AddModelAI = ({ show, onClose, setReload, data, id, typePopup }) => {
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState(null)
    const [form, setForm] = useState(format_form)

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
        }
    }

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({})

    useEffect(() => {
        setDetail(data)
    }, [data])

    useEffect(() => {
        if (detail) {
            setDetailFormValue()
        }
    }, [detail])

    const setDetailFormValue = () => {
        reset(detail)
    }


    const onReset = (values) => {
        var detail = {}
        callback(detail)
        onClose()
    }

    const onSubmit = (values) => {

        if (data) {
            handleUpdate(values)
        } else {
            handleAdd(values)
        }
        onClose()
    }

    const handleAdd = (values) => {
        const params = {
            ...values
        }

        setLoading(true)
        axios.post(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai`, { ...params }, config)
            .then(() => {
                toast.success('Thêm mới thành công')
                setReload()
                onClose()
            })
            .catch((error) => {
                console.error('Error fetching data: ', error)
                toast.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleUpdate = (values) => {
        const params = {
            ...values
        }

        setLoading(true)
        axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai/${data.id}`, { ...params }, config)
            .then(() => {
                toast.success('Dữ liệu thay đổi thành công')
                setReload()
                onClose()
            })
            .catch((error) => {
                console.error('Error fetching data: ', error)
                toast.error(error)
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
                                        <Grid item xs={item.width} key={index}>
                                            <Controller
                                                name={item.name}
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomTextField
                                                        fullWidth
                                                        disabled={typePopup === 'view' ? true : false}
                                                        value={value}
                                                        label={item.label}
                                                        onChange={onChange}
                                                        placeholder={item.placeholder}
                                                        error={Boolean(errors.nameCalendar)}
                                                        aria-describedby='validation-basic-last-name'
                                                        {...(errors.nameCalendar && { helperText: 'Trường này bắt buộc' })}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    )
                                }
                            })}
                            <Button variant='contained' color='primary' sx={{ margin: '10px' }}>
                                Thêm
                            </Button>
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
                    {
                        typePopup === 'add' &&
                        <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
                            Lưu
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default AddModelAI