import {
    Autocomplete, Button, Card, CardContent, CardHeader, Grid,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material"
import React from "react"
import { useEffect, useState } from "react"
import authConfig from 'src/configs/auth'
import axios from "axios"
import 'react-datepicker/dist/react-datepicker.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import DatePicker from 'react-datepicker'
import TreeItem from '@mui/lab/TreeItem'
import * as XLSX from 'xlsx'
import Icon from 'src/@core/components/icon'
import CustomTextField from "src/@core/components/mui/text-field"
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { format, isWithinInterval, parse } from "date-fns"
import TreeView from "@mui/lab/TreeView"
import { useForm } from 'react-hook-form'
import useUrlState from "../useUrlState"

const initValueFilter = {
    limit: 100,
    page: 1,
    groupId: ''
}

function ReportMonth({ history }) {
    const [loading, setLoading] = useState(false)
    const [valueFilter, setValueFilter, incrementPage] = useUrlState(initValueFilter)
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [daysInRange, setDaysInRange] = useState([])
    const [groups, setGroups] = useState([])
    const [valueGroup, setValueGroup] = useState('')
    const [selectedGroups, setSelectedGroups] = useState([])
    const [dataResource, setDataResource] = useState([])
    const [selectedGroupId, setSelectedGroupId] = useState(null)

    const {
        handleSubmit,
        control,
        setError,
        setValue,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: valueFilter
    })

    useEffect(() => {
        if (selectedGroupId !== null) {
            setValueFilter({ ...valueFilter, page: 1 })
            setDataResource([])
            fetchDataSource()
        }
    }, [selectedGroupId])

    useEffect(() => {
        fetchDataSource()
    }, [valueFilter.page])

    const fetchDataSource = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem(authConfig.storageTokenKeyName)

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    groupId: selectedGroupId?.groupId || '',
                    page: parseInt(valueFilter.page),
                    limit: parseInt(valueFilter.limit),
                }
            }
            const response = await axios.post(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/event/search/user`, {}, config)

            if (response.data.data.rows.length > 0) {
                // Cập nhật dữ liệu mới vào mảng tạm thời
                setDataResource(prevData => [...prevData, ...response.data.data.rows])

                // Tăng trang
                incrementPage()

            } else {
                console.log("No more data to fetch.")
            }
            reset(valueFilter)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const token = localStorage.getItem(authConfig.storageTokenKeyName)

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        keyword: valueGroup
                    }
                }
                const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config)
                const dataWithChildren = addChildrenField(response.data.data)
                const rootGroups = findRootGroups(dataWithChildren)
                setGroups(rootGroups)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchGroupData()
    }, [])

    const addChildrenField = (data, parentId = null) => {
        return data.map(group => {
            const children = data.filter(child => child.parentId === group.groupId)
            if (children.length > 0) {
                group.children = children
            }

            return group
        })
    }

    const findRootGroups = data => {
        const rootGroups = []
        data.forEach(group => {
            if (!data.some(item => item.groupId === group.parentId)) {
                rootGroups.push(group)
            }
        })

        return rootGroups
    }

    const handleGroupCheckboxChange = (groupId, checked) => {
        if (checked) {
            setSelectedGroups(prevGroups => [...prevGroups, { groupId }])
        } else {
            setSelectedGroups(prevGroups => prevGroups.filter(g => g.groupId !== groupId))
        }
    }

    const GroupCheckbox = ({ group, checked, onChange }) => {
        return (
            <div>
                <input
                    type='checkbox'
                    id={`group-${group.groupId}`}
                    checked={checked}
                    onChange={e => onChange(group.groupId, e.target.checked)}
                />
                <label htmlFor={`group-${group.groupId}`}>{group.groupName}</label>
            </div>
        )
    }

    const renderGroup = group => (
        <TreeItem
            key={group.groupId}
            nodeId={group.groupId}
            label={
                <GroupCheckbox
                    group={group}
                    checked={selectedGroups.some(g => g.groupId === group.groupId)}
                    onChange={handleGroupCheckboxChange}
                />
            }
        >
            {group.children && group.children.map(childGroup => renderGroup(childGroup))}
        </TreeItem>
    )

    const groupedData = dataResource.length > 0 ? dataResource.reduce((acc, employee) => {
        const userId = employee?.user_id

        if (!acc[userId]) {
            acc[userId] = {
                fullName: employee?.fullName,
                timeValues: [],
            }
        }

        if (!acc[userId].timeMax || employee?.timeMax > acc[userId]?.timeMax) {
            acc[userId].timeMax = employee?.timeMax
        }
        if (!acc[userId].timeMin || employee?.timeMin < acc[userId]?.timeMin) {
            acc[userId].timeMin = employee?.timeMin
        }

        acc[userId].timeValues.push({
            timeMin: employee?.timeMin,
            timeMax: employee?.timeMax,
        })

        return acc
    }, {}) : {}

    const groupedDataArray = Object.values(groupedData)

    useEffect(() => {
        const today = new Date()
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        setStart(startDate)
        setEnd(endDate)
    }, [])

    useEffect(() => {
        if (start && end && start instanceof Date && end instanceof Date) {
            const days = []
            let currentDay = new Date(start)

            while (currentDay <= end) {
                days.push(format(currentDay, 'dd/MM/yyyy'))
                currentDay.setDate(currentDay.getDate() + 1)
            }
            setDaysInRange(days)
        }
    }, [start, end])

    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100%',
        overflowX: 'auto',
    }

    const exportToExcel = () => {
        // Tạo một workbook mới
        const workbook = XLSX.utils.book_new()

        // Tạo một worksheet từ dữ liệu đã gộp cho khoảng ngày đã chọn
        const filteredData = groupedDataArray.map((employee) => {
            const row = {
                'Họ tên nhân viên': employee.fullName,
            }

            daysInRange.forEach((day) => {
                const formattedDay = format(parse(day, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy')

                const matchingTimes = employee.timeValues.filter((time) => {
                    const startDate = format(new Date(time.timeMin), 'dd/MM/yyyy')
                    const endDate = format(new Date(time.timeMax), 'dd/MM/yyyy')

                    return isWithinInterval(parse(formattedDay, 'dd/MM/yyyy', new Date()), {
                        start: parse(startDate, 'dd/MM/yyyy', new Date()),
                        end: parse(endDate, 'dd/MM/yyyy', new Date()),
                    })
                })

                const totalDuration = matchingTimes.reduce((sum, time) => {
                    const startTime = format(new Date(time.timeMin), 'HH:mm')
                    const endTime = format(new Date(time.timeMax), 'HH:mm')

                    const lunchStart = '12:00'
                    const lunchEnd = '13:30'

                    // Nếu thời gian nằm ngoài thời gian nghỉ trưa hoặc không nằm trong thời gian làm việc
                    if (endTime <= lunchStart || startTime >= lunchEnd) {
                        sum += (time.timeMax - time.timeMin)
                    } else {
                        // Trường hợp còn lại, tính thời gian làm việc trừ thời gian nghỉ trưa
                        if (startTime < lunchStart) {
                            sum += (parse(lunchStart, 'HH:mm', new Date()) - parse(startTime, 'HH:mm', new Date()))
                        }
                        if (endTime > lunchEnd) {
                            sum += (parse(endTime, 'HH:mm', new Date()) - parse(lunchEnd, 'HH:mm', new Date()))
                        }
                    }

                    return sum
                }, 0)


                const formattedTimes = matchingTimes.map((time) => `Vào: ${format(new Date(time.timeMin), 'HH:mm')} - Ra: ${format(new Date(time.timeMax), 'HH:mm')}`).join('\n')
                const totalTime = formatDuration(totalDuration)

                // Thời gian vào, ra và tổng thời gian được thêm vào dòng tương ứng
                row[`ThoiGian_${formattedDay}_`] = `${formattedTimes}\nTongThoiGian: ${totalTime}`
            })

            return row
        })

        const worksheet = XLSX.utils.json_to_sheet(filteredData)

        // Thêm worksheet vào workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachNhanVien')

        // Tạo buffer cho file Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

        // Tạo Blob từ buffer
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetcharset=UTF-8' })

        // Tạo đường dẫn URL cho Blob
        const url = URL.createObjectURL(blob)

        // Tạo một thẻ a để tải xuống
        const a = document.createElement('a')
        a.href = url
        a.download = 'DanhSachNhanVien.xlsx'

        // Thêm thẻ a vào body và click để bắt đầu tải xuống
        document.body.appendChild(a)
        a.click()

        // Xóa thẻ a sau khi đã tải xuống
        document.body.removeChild(a)
    }

    const formatDuration = (durationInMilliseconds) => {
        const seconds = Math.floor((durationInMilliseconds / 1000) % 60)
        const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60)
        const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24)

        const formattedHours = hours.toString().padStart(2, '0')
        const formattedMinutes = minutes.toString().padStart(2, '0')
        const formattedSeconds = seconds.toString().padStart(2, '0')

        return `${formattedHours}:${formattedMinutes}`
    }
    const emptyColumnCount = Math.max(0, 9 - daysInRange.length)

    // Tạo một mảng chứa các cột rỗng
    const emptyColumn = Array.from({ length: emptyColumnCount }, (_, index) => index)

    const cellWidth = 150
    const minCellWidth = 150

    return (
        <Card>
            <CardHeader title='BẢNG CHẤM CÔNG' />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            disablePortal
                            id="treeview-autocomplete"
                            options={groups}
                            style={{ width: '60%', marginLeft: 50 }}
                            autoHighlight
                            getOptionLabel={(option) => option.groupName}
                            renderInput={params => <CustomTextField placeholder='Placeholder' {...params} label='Phòng ban' />}
                            renderOption={(props, option) => (
                                <div {...props}>
                                    <TreeView
                                        defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                                        defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                                    >
                                        {renderGroup(option)}
                                    </TreeView>
                                </div>
                            )}
                            onChange={(e, value) => {
                                setSelectedGroupId(value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <DatePicker
                            selected={start}
                            id='basic-input'
                            onChange={date => setStart(date)}
                            placeholderText='Click to select a date'
                            customInput={<CustomInput label='Ngày bắt đầu' />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <DatePicker
                            selected={end}
                            id='basic-input'
                            onChange={date => setEnd(date)}
                            placeholderText='Click to select a date'
                            customInput={<CustomInput label='Ngày kết thúc' />}
                            minDate={start}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            style={{ marginTop: 20 }}
                            variant='outlined'
                            color='secondary'
                            startIcon={<Icon icon="tabler:download" />}
                            onClick={exportToExcel}
                        >
                            Tải xuống
                        </Button>
                    </Grid>
                </Grid>
                <br /> <hr /><br />

                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                    <Table aria-label="Bảng báo cáo tháng">
                        <TableHead>
                            <TableRow>
                                <TableCell style={fixedColumnStyles}>Tên Nhân Viên</TableCell>
                                {daysInRange.map((day, index) => (
                                    <TableCell key={index} style={{ ...headerCellStyle, width: `${cellWidth}px`, minWidth: `${minCellWidth}px` }}>
                                        {`${day}`}
                                    </TableCell>
                                ))}
                                {emptyColumn.map((colIndex) => (
                                    <TableCell key={`empty-column-${colIndex}`} style={{ ...headerCellStyle, width: `${cellWidth}px`, minWidth: `${minCellWidth}px` }}></TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupedDataArray.map((employee, employeeIndex) => (
                                <TableRow key={employeeIndex}>
                                    <TableCell
                                        key={employeeIndex}
                                        style={{
                                            ...fixedColumnStyle,
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: 'white',
                                            zIndex: 2,
                                        }}
                                    >
                                        {employee?.fullName}
                                    </TableCell>
                                    {daysInRange.map((day, dayIndex) => {
                                        const formattedDay = format(parse(day, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy')

                                        const matchingTimes = employee.timeValues.filter((time) => {
                                            const startDate = format(new Date(time.timeMin), 'dd/MM/yyyy')
                                            const endDate = format(new Date(time.timeMax), 'dd/MM/yyyy')

                                            return isWithinInterval(parse(formattedDay, 'dd/MM/yyyy', new Date()), {
                                                start: parse(startDate, 'dd/MM/yyyy', new Date()),
                                                end: parse(endDate, 'dd/MM/yyyy', new Date()),
                                            })
                                        })

                                        const totalDuration = matchingTimes.reduce((sum, time) => {
                                            const startTime = format(new Date(time.timeMin), 'HH:mm')
                                            const endTime = format(new Date(time.timeMax), 'HH:mm')

                                            const lunchStart = '12:00'
                                            const lunchEnd = '13:30'

                                            // Nếu thời gian nằm ngoài thời gian nghỉ trưa hoặc không nằm trong thời gian làm việc
                                            if (endTime <= lunchStart || startTime >= lunchEnd) {
                                                sum += (time.timeMax - time.timeMin)
                                            } else {
                                                // Trường hợp còn lại, tính thời gian làm việc trừ thời gian nghỉ trưa
                                                if (startTime < lunchStart) {
                                                    sum += (parse(lunchStart, 'HH:mm', new Date()) - parse(startTime, 'HH:mm', new Date()))
                                                }
                                                if (endTime > lunchEnd) {
                                                    sum += (parse(endTime, 'HH:mm', new Date()) - parse(lunchEnd, 'HH:mm', new Date()))
                                                }
                                            }

                                            return sum
                                        }, 0)

                                        return (
                                            <TableCell
                                                key={dayIndex}
                                                style={{
                                                    ...cellStyle,
                                                    width: `${cellWidth}px`,
                                                    minWidth: `${minCellWidth}px`,
                                                }}>
                                                {matchingTimes.map((time, timeIndex) => (
                                                    <div key={timeIndex}>
                                                        {format(new Date(time.timeMin), ' HH:mm')} - {format(new Date(time.timeMax), ' HH:mm')}
                                                    </div>
                                                ))}
                                                {matchingTimes.length > 0 && (
                                                    <div>
                                                        Tổng thời gian:
                                                        <div style={{ color: '#e28743' }}>{formatDuration(totalDuration)}</div>
                                                    </div>
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                    {emptyColumn.map((colIndex) => (
                                        <TableCell key={`empty-cell-${employeeIndex}-${colIndex}`} style={{ ...cellStyle, width: `${cellWidth}px`, minWidth: `${minCellWidth}px` }}></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}

const cellStyle = {
    border: '1px solid #dddddd',
    padding: '20px',
    minWidth: '25%',
    textAlign: 'left',
}

const headerCellStyle = {
    ...cellStyle,
    backgroundColor: '#f2f2f2',
}

const fixedColumnStyle = {
    ...cellStyle,
    width: 'auto',
    minWidth: '150px',
    position: 'sticky',
    left: 0,
    zIndex: 1,
}

const fixedColumnStyles = {
    ...cellStyle,
    width: 'auto',
    minWidth: '200px',
    position: 'sticky',
    backgroundColor: '#f2f2f2',
    left: 0,
    zIndex: 5,
}

export default ReportMonth