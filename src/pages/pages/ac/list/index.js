import React, { useState } from 'react';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, Tab, useTheme } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { FilterAlt, Label } from '@mui/icons-material';
import Icon from 'src/@core/components/icon';
import CustomTextField from "src/@core/components/mui/text-field";
import Filter from '../popups/Filter';
import { rows } from 'src/@fake-db/table/static-data';

const columns = [
    {
        flex: 0.1,
        field: 'id',
        minWidth: 80,
        headerName: 'ID'
    },
    {
        flex: 0.25,
        minWidth: 200,
        field: 'full_name',
        headerName: 'Name'
    },
    {
        flex: 0.25,
        minWidth: 230,
        field: 'email',
        headerName: 'Email'
    },
    {
        flex: 0.15,
        type: 'date',
        minWidth: 130,
        headerName: 'Date',
        field: 'start_date',
        valueGetter: params => new Date(params.value)
    },
    {
        flex: 0.15,
        minWidth: 120,
        field: 'experience',
        headerName: 'Experience'
    },
    {
        flex: 0.1,
        field: 'age',
        minWidth: 80,
        headerName: 'Age'
    }
]

const Access = () => {
    const [value, setValue] = useState('overview');
    const [keyword, setKeyword] = useState([]);
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const theme = useTheme();

    const handleTabsChange = (event, newValue) => {
        setValue(newValue);
    }

    const handSearch = val => {
        setKeyword(val);
    }

    return (
        <>
            <Card>
                <CardHeader
                    title='Quyền truy cập'
                    titleTypographyProps={{ sx: { mb: [2, 0] } }}
                    action={
                        <Grid container spacing={2}>
                            <Grid item>
                                <Box>
                                    <IconButton aria-label='Bộ lọc' onClick={() => { setIsOpenFilter(true) }}>
                                        <Icon icon="tabler:filter" />
                                    </IconButton>
                                </Box>
                            </Grid>
                            <Grid item>
                                <CustomTextField value={keyword} placeholder='Search' onChange={e => handSearch(e.target.value)} />
                            </Grid>
                        </Grid>
                    }
                    sx={{
                        py: 4,
                        flexDirection: ['column', 'row'],
                        '& .MuiCardHeader-action': { m: 0 },
                        alignItems: ['flex-start', 'center']
                    }}
                />
                <TabContext value={value}>
                    <TabList
                        variant='scrollable'
                        scrollButtons={false}
                        onChange={handleTabsChange}
                        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, '& .MuiTab-root': { py: 3.5 } }}
                    >
                        <Tab value='overview' label='Tổng quan' />
                        <Tab value='set-permissions' label='Thiết lập quyền' />
                    </TabList>
                    <CardContent>
                        <TabPanel sx={{ p: 0 }} value='overview'>
                            <Grid container spacing={0}>
                                <Box sx={{ height: 500, width: '100%' }}>
                                    <DataGrid columns={columns} rows={rows.slice(0, 10)} />
                                </Box>
                            </Grid>
                        </TabPanel>

                        <TabPanel sx={{ p: 0 }} value='set-permissions'>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ float: 'right', mb: 5 }}>
                                        <Button variant='outlined' startIcon={<Icon icon="tabler:file-import" />} sx={{ mr: 10 }} >
                                            Import
                                        </Button>
                                        <Button variant='outlined' endIcon={<Icon icon="tabler:file-export" />} sx={{ mr: 10 }}>
                                            Export
                                        </Button>
                                        <Button variant='outlined' startIcon={<Icon icon="tabler:plus" />}>
                                            Thêm mới
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ height: 500, width: '100%' }}>
                                        <DataGrid columns={columns} rows={rows.slice(0, 10)} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </TabPanel>

                    </CardContent>
                </TabContext>
            </Card>

            {isOpenFilter &&
                (
                    <Filter show={isOpenFilter} onClose={() => setIsOpenFilter(false)} />
                )
            }
        </>

    )
}

export default Access;
