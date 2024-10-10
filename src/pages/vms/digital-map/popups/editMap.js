import React, { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    Fade,
    Grid,
    IconButton,
    Popover,
    Typography,
    styled
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FileUploader } from 'devextreme-react'
import { getApi, postApi, putApi } from 'src/@core/utils/requestUltils'
import { TreeItem, TreeView } from '@mui/lab'

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


const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
        backgroundColor: theme.palette.action.hover
    },
    '& .MuiTreeItem-content': {
        paddingRight: theme.spacing(3),
        borderTopRightRadius: theme.spacing(4),
        borderBottomRightRadius: theme.spacing(4),
        fontWeight: theme.typography.fontWeightMedium
    },
    '& .MuiTreeItem-label': {
        fontWeight: 'inherit',
        paddingRight: theme.spacing(3)
    },
    '& .MuiTreeItem-group': {
        marginLeft: 0,
        '& .MuiTreeItem-content': {
            paddingLeft: theme.spacing(4),
            fontWeight: theme.typography.fontWeightRegular
        }
    }
}))

const StyledTreeItem = props => {
    // ** Props
    const { labelText, labelIcon, labelInfo, color, textDirection, disabled, ...other } = props

    return (
        <StyledTreeItemRoot
            {...other}
            label={
                <Box
                    sx={{
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        '& svg': { mr: 1 },
                    }}>
                    <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 500, textDecoration: textDirection }}>
                        {labelText}
                    </Typography>
                    {labelInfo ? (
                        <Typography variant='caption' color='inherit'>
                            {labelInfo}
                        </Typography>
                    ) : null}
                </Box>
            }
        />
    )
}

const EditMap = ({ show, onClose, setReload, data, typePopup }) => {
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState(null)
    const [treeData, setTreeData] = useState([])
    const [expandedNodes, setExpandedNodes] = useState([])

    const [fileUploadDataName, setFileUploadDataName] = useState(null)
    const [fileUploadDataId, setFileUploadDataId] = useState(null)
    const [fileUploadUrl, setFileUploadUrl] = useState(null)
    const [selectedArea, setSelectedArea] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [areaGroup, setAreaGroup] = useState([])

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({})

    useEffect(() => {
        setDetail(data)
        setFileUploadUrl(data?.img)
    }, [data])

    useEffect(() => {
        if (detail) {
            setDetailFormValue()
        }
    }, [detail])

    const setDetailFormValue = () => {
        reset(detail)
    }


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        fetchAreaGroup()
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onReset = values => {
        var detail = {}
        callback(detail)
        onClose()
    }

    const fetchAreaGroup = async () => {
        try {
            const res = await getApi(
                `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=ee7ab701-ca82-4917-96c1-847dfdd20814`)
            if (Array.isArray(res?.data)) {
                setAreaGroup(res?.data)
            } else {
                setAreaGroup([])
            }

        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        } finally {
            setLoading(false)
        }
    }


    const fetchChildrenById = async parentId => {
        try {
            const res = await getApi(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentId}`)
            setTreeData(prevTreeData => ({
                ...prevTreeData,
                [parentId]: res.data
            }))
        } catch (error) {
            console.error('Error fetching children:', error)

            return []
        }
    }

    const handleFetchChildren = nodeId => {

        // check nodeId have existed
        const isExpanded = expandedNodes.includes(nodeId)
        const childrenData = fetchChildrenById(nodeId)

        setTreeData(prevTreeData => ({
            ...prevTreeData,
            [nodeId]: childrenData
        }))

        if (isExpanded) {
            setExpandedNodes(expandedNodes.filter(id => id !== nodeId))
        } else {
            setExpandedNodes([...expandedNodes, nodeId])
        }
    }


    const handleUploadFileData = async e => {
        setLoading(true)
        const formData = new FormData()
        const files = e.value

        for (const file of files) {
            formData.append('files', file)
        }
        try {
            const res = await postApi(`https://sbs.basesystem.one/ivis/vms/api/v0/images/upload`, formData)
            setFileUploadDataName(e.value[0].name)
            setFileUploadDataId(res.data.id)
            setFileUploadUrl(res.data.urlImage)
            setLoading(false)
        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }

            return null
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = values => {

        // Tạo đối tượng detail để gửi đi
        const detail = {
            ...values,
            areaId: selectedArea?.id,
            areaCode: selectedArea?.code,
            areaName: selectedArea?.name,
            img: fileUploadUrl
        }

        if (data) {
            handleUpdate(detail)
        } else {
            handleAdd(detail)
        }

        onClose()
    }

    const handleAdd = values => {
        const params = {
            ...values
        }

        setLoading(true)
        postApi(`https://sbs.basesystem.one/ivis/infrares/api/v0/digital-maps`, { ...params })
            .then(() => {
                toast.success('Add Successfully')
                setReload()
                onClose()
            })
            .catch(error => {
                if (error && error?.response?.data) {
                    console.error('error', error)
                    toast.error(error?.response?.data?.message)
                } else {
                    console.error('Error fetching data:', error)
                    toast.error(error)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleUpdate = values => {
        const params = {
            ...values
        }

        setLoading(true)
        putApi(`https://sbs.basesystem.one/ivis/infrares/api/v0/digital-maps/${data.id}`, { ...params })
            .then(() => {
                toast.success('Data saved successfully')
                setReload()
                onClose()
            })
            .catch(error => {
                if (error && error?.response?.data) {
                    console.error('error', error)
                    toast.error(error?.response?.data?.message)
                } else {
                    console.error('Error fetching data:', error)
                    toast.error(error)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const renderTreeItems = nodes => {
        return nodes.map(node => {

            const hasChildren = treeData[node.id] && treeData[node.id].length > 0

            return (
                <StyledTreeItem
                    key={node?.id}
                    nodeId={node?.id.toString()}
                    labelText={node.name}
                    labelIcon='tabler:map'
                    icon={
                        node.isParent ? (
                            <Box display='flex' alignItems='center'>
                                <IconButton style={{ padding: '0px' }} onClick={() => handleFetchChildren(node.id)}>
                                    <Icon icon={expandedNodes.includes(node.id) ? 'tabler:chevron-down' : 'tabler:chevron-right'} />
                                </IconButton>
                            </Box>
                        ) : null
                    }
                    onClick={() =>
                        setSelectedArea(node)
                    }
                >
                    {hasChildren && renderTreeItems(treeData[node.id])}
                </StyledTreeItem>
            )

        })
    }

    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                TransitionComponent={Transition}
                onClose={onClose}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <DialogContent
                    sx={{
                        px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(10)} !important`],
                        py: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`]
                    }}
                >
                    <CustomCloseButton onClick={onClose}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                    </CustomCloseButton>
                    <Box sx={{ mb: 8, textAlign: 'left' }}>
                        <Typography variant='h5' sx={{ mb: 3 }}>
                            Edit Digital Map
                        </Typography>
                    </Box>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Controller
                                        name={"name"}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <CustomTextField
                                                fullWidth
                                                value={value}
                                                label={"Name Digital Map"}
                                                onChange={onChange}
                                                placeholder={"Name Digital Map"}
                                                error={Boolean(errors["name"])}
                                                aria-describedby='validation-basic-last-name'
                                                {...(errors["name"] && { helperText: 'This field is required' })}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Controller
                                        name={"areaName"}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <>
                                                <CustomTextField
                                                    fullWidth
                                                    value={selectedArea?.name || value}
                                                    label={"Area"}
                                                    placeholder={"Chose Area"}
                                                    onClick={handleClick}
                                                    aria-describedby='validation-basic-last-name'
                                                    InputProps={{
                                                        endAdornment: (
                                                            <IconButton>
                                                                <Icon icon="tabler:chevron-down" />
                                                            </IconButton>
                                                        ),
                                                    }}
                                                />
                                                <Popover
                                                    id={id}
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                    PaperProps={{
                                                        sx: {
                                                            maxHeight: 400,
                                                            width: 350, // Đặt width là 100%
                                                        },
                                                    }}
                                                >
                                                    <TreeView
                                                        aria-label='file system navigator'
                                                        expanded={expandedNodes}
                                                        defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                                                        defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                                                        sx={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}
                                                    >
                                                        {renderTreeItems(areaGroup)}
                                                    </TreeView>
                                                </Popover>

                                            </>
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Controller
                                        name={"areaCode"}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <CustomTextField
                                                fullWidth
                                                disabled
                                                value={selectedArea?.code || value}
                                                label={"Area Code"}

                                                // onChange={onChange}
                                                placeholder={"Area Code"}
                                                error={Boolean(errors["areaCode"])}
                                                aria-describedby='validation-basic-last-name'
                                                {...(errors["areaCode"] && { helperText: 'This field is required' })}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={12} sx={{ marginBottom: -1 }}>
                                    Image Of Digital Map
                                </Grid>
                                <Grid item xs={12}>
                                    {fileUploadUrl && (
                                        <>
                                            <div style={{
                                                width: "auto",
                                                height: 450,
                                                borderStyle: 'solid',
                                                borderWidth: 2,
                                                borderRadius: 2,
                                                borderColor: "#000"
                                            }}>
                                                <img
                                                    alt=''
                                                    src={fileUploadUrl}
                                                    style={{
                                                        objectFit: "cover",
                                                        maxHeight: 450,
                                                        maxWidth: '100%',
                                                        padding: 5
                                                    }}
                                                />
                                            </div>
                                            {fileUploadDataName && (
                                                <div>
                                                    <div
                                                        style={{
                                                            width: '100%',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            padding: '10px 5px'
                                                        }}
                                                    >
                                                        <Typography>
                                                            {' '}
                                                            {fileUploadDataName}
                                                            <IconButton
                                                                style={{ float: 'right' }}
                                                                size='small'
                                                                onClick={() => {
                                                                    setFileUploadDataName(null)
                                                                    setFileUploadDataId(null)

                                                                    // setFileUploadUrl(null)
                                                                }}
                                                            >
                                                                <Icon icon='tabler:trash-x-filled' />
                                                            </IconButton>
                                                        </Typography>
                                                    </div>
                                                    <Button variant='contained' sx={{ float: 'right', marginTop: 2 }}>
                                                        <a
                                                            href={`https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/public/download/${fileUploadDataId}`}
                                                            target='_blank'
                                                            download
                                                            style={{ color: 'white', textDecoration: 'none' }}
                                                        >
                                                            download
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <br />
                                    {fileUploadUrl && !fileUploadDataName && (
                                        <div
                                            style={{
                                                borderStyle: 'dashed',
                                                borderWidth: 2,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '100px'
                                            }}
                                        >
                                            <FileUploader
                                                multiple={false}
                                                control={control}
                                                name='fileId'
                                                accept='*'
                                                uploadMode='useForm'
                                                selectButtonText='Drop files here or click to upload.'
                                                onValueChanged={e => handleUploadFileData(e)}
                                                labelText=''
                                            />
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions
                    sx={{

                    }}
                >
                    <Button
                        variant={'tonal'}
                        color={'secondary'}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default EditMap
