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

const format_form = [
    {
        name: 'nameCalendar',
        label: 'Tên lịch',
        placeholder: 'Tên lịch',
        type: 'TextField',
        data: [],
        require: true,
        width: 6,
    },
    {
        name: 'groupName',
        label: 'Phòng ban',
        placeholder: 'Phòng ban',
        type: 'TextField',
        require: true,
        width: 6,
    },
    {
        name: 'doorInName',
        label: 'Cửa vào',
        placeholder: 'Cửa vào',
        type: 'TextField',
        require: true,
        width: 6,
    },
    {
        name: 'doorOutName',
        label: 'Cửa ra',
        placeholder: 'Cửa ra',
        type: 'TextField',
        require: true,
        width: 6,
    },
    {
        name: 'startDate',
        label: 'Ngày bắt đầu',
        placeholder: 'Ngày bắt đầu',
        type: 'TextField',
        data: [],
        require: false,
        width: 6,
    },
    {
        name: 'endDate',
        label: 'Ngày Kết thúc',
        placeholder: 'Ngày kết thúc',
        type: 'TextField',
        data: [],
        require: false,
        width: 6,
    },
    {
        name: 'calendarDays',
        label: '',
        placeholder: '',
        type: 'Schedule',
        data: [],
        require: false,
        width: 12,
    },
]

const View = ({ show, onClose, id, setReload, filter }) => {
    const [loading, setLoading] = useState(false)
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [detail, setDetail] = useState(null)
    const [dataDaily, setDataDaily] = useState([])
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)
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
        defaultValues
    });

    useEffect(() => {
        fetchDataList()
    }, [])

    useEffect(() => {
        if (detail) {
            setDetailFormValue()
        }
    }, [detail])



    const setDetailFormValue = () => {
        reset(detail);
    }

    const fetchDataList = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/`, config)
            const setData = res.data.data.rows.filter(x => x.id == id)
            setDetail(setData[0])
        } catch (error) {
            console.error('Error fetching data: ', error)
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCheckboxChange = (event) => {
        setIsCheckboxChecked(event.target.checked)
    }


    const ViewContent = () => {

        const transformCalendarDays = (calendarDays) => {
            return calendarDays.map((day) => {
                const { dayOfWeek, timePeriods } = day;
                const value = dataDailyDefault.find((item) => item.dayOfWeek === dayOfWeek)?.value || 1;

                return {
                    label: value === 1 ? '' : `Thứ ${value}`,
                    dayOfWeek,
                    value,
                    timePeriods,
                };
            });
        };

        useEffect(() => {
            if (detail && detail.calendarDays) {
                const transformedData = transformCalendarDays(detail.calendarDays);
                setDataDailyState(transformedData);
                setDataDaily(transformedData);
            }
        }, [detail]);

        return (
            <div>
                <div
                    style={{
                        color: '#333',
                        margin: '20px 0 20px 0',
                    }}
                >
                    <span>Bảng cấu hình thời gian</span>
                </div>

                <div
                    style={{
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            marginLeft: 50,
                            width: 'calc(100% - 150px)',
                            position: 'relative',
                            color: 'rgba(0, 0, 0, 0.6)',
                            fontSize: 14,
                            display: 'flex',
                        }}
                    >
                        {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((time, index) => (
                            <div
                                key={index.toString()}
                                style={{
                                    width: `${100 / 6}%`,
                                    textAlign: 'center',
                                    padding: '8px 0',
                                }}
                            >
                                {time}
                            </div>
                        ))}
                        <div
                            style={{
                                position: 'absolute',
                                right: -70,
                                textAlign: 'center',
                                padding: '8px 0',
                            }}
                        >
                            24:00
                        </div>
                    </div>

                    <Daily
                        callbackOfDaily={(v) => {
                            setDataDaily(v);
                            setDataDailyState(v);
                        }}
                        dataDailyProps={dataDailyState}
                    />
                </div>
            </div>
        );

    };

    return (
        <Card>
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
                    <form>
                        <Grid container spacing={3}>
                            {form.map((item, index) => {
                                if (item.type == 'TextField') {
                                    return (
                                        <Grid item xs={12} sm={4} key={index}>
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
                                                        {...(errors[item.name] && { helperText: 'Trường này bắt buộc' })}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    )
                                }
                                if (item.type == 'Schedule') {
                                    return (
                                        <Grid item xs={12} key={index}>
                                            <span style={{ color: "#f5963a", fontSize: 20, position: 'relative' }}>
                                                Cấu hình thời gian hoạt động
                                                <span style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    bottom: -10,
                                                    display: 'inline-block',
                                                    content: '',
                                                    width: '100%',
                                                    height: '5px',
                                                    background: '#7ebbfc',
                                                    borderRadius: 25
                                                }} />
                                            </span>
                                            {ViewContent()}
                                        </Grid>
                                    )
                                }

                            })}
                            <Grid item xs={12}>

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
                    <Button variant='contained' onClick={onClose}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default View