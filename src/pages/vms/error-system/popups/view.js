import { useState, forwardRef, useEffect } from 'react'
import authConfig from 'src/configs/auth'
import { Controller, useForm } from 'react-hook-form'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, Typography, styled } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import CustomAvatar from 'src/@core/components/mui/avatar'
import moment from 'moment'

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

const initValues = {
    imageObject: null,
    camName: null,
    description: '',
    timestamp: null,
    location: null,
    imageResult: null,
}

const format_form = [
    {
        name: 'imageObject',
        label: 'Image',
        placeholder: 'Nhập Image',
        type: 'ImageObject',
        data: [],
        require: true,
        width: 12,
    },
    {
        name: 'description',
        label: 'Đối tượng',
        placeholder: 'Nhập tên đối tượng',
        type: 'TextField',
        data: [],
        require: true,
        width: 12,
    },
    {
        name: 'timestamp',
        label: 'Time ',
        placeholder: 'Nhập thời gian',
        type: 'TextField',
        data: [],
        require: true,
        width: 12,
    },
    {
        name: 'camName',
        label: 'Camera',
        placeholder: 'Nhập Camera',
        type: 'VAutocomplete',
        data: [],
        require: true,
        width: 12,
    },
    {
        name: 'location',
        label: 'Location',
        placeholder: 'Nhập vị trí',
        type: 'VAutocomplete',
        data: [],
        require: true,
        width: 12,
    },
    {
        name: 'imageResult',
        label: 'Ảnh toàn cảnh',
        placeholder: 'Nhập ảnh toán cảnh',
        type: 'ImageResult',
        data: [],
        require: true,
        width: 12,
    },
]

const View = ({ show, onClose, data, setReload }) => {
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState(null)
    const [form, setForm] = useState(format_form);

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {}
    }

    const {
        handleSubmit,
        control,
        setError,
        setValue,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: initValues
    });

    useEffect(() => {
        setDetail(data)
    }, [])


    useEffect(() => {
        if (detail) {
            setDetailFormValue()
        }
    }, [detail])

    const setDetailFormValue = () => {
        reset(detail);
    }

    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='lg'
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
                            Chi tiết sự kiện
                        </Typography>
                    </Box>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <Grid container spacing={2}>
                                    {form.map((item, index) => {
                                        if (item.type == 'ImageObject') {
                                            return (
                                                <Grid item xs={12} key={index}>
                                                    <Controller
                                                        name={item.name}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field: { value, onChange } }) => (
                                                            <Box>
                                                                <Typography sx={{ mb: 1 }}>Ảnh đối tượng</Typography>
                                                                <CustomAvatar
                                                                    src={value}
                                                                    variant='rounded'
                                                                    alt={''}
                                                                    sx={{ width: '100%', height: '100%', mb: 4 }}
                                                                />
                                                            </Box>
                                                        )}
                                                    />
                                                </Grid>
                                            )
                                        }
                                        if (item.type == 'TextField') {
                                            return (
                                                <Grid item xs={12} key={index}>
                                                    <Controller
                                                        name={item.name}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field: { value, onChange } }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                disabled={true}
                                                                value={item.name == 'timestamp' ? moment(new Date(value)).format('DD/MM/YYYY HH:mm:ss') : value}
                                                                label={item.label}
                                                                onChange={onChange}
                                                                placeholder={item.placeholder}
                                                                error={Boolean(errors[item.name])}
                                                                aria-describedby='validation-basic-last-name'
                                                                {...(errors[item.name] && { helperText: 'This field is required' })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            )
                                        }
                                        if (item.type == 'VAutocomplete') {
                                            return (
                                                <Grid item xs={12} key={index}>
                                                    <Controller
                                                        name={item.name}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field: { value, onChange } }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                disabled={true}
                                                                value={value}
                                                                label={item.label}
                                                                onChange={onChange}
                                                                placeholder={item.placeholder}
                                                                error={Boolean(errors[item.name])}
                                                                aria-describedby='validation-basic-last-name'
                                                                {...(errors[item.name] && { helperText: 'This field is required' })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            )
                                        }
                                    })}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Grid container spacing={0}>
                                    {form.map((item, index) => {
                                        if (item.type == 'ImageResult') {
                                            return (
                                                <Grid item xs={12} key={index}>
                                                    <Controller
                                                        name={item.name}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field: { value, onChange } }) => (
                                                            <Box>
                                                                <Typography sx={{ mb: 1 }}>Ảnh toàn cảnh</Typography>
                                                                <CustomAvatar
                                                                    src={value}
                                                                    variant='rounded'
                                                                    alt={''}
                                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            </Box>
                                                        )}
                                                    />
                                                </Grid>
                                            )
                                        }
                                    })}
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'flex-end',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button variant='contained' onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default View