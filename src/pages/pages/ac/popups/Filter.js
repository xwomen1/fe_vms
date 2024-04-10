import { useState, forwardRef, useEffect } from 'react'


// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Box, Button, Card, CardContent, CardHeader, Checkbox, Dialog, DialogActions, DialogContent, Fade, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, InputAdornment, MenuItem, Radio, RadioGroup, Switch, Typography, styled } from '@mui/material'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

import authConfig from 'src/configs/auth'
import axios from 'axios'

import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
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
const CustomInput = forwardRef(({ ...props }, ref) => {
    return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const Filter = ({ show, onClose, valueFilter, callback, direction }) => {
    const API_REGIONS = `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/`
    const ExpandIcon = direction === 'rtl' ? 'tabler:chevron-left' : 'tabler:chevron-right'


    const [doorList, setDoorList] = useState([])
    const [departmentList, setDepartmentList] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedGroups, setSelectedGroups] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
        }
    }

    const [state, setState] = useState({
        password: '',
        showPassword: false
    })

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues })

    const handleClickShowPassword = () => {
        setState({ ...state, showPassword: !state.showPassword })
    }

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

    const handleTreeSelect = (event, nodeIds) => {
        setSelectedItem(nodeIds);
    };

    const handleAutocompleteChange = (event, newValue) => {
        setSelectedItem(newValue ? [newValue] : []);
    };

    const onSubmit = (values) => {
        console.log('v', values);
        // callback()
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
                                <Controller
                                    name='groupId'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TreeView
                                            aria-label='Phòng ban'
                                            defaultExpandIcon={<Icon icon={ExpandIcon} />}
                                            defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                                            id='validation-basic-select'
                                            error={Boolean(errors.select)}
                                            {...(errors.select && { helperText: 'This field is required' })}
                                            value={value}
                                            onChange={(event, newValue) => onChange(newValue)}
                                        >
                                            <TreeItem nodeId='1' label='Applications'>
                                                <TreeItem nodeId='2' label='Calendar' />
                                                <TreeItem nodeId='3' label='Chrome' />
                                                <TreeItem nodeId='4' label='Webstorm' />
                                            </TreeItem>
                                            <TreeItem nodeId='5' label='Documents'>
                                                <TreeItem nodeId='10' label='OSS' />
                                                <TreeItem nodeId='6' label='MUI'>
                                                    <TreeItem nodeId='7' label='src'>
                                                        <TreeItem nodeId='8' label='index.js' />
                                                        <TreeItem nodeId='9' label='tree-view.js' />
                                                    </TreeItem>
                                                </TreeItem>
                                            </TreeItem>
                                        </TreeView>
                                    )}
                                />

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