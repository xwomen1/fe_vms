import {
    Autocomplete, Box, Button, Card, CardContent, CardHeader,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel, FormLabel, Grid, IconButton, Paper,
    Radio, RadioGroup, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from "@mui/material"
import Link from "next/link"
import { forwardRef, useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
import CustomTextField from "src/@core/components/mui/text-field"
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import toast from "react-hot-toast"
import CustomAutocomplete from "src/@core/components/mui/autocomplete"
import DayOfWeek from "./popups/dayOfWeek"
import {
    add,
    eachDayOfInterval,
    format,
    isAfter,
    startOfDay,
} from 'date-fns';
import { uniq } from 'lodash';
import { callApiWithConfig, getApi, METHODS, postApi } from "src/@core/utils/requestUltils"
import { FileUploader } from "devextreme-react"
import AddGuest from "./popups/addGuest"
import EditGuest from "./popups/editGuest"
import ImportGuest from "./popups/importGuest"
import Swal from "sweetalert2"
import { useRouter } from "next/router"

const CustomInput = forwardRef(({ ...props }, ref) => {
    return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd');

const Register = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [repeatType, setRepeatType] = useState('ONCE')
    const [dayOfWeeks, setDayOfWeeks] = useState([])
    const [time, setTime] = useState([8, 20])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(null)
    const [unitGroup, setUnitGroup] = useState([])
    const [areaGroup, setAreaGroup] = useState([])
    const [guests, setGuests] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [users, setUsers] = useState([])
    const [approvers, setApprovers] = useState([])
    const [approvalPersons, setApprovalPersons] = useState([])

    const [fileUploadDataName, setFileUploadDataName] = useState();
    const [fileUploadDataId, setFileUploadDataId] = useState();

    const [isOpenAddGuest, setIsOpenAddGuest] = useState(false)
    const [isOpenEditGuest, setIsOpenEditGuest] = useState(false)
    const [guestEdit, setGuestEdit] = useState(null)
    const [rowDel, setRowDel] = useState({ index: null, row: null, type: null })
    const [isOpenImportGuest, setIsOpenImportGuest] = useState(false)

    const [isOpenDel, setIsOpenDel] = useState(false)
    const [isDelGuest, setIsDelGuest] = useState(false)

    const defaultValues = {
        repeatType: 'ONCE',
        dayOfWeeks: [],
        area: null,
        block: null,
        floor: null,
        company: null,
        startDate: new Date(),
        endDate: null,
        group: null,
        groupId: null,
        areaId: null,
        note: null,
        documentReference: null,
        guests: [],
        vehicles: [],
        approvalPersons: [],
    }

    const timeRange = [0, 4, 8, 12, 16, 20, 24].map((t) => ({
        label: `${t}h`,
        value: t
    }))

    const WEEKDAYS = [
        { label: 'Mon', value: 'MONDAY', id: 1, },
        { label: 'Tues', value: 'TUESDAY', id: 2, },
        { label: 'Web', value: 'WEDNESDAY', id: 3, },
        { label: 'Thurs', value: 'THURSDAY', id: 4, },
        { label: 'Fri', value: 'FRIDAY', id: 5, },
        { label: 'Sat', value: 'SATURDAY', id: 6, },
        { label: 'Sun', value: 'SUNDAY', id: 7, },
    ];

    const DAYS_OF_WEEK = [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
    ];

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues })

    // useEffect(() => {
    //     fetchApproverGroup()
    // }, [])

    const isDisableDayOfWeekOption = (option) => {
        const start = startDate;
        const end = endDate;

        if (!end) return false;

        // ngay bat dau > ngay ket thuc => data dang sai => disable het khong cho chon thu trong tuan
        if (isAfter(startOfDay(start), startOfDay(end))) {
            return true;
        }

        const eachDayOfRange = eachDayOfInterval({
            start: start,
            end: end,
        });

        // range date >= 7  => thoa man dieu kien => ko disable
        if (eachDayOfRange.length >= 7) {
            return false;
        }

        return !eachDayOfRange.some(
            (day) => DAYS_OF_WEEK[day.getDay()] == option.value,
        );
    };

    const fetchUnitGroup = async () => {
        try {
            const response = await getApi(
                `https://sbs.basesystem.one/ivis/infrares/api/v0/regions`
            )

            const data = response.data
            if (data?.length > 0) {
                setUnitGroup(data)
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

    const fetchAreaGroup = async () => {
        try {
            const response = await getApi(
                `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/adults`
            )

            const data = response.data
            if (data?.length > 0) {
                setAreaGroup(data)
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

    const fetchApproverGroup = async () => {
        try {
            const response = await getApi(
                `https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?limit=50&page=1&keyword=&isLeader=true`
            )

            const data = response.data?.rows
            if (data?.length > 0) {
                setUsers(data)
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

    const handleUploadFileData = async (e) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', e.value[0]);
        formData.append('isPublic', true);
        formData.append('service', 'CMS');
        try {
            await callApiWithConfig(`https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/upload`, METHODS.POST, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setFileUploadDataName(e.value[0].name);
                setFileUploadDataId(res.data.id);
                setLoading(false);
            });
        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    const alert72Hours = (callback) =>
        Swal.fire({
            text: 'Registration deadline is over 72 hours, you need to register for a permanent card.',
            showCancelButton: false,
            showCloseButton: true,
            showConfirmButton: true,
            focusConfirm: true,
            confirmButtonText: 'Close',
            customClass: {
                content: 'content-class',
                confirmButton: 'swal-btn-confirm',
            },
        }).then(() => callback());

    const onSubmit = async (values) => {
        if (guests.length <= 0) {
            toast.error(`Register at least one guest`)
        }

        if (approvalPersons.length <= 0) {
            toast.error(`Minimum 1 person approval`)
        }


        const check72Hours = await new Promise((resolved) => {
            if (repeatType == 'ONCE') {
                resolved(true);
                setDayOfWeeks([])
            }
            if (dayOfWeeks.length >= 3) {
                alert72Hours(() => {
                    resolved(true);
                });
            }

            const eachDayOfRange = eachDayOfInterval({
                start: startDate,
                end: endDate,
            });

            const count = eachDayOfRange.reduce((total, cur) => {
                const d = DAYS_OF_WEEK[cur.getDay()];
                if (dayOfWeeks.includes(d)) {
                    return total + 1;
                }

                return total;
            }, 0);
            if (count >= 3) {
                alert72Hours(() => {
                    resolved(true);
                });
            } else resolved(true);
        });

        if (check72Hours) {
            const params = {
                note: values.note,
                department: values?.department,
                startDate: formatDate(startDate),
                endDate: values?.repeatType === 'ONCE' ? formatDate(startDate) : formatDate(endDate),
                dayOfWeeks: values?.repeatType === 'ONCE' ? [] : dayOfWeeks,
                areaId: values?.area?.id,
                groupId: values?.group?.id,
                startTimeInMinute: time[0] * 60,
                endTimeInMinute: time[1] * 60,
                fileId: fileUploadDataId,
                guests: [...guests],
                vehicles: [...vehicles],
                approvalPersons: approvalPersons.map((item, index) => ({
                    approvalLevel: index + 1,
                    ...item
                }))
            }

            setLoading(true)
            postApi(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/registrations`, params)
                .then(() => {
                    router.push(`/pages/scheduling`)
                    toast.success('Guest registration request created')
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
                    setLoading(false);
                });
        }
    }

    const updateArray = useMemo(() => {
        let foundRepresentation = false;

        return guests.map(item => {
            if (item.isRepresentation) {
                if (!foundRepresentation) {
                    foundRepresentation = true;

                    return item;
                } else {
                    return { ...item, isRepresentation: false };
                }
            }

            return item;
        });
    }, [guests]);

    useEffect(() => {
        if (JSON.stringify(guests) !== JSON.stringify(updateArray)) {
            setGuests(updateArray);
        }
    }, [updateArray, guests]);


    const handleAddRowGuests = data => {
        const newRows = data?.map((item, index) => {
            return {
                accessCode: item?.accessCode,
                identityNumber: item?.identityNumber,
                fullName: item?.fullName,
                phoneNumber: item?.phoneNumber,
                address: item?.address,
                isRepresentation: true,
                email: item?.email,
                id: item?.id,
                documentFileId: item?.documentFileId,
                gender: item?.gender,
                guestId: item?.id
            }
        })

        const arr = [...guests, ...newRows]

        const uniqueArray = arr.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.accessCode === item.accessCode && t.identityNumber === item.identityNumber
            ))
        );

        setGuests(uniqueArray)
    }

    const handleCheckboxChange = index => {
        const updatedGuests = guests.map((item, i) => ({
            ...item,
            isRepresentation: i === index // Chỉ phần tử tại vị trí index được chọn là true
        }));

        setGuests(updatedGuests);
    }

    const handleRemoveRowGUests = index => {
        if (index !== null) {
            const updateRows = [...guests]
            const removedItem = updateRows.splice(index, 1)[0];
            if (removedItem.isRepresentation && updateRows.length > 0) {
                // Nếu phần tử bị xóa có `isRepresentation: true` và mảng không rỗng
                updateRows[0].isRepresentation = true;
            }
            setGuests(updateRows)
        }
        setRowDel({ index: null, row: null, type: null })
    }

    const handleUpdateGuests = data => {
        const arr = [...guests]

        const updateArray = arr.map((item, index) => {
            if (item?.identityNumber === data?.identityNumber) {
                return data
            }

            return item
        })

        setGuests(updateArray)
    }

    const handleSuccessImport = (ret) => {
        if (ret) {
            const data = ret.map((d) => ({
                ...d,
                isRepresentation: false,
            }));

            const oldData = guests.filter((item) => {
                const foundIndex = data.findIndex((d) => d.id == item.id);

                return foundIndex < 0;
            });
            const newGuest = [...oldData, ...data];
            if (newGuest) {
                const flagRepresentation = newGuest.findIndex(
                    (g) => g.isRepresentation,
                );
                if (flagRepresentation < 0) {
                    newGuest[0].isRepresentation = true;
                }
                setGuests(newGuest)
            }
        }
    };

    const handleAddRowVehicles = () => {
        const newRow = {
            vehicleName: '',
            numberPlate: '',
            guestId: ''
        }

        setVehicles([...vehicles, newRow])
    }

    const handleChangeVehicleRow = (index, event, field) => {

        const newRows = [...vehicles]

        if (field === 'vehicleName') {
            newRows[index].vehicleName = event?.target?.value
            setVehicles(newRows)
        }
        if (field === 'numberPlate') {
            newRows[index].numberPlate = event?.target?.value
            setVehicles(newRows)
        }
        if (field === 'guestId') {
            newRows[index].guestId = event?.guestId
            setVehicles(newRows)
        }
    }

    const handleRemoveVehicleRows = index => {
        if (index !== null) {
            const updateRows = [...vehicles]
            updateRows.splice(index, 1)
            setVehicles(updateRows)
        }
        setRowDel({ index: null, row: null, type: null })

    }

    const handleAddRowApprover = () => {
        const newRowApprovers = {
            users: '',
            positionName: '',
            mainGroupName: ''
        }
        const newRowApprovalPersons = {}

        setApprovers([...approvers, newRowApprovers])
        setApprovalPersons([...approvalPersons, newRowApprovalPersons])
    }

    const handleChangeApproverRow = (index, event) => {
        const newRowApprovers = [...approvers]
        const newRowApprovalPersons = [...approvalPersons]

        newRowApprovers[index].users = event
        newRowApprovers[index].positionName = event?.userGroup[0].positionName
        newRowApprovers[index].mainGroupName = event?.mainGroupName

        newRowApprovalPersons[index] = event

        setApprovers(newRowApprovers)
        setApprovalPersons(newRowApprovalPersons)
    }

    const handleRemoveApproverRows = index => {
        if (index !== null) {
            const updateRowsApprovers = [...approvers]
            const updateRowApprovalPersons = [...approvalPersons]
            updateRowsApprovers.splice(index, 1)
            updateRowApprovalPersons.splice(index, 1)
            setApprovers(updateRowsApprovers)
            setApprovalPersons(updateRowApprovalPersons)
        }

        setRowDel({ index: null, row: null, type: null })
    }

    // Table render
    const guestsCol = [
        {
            dataField: 'identityNumber',
            label: 'Identity Number',
            minWidth: 120,
            align: 'center',
        },
        {
            dataField: 'fullName',
            label: 'Full Name',
            minWidth: 120,
            align: 'center',
            required: true,
        },
        {
            dataField: 'phoneNumber',
            label: 'Phone Number',
            minWidth: 160,
            align: 'center',
            required: true,
        },
        {
            dataField: 'address',
            label: 'Address/Company',
            minWidth: 140,
            align: 'center',
        },
    ];

    const vehicleCol = [
        {
            dataField: 'vehicleName',
            label: 'Vehicle Name',
            minWidth: 120,
            align: 'center',
            renderCell: (value, index) => (
                <CustomTextField value={value} onChange={event => handleChangeVehicleRow(index, event, 'vehicleName')} fullWidth />
            )
        },
        {
            dataField: 'numberPlate',
            label: 'Number Plate',
            minWidth: 120,
            align: 'center',
            required: true,
            renderCell: (value, index) => (
                <CustomTextField value={value} onChange={event => handleChangeVehicleRow(index, event, 'numberPlate')} fullWidth />
            )
        },
        {
            dataField: 'guestId',
            label: 'Driver Name',
            minWidth: 160,
            align: 'center',
            required: true,
            renderCell: (value, index) => {

                return (
                    <Autocomplete
                        value={value || null}
                        options={guests}
                        getOptionLabel={option => {
                            const guest = guests.find((guest) => guest?.guestId === option)

                            return (
                                option?.fullName || guest?.fullName
                            )
                        }}
                        onChange={(event, newValue) => handleChangeVehicleRow(index, newValue, 'guestId')}
                        renderInput={params => <CustomTextField {...params} />}
                        fullWidth
                    />
                )
            }
        },
    ]

    const approverCol = [
        {
            dataField: 'users',
            label: 'Name/Account Name',
            minWidth: 160,
            align: 'center',
            required: true,
            renderCell: (value, index) => {

                return (
                    <Autocomplete
                        value={value || null}
                        options={users}
                        getOptionLabel={option => [option?.fullName, option?.username].join`/`}
                        onChange={(event, newValue) => handleChangeApproverRow(index, newValue)}
                        onFocus={fetchApproverGroup}
                        renderOption={(props, option) => (
                            <li {...props} key={option?.id} style={{ marginBottom: 1 }}>
                                <ul style={{ listStyleType: 'none' }}>
                                    <li>
                                        {option?.fullName}
                                    </li>
                                    <li style={{ opacity: 0.5 }}>
                                        ({option?.email}) {option?.mainGroupName}
                                    </li>
                                </ul>
                            </li>
                        )}

                        renderInput={params => <CustomTextField {...params} />}
                        fullWidth
                    />
                )
            }
        },
        {
            dataField: 'positionName',
            label: 'Position',
            minWidth: 120,
            align: 'center',
            required: true,
        },
        {
            dataField: 'mainGroupName',
            label: 'Unit',
            minWidth: 120,
            align: 'center',
            required: true,
        },
    ]

    const TableGuest = () => (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }} >
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        {guestsCol.map(column => (
                            <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                {column.label}
                            </TableCell>
                        ))}
                        <TableCell align='center'>Is Representation</TableCell>
                        <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {guests.map((row, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                            <TableCell>{index + 1}</TableCell>
                            {guestsCol.map(col => {
                                const value = row[col.dataField]

                                return (
                                    <TableCell key={col.dataField} align={col.align}>
                                        {col?.renderCell ? col.renderCell : value}
                                    </TableCell>
                                )
                            })}
                            <TableCell align="center">
                                <Checkbox checked={row?.isRepresentation} name='uncontrolled' onClick={() => handleCheckboxChange(index)} />
                            </TableCell>
                            <TableCell align='center'>
                                <IconButton
                                    size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => {
                                        setIsOpenEditGuest(true)
                                        setGuestEdit(row)
                                    }}
                                >
                                    <Icon icon="tabler:edit" />
                                </IconButton>
                                <IconButton
                                    size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => {
                                        setIsOpenDel(true)
                                        setIsDelGuest(true)
                                        setRowDel({ index: index, row: row, type: 'guest' })
                                    }}
                                >
                                    <Icon icon="tabler:trash" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

    const TableVehicle = () => (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }} >
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        {vehicleCol.map(column => (
                            <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                {column.label}
                            </TableCell>
                        ))}
                        <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vehicles.map((row, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                            <TableCell>{index + 1}</TableCell>
                            {vehicleCol.map(({ dataField, renderCell, align, minWidth }) => {
                                const value = row[dataField]

                                return (
                                    <TableCell key={dataField} align={align}>
                                        {renderCell ? renderCell(value, index) : value}
                                    </TableCell>
                                )
                            })}
                            <TableCell align='center'>
                                <IconButton
                                    size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => {
                                        setIsOpenDel(true)
                                        setRowDel({ index: index, row: row, type: 'vehicle' })
                                    }}
                                >
                                    <Icon icon="tabler:trash" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

    const TableApprover = () => (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }} >
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        {approverCol.map(column => (
                            <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                {column.label}
                            </TableCell>
                        ))}
                        <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {approvers.map((row, index) => (
                        <TableRow hover tabIndex={-1} key={index}>
                            <TableCell>{index + 1}</TableCell>
                            {approverCol.map(({ dataField, renderCell, align, minWidth }) => {
                                const value = row[dataField]

                                return (
                                    <TableCell key={dataField} align={align}>
                                        {renderCell ? renderCell(value, index) : value}
                                    </TableCell>
                                )
                            })}
                            <TableCell align='center'>
                                <IconButton
                                    size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => {
                                        setIsOpenDel(true)
                                        setRowDel({ index: index, row: row, type: 'approver' })
                                    }}
                                >
                                    <Icon icon="tabler:trash" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

    const DeleteView = () => {
        return (
            <Dialog
                open={isOpenDel}
                maxWidth='sm'
                scroll='body'
                onClose={() => setIsOpenDel(false)}
                onBackdropClick={() => setIsOpenDel(false)}
            >
                <DialogContent
                    sx={{}}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant='h3' sx={{ mb: 3 }}>
                            Confirm
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            {
                                isDelGuest && rowDel.row?.isRepresentation ? `Guest ${rowDel.row?.fullName} is currently a representative guest. 
                    If you delete this guest, the representative role will be transferred to someone else.` :
                                    isDelGuest && !rowDel.row?.isRepresentation ?
                                        `Are you sure you want to delete guest ?` :
                                        `Do you really want to delete this record?`
                            }
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        py: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(5)} !important`]
                    }}
                >
                    <Button
                        variant='tonal'
                        color='secondary'
                        sx={{ mr: 1 }}
                        onClick={() => {
                            setIsOpenDel(false)
                            setIsDelGuest(false)
                            setRowDel({ index: null, row: null, type: null })
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            if (isDelGuest && rowDel.type === 'guest') {
                                handleRemoveRowGUests(rowDel.index)
                            }
                            if (!isDelGuest && rowDel.type === 'vehicle') {
                                handleRemoveVehicleRows(rowDel.index)
                            }
                            if (!isDelGuest && rowDel.type === 'approver') {
                                handleRemoveApproverRows(rowDel.index)
                            }
                            setIsOpenDel(false)
                            setIsDelGuest(false)
                        }}
                    >
                        Accept
                    </Button>

                </DialogActions>
            </Dialog>
        )
    }

    return (
        <>

            <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Box display={'flex'}>
                    <IconButton component={Link} href={`/pages/scheduling`}>
                        <Icon icon="tabler:arrow-back" />
                    </IconButton>
                    <Typography variant="h5" fontWeight={550}>Register Guest Information</Typography>
                </Box>

                <Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        href={`/pages/scheduling`}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit(onSubmit)}
                        sx={{ marginLeft: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
            {loading === true && (
                <Box
                    sx={{ width: '100%', height: ' 100%', position: 'absolute', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <CircularProgress />
                </Box>
            )}
            <form>
                <Card sx={{ margin: 2 }}>
                    <CardHeader title={'General Information'} />
                    <CardContent>
                        <Grid container spacing={3} padding={3}>
                            <Grid item xs={4}>
                                <Controller
                                    name='repeatType'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <RadioGroup row aria-label='gender'
                                            name='repeatType'
                                            value={value || repeatType}
                                            label={'Request Type'}
                                            onChange={(e) => {
                                                onChange(e)
                                                setRepeatType(e.target.value)
                                            }}
                                        >
                                            <FormControlLabel
                                                value='ONCE'
                                                label='Once'
                                                sx={errors.repeatType ? { color: 'error.main' } : null}
                                                control={<Radio sx={errors.repeatType ? { color: 'error.main' } : null} />}
                                            />
                                            <FormControlLabel
                                                value='WEEKLY'
                                                label='Repeat'
                                                sx={errors.repeatType ? { color: 'error.main' } : null}
                                                control={<Radio sx={errors.repeatType ? { color: 'error.main' } : null} />}
                                            />
                                        </RadioGroup>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controller
                                    name='startDate'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <DatePickerWrapper>
                                            <div>
                                                <DatePicker
                                                    selected={value}
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    minDate={new Date()}
                                                    onChange={e => {
                                                        onChange(e)
                                                        setStartDate(e)
                                                        if (repeatType == 'WEEKLY') {
                                                            if (isAfter(startOfDay(e), startOfDay(endDate))) {
                                                                setDayOfWeeks([])
                                                            } else {
                                                                const eachDayOfRange = eachDayOfInterval({
                                                                    start: e,
                                                                    end: endDate,
                                                                });

                                                                const days = uniq(
                                                                    eachDayOfRange.map((d) => DAYS_OF_WEEK[d.getDay()]),
                                                                );
                                                                setDayOfWeeks(days)
                                                            }
                                                        }
                                                    }}
                                                    placeholderText='DD/MM/YYYY'
                                                    customInput={
                                                        <CustomInput
                                                            value={value}
                                                            onChange={onChange}
                                                            label='Start Date'
                                                            error={Boolean(errors.startDate)}
                                                            aria-describedby='validation-basic-dob'
                                                            {...(errors.startDate && { helperText: 'This field is required' })}
                                                        />
                                                    }
                                                />
                                            </div>
                                        </DatePickerWrapper>
                                    )}
                                />
                            </Grid>
                            {repeatType !== 'ONCE' && (
                                <Grid item xs={4}>
                                    <Controller
                                        name='endDate'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <DatePickerWrapper>
                                                <div>
                                                    <DatePicker
                                                        selected={value || ''}
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        onChange={e => {
                                                            onChange(e)
                                                            setEndDate(e)
                                                            if (repeatType === 'WEEKLY') {
                                                                if (isAfter(startOfDay(startDate), startOfDay(e))) {
                                                                    setDayOfWeeks([])
                                                                } else {
                                                                    const eachDayOfRange = eachDayOfInterval({
                                                                        start: startDate,
                                                                        end: e,
                                                                    })

                                                                    const days = uniq(
                                                                        eachDayOfRange.map((d) => DAYS_OF_WEEK[d.getDay()])
                                                                    )
                                                                    setDayOfWeeks(days)
                                                                }
                                                            }
                                                        }}
                                                        minDate={add(startDate, { days: 1 })}
                                                        placeholderText='DD/MM/YYYY'
                                                        customInput={
                                                            <CustomInput
                                                                value={value}
                                                                onChange={onChange}
                                                                label='End Date *'
                                                                error={Boolean(errors.endDate)}
                                                                aria-describedby='validation-basic-dob'
                                                                {...(errors.endDate && { helperText: 'This field is required' })}
                                                            />
                                                        }
                                                    />
                                                </div>
                                            </DatePickerWrapper>
                                        )}
                                    />
                                </Grid>
                            )}
                            {repeatType === 'WEEKLY' && (
                                <Grid item xs={4}>
                                    <FormLabel>Repeat Date *</FormLabel>
                                    <DayOfWeek
                                        options={WEEKDAYS}
                                        displayExpr={(option) => option?.label}
                                        valueExpr="value"
                                        getOptionDisabled={isDisableDayOfWeekOption}
                                        value={dayOfWeeks}
                                        onChange={(e) => {
                                            setDayOfWeeks(e)
                                        }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={4}>
                                <FormLabel>Time</FormLabel>
                                <Slider
                                    marks={timeRange}
                                    min={0}
                                    max={24}
                                    step={4}
                                    value={time}
                                    onChange={(e, newVal) => {
                                        setTime(newVal)
                                    }}
                                    valueLabelDisplay='auto'
                                    aria-labelledby='discrete-slider'
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controller
                                    name='area'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <Autocomplete
                                            fullWidth
                                            value={value}
                                            options={areaGroup}
                                            onChange={(event, selectItem) => {
                                                onChange(selectItem)
                                            }}
                                            onFocus={fetchAreaGroup}
                                            id='autocomplete-controlled'
                                            getOptionLabel={option => option.name || ''}
                                            renderInput={params => (
                                                <CustomTextField
                                                    {...params}
                                                    label={'Work Area *'}
                                                    variant='outlined'
                                                    fullWidth
                                                    error={Boolean(errors.area)}
                                                    aria-describedby='validation-basic-last-name'
                                                    {...(errors.area && { helperText: 'This field is required' })}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controller
                                    name='group'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomAutocomplete
                                            fullWidth
                                            value={value}
                                            options={unitGroup}
                                            onChange={(e, selectItem) => {
                                                onChange(selectItem)
                                            }}
                                            onFocus={fetchUnitGroup}
                                            id='autocomplete-controlled'
                                            getOptionLabel={option => option?.name || option?.groupName || ''}
                                            renderInput={params => (
                                                <CustomTextField
                                                    {...params}
                                                    label={'Unit *'}
                                                    variant='outlined'
                                                    fullWidth
                                                    error={Boolean(errors.group)}
                                                    aria-describedby='validation-basic-last-name'
                                                    {...(errors.group && { helperText: 'This field is required' })}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controller
                                    name='department'
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={value || ''}
                                            label={'Room/Department'}
                                            onChange={onChange}
                                            placeholder={''}
                                            error={Boolean(errors.department)}
                                            aria-describedby='validation-basic-last-name'
                                            {...(errors.department && { helperText: 'This field is required' })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controller
                                    name='note'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={value || ''}
                                            label={'Purpose *'}
                                            onChange={onChange}
                                            placeholder={''}
                                            error={Boolean(errors.note)}
                                            aria-describedby='validation-basic-last-name'
                                            {...(errors.note && { helperText: 'This field is required' })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Controller
                                    name='documentReference'
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={value || ''}
                                            label={'Reference document'}
                                            onChange={onChange}
                                            placeholder={''}
                                            error={Boolean(errors.documentReference)}
                                            aria-describedby='validation-basic-last-name'
                                            {...(errors.documentReference && { helperText: 'This field is required' })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                {fileUploadDataName && (
                                    <div>
                                        <div
                                            style={{
                                                width: '100%',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '10px 5px',
                                            }}
                                        >
                                            <Typography> {fileUploadDataName}
                                                <IconButton
                                                    style={{ float: 'right', }}
                                                    size="small"
                                                    onClick={() => {
                                                        setFileUploadDataName(null);
                                                        setFileUploadDataId(null);
                                                    }}
                                                >
                                                    <Icon icon="tabler:trash-x-filled" />
                                                </IconButton>
                                            </Typography>

                                        </div>
                                        <Button variant="contained" sx={{ float: 'right', marginTop: 2 }} >
                                            <a href={
                                                `https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/public/download/${fileUploadDataId}`
                                            }
                                                target="_blank"
                                                download
                                                style={{ color: 'white', textDecoration: 'none' }}
                                            >
                                                download
                                            </a>
                                        </Button>
                                    </div>

                                )}
                                {!fileUploadDataName && (
                                    <div style={{ borderStyle: 'dashed', borderWidth: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                        <FileUploader
                                            multiple={false}
                                            control={control}
                                            name="fileId"
                                            accept="*"
                                            uploadMode="useForm"
                                            selectButtonText="Drop files here or click to upload."
                                            onValueChanged={(e) => handleUploadFileData(e)}
                                            labelText=""
                                        />
                                    </div>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{ margin: 2 }}>
                    <CardHeader
                        title={'Guest Information'}
                        action={
                            <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setIsOpenAddGuest(true)
                                        }}
                                    >
                                        <Icon icon="tabler:square-plus" />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        sx={{ marginLeft: 2, marginRight: 1 }}
                                        onClick={() => {
                                            setIsOpenImportGuest(true)
                                        }}
                                    >
                                        <Icon icon="tabler:table-import" />
                                    </IconButton>
                                </Grid>
                                {isOpenAddGuest && (
                                    <Grid item xs={12}>
                                        <AddGuest onClose={() => setIsOpenAddGuest(false)} callback={handleAddRowGuests} guestSelected={guests} />
                                    </Grid>
                                )}
                            </Grid>
                        }
                    />
                    <CardContent>
                        {TableGuest()}
                    </CardContent>
                </Card>
                <Card sx={{ margin: 2 }}>
                    <CardHeader title={'Vehicle Information'}
                        action={
                            <Box>
                                <IconButton variant="contained" color="primary"
                                    onClick={() => {
                                        handleAddRowVehicles()
                                    }}
                                >
                                    <Icon icon="tabler:square-plus" />
                                </IconButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        {TableVehicle()}
                    </CardContent>
                </Card>
                <Card sx={{ margin: 2 }}>
                    <CardHeader title={'Approver Information'}
                        action={
                            <Box>
                                <IconButton variant="contained" color="primary"
                                    onClick={() => {
                                        handleAddRowApprover()
                                    }}
                                >
                                    <Icon icon="tabler:square-plus" />
                                </IconButton>
                            </Box>
                        }
                    />
                    <CardContent>
                        {TableApprover()}
                    </CardContent>
                </Card>
            </form >
            {isOpenEditGuest && (
                <EditGuest show={isOpenEditGuest} onClose={() => setIsOpenEditGuest(false)} data={guestEdit} callback={handleUpdateGuests} />
            )}
            {isOpenDel && DeleteView()}
            {isOpenImportGuest && (
                <ImportGuest show={isOpenImportGuest} onClose={() => setIsOpenImportGuest(false)} handleSuccess={handleSuccessImport} />
            )}
        </>
    )
}

export default Register 