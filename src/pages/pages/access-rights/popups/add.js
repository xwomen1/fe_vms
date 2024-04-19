import { useState, forwardRef, useEffect } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { Box, Button, Card, Checkbox, Dialog, DialogActions, DialogContent, Fade, FormControlLabel, Grid, IconButton, MenuItem, Typography, styled } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Daily from '../mocdata/daily'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

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

const dataDailyDefault = [
    {
        label: '',
        value: 1,
    },
    {
        label: 'Thứ 2',
        dayOfWeek: 'MONDAY',
        value: 2,
    },
    {
        label: 'Thứ 3',
        dayOfWeek: 'TUESDAY',
        value: 3,
    },
    {
        label: 'Thứ 4',
        dayOfWeek: 'WEDNESDAY',
        value: 4,
    },
    {
        label: 'Thứ 5',
        dayOfWeek: 'THURSDAY',
        value: 5,
    },
    {
        label: 'Thứ 6',
        dayOfWeek: 'FRIDAY',
        value: 6,
    },
    {
        label: 'Thứ 7',
        dayOfWeek: 'SATURDAY',
        value: 7,
    },
    {
        label: 'CN',
        dayOfWeek: 'SUNDAY',
        value: 8,
    },
]

const defaultValues = {
    groupId: null,
    doorInId: null,
    doorOutId: null,
    nameCalendar: null,
    startDate: null,
    endDate: null,
    calendarDays: []
}

const Add = ({ show, onClose, id, setReload, filter }) => {
    const [loading, setLoading] = useState(false)
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [doorList, setDoorList] = useState([])
    const [groupName, setGroupName] = useState([])
    const [dataDaily, setDataDaily] = useState([])
    const [userGroupId, setUserGroupId] = useState(null)
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)
    const API_REGIONS = `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/`

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
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
        defaultValues
    });

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
            setGroupName(res.data.data);
        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    }

    useEffect(() => {
        fetchDoorList()
        fetchDepartment()
    }, [])

    const handleCheckboxChange = (event) => {
        setIsCheckboxChecked(event.target.checked)
    }

    const onSubmit = (values) => {

        if (values.calendarDays && Array.isArray(values.calendarDays)) {
            const validCalendarDays = values.calendarDays
                .filter((day) => day.dayOfWeek && day.timePeriods && Array.isArray(day.timePeriods))
                .map((day) => {
                    return {
                        dayOfWeek: day.dayOfWeek,
                        timePeriods: day.timePeriods.map((timePeriod) => {
                            return {
                                endTimeInMinute: timePeriod.endTimeInMinute,
                                startTimeInMinute: timePeriod.startTimeInMinute,
                            };
                        }),
                    };
                });
            values.calendarDays = validCalendarDays;
        } else {
            values.calendarDays = [];
        };

        values['startDate'] = format(start, 'yyyy-MM-dd')
        values['endDate'] = format(end, 'yyyy-MM-dd')

        handleAddSchedule(values)
    }

    const handleAddSchedule = (values) => {
        setLoading(true)

        const params = {
            name: values?.nameCalendar,
            description: values?.nameCalendar,
            listHoliday: [],
            scheduleWeeklyRequest: values.calendarDays.map(day => {
                return {
                    dayOfWeek: day.dayOfWeek,
                    times: day.timePeriods.map(period => {
                        return {
                            endTimeInMinute: period.endTimeInMinute,
                            startTimeInMinute: period.startTimeInMinute,
                        }
                    })
                }
            }),
        }

        axios.post(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/schedules`, { ...params }, config)
            .then((res) => {
                const scheduleId = res.data.data.id
                const doorId = values.doorInId
                handleAddDoorAccesses(values, scheduleId, doorId)
            }).catch((err) => {
                console.error('Error fetching data: ', err)
                toast.error(err)
            }).finally(
                setLoading(false)
            )
    }

    const handleAddDoorAccesses = (values, scheduleId, doorId) => {

        const params = {
            name: values?.nameCalendar,
            description: values?.nameCalendar,
            policies: [
                {
                    applyMode: 'CUSTOMIZE',
                    doorId: doorId,
                    scheduleId: scheduleId !== null ? scheduleId : undefined,
                }
            ]
        }


        axios.post(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-accesses`, { ...params }, config)
            .then((res) => {
                const doorAccessId = res.data.data.id
                handleAddSAccessGroup(values, doorAccessId)
            })
            .catch((err) => {
                console.error('Error fetching data: ', err)
                toast.error(err)
                setLoading(false)
            })
    }

    const handleAddSAccessGroup = (values, doorAccessId) => {
        setLoading(true)

        const params = {
            name: values?.nameCalendar,
            description: values?.nameCalendar,
            doorAccessIds: [doorAccessId],
            userGroupId: values?.groupId
        }

        axios.post(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/access-groups`, { ...params }, config)
            .then(() => {
                setLoading(false)
                handleAdd(values)
            })
            .catch((err) => {
                console.error('Error fetching data: ', err)
                toast.error(err)
                setLoading(false)
            });
    };

    const handleAdd = (values) => {
        const params = {
            ...values
        }

        setLoading(true)
        axios.post(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/create`, { ...params }, config)
            .then(() => {
                toast.success('Thêm mới thành công')
                setReload()
                onClose()
            })
            .catch((err) => {
                console.error('Error fetching data: ', err)
                toast.error(err)
            })
            .finally(() => {
                setLoading(false)
            });
    }

    return (
        <Card>
            <form>
                <Dialog
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
                                Cấu hình lịch
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <Controller
                                    name='nameCalendar'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={value}
                                            label='Tên Lịch'
                                            onChange={onChange}
                                            placeholder='Tên lịch'
                                            error={Boolean(errors.nameCalendar)}
                                            aria-describedby='validation-basic-last-name'
                                            {...(errors.nameCalendar && { helperText: 'Trường này bắt buộc' })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controller
                                    name='groupId'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            select
                                            fullWidth
                                            label='Phòng ban'
                                            SelectProps={{
                                                value: value,
                                                onChange: e => onChange(e)
                                            }}
                                            id='validation-basic-select'
                                            error={Boolean(errors.groupId)}
                                            aria-describedby='validation-basic-select'
                                            {...(errors.groupId && { helperText: 'Trường này bắt buộc' })}
                                        >
                                            {groupName.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controller
                                    name='doorInId'
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
                                            error={Boolean(errors.doorInId)}
                                            aria-describedby='validation-basic-select'
                                            {...(errors.doorOutId && { helperText: 'Trường này bắt buộc' })}
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
                            <Grid item xs={4}>
                                <Controller
                                    name='doorOutId'
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
                                            error={Boolean(errors.doorOutId)}
                                            aria-describedby='validation-basic-select'
                                            {...(errors.doorOutId && { helperText: 'Trường này bắt buộc' })}
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
                            <Grid item xs={3}>
                                <DatePicker
                                    selected={start}
                                    id='basic-input'
                                    onChange={date => setStart(date)}
                                    placeholderText='Ngày bắt đầu'
                                    customInput={<CustomInput label='Ngày bắt đầu' />}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <DatePicker
                                    selected={end}
                                    id='basic-input'
                                    onChange={date => setEnd(date)}
                                    placeholderText='Ngày kết thúc'
                                    customInput={<CustomInput label='Ngày kết thúc' />}
                                    minDate={start}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <FormControlLabel
                                    control={<Checkbox onChange={handleCheckboxChange} />}
                                    label="Tuần"
                                    style={{ marginTop: '30px', marginLeft: '20px' }}
                                />
                            </Grid>
                            <Grid item>Bảng cấu hình thời gian</Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name='calendarDays'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Daily
                                            callbackOfDaily={(v) => {
                                                onChange(v)
                                                setDataDaily(v)
                                                setDataDailyState(v)
                                            }}
                                            dataDailyProps={dataDailyState}
                                            disabled={!isCheckboxChecked} // Truyền giá trị disabled từ checkbox vào Daily
                                            error={Boolean(errors.calendarDays)}
                                            aria-describedby='validation-basic-last-name'
                                            {...(errors.calendarDays && { helperText: 'Trường này bắt buộc' })}
                                        />
                                    )}
                                />
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
                        <Button variant='tonal' color='secondary' onClick={onClose}>
                            Hủy
                        </Button>
                        <Button variant='contained' onClick={handleSubmit(onSubmit)}>
                            Thêm
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </Card>
    )
}

export default Add