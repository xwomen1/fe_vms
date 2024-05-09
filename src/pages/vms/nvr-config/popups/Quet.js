import { useState, useEffect} from 'react'
import {
  Box, Button, Card, CardContent, CardHeader, Grid, IconButton, 
  Table, TableHead, TableRow, TableCell,Fade,styled, TableBody, 
} from "@mui/material";
import authConfig from 'src/configs/auth'
import Icon from 'src/@core/components/icon'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import axios from 'axios'

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
            setCamera(response.data);
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
            setNVRCameraList(response.data.cameras);
        } catch (error) {
            console.error('Error fetching NVR data:', error);
        }
    };

    fetchGroupData();
    fetchGroupDataNVR();
}, [nvr]);

const handleDelete = async (id) => {

    setLoading(true);
    try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const nvrResponse = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`, config);
        const nvrCameras = nvrResponse.data.cameras;

        const updatedCameras = nvrCameras.filter(camera => camera.id !== id);


        await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`, { cameras: updatedCameras }, config);

        Swal.fire('Xóa camera thành công', '', 'success');
    } catch (error) {

        Swal.fire('Đã xảy ra lỗi', error.message, 'error');
        console.error('Error deleting camera:', error);
    } finally {
        onClose();
        setLoading(false);
    }
}

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

            cameras: [
                ...(nvrCameraList && Array.isArray(nvrCameraList) ? nvrCameraList : []),
                {
                    id: id,
                    name: name,
                }
            ]
        }
        await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/camera/${nvr}`, params, config)
        Swal.fire('Thêm thành công', '', 'success')
    } catch (error) {
        Swal.fire('Thiết bị chưa phản hồi', error.message, 'error')
        console.error('Error adding member to group:', error)
        onClose();
    }finally {
        onClose();
        setLoading(false);
    }
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
                                                            
                                                                onClick={() => handleDelete(camera.id)}
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

                                                                onClick={() => handleUpdate(camera.id, camera.name)}
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
