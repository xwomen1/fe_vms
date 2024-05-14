import { useState } from "react"
import MuiTabList from '@mui/lab/TabList'
import { TabContext, TabPanel } from "@mui/lab"
import { Grid, Tab, styled } from "@mui/material"
import AIConfig from "./view/aiConfig"

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
                    <Grid item xs={12}>
                        {' '}
                        <TabList onChange={handleChange} aria-label='customized tabs example'>
                            <Tab value='1' label='Tab 1' key={1} />
                            <Tab value='2' label='Tab 2' key={2} />
                            <Tab value='3' label='Tab 3' key={3} />
                            <Tab value='4' label='Tab 4' key={4} />
                        </TabList>
                    </Grid>
                    <Grid item xs={12}>
                        <TabPanel value='1'>
                        </TabPanel>
                        <TabPanel value='2'>
                            <AIConfig />
                        </TabPanel>
                        <TabPanel value='3'>
                        </TabPanel>
                        <TabPanel value='4'>
                        </TabPanel>
                    </Grid>
                </TabContext>
            </Grid>
        </div>
    )
}

export default Events