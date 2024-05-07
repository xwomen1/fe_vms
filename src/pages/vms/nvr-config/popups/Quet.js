import { useState, useEffect, forwardRef,useCallback } from 'react'
import {
  Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Tab, TableContainer, Paper,
  Table, TableHead, TableRow, TableCell,Fade,styled, TableBody, Pagination, Menu, MenuItem, Dialog, DialogContent,
  DialogActions,
  Typography,
  TextField,
  Input,
  TextareaAutosize
} from "@mui/material";
import authConfig from 'src/configs/auth'
import Icon from 'src/@core/components/icon'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/asset/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'

const AddCamera = ({nvr, onClose }) => {

    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const { id } = router.query;
    const [camera , setCamera] = useState([]);
    const [nvrCameraList, setNVRCameraList] = useState([]);
  
    console.log(nvr,'nvr');

 
 useEffect(() => {
    const fetchGroupData = async () => {

        try {
            const token = localStorage.getItem(authConfig.storageTokenKeyName);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(
                'https://sbs.basesystem.one/ivis/vms/api/v0/cameras?sort=%2Bcreated_at&page=1',
                config
            );
            setCamera(response.data.data);
        } catch (error) {
            console.error('Error fetching camera data:', error);
        }
    };

    const fetchGroupDataNVR = async () => {
        try {

            const token = localStorage.getItem(authConfig.storageTokenKeyName);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(
                `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`,
                config
            );
            setNVRCameraList(response.data.data.cameras);
        } catch (error) {
            console.error('Error fetching NVR data:', error);
        }
    };

    fetchGroupData();
    fetchGroupDataNVR();
}, [nvr]);

const handleDelete = (cameraId) => {
    Swal.fire('Deleted!', 'Camera has been deleted.', 'success');
};

const handleUpdate = async (id, name) => {
    setLoading(true);
    try {

        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
        const params = {

            // ...(nvrCameraList && Array.isArray(nvrCameraList) ? nvrCameraList : []),
            cameras: [
                {
                    id: id,
                    name: name,
                }
            ]
        }
        await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/camera/${nvr}`, params, config)
        Swal.fire('Thêm thành công', '', 'success')
    } catch (error) {
        Swal.fire('Đã xảy ra lỗi', error.message, 'error')
        console.error('Error adding member to group:', error)
    }
}



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
  
  return (
    
    <Grid container spacing={1}>
     <Card >
     <Grid item xs={12}>
                        <Table>
                           < TableHead>
                                <TableRow>
                                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Tên camera</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Loại</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Địa chỉ IP</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Kết nối NVR/AI Box</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Địa chỉ Mac</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Vị trí</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Trạng thái</TableCell>
                                    <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                                </TableRow>
                           </TableHead>
                           <TableBody>
                                {Array.isArray(camera) && camera.length > 0 ? (
                                    camera.map((camera, index) => (
                                        <TableRow key={camera.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{camera.name}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{camera.ipAddress}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{camera.location}</TableCell>
                                            <TableCell>{camera.status.name}</TableCell>
                                            <TableCell sx={{ padding: '16px' }}>
                                                <Grid container spacing={2}>
                                                    {Array.isArray(nvrCameraList) && nvrCameraList.length > 0 ? (
                                                        nvrCameraList.some(nvrCamera => nvrCamera.id === camera.id) ? (
                                                            <IconButton
                                                            
                                                                // onClick={() => handleDelete(camera.id)}
                                                            >
                                                                <Icon icon='tabler:minus' />
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton
                                                                onClick={() => handleUpdate(camera.id, camera.name)}
                                                            >
                                                                <Icon icon='tabler:plus' />
                                                            </IconButton>
                                                        )
                                                    ) : (
                                                        <IconButton

                                                            // onClick={() => handleAdd(camera.id)}
                                                        >
                                                            <Icon icon='tabler:plus' />
                                                        </IconButton>
                                                    )}
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Grid>
      </Card>
    </Grid>
  );
}

export default AddCamera
