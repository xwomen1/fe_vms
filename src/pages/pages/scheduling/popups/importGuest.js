import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, styled, Typography } from "@mui/material"
import React, { forwardRef, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Icon from 'src/@core/components/icon'
import { callApiExportFile, postApi } from "src/@core/utils/requestUltils"
import styles from 'styled-components'
import FileSaver from 'file-saver'
import { omit } from 'lodash';
import { utils, writeFile } from 'xlsx';

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
        transform: 'translate(7px, -5px)'
    }
}))

const DropContainer = styles.div`
  border: 3px dashed;
  border-color: ${(props) => (props.isDragReject ? '#f44336' : 'steelblue')};
  min-height: 80px;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 8px;
`;

const ImportGuest = ({ show, onClose, handleSuccess }) => {
    const [loading, setLoading] = useState(false)

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragReject,
    } = useDropzone({
        accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        maxSize: 1024 ** 3 * 3, // 3Gb
    });

    useEffect(() => {
        if (fileRejections && fileRejections.length) {
            // const { errors } = fileRejections[0];
            toast.error('Invalid file');
        }
    }, [fileRejections]);

    const downloadFileExample = async () => {
        setLoading(true);

        try {
            const response = await callApiExportFile(
                `https://sbs.basesystem.one/ivis/iam/api/v0/guests/get-create-guest-template`,
                'GET',
                null,
            );
            FileSaver.saveAs(response, `guest.xlsx`);

        } catch (error) {
            toast.error(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };


    const uploadFile = () => {
        if (!acceptedFiles || acceptedFiles.length <= 0) return;
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        postApi(`https://sbs.basesystem.one/ivis/iam/api/v0/guests/create-by-file`, formData)
            .then((rs) => {
                if (rs.data) {
                    const success = [];
                    const errors = [];
                    rs.data.forEach((item) => {
                        if (item.id) {
                            success.push(item);
                        } else {
                            errors.push(omit(item, 'deleted'));
                        }
                    });
                    handleSuccess(success);
                    if (errors.length > 0) {
                        showError(
                            `Thông tin ${errors.length} tải lên không hợp lệ, xem tệp kết quả tải về`,
                        );
                        const fileName = 'import-guest-result.xlsx';
                        const ws = utils.json_to_sheet(errors);
                        const wb = utils.book_new();
                        utils.book_append_sheet(wb, ws, 'result');
                        writeFile(wb, fileName);
                    }
                }
                close();
            })
            .catch((error) => {
                toast.error(error.message || "An error occurred during the upload.");
            })
            .finally(() => {
                setLoading(false)
                onClose()
            });
    };


    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                onClose={onClose}
                TransitionComponent={Transition}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <DialogContent
                    sx={{
                        px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(10)} !important`],
                        py: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(5)} !important`]
                    }}
                >
                    <CustomCloseButton onClick={onClose}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                    </CustomCloseButton>
                    <Box sx={{ mb: 4, textAlign: 'left' }}>
                        <Typography variant='h4' sx={{ mb: 3 }}>
                            Upload list
                        </Typography>
                    </Box>

                    <DropContainer {...getRootProps({ isDragReject })}>
                        <input {...getInputProps()} />
                        <Icon icon="tabler:file-upload" />
                        {acceptedFiles && acceptedFiles.length ? (
                            <div>
                                {React.Children.toArray(
                                    acceptedFiles.map((file) => (
                                        <p>
                                            {file.path} - {file.size} bytes
                                        </p>
                                    )),
                                )}
                            </div>
                        ) : (
                            <p>Import excel list file (*.xls, *.xlsx)</p>
                        )}
                    </DropContainer>

                </DialogContent>
                <DialogActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(10)} !important`],
                        py: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(5)} !important`]
                    }}
                >
                    <Box>
                        <Button
                            variant='contained'
                            color='success'
                            onClick={downloadFileExample}
                            endIcon={<Icon icon="tabler:file" />}
                        >
                            Simple Data
                        </Button>
                    </Box>
                    <Box>
                        <Button variant='contained' color='secondary' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type='submit' variant='contained' onClick={uploadFile} sx={{ marginLeft: 3 }}>
                            Agree
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default ImportGuest