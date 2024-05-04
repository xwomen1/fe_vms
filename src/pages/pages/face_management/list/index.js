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

const FaceManagement=() => {

    const [keyword, setKeyword] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [userData, setUserData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [listImage, setListImage] = useState([]);
    const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

    const initValueFilter = {
        keyword: '',
        limit: 25,
        page: 1,
    }

    const [valueFilter, setValueFilter] = useState(initValueFilter)

    useEffect(() => {

        const atLeastOneSelected = selectedIds.length > 0;

        setSelectAll(atLeastOneSelected);
      }, [selectedIds]);
    
    const handleCheckboxChange = (event, id) => {

        const { checked } = event.target;

        let updatedIds = [...selectedIds];
        if (checked && !updatedIds.includes(id)) {
        updatedIds.push(id);
        } else {
        updatedIds = updatedIds.filter(selectedId => selectedId !== id);
        }
        setSelectedIds(updatedIds);
        setIsDeleteDisabled(updatedIds.length === 0);
        console.log(updatedIds,'updatedIds');   
    };
    
    const handleSelectAllChange = (event) => {

        const { checked } = event.target;

        const updatedIds = checked ? userData.map(user => user.id) : [];

        setSelectedIds(updatedIds);
        setSelectAll(checked);
    };
    
    const handleDeleteSelected = () => {
        showAlertConfirm({
          text: 'Bạn có chắc chắn muốn xóa?'
        }).then(({ value }) => {
          if (value) {

            const token = localStorage.getItem(authConfig.storageTokenKeyName);
            if (!token) {
              return;
            }
            
            const config = {
              headers: {
                Authorization: `Bearer ${token}`
              }
            };
            selectedIds.forEach(idDelete => {
              let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${idDelete}`;
              axios
                .delete(urlDelete, config)
                .then(() => {
                    
                  const updatedData = userData.filter(user => user.id !== idDelete);
                  setUserData(updatedData);
                })
                .catch(err => {
                  Swal.fire('Đã xảy ra lỗi', err.message, 'error');
                });
            });

            setSelectedIds([]);
          }
          
        });
      };

    const exportToExcel = async () => {
        setLoading(true);
    
        try {

            const token = localStorage.getItem(authConfig.storageTokenKeyName)
  
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
                keyword: '',
                page: valueFilter.page,
                limit: valueFilter.limit,
            }
          }

          const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/blacklist?sort=%2Bcreated_at&page=1', config)

            const data = response.data.data.map(item => ({
                mainImageId: item.mainImageId,
                name: item.name,
                time: item.time,
            }));

            console.log(data,'data');

            const exportData = [
                ['Mã ảnh', 'Tên', 'Lần cuối xuất hiện'],
                ...data.map(item => [item.mainImageId, item.name, item.time]),
            ];
    
            const ws = XLSX.utils.aoa_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đen');
    
            const fileName = 'Danh sách đen.xlsx';
            XLSX.writeFile(wb, fileName);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            toast.error(error)
        } finally {
            setLoading(false);
        }
    };

    function showAlertConfirm(options, intl) {

    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

useEffect(() => {

    const fetchFilteredOrAllUsers = async () => {
        setLoading(true)
        try {

          const token = localStorage.getItem(authConfig.storageTokenKeyName)
  
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
                keyword: keyword,
                page: valueFilter.page,
                limit: valueFilter.limit,
            }
          }
         
          const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/blacklist?sort=%2Bcreated_at&page=1', config)
          setUserData(response.data.data)
          const imageFaces = response.data.data[0].mainImageUrl;
          console.log(imageFaces,'imageFaces');
          setListImage(imageFaces)

        //   const centerFace = imageFaces.find((face) => face.faceType === 'CENTER');
        //   if (centerFace) {
        //     imageUrls.push(centerFace.imageFileUrl);
        //   }

          console.log(response.data.data,'response.data');
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    fetchFilteredOrAllUsers();

},[keyword])

const handleDelete = idDelete => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?'
    }).then(({ value }) => {
      if (value) {

        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        if (!token) {

          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Xóa thành công', '', 'success')
            const updatedData = userData.filter(user => user.id !== idDelete)
            setUserData(updatedData)
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.message, 'error')
          })
      }
    })
  }

const buildUrlWithToken = url => {

    const token = localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {

      return `${url}?token=${token}`;
    }

    return url;
  };

const Img = React.memo(props => {
    const [loaded, setLoaded] = useState(false)

    const { src } = props

    return (
      <>
        <div
          style={
            loaded
              ? { display: 'none' }
              : {
                  width: '100px',
                  height: '100px',
                  display: 'grid',
                  backgroundColor: '#C4C4C4',
                  placeItems: 'center'
                }
          }
        >
          <CircularProgress size={20} />
        </div>
        <img
          {...props}
          src={src}
          alt='Ảnh'
          onLoad={() => setLoaded(true)}
          style={loaded ? { width: '100px', height: '100px' } : { display: 'none' }}
        />
      </>
    )
  })

    return(
        <>

        {loading ? (
                <div>Loading...</div>
            ) : (
                <Grid container spacing={6.5}>
                <Grid item xs={12}>
                    <Card>
                    <CardHeader
                        title='Quản lý khuôn mặt'
                        titleTypographyProps={{ sx: { mb: [2, 0] } }}
                        action={
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Box sx={{ float: 'right' }}>
                                        <IconButton 
                                         aria-label='Xóa'
                                         color='primary'
                                         disabled={isDeleteDisabled}
                                         onClick={handleDeleteSelected} >
                                            <Icon icon="tabler:trash" />
                                        </IconButton>
                                        <IconButton
                                        aria-label='export file'
                                        color='primary'
                                        onClick={exportToExcel} >
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
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
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
                                      onChange={handleSelectAllChange}
                                      checked={selectAll}
                                     />
                                    </TableCell>
                                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Ảnh đối tượng</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Tên Đối tượng</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Lần cuối xuất hiện</TableCell>
                                    <TableCell sx={{ padding: '16px',textAlign:'center' }}>Chi tiết</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Xóa</TableCell>
                                </TableRow>
                           </TableHead>
                           <TableBody>
                           {Array.isArray(userData) && userData.map((user, index) => (
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
                            ))}
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


export default FaceManagement