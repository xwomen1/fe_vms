// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const areaColors = {
    series2: '#b992fe',
}

const series = [
    {
        name: 'Clicks',
        data: [60, 80, 70, 110, 80, 100, 90, 180, 160, 140, 200, 220, 275]
    },
]

const GPUChart = () => {
    // ** States
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)

    // ** Hook
    const theme = useTheme()

    const options = {
        chart: {
            parentHeightOffset: 0,
            toolbar: { show: false }
        },
        tooltip: { shared: false },
        dataLabels: { enabled: false },
        stroke: {
            show: false,
            curve: 'straight'
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            labels: { colors: theme.palette.text.secondary },
            markers: {
                offsetY: 1,
                offsetX: -3
            },
            itemMargin: {
                vertical: 3,
                horizontal: 10
            }
        },
        colors: [areaColors.series2],
        fill: {
            opacity: 1,
            type: 'solid'
        },
        grid: {
            show: true,
            borderColor: theme.palette.divider,
            xaxis: {
                lines: { show: true }
            }
        },
        yaxis: {
            labels: {
                style: { colors: theme.palette.text.disabled }
            }
        },
        xaxis: {
            axisBorder: { show: false },
            axisTicks: { color: theme.palette.divider },
            crosshairs: {
                stroke: { color: theme.palette.divider }
            },
            labels: {
                style: { colors: theme.palette.text.disabled }
            },
            categories: [
                // '7/12',
                // '8/12',
                // '9/12',
                // '10/12',
                // '11/12',
                // '12/12',
                // '13/12',
                // '14/12',
                // '15/12',
                // '16/12',
                // '17/12',
                // '18/12',
                // '19/12'
            ]
        }
    }

    const CustomInput = forwardRef((props, ref) => {
        const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
        const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
        const value = `${startDate}${endDate !== null ? endDate : ''}`

        return (
            <CustomTextField
                {...props}
                size='small'
                value={value}
                inputRef={ref}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Icon fontSize='1.25rem' icon='tabler:calendar-event' />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position='end'>
                            <Icon fontSize='1.25rem' icon='tabler:chevron-down' />
                        </InputAdornment>
                    )
                }}
            />
        )
    })

    const handleOnChange = dates => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)
    }

    return (
        <Card>
            <CardHeader
                title='GPU'
                subheader='Commercial networks'
                subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
                sx={{
                    flexDirection: ['column', 'row'],
                    alignItems: ['flex-start', 'center'],
                    '& .MuiCardHeader-action': { mb: 0 },
                    '& .MuiCardHeader-content': { mb: [2, 0] }
                }}
            />
            <CardContent>
                <ReactApexcharts type='area' height={200} options={options} series={series} />
            </CardContent>
        </Card>
    )
}

export default GPUChart
