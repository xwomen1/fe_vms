import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton } from "@mui/material"
import { useState } from "react"
import DatePicker from 'react-datepicker'
import Icon from 'src/@core/components/icon'
import CustomTextField from "src/@core/components/mui/text-field"
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"

const EventMap = () => {
    const [keyword, setKeyword] = useState('')
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)

    const handleSearch = value => {
    }

    return (
        <>
            <Card>
                <CardHeader
                    title='Bản đồ'
                    titleTypographyProps={{ sx: { mb: [2, 0] } }}
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
                                        placeholder='Nhập sự kiện'
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
                                        onChange={(e) => setKeyword(e.target.value)}
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
                                        }}>Tạo câu tìm kiếm</Button>
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
                <CardContent>
                </CardContent>
            </Card>
        </>
    )
}

export default EventMap