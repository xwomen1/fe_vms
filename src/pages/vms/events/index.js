import { useState } from "react"
import MuiTabList from '@mui/lab/TabList'
import { TabContext, TabPanel } from "@mui/lab"
import { Grid, Tab, Typography, styled } from "@mui/material"
import EventOverview from "./view/eventOverview"
import EventList from "./view/eventList"
import EventConfig from "./view/eventConfig"
import EventMap from "./view/eventMap"

const TabList = styled(MuiTabList)(({ theme }) => ({
    borderBottom: '0 !important',
    '&, & .MuiTabs-scroller': {
        boxSizing: 'content-box',
        padding: theme.spacing(1.25, 1.25, 2),
        margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
    },
    '& .MuiTabs-indicator': {
        display: 'none'
    },
    '& .Mui-selected': {
        boxShadow: theme.shadows[2],
        backgroundColor: theme.palette.primary.main,
        color: `${theme.palette.common.white} !important`
    },
    '& .MuiTab-root': {
        lineHeight: 1,
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
            color: theme.palette.primary.main
        }
    }
}))

const Events = () => {
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <div>
            <Grid container spacing={0} style={{ marginTop: 10 }}>
                <TabContext value={value}>
                    <Grid xs={12}>
                        {' '}
                        <TabList onChange={handleChange} aria-label='customized tabs example'>
                            <Tab value='1' label='Tổng Quan' />
                            <Tab value='2' label='Danh sách' />
                            <Tab value='3' label='Cấu hình' />
                            <Tab value='4' label='Bản đồ' />
                        </TabList>
                    </Grid>
                    <Grid item xs={12}>
                        <TabPanel value='1'>
                            <EventOverview />
                        </TabPanel>
                        <TabPanel value='2'>
                            <EventList />
                        </TabPanel>
                        <TabPanel value='3'>
                            <EventConfig />
                        </TabPanel>
                        <TabPanel value='4'>
                            <EventMap />
                        </TabPanel>
                    </Grid>
                </TabContext>
            </Grid>
        </div>
    )
}

export default Events