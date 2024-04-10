import { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, MenuItem, Typography, styled } from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { TreeItem, TreeView } from '@mui/lab'

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

const defaultValues = {
    groupId: null,
    doorIn: null,
    doorOut: null
}

const Filter = ({ show, onClose, valueFilter, callback, direction }) => {
    const API_REGIONS = `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/`
    const ExpandIcon = direction === 'rtl' ? 'tabler:chevron-left' : 'tabler:chevron-right'
    const [doorList, setDoorList] = useState([])
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
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues })

    const fetchDoorList = async () => {
        try {
            const res = await axios.get(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors
            `, config)
            setDoorList(res.data.data.rows);
        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    }
    const fetchDepartment = async () => {
        try {
            const res = await axios.get(`${API_REGIONS}/?parentId=342e46d6-abbb-4941-909e-3309e7487304`, config)
            setDepartmentList(res.data.data);
        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    }

    useEffect(() => {
        fetchDoorList()
        fetchDepartment()
    }, [])

    const onSubmit = (values) => {
        console.log('v', values);
        toast.success('Form Submitted')
        onClose()
    }

    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                onClose={() => setShow(false)}
                TransitionComponent={Transition}
                onBackdropClick={() => setShow(false)}
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
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name='doorIn'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            select
                                            fullWidth
                                            defaultValue=''
                                            label='Cửa vào'
                                            SelectProps={{
                                                value: value,
                                                onChange: e => onChange(e)
                                            }}
                                            id='validation-basic-select'
                                            error={Boolean(errors.select)}
                                            aria-describedby='validation-basic-select'
                                            {...(errors.select && { helperText: 'This field is required' })}
                                        >
                                            {doorList.map((door) => (
                                                <MenuItem key={door.id} value={door.id}>
                                                    {door.name}
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Controller
                                    name='doorOut'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            select
                                            fullWidth
                                            defaultValue=''
                                            label='Cửa ra'
                                            SelectProps={{
                                                value: value,
                                                onChange: e => onChange(e)
                                            }}
                                            id='validation-basic-select'
                                            error={Boolean(errors.select)}
                                            aria-describedby='validation-basic-select'
                                            {...(errors.select && { helperText: 'This field is required' })}
                                        >
                                            {doorList.map((door) => (
                                                <MenuItem key={door.id} value={door.id}>
                                                    {door.name}
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DialogActions
                                    sx={{
                                        justifyContent: 'center',
                                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                                    }}
                                >
                                    <Button type='submit' variant='contained'>
                                        Lọc
                                    </Button>
                                    <Button variant='tonal' color='secondary' onClick={onClose}>
                                        Hủy
                                    </Button>
                                </DialogActions>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default Filter