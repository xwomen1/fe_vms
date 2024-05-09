import {
    Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Grid, IconButton,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material"
import { useEffect, useState } from "react"
import DatePicker from 'react-datepicker'
import Icon from 'src/@core/components/icon'
import CustomTextField from "src/@core/components/mui/text-field"
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"

import ReactMapGL, { Marker, Popup as Popup, Source, Layer } from '@goongmaps/goong-map-react'

import authConfig from 'src/configs/auth'
import toast from "react-hot-toast"
import axios from "axios"
import * as XLSX from 'xlsx'

const columns = [
    {
        id: 1,
        flex: 0.15,
        type: 'date',
        width: 50,
        align: 'right',
        label: 'Ngày giờ',
        field: 'time',
        valueGetter: params => new Date(params.value)
    },
    {
        id: 2,
        flex: 0.25,
        width: 50,
        align: 'right',
        field: 'event',
        label: 'Sự kiện'
    },
    {
        id: 3,
        flex: 0.15,
        width: 50,
        align: 'right',
        label: 'Camera',
        field: 'camera',
    },
]

const rows = [
    {
        time: '03/05/2024',
        event: 'Nhận diện',
        camera: 'Cam 1',
        latitude: '21.027974',
        longitude: '105.817700'
    },
    {
        time: '04/05/2024',
        event: 'Biển số',
        camera: 'Cam 2',
        latitude: '21.027498979352664',
        longitude: '105.82610264411711'
    },
    {
        time: '05/05/2024',
        event: 'Biển số',
        camera: 'Cam 3',
        latitude: '21.024535898438057',
        longitude: '105.83191767326018'
    },
    {
        time: '06/05/2024',
        event: 'Nhận diện',
        camera: 'Cam 5',
        latitude: '21.023254547908486',
        longitude: '105.8227337895938'
    },
    {
        time: '07/05/2024',
        event: 'Nhận diện',
        camera: 'Cam 1',
        latitude: '21.026821',
        longitude: '105.820900'
    },
]

const EventMap = () => {
    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [isOpenGroup, setIsOpenGroup] = useState([])
    const [selected, setSelected] = useState([])
    const [isOpenTable, setIsOpenTable] = useState(false)
    const [dataList, setDataList] = useState(null)
    const [points, setPoints] = useState([])
    const [selectedPoints, setSelectedPoints] = useState([])

    const [viewport, setViewport] = useState({
        longitude: 105.834160,
        latitude: 21.027763,
        zoom: 15
    })

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }

    const GOONG_MAP_KEY = 'MaRpQPZORjHfEMC3tpTGCLlPqo5qXDkzvcemJZWO'


    useEffect(() => {
        fetchDataList()
    }, [])

    const fetchDataList = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras`, config)
            setDataList(res.data)
        } catch (error) {
            console.error('Error fetching data: ', error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = e => {
        setKeyword(e.target.value)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.time)
            setSelected(newSelected)

            return
        }
        setSelected([])
    }

    const handleClick = (event, name, longitude, latitude) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected = []
        let newSelectedPoints = [...selectedPoints] // Sao chép danh sách các điểm đã chọn

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
            newSelectedPoints.push({ longitude, latitude }) // Thêm điểm mới vào danh sách
        } else {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
            const indexToRemove = newSelectedPoints.findIndex(point => point.longitude === longitude && point.latitude === latitude)
            if (indexToRemove !== -1) {
                newSelectedPoints.splice(indexToRemove, 1) // Loại bỏ điểm đã chọn khỏi danh sách
            }
        }
        setSelected(newSelected)
        setSelectedPoints(newSelectedPoints)
    }

    const handleExport = async () => {
        const excelData = rows.reduce((acc, row) => {
            acc.push({
                'Ngày giờ': row.time,
                'Sự kiện': row.event,
                'Camera': row.camera
            })

            return acc
        }, [])

        const ws = XLSX.utils.json_to_sheet(excelData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Map')

        XLSX.writeFile(wb, 'Map.xlsx')
    }

    const viewMap = () => (
        <Grid container spacing={2}>
            <ReactMapGL
                {...viewport}
                width="100%"
                height="65vh"
                onViewportChange={setViewport}
                goongApiAccessToken={GOONG_MAP_KEY}
            >
                {
                    dataList?.map((marker, index) => {
                        if (marker?.lat && marker?.long) {
                            return (
                                <>
                                    <Marker
                                        onClick={() => {
                                            let isOpen = dataList?.map((x) => false)
                                            isOpen[index] = true
                                            setIsOpenGroup(isOpen)
                                        }}
                                        latitude={parseFloat(marker?.lat)}
                                        longitude={parseFloat(marker?.long)}
                                        offsetLeft={-20}
                                        offsetTop={-20}
                                        key={index}
                                    >
                                        <div
                                            style={{ zoom: '10%' }}
                                        >
                                            <img src="/images/speaker.png" />
                                        </div>
                                    </Marker>

                                    {
                                        isOpenGroup[index] && (
                                            <div>
                                                <Popup
                                                    latitude={parseFloat(marker?.lat)}
                                                    longitude={parseFloat(marker?.long)}
                                                    closeButton={true}
                                                    closeOnClick={false}
                                                    onClose={() => {
                                                        let isOpen = dataList?.map((x) => false)
                                                        setIsOpenGroup(isOpen)
                                                    }}
                                                    anchor="top"
                                                >
                                                    <div style={{ fontWeight: 400 }}>

                                                    </div>
                                                </Popup>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                    })
                }

                {selectedPoints.length >= 2 && (
                    <Source id="line" type="geojson" data={{ type: 'Feature', geometry: { type: 'LineString', coordinates: selectedPoints.map(point => [point.longitude, point.latitude]) } }}>
                        <Layer
                            id="measure-lines"
                            type="line"
                            paint={{
                                'line-color': '#FF0000',
                                'line-width': 2,
                                'line-dasharray': [2, 2],
                            }}
                            layout={{
                                'line-join': 'round',
                                'line-cap': 'round'
                            }}
                        />
                    </Source>
                )}
            </ReactMapGL>
        </Grid >
    )

    const isSelected = time => selected.indexOf(time) !== -1


    const viewTable = () => (
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table sstickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                <TableHead>
                    <TableRow>
                        <TableCell padding='checkbox' sx={{ width: 20 }}>
                            <Checkbox
                                onChange={handleSelectAllClick}
                                checked={rows.length > 0 && selected.length === rows.length}
                                inputProps={{ 'aria-label': 'select all desserts' }}
                                indeterminate={selected.length > 0 && selected.length < rows.length}
                            />
                        </TableCell>
                        {columns.map(column => (
                            <TableCell key={column.id} align={column.align} sx={{ width: column.width }}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => {
                        const isItemSelected = isSelected(row.time)
                        const labelId = `enhanced-table-checkbox-${index}`

                        return (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={index}
                                role='checkbox'
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                                onClick={event => handleClick(event, row.time, row.longitude, row.latitude)}

                            >
                                <TableCell padding='checkbox'>
                                    <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </TableCell>
                                {columns.map(column => {
                                    const value = row[column.field]

                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}

                </TableBody>
            </Table>
        </TableContainer>
    )

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title='Bản đồ'
                            sx={{
                                py: 4,
                                flexDirection: ['column', 'row'],
                                '& .MuiCardHeader-action': { m: 0 },
                                alignItems: ['flex-start', 'center']
                            }}
                            action={
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                                            <CustomTextField
                                                value={keyword}
                                                placeholder='Tìm đối tượng'
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box sx={{ mr: 2, display: 'flex' }}>
                                                            <Icon fontSize='1.25rem' icon='tabler:search' />
                                                        </Box>
                                                    ),
                                                    endAdornment: (
                                                        <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                                                            <Icon fontSize='1.25rem' icon='tabler:x' />
                                                        </IconButton>
                                                    )
                                                }}
                                                onChange={(e) => handleSearch(e)}
                                                sx={{
                                                    width: {
                                                        xs: 1,
                                                        sm: 'auto'
                                                    },
                                                    '& .MuiInputBase-root > svg': {
                                                        mr: 2
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                                            <Button
                                                variant='outlined'
                                                onClick={() => {
                                                    setIsOpenTable(true)
                                                }}>Tìm kiếm</Button>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <DatePickerWrapper>
                                            <div>
                                                <DatePicker
                                                    selected={startTime}
                                                    id='basic-input'
                                                    onChange={date => setStartTime(date)}
                                                    placeholderText='Chọn ngày bắt đầu'
                                                    customInput={<CustomInput label='Ngày bắt đầu' />}
                                                />
                                            </div>
                                        </DatePickerWrapper>
                                    </Grid>
                                    <Grid item>
                                        <DatePickerWrapper>
                                            <div>
                                                <DatePicker
                                                    selected={endTime}
                                                    id='basic-input'
                                                    onChange={date => setEndTime(date)}
                                                    placeholderText='Chọn ngày kết thúc'
                                                    customInput={<CustomInput label='Ngày kết thúc' />}
                                                />
                                            </div>
                                        </DatePickerWrapper>
                                    </Grid>
                                </Grid>
                            }
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={isOpenTable ? 9 : 12}>
                    <Card>
                        <CardContent>
                            {viewMap()}
                        </CardContent>
                    </Card>
                </Grid>
                {isOpenTable && (
                    <Grid item xs={12} sm={3}>
                        <Card>

                            <CardContent sx={{ height: '60vh' }}>
                                {viewTable()}
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-around' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={5}><Button variant='contained'>Xóa danh sách</Button></Grid>
                                    <Grid item xs={4}><Button variant='contained' onClick={() => handleExport()}>Xuất file</Button></Grid>
                                    <Grid item xs={3}> <Button variant='contained' onClick={() => setIsOpenTable(false)}>Đóng</Button></Grid>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </>
    )
}

export default EventMap