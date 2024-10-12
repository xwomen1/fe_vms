import React, { forwardRef, useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
    Autocomplete,
    Box,
    Button,
    Card,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Fade,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    styled,
} from '@mui/material'
import Icon from 'src/@core/components/icon'

import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import ReactMapGL, { Marker } from '@goongmaps/goong-map-react'
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

const CustomMapPin = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
        viewBox='0 0 24 24'
        stroke='orange'
        fill='orange'
        className='icon icon-tabler icons-tabler-filled icon-tabler-map-pin'
    >
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <path d='M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z' />
    </svg>
)

const initValues = {
    name: '',
    username: '',
    password: '',
    ipAddress: '',
    httpPort: '',
    latitude: '',
    longitude: '',
    isOfflineSetting: false,
    streams: [],
};

const format_form = [
    {
        name: 'name',
        label: 'Device Name',
        placeholder: 'Device Name',
        type: 'TextField',
        data: [],
        require: true,
        width: 4,
    },
    {
        name: 'username',
        label: 'Username',
        placeholder: 'Username',
        type: 'TextField',
        data: [],
        require: true,
        width: 4,
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Password',
        type: 'TextField',
        data: [],
        require: true,
        width: 4,
    },
    {
        name: 'ipAddress',
        label: 'IP Address',
        placeholder: 'IP Address',
        type: 'TextField',
        data: [],
        require: false,
        width: 4,
    },
    {
        name: 'httpPort',
        label: 'Http Port',
        placeholder: 'Http Port',
        type: 'TextField',
        data: [],
        require: false,
        width: 2,
    },
    {
        name: 'onvifPort',
        label: 'Onvif Port',
        placeholder: 'Onvif Port',
        type: 'TextField',
        data: [],
        require: false,
        width: 2,
    },

    // {
    //     name: 'cameraGroup',
    //     label: 'Nhóm cam',
    //     placeholder: 'Nhóm cam',
    //     type: 'VAutocomplete',
    //     data: [],
    //     option: {
    //         key: 'id',
    //         value: 'name',
    //     },
    //     require: false,
    //     width: 4,
    // },

    {
        name: 'protocol',
        label: 'Protocols',
        placeholder: 'Protocols',
        type: 'VAutocomplete',
        data: [],
        option: {
            key: 'id',
            value: 'name',
        },
        require: true,
        width: 4,
    },
    {
        name: 'siteInfo',
        label: 'Region',
        placeholder: 'Region',
        type: 'VAutocomplete',
        data: [],
        option: {
            key: 'id',
            value: 'name',
        },
        require: true,
        width: 4,
    },
    {
        name: 'box',
        label: 'NVR/AI BOX',
        placeholder: 'NVR/AI Box',
        type: 'VAutocomplete',
        data: [],
        option: {
            key: 'id',
            value: 'name',
        },
        require: false,
        width: 4,
    },
    {
        name: 'latitude',
        label: 'latitude',
        placeholder: 'latitude',
        type: 'TextField',
        data: [],
        require: false,
        width: 4,
    },
    {
        name: 'longitude',
        label: 'longitude',
        placeholder: 'longitude',
        type: 'TextField',
        data: [],
        require: false,
        width: 4,
    },
    {
        name: 'isOfflineSetting',
        label: 'Thiết bị dang ngoại tuyến',
        type: 'Checkbox',
        default: false,
        data: [],
        require: false,
        width: 12,
    }
];

const AddDevice = ({ show, setReload, onClose, camera }) => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName);

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState(format_form)
    const [cameraGroup, setCameraGroup] = useState([])
    const [cameraGroupSelect, setCameraGroupSelect] = useState({ label: '', value: '' })
    const [regionsSelect, setRegionsSelect] = useState('')
    const [regions, setRegions] = useState([])
    const [box, setBox] = useState([])
    const [isOfflineSetting, setIsOfflineSetting] = useState(true)

    const [protocols, setProtocols] = useState([])

    const [rows, setRows] = useState([])
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)

    const GOONG_MAP_KEY = 'MaRpQPZORjHfEMC3tpTGCLlPqo5qXDkzvcemJZWO'

    const [viewport, setViewport] = React.useState({
        longitude: 105.83416,
        latitude: 21.027763,
        zoom: 14
    })

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
    })

    const handleMapClick = location => {
        const clickedLat = location.lngLat[1]
        const clickedLng = location.lngLat[0]
        setLat(clickedLat)
        setLng(clickedLng)
    }

    const handleComboBoxFocus = () => {
        fetchCameraGroup()
    }

    const handleComboBoxFocusRegions = () => {
        if (regions.length === 0) {
            fetchRegions()
        }
    }

    const handleComboBoxFocusBox = () => {
        if (box.length === 0) {
            fetchNvrAIBox()
        }
    }

    const handleComboBoxFocusProtocol = () => {
        if (protocols.length === 0) {
            fetchProtocol()
        }
    }

    const fetchCameraGroup = async () => {
        try {
            setLoading(true)

            const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups', config)

            const cameraGroup = response.data.map(item => ({
                id: item.id,
                name: item.name,
                label: item.name,
                value: item.name
            }))
            setCameraGroup(cameraGroup)
            if (cameraGroup.length > 0) {
                setCameraGroupSelect(cameraGroup[0].value)
            }
        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchNvrAIBox = async () => {
        try {
            setLoading(true)

            const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/device', config)

            const boxes = response.data.map(item => ({
                label: item.nameDevice,
                value: item.id
            }))
            setBox(boxes)

        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchRegions = async () => {
        try {
            setLoading(true)

            const response = await axios.get(
                'https://dev-ivi.basesystem.one/smc/infrares/api/v0/regions?limit=25&page=1&parentID=abbe3f3c-963b-4d23-a766-42a8261607c3',
                config
            )

            const nicTypes = response.data.map(item => ({
                id: item.id,
                name: item.name,
                label: item.name,
                value: item.value
            }))
            setRegions(nicTypes)
            if (nicTypes.length > 0) {
                setRegionsSelect(nicTypes[0].value)
            }
        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchProtocol = async () => {
        try {
            setLoading(true)

            const response = await axios.get(
                'https://sbs.basesystem.one/ivis/vms/api/v0/cameras/options/protocol-types',
                config
            )

            const protocols = response.data.map(item => ({
                id: item.id,
                name: item.name,
                label: item.name,
                value: item.id
            }))

            setProtocols(protocols)
        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCameraGroupChange = (event, newValue) => {
        setCameraGroupSelect({ label: newValue?.label, value: newValue?.name })
    }

    const handleRegionsChange = (event, newValue) => {
        setRegionsSelect(newValue)
    }

    const handleProtocolChange = (event, newValue) => {
        setSelectedProtocol(newValue)
    }

    const handleAddRow = () => {
        const newRow = { name: '', isProxied: false, url: '', type: '' } // Ensure isProxied is a boolean
        setRows([...rows, newRow])
    }

    const handleChannelNameChange = (index, event) => {
        const newRows = [...rows]
        newRows[index].name = event.target.value
        setRows(newRows)
    }

    const handleChannelUrlChange = (index, event) => {
        const newRows = [...rows]
        newRows[index].url = event.target.value
        setRows(newRows)
    }

    const handleProxiedChange = (index, event) => {
        const newRows = [...rows]
        newRows[index].isProxied = event.target.checked
        setRows(newRows)
    }

    const handleStreamTypeChange = (index, event) => {
        const newRows = [...rows]
        newRows[index].type = event.target.value
        setRows(newRows)
    }

    const handleDeleteRow = index => {
        const updatedRows = [...rows]
        updatedRows.splice(index, 1)
        setRows(updatedRows)
    }

    const handleCheckboxChange = () => {
        setIsOfflineSetting(isOfflineSetting === true ? false : true)
    }


    const onSubmit = values => {
        const detail = {
            name: values?.name,
            username: values?.username,
            password: values?.password,
            ipAddress: values?.ipAddress,
            httpPort: values?.httpPort,
            onvifPort: values?.onvifPort,
            protocol: values?.protocol?.name,
            latitude: lat?.toString(),
            longitude: lng?.toString(),
            isOfflineSetting: isOfflineSetting,
            siteInfo: {
                id: values?.siteInfo?.id,
                name: values?.siteInfo?.name
            },
            box: {
                id: values?.box?.value,
            },
            streams: [...rows]
        }

        handleAdd(detail)
    }

    const handleAdd = (values) => {
        setLoading(true)

        const params = {
            ...values
        }

        axios.post(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs`, params, config)
            .then((res) => {
                toast.success(res.message)
            })
            .catch((error) => {
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
                onClose()
                setReload()
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
                    <Box sx={{ mb: 5, textAlign: 'left' }}>
                        <Typography variant='h3' sx={{ mb: 3 }}>
                            Add a device
                        </Typography>
                    </Box>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    {form.map((item, index) => {
                                        if (item.type == 'TextField') {
                                            if (item?.name === 'latitude') {
                                                return (
                                                    <Grid item xs={item.width} key={index}>
                                                        <CustomTextField label='Latitude' type='text' disabled value={lat || ''} fullWidth />
                                                    </Grid>
                                                )
                                            }
                                            if (item?.name === 'longitude') {
                                                return (
                                                    <Grid item xs={item.width} key={index}>
                                                        <CustomTextField label='Longitude' type='text' disabled value={lng || ''} fullWidth />
                                                    </Grid>
                                                )
                                            }

                                            return (
                                                <Grid item xs={item.width} key={index}>
                                                    <Controller
                                                        name={item.name}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field: { value, onChange } }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                value={value}
                                                                type={item?.name === 'password' ? 'password' : ''}
                                                                label={item.label}
                                                                onChange={e => onChange(e.target.value)}
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
                                        if (item.type === 'VAutocomplete') {
                                            return (
                                                <Grid item xs={item.width} key={index}>
                                                    <Controller
                                                        name={item.name}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field: { value, onChange } }) => {
                                                            switch (item.name) {
                                                                case 'cameraGroup':
                                                                    return (
                                                                        <Autocomplete
                                                                            value={value || null}
                                                                            onChange={(event, newValue) => onChange(newValue)}
                                                                            options={cameraGroup}
                                                                            getOptionLabel={(option) => option.label}
                                                                            renderInput={(params) => (
                                                                                <CustomTextField {...params} label={item?.label} fullWidth />
                                                                            )}
                                                                            onFocus={handleComboBoxFocus}
                                                                        />
                                                                    );
                                                                case 'protocol':
                                                                    return (
                                                                        <Autocomplete
                                                                            value={value || ''}
                                                                            onChange={(event, newValue) => onChange(newValue)}
                                                                            options={protocols}
                                                                            getOptionLabel={(option) => option.label || ''}
                                                                            renderInput={(params) => (
                                                                                <CustomTextField {...params} label={item?.label} fullWidth />
                                                                            )}
                                                                            onFocus={handleComboBoxFocusProtocol}
                                                                        />
                                                                    );
                                                                case 'siteInfo':
                                                                    return (
                                                                        <Autocomplete
                                                                            value={value || null}
                                                                            onChange={(event, newValue) => onChange(newValue)}
                                                                            options={regions}
                                                                            getOptionLabel={(option) => option.label || ''}
                                                                            renderInput={(params) => <CustomTextField {...params} label={item?.label} fullWidth />}
                                                                            onFocus={handleComboBoxFocusRegions}
                                                                        />
                                                                    )
                                                                case 'box':
                                                                    return (
                                                                        <Autocomplete
                                                                            value={value || null}
                                                                            onChange={(event, newValue) => onChange(newValue)}
                                                                            options={box}
                                                                            getOptionLabel={(option) => option.label || ''}
                                                                            renderInput={(params) => <CustomTextField {...params} label={item?.label} fullWidth />}
                                                                            onFocus={handleComboBoxFocusBox}
                                                                        />
                                                                    )
                                                                default:
                                                                    return null;
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            );
                                        }
                                        if (item.type === 'Checkbox') {
                                            return (
                                                <Grid item xs={item.width} key={index}>
                                                    <Checkbox checked={isOfflineSetting} onChange={e => {
                                                        handleCheckboxChange(e.target.checked)
                                                    }} />
                                                    The device is offline
                                                </Grid>
                                            );
                                        }

                                    })}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: 5 }}>
                                {viewport && (
                                    <Grid item xs={12}>
                                        <ReactMapGL
                                            {...viewport}
                                            width='100%'
                                            height='30vh'
                                            onViewportChange={setViewport}
                                            goongApiAccessToken={GOONG_MAP_KEY}
                                            onClick={handleMapClick}
                                        >
                                            {lat && lng && (
                                                <Marker latitude={parseFloat(lat)} longitude={parseFloat(lng)} offsetLeft={-20} offsetTop={-20}>
                                                    <div>
                                                        <CustomMapPin />{' '}
                                                    </div>
                                                </Marker>
                                            )}
                                        </ReactMapGL>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: 5 }}>
                                <Typography variant='h5'>Channel</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Channel Name</TableCell>
                                                <TableCell>Proxied</TableCell>
                                                <TableCell align='right'>Channel URL </TableCell>
                                                <TableCell align='right'>StreamType </TableCell>

                                                <TableCell align='center'>
                                                    <IconButton size='small' onClick={handleAddRow}>
                                                        <Icon icon='tabler:plus' />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows &&
                                                rows.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <CustomTextField
                                                                type='text'
                                                                value={row.name}
                                                                onChange={event => handleChannelNameChange(index, event)}
                                                                fullWidth
                                                            />{' '}
                                                        </TableCell>
                                                        <TableCell>
                                                            {' '}
                                                            <Checkbox checked={row.isProxied} onChange={event => handleProxiedChange(index, event)} />
                                                        </TableCell>
                                                        <TableCell align='right'>
                                                            <CustomTextField
                                                                type='text'
                                                                value={row.url}
                                                                onChange={event => handleChannelUrlChange(index, event)}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell align='right'>
                                                            <CustomTextField
                                                                type='text'
                                                                value={row.type}
                                                                onChange={event => handleStreamTypeChange(index, event)}
                                                                fullWidth
                                                            />
                                                        </TableCell>

                                                        <TableCell align='center'>
                                                            <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                                                                <Icon icon='bi:trash' />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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
                    <Button variant='tonal' color='secondary' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant='contained' onClick={handleSubmit(onSubmit)}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Card >
    )
}

export default AddDevice
