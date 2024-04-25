import { useRouter } from 'next/router';
import {Fragment, useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import authConfig from 'src/configs/auth';
import toast from 'react-hot-toast';
import CustomTextField from "src/@core/components/mui/text-field";
import { TextBox } from 'devextreme-react/text-box';
import FileUploader from 'devextreme-react/file-uploader';
import ModalImage from '../ModalImage';
import Link from 'next/link'
import PlusIcon from '../list/Imge/dragndrop';
import {
    Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Tab, TableContainer, Paper,
    Table, TableHead, TableRow, TableCell, TableBody, Pagination, Menu, MenuItem, Dialog, DialogContent,
    DialogActions,
    Typography
} from "@mui/material";
import Icon from 'src/@core/components/icon';
import DragdropBG from '../list/Imge/dragndrop.js';
import Fullscreen from '@material-ui/icons/Fullscreen';
import { UploadFile } from '@mui/icons-material';

const EditFaceManagement = () => {

    const classes = useStyles();
    const router = useRouter();

    // const history = useHistory();

    const id = router.query.EditDetailBlacklist;
    const [loading, setLoading] = useState(false);
    const [avatarImage, setAvatarImage] = useState(null);
    const [listFileId, setListFileId] = useState([]);
    const [listImage, setListImage] = useState([]);
    const listFileUrl = [];
    const [listFileUpload, setListFileUpload] = useState([]);
    const [fileAvatarImg, setFileAvatarImg] = useState(null);
    const [showCropper, setShowCopper] = useState(false);
    const [fileAvatarId, setFileAvatarId] = useState(null);
    const [name, setName] = useState(null);
    const fileUploader1 = useRef(null);
    const fileUploader2 = useRef(null);
    const [showLoading, setShowLoading] = useState(false);
    const [isDoubleClick, setIsDoubleClick] = useState(false);
    const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.gif', '.png'];
    const [modalImage, setModalImage] = useState(null);
    const [img0, setImg0] = useState(null);
    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);
    const [img3, setImg3] = useState(null);
    const [img4, setImg4] = useState(null);

    console.log(id,'id'); 

    const buildUrlWithToken = url => {
        const token = localStorage.getItem(authConfig.storageTokenKeyName);
        if (token) {

          return `${url}?token=${token}`;

        }

        return url;
      };
      
      useEffect(() => {
        setListImage([img0, img1, img2, img3, img4]);
    }, []);

    useEffect(() => {
        const listImg = listFileId.map((id) => buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${id}`));
        setListImage(listImg);
    }, [listFileId]);

    // useEffect(() => {
    //     if (!showCropper) {
    //         setIsDoubleClick(false);
    //     }
    // }, [showCropper]);
    // const fileListToBase64 = async (fileList) => {
    //     function getBase64(file) {
    //         const reader = new FileReader();
    //         return new Promise((resolve) => {
    //             reader.onload = (ev) => {
    //                 resolve(ev.target.result);
    //             };
    //             reader.readAsDataURL(file);
    //         });
    //     }
    //     const promises = [];
    //     for (let i = 0; i < fileList.length; i++) {
    //         promises.push(getBase64(fileList[i]));
    //     }
    //     const data = await Promise.all(promises);
    //     return data;
    // };
    // useEffect(() => {
    //     async function fetchData() {
    //         const arrayOfBase64 = await fileListToBase64(listFileUpload);
    //         setListImage(arrayOfBase64);
    //     }

    //     if (listFileUpload.length > 0) {
    //         fetchData();
    //     }
    // }, [listFileUpload]);
    // const invalidPopup = () => (
    //     <InvaliteImagePopup
    //         onClose={() => {
    //             setShowInvalidImagePopup(null);
    //         }}
    //         title={showInvalidImagePopup.title}
    //         content={showInvalidImagePopup.content}
    //         txtButton="Đồng ý"
    //     />
    // );

      const onDragDropImage = (e) => {
        if (e.value.length > 0) {
            if (e.value.length + listFileUpload.length > 5) {
                Swal.fire({
                    text: 'Tối đa 5 file',
                    icon: 'error',

                    // imageWidth: 213,

                    showCancelButton: false,
                    showCloseButton: false,
                    showConfirmButton: true,
                    focusConfirm: true,
                    confirmButtonColor: '#40a574',
                    confirmButtonText: 'Đóng',
                    customClass: {
                        content: 'content-class',
                    },
                });
            } else {
                const files = listFileUpload.concat(e.value);

                // call API validate file
                const formData = new FormData();

                // eslint-disable-next-line no-restricted-syntax
                for (const file of files) {

                    // formData.append('detectedImages', file, file.name);
                    formData.append('files', file);
                }
                setShowLoading(true);
                axios.post(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/upload/multi`, formData)
                    .then((res) => {
                        setListFileUpload(files);

                        console.log(res,'res');

                        // listFileUpload.push(...files);

                        const fileIds = res.data.map((x) => x.id);
                        const arr = [...listFileId, ...fileIds]
                        setListFileId([...arr].slice(0, 5));
                    })
                    .catch((err) => {
                        (err);
                    })
                    .finally(() => {
                        setShowLoading(false);
                    });
            }
            if (fileUploader2?.current?.instance) {
                fileUploader2.current.instance.reset();
            }
            if (fileUploader1?.current?.instance) {
                fileUploader1.current.instance.reset();
            }
        }
    };

    useEffect(() => {
        const fetchFilteredOrAllUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem(authConfig.storageTokenKeyName);
                
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        limit: 25,
                        page: 1,
                        keyword: '',
                    }
                };

                if (id) { 

                    // Thêm điều kiện kiểm tra id tồn tại trước khi gửi yêu cầu
                    
                    const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${id}`, config);
                    const imgs = [...response.data.data.imgs];
                    setFileAvatarId(response.data.data.mainImageId);
                    setListFileUpload(imgs.map((img) => buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${img.id}`)));
                    setListFileId(imgs.map((img) => img.id));
                    setListImage(imgs.map((img) =>  buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${img.id}`)));
                    setAvatarImage(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${response.data.data.mainImageId}`));
                    setImg0(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[0]?.id}`));
                    setImg1(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[1]?.id}`));
                    setImg2(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[2]?.id}`));
                    setImg3(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[3]?.id}`));
                    setImg4(buildUrlWithToken(`https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${imgs[4]?.id}`));
                    setName(response.data.data.name);
                    console.log(imgs);
                }
            } catch (error) {

                console.error('Error fetching data:', error);
                toast.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredOrAllUsers();
    }, [id]); 

    // Thêm id vào mảng dependencies để useEffect gọi lại mỗi khi id thay đổi
    console.log(name);

    const handleUpdate = () => {
        setLoading(true);

        const params = {
            name: name,
            mainImageId: fileAvatarId,

            // mainImageUrl: fileAvatarUrl,

            imgs: listFileId.map((id, index) => ({
                id: id,
                urlImage: listFileUrl[id],
            })),
        };
        putApi(`${VMS}/blacklist/${id}`, params)
            .then((res) => {
                showSuccess('Cập nhật đối tượng danh sách đen thành công');
                history.push('/vms/black-list');
            })
            .catch((error) => { showError(error) })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            {showLoading || loading ? (
                <div>Loading...</div>
           ):(
            <>
            <Grid container spacing={6.5}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title='Đối tượng danh sách'
                            titleTypographyProps={{ sx: { mb: [2, 0] } }}
                            action={
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Box sx={{ float: 'right' }}>
                                            <Button 
                                            style={{background:'#E0D7D7',
                                            color:'#000000',
                                            right:'20px'}}
                                            component={Link}
                                            href={`/pages/face_management/list`}
                                            sx={{ color: 'blue' }}
                                             >
                                            Hủy
                                            </Button>
                                            <Button  style={{background:'#3B2828',color:'#FFFFFF'}}>
                                            Cập nhật
                                            </Button>
                                        </Box>
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
                        {modalImage && (
                                <ModalImage
                                    imageUrl={modalImage}
                                    onClose={() => {
                                        setModalImage(null);
                                    }}
                                />
                            )}
                            <div className={classes.container}>
                                <div className={classes.avatar_container}>
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            width: '192px',
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: '18px',
                                                lineHeight: '22px',
                                                color: 'rgba(0, 0, 0, 0.6)',
                                                margin: '0px',
                                            }}
                                        >
                                        Ảnh đại diện
                                        </p>
                                        <div
                                            style={{
                                                background: '#CED1D7',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                margin: 'auto',
                                                width: '192px',
                                                height: '192px',
                                            }}
                                        >
                                            <img
                                                alt=""
                                                src={avatarImage}
                                                style={{
                                                    marginBottom: `${avatarImage ? '' : '-10%'}`,
                                                    objectFit: 'contain',
                                                    width: `${avatarImage ? '100%' : ''}`,
                                                    height: `${avatarImage ? '100%' : ''}`,
                                                }}
                                            />
                                        </div>
                                        <TextBox
                                            id="eventName"
                                            eventName="eventName"
                                            placeholder={`Tên đối tượng`}
                                            stylingMode="outlined"
                                            defaultValue=""
                                            value={name || ''}
                                            mode="text"
                                            showClearButton
                                            style={{
                                                background: '#FFFFFF',
                                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                                borderRadius: '4px',
                                                marginTop: '10px',
                                            }}
                                            onInput={(e) => {
                                                setName(e.event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                {listFileUpload.length === 0 && (
                                <p style={{ margin: '35px 0px 0px 0px' }}>

                                    <div></div>

                                    {`Ảnh của đối tượng : ( tối đa 5 ảnh)`}
                                </p>
                                )}
                                {listFileUpload.length > 0 && (
                                    <p style={{ margin: '35px 0px 0px 0px' }}>
                                    { `Ảnh của đối tượng: ${listFileUpload.length}/5`}
                                    </p>
                                )}
                                <div
                                    style={{
                                        marginTop: '20px',
                                        minHeight: '422px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {listFileUpload.length === 0 && (
                                        <Fragment>
                                            <div
                                                className="cropper"
                                                style={{
                                                    display: 'flex',
                                                }}
                                                id="dropzone-external"
                                            >
                                                <div
                                                    style={{
                                                        margin: 'auto',
                                                        alignSelf: 'center',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <div>
                                                        <img alt="" src={"DragdropBG"} />
                                                    </div>
                                                    <p
                                                        style={{
                                                            fontSize: '16px',
                                                            lineHeight: '19px',
                                                            color: 'rgba(37, 37, 37, 0.6)',
                                                        }}
                                                    >
                                                        {`1ádaaaaaaaaaasdasdasda`}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: '16px',
                                                            lineHeight: '19px',
                                                            color: 'rgba(37, 37, 37, 0.84)',
                                                        }}
                                                    >
                                                        {`2ádasdasdasdasdasdasdasdas`}
                                                    </p>
                                                    {/* eslint-disable-next-line react/button-has-type */}
                                                    <button
                                                        style={{
                                                            background: '#00554A',
                                                            boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
                                                            borderRadius: '8px',
                                                            width: '104px',
                                                            height: '40px',
                                                            border: 'none',
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {`3adasdasdasdasdasdasdasd`}
                                                    </button>
                                                </div>
                                            </div>
                                            <FileUploader
                                                id="file-uploader"
                                                dialogTrigger="#dropzone-external"
                                                dropZone="#dropzone-external"
                                                multiple
                                                allowedFileExtensions={ALLOWED_FILE_EXTENSIONS}
                                                uploadMode="useButtons"
                                                visible={false}
                                                onValueChanged={onDragDropImage}
                                                ref={fileUploader1}
                                            />
                                        </Fragment>
                                    )}
                                    {listFileUpload.length > 0 && listImage.length > 0 && (
                                        <div className={classes.cardImageContainer}>
                                            {listImage.length < 5 && (
                                                <div className="add-btn card-img" id="dropzone-external-2">
                                                    <div style={{ alignSelf: 'center', margin: 'auto' }}>
                                                    <img style={{background:'red',marginLeft:'100px'}} src="data:image/svg+xml,%3Csvg width='32' height='34' viewBox='0 0 32 34' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17.9 15.1665H31.7441V18.6665H17.9V33.729H14.1191V18.6665H0.556641V15.1665H14.1191V0.604004H17.9V15.1665Z' fill='black' fill-opacity='0.6'/%3E%3C/svg%3E" alt="" />
                                                    
                                                    </div>
                                                    <FileUploader
                                                        id="file-uploader-2"
                                                        dialogTrigger="#dropzone-external-2"
                                                        dropZone="#dropzone-external-2"
                                                        multiple
                                                        allowedFileExtensions={ALLOWED_FILE_EXTENSIONS}
                                                        uploadMode="useButtons"
                                                        visible={false}
                                                        onValueChanged={(e) => {
                                                            onDragDropImage(e);
                                                        }}
                                                        ref={fileUploader2}
                                                    />
                                                </div>
                                            )}
                                            {listImage.map((image, index) => (
                                                <div className="card-img" key={index}>
                                                    <img
                                                        src={image}
                                                        alt=""
                                                        className="hover-image"
                                                        onDoubleClick={() => {
                                                            // setShowCopper(true);
                                                            setAvatarImage(image);
                                                            setFileAvatarImg(listFileUpload[listImage.indexOf(image)]);
                                                            setFileAvatarId(listFileId[listImage.indexOf(image)]);
                                                        }}
                                                    />
                                                    <IconButton
                                                        className="close"
                                                        onClick={() => {
                                                            const listFileUploadImgId = [...listFileId];
                                                            const listFileUploadTmp = [...listFileUpload];
                                                            const indexId = listFileUploadTmp.indexOf(image);
                                                            listFileUploadImgId.splice(indexId, 1);
                                                            listFileUploadTmp.splice(indexId, 1);
                                                            setListFileId(listFileUploadImgId);
                                                            setListFileUpload(listFileUploadTmp);
                                                            setListImage(listFileUploadTmp);
                                                        }}
                                                    >
                                                        -
                                                    </IconButton>
                                                    <IconButton
                                                        className="full"
                                                        onClick={() => {
                                                            setModalImage(image);
                                                        }}
                                                    >
                                                        <Fullscreen />
                                                    </IconButton>
                                                </div>
                                            ))}

                                        </div>
                                    )}
                                </div>
                            </div>  
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            </>
           )
           }

        </>
    );
};


const useStyles = makeStyles(() => ({
    cancelBtn: {
        width: '116px',
        height: '40px',
        background: '#E2E2E2',
        border: '1px solid #DDDDDD',
        boxSizing: 'border-box',
        borderRadius: '8px',
        '& .dx-button-content': { display: 'block' },
    },
    addBtn: {
        width: '104px',
        height: '40px',
        background: '#00554A',
        boxShadow: '0px 4px 10px rgba(16, 156, 241, 0.24)',
        borderRadius: '8px',
        color: '#fff',
        '& .dx-button-content': { display: 'block' },
    },
    container: {
        padding: '30px 50px 0px 50px',
        background: '#FFFFFF',
        boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
        borderRadius: '10px',
    },
    avatar_container: {
        width: '100%',
        '& .cropper': {
            height: '422px',
            float: 'left'
        },
        '& .cropper .box': {
            display: 'inline-block',
            padding: '10px',
            boxSizing: 'border-box',
        },
        '& .cropper .img-preview': {
            overflow: 'hidden',
        },
    },
    related_image: {
        height: '179px',
        width: '100%',
        marginTop: '28px',
    },
    vertical: {
        height: '180px',
        position: 'relative',
        float: 'right',
        marginTop: '-226.04px',
        marginRight: '28.9px',
    },
    icon: {
        float: 'right',
        position: 'relative',
        marginTop: '-420px',
        padding: '10px',
        color: '#fff',
    },
    cardImageContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexFlow: 'wrap',
        '& .add-btn': {
            border: '1.5px dashed rgba(0, 0, 0, 0.48)',
        },
        '& .card-img': {
            position: 'relative',
            width: '230px',
            height: '230px',
            display: 'flex',
            margin: '10px',
            '& .hover-image': {
                width: '100%',
                height: '100%',
                background: 'rgb(206, 209, 215)',
                objectFit: 'contain',
                borderRadius: '8px',
            },
        },
        '& .card-img .close': {
            display: 'none',
            padding: '0px',
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: '#000',
            backgroundColor: '#fff',
            '& .MuiIconButton-label': {
                width: '24px',
                height: '24px',
            },
        },
        '& .card-img:hover .close': {
            display: 'block',
        },
        '& .card-img .full': {
            display: 'none',
            padding: '0px',
            position: 'absolute',
            right: '10px',
            bottom: '10px',
            color: '#000',
            backgroundColor: '#fff',
            '& .MuiIconButton-label': {
                width: '24px',
                height: '24px',
            },
        },
        '& .card-img:hover .full': {
            display: 'block',
        },
    },
}));

export default EditFaceManagement;
