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
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { FileUploader } from 'devextreme-react'

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
        name: 'name',
        label: 'Name Digital Map',
        placeholder: 'Name digital map',
        type: 'TextField',
        require: true,
        width: 6
    },
    {
        name: 'areaId',
        label: 'Area Name',
        placeholder: 'Enter Model AI Name',
        type: 'Autocomplete',
        data: [
        ],
        require: true,
        width: 6
    },
]

const AddMap = ({ show, onClose, setReload, data, id, typePopup }) => {
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState(null)
    const [form, setForm] = useState(format_form)
    const [area, setArea] = useState([])


    const [fileUploadDataName, setFileUploadDataName] = useState()
    const [fileUploadDataId, setFileUploadDataId] = useState()

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

    const onReset = values => {
        var detail = {}
        callback(detail)
        onClose()
    }

    const handleUploadFileData = async e => {
        setLoading(true)
        const formData = new FormData()
        formData.append('file', e.value[0])
        formData.append('isPublic', true)
        formData.append('service', 'CMS')
        try {
            await callApiWithConfig(
                `https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/upload`,
                METHODS.POST,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then(res => {
                setFileUploadDataName(e.value[0].name)
                setFileUploadDataId(res.data.id)
                setLoading(false)
            })
        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }

            return null
        } finally {
            setLoading(false)
        }
    }


    const onSubmit = values => {

        // Tạo đối tượng detail để gửi đi
        const detail = {
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

        // setLoading(true)
        // axios
        //   .post(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai`, { ...params }, config)
        //   .then(() => {
        //     toast.success('Add New Successfully')
        //     setReload()
        //     onClose()
        //   })
        //   .catch(error => {
        //     if (error && error?.response?.data) {
        //       console.error('error', error)
        //       toast.error(error?.response?.data?.message)
        //     } else {
        //       console.error('Error fetching data:', error)
        //       toast.error(error)
        //     }
        //   })
        //   .finally(() => {
        //     setLoading(false)
        //   })
    }

    const handleUpdate = values => {
        const params = {
            ...values
        }

        // setLoading(true)
        // axios
        //   .put(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai/${data.id}`, { ...params }, config)
        //   .then(() => {
        //     toast.success('Data saved successfully')
        //     setReload()
        //     onClose()
        //   })
        //   .catch(error => {
        //     if (error && error?.response?.data) {
        //       console.error('error', error)
        //       toast.error(error?.response?.data?.message)
        //     } else {
        //       console.error('Error fetching data:', error)
        //       toast.error(error)
        //     }
        //   })
        //   .finally(() => {
        //     setLoading(false)
        //   })
    }

    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                TransitionComponent={Transition}
                onClose={onClose}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <DialogContent
                    sx={{
                        px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(10)} !important`],
                        py: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`]
                    }}
                >
                    <CustomCloseButton onClick={onClose}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                    </CustomCloseButton>
                    <Box sx={{ mb: 8, textAlign: 'left' }}>
                        <Typography variant='h5' sx={{ mb: 3 }}>
                            Digital Map
                        </Typography>
                    </Box>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} container spacing={2}>
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
                                    if (item.type === 'Autocomplete') {
                                        return (
                                            <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Controller
                                                    name={item.name}
                                                    control={control}
                                                    rules={{ required: item.require }}
                                                    render={({ field: { value, onChange } }) => (
                                                        <CustomAutocomplete
                                                            sx={{ width: 300 }}
                                                            value={value}
                                                            onChange={(event, selectedItem) => {
                                                                onChange(selectedItem)
                                                            }}
                                                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                                            options={item.data}
                                                            id='autocomplete-custom'
                                                            getOptionLabel={option => option.name || option || ''}
                                                            renderInput={params => <CustomTextField {...params} label={item.label} />}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        )
                                    }
                                })}
                            </Grid>

                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={12} sx={{ marginBottom: -1 }}>
                                    Image Of Digital Map
                                </Grid>
                                <Grid item xs={12}>
                                    {fileUploadDataName && (
                                        <div>
                                            <div
                                                style={{
                                                    width: '100%',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    padding: '10px 5px'
                                                }}
                                            >
                                                <Typography>
                                                    {' '}
                                                    {fileUploadDataName}
                                                    <IconButton
                                                        style={{ float: 'right' }}
                                                        size='small'
                                                        onClick={() => {
                                                            setFileUploadDataName(null)
                                                            setFileUploadDataId(null)
                                                        }}
                                                    >
                                                        <Icon icon='tabler:trash-x-filled' />
                                                    </IconButton>
                                                </Typography>
                                            </div>
                                            <Button variant='contained' sx={{ float: 'right', marginTop: 2 }}>
                                                <a
                                                    href={`https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/public/download/${fileUploadDataId}`}
                                                    target='_blank'
                                                    download
                                                    style={{ color: 'white', textDecoration: 'none' }}
                                                >
                                                    download
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                    {!fileUploadDataName && (
                                        <div
                                            style={{
                                                borderStyle: 'dashed',
                                                borderWidth: 2,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '100px'
                                            }}
                                        >
                                            <FileUploader
                                                multiple={false}
                                                control={control}
                                                name='fileId'
                                                accept='*'
                                                uploadMode='useForm'
                                                selectButtonText='Drop files here or click to upload.'
                                                onValueChanged={e => handleUploadFileData(e)}
                                                labelText=''
                                            />
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions
                    sx={{

                    }}
                >
                    <Button
                        variant={'tonal'}
                        color={'secondary'}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default AddMap
