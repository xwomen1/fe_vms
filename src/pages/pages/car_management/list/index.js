import React, {Fragment, useEffect, useState } from 'react';
import { TabContext, TabList, TabPanel } from "@mui/lab"
import {
    Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Tab, TableContainer, Paper,
    Table, TableHead, TableRow, TableCell, TableBody, Pagination, Menu, MenuItem, Dialog, DialogContent,
    DialogActions,
    Typography
} from "@mui/material"
import Icon from 'src/@core/components/icon'
import Swal from 'sweetalert2'
import { CircularProgress } from '@material-ui/core'
import CustomTextField from "src/@core/components/mui/text-field"
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx';
import Checkbox from '@mui/material/Checkbox'
import Link from 'next/link'

const Car_management = () => {

    const [loading, setLoading] = useState(false)

    return(
        <>

        {loading ? (
                <div>Loading...</div>
            ) : (
            <Grid container spacing={6.5}>
                <Grid item xs={12}>
                    <Card>
                    <CardHeader
                        title='Quản lý Biển số'
                        titleTypographyProps={{ sx: { mb: [2, 0] } }}
                        action={
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Box sx={{ float: 'right' }}>
                                        <IconButton 
                                         aria-label='Xóa'
                                         color='primary'

                                        //  disabled={isDeleteDisabled}
                                        //  onClick={handleDeleteSelected}
                                          >
                                            <Icon icon="tabler:trash" />
                                        </IconButton>
                                        <IconButton
                                        aria-label='export file'
                                        color='primary'

                                        // onClick={exportToExcel}
                                         >
                                            <Icon icon="tabler:file-export" />
                                        </IconButton>
                                        <IconButton aria-label='Thêm mới'
                                        component={Link}
                                        href={`/pages/face_management/detail/add`}
                                        color='primary'
                                        >
                                            <Icon icon="tabler:square-plus" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <CustomTextField

                                        // value={keyword}
                                        // onChange={(e) => setKeyword(e.target.value)}
                                        placeholder='Search…'
                                        InputProps={{
                                            startAdornment: (
                                                <Box sx={{ mr: 2, display: 'flex' }}>
                                                    <Icon fontSize='1.25rem' icon='tabler:search' />
                                                </Box>
                                            ),
                                            endAdornment: (
                                                <IconButton size='small' title='Clear' aria-label='Clear' >
                                                    <Icon fontSize='1.25rem' icon='tabler:x' />
                                                </IconButton>
                                            )
                                        }}
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
                    <Grid item xs={12}>
                        <Table>
                           < TableHead style={{background:'#f6f6f7'}}>
                                <TableRow>
                                    <TableCell>
                                    <Checkbox

                                    //   onChange={handleSelectAllChange}
                                    //   checked={selectAll}
                                     />
                                    </TableCell>
                                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Ảnh xe</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Biển số xe</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Lần cuối xuất hiện</TableCell>
                                    <TableCell sx={{ padding: '16px',textAlign:'center' }}>Chi tiết</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Xóa</TableCell>
                                </TableRow>
                           </TableHead>
                           <TableBody>
                           <TableRow >
                                    <TableCell>
                                    <Checkbox
                                     />
                                    </TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>
                                        Ảnh 1
                                    </TableCell>
                                    <TableCell>30 - Y1 8729</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>
                                        <Button
                                            size='small'
                                            component={Link}
                                            href={`/pages/car_management/detail/UpDateCar`}
                                            sx={{ color: 'blue',left:'45px'}}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={{ padding: '16px' }}>
                                        <Grid container spacing={2}>
                                        <IconButton
                                         >
                                            <Icon icon='tabler:trash' />
                                        </IconButton>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                                
                           {/* {Array.isArray(userData) && userData.map((user, index) => (
                            console.log(user.mainImageUrl),
                                <TableRow key={user.id}>
                                    <TableCell>
                                    <Checkbox
                                                    onChange={(event) => handleCheckboxChange(event, user.id)}
                                                    checked={selectedIds.includes(user.id)}
                                     />
                                    </TableCell>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                    <Img
                                            src={buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${user.mainImageId}`)}
                                            style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.lastAppearance}</TableCell>
                                    <TableCell>
                                        <Button
                                            size='small'
                                            component={Link}
                                            href={`/pages/face_management/detail/${user.id}`}
                                            sx={{ color: 'blue',left:'45px'}}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={{ padding: '16px' }}>
                                        <Grid container spacing={2}>
                                        <IconButton
                                        onClick={() => handleDelete(user.id)}
                                         >
                                            <Icon icon='tabler:trash' />
                                        </IconButton>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))} */}
                            </TableBody>
                        </Table>
                    </Grid>
                    </Card>
                </Grid>
            </Grid>
                )}
        </>
    );
}

export default Car_management