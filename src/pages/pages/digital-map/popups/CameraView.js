import { forwardRef, useEffect, useState } from "react"
import Icon from 'src/@core/components/icon'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, Tab, Typography, styled } from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import CustomTextField from "src/@core/components/mui/text-field"
import LiveView from "./LiveView"
import { Controller, useForm } from "react-hook-form"

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

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

const defaultValues = {
    rotation: '',
    cameraAngle: '',
    range: ''
}

const format_form = [
    {
        name: 'rotation',
        label: 'Góc quay',
        placeholder: 'Góc quay',
        type: 'TextField',
        require: true,
        width: 12
    },
    {
        name: 'cameraAngle',
        label: 'Góc camera',
        placeholder: 'Góc camera',
        type: 'TextField',
        require: true,
        width: 12
    },
    {
        name: 'range',
        label: 'Tầm xa',
        placeholder: 'Tầm xa',
        type: 'TextField',
        require: true,
        width: 12
    },
]

const CameraView = ({ show, onClose, data, callback }) => {
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState('1')
    const [form, setForm] = useState(format_form)
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })

    const {
        handleSubmit,
        control,
        setError,
        reset,
        clearErrors,
        formState: { errors }
    } = useForm({
        defaultValues
    })

    useEffect(() => {
        setCamera({ id: data?.id, name: data?.text, channel: 'Sub' })
    }, [data])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const onSubmit = values => {
        callback(values)
        onClose()
    }

    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='xs'
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
                            {data?.text}
                        </Typography>
                    </Box>
                    <Grid container spacing={0} style={{ marginTop: 10 }}>
                        <TabContext value={value}>
                            <Grid item xs={12}>
                                {' '}
                                <TabList onChange={handleChange} aria-label='customized tabs example'>
                                    <Tab value='1' label='Xem trực tiếp' key={1} />
                                    <Tab value='2' label='Góc quay camera' key={2} />
                                </TabList>
                            </Grid>
                            <Grid item xs={12}>
                                <TabPanel value='1'>
                                    <LiveView key={camera?.id} id={camera?.id} name={camera?.name} channel={camera?.channel} />
                                </TabPanel>
                                <TabPanel value='2'>
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
                                    </Grid>
                                </TabPanel>
                            </Grid>
                        </TabContext>
                    </Grid>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'right',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    {value === '2' &&
                        <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
                            Lưu
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default CameraView