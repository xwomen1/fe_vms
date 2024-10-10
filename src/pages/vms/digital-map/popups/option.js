// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'

import { TreeItem, TreeView } from '@mui/lab'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getApi } from 'src/@core/utils/requestUltils'
import { Button } from '@mui/material'

const Toggler = styled(Box)(({ theme }) => ({
    right: 0,
    top: '50%',
    display: 'flex',
    cursor: 'pointer',
    position: 'fixed',
    padding: theme.spacing(2),
    zIndex: theme.zIndex.modal,
    transform: 'translateY(-50%)',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)(({ theme }) => ({
    width: 400,
    zIndex: theme.zIndex.modal,
    '& .MuiFormControlLabel-root': {
        marginRight: '0.6875rem'
    },
    '& .MuiDrawer-paper': {
        border: 0,
        width: 400,
        zIndex: theme.zIndex.modal,
        boxShadow: theme.shadows[9]
    }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
    padding: theme.spacing(5, 6)
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
                    <Icon icon={labelIcon} color={color} />
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

const Option = ({ keyword, keyword1, setKeyword, setCamera, cameraGroup, areaGroup }) => {
    // ** State
    const [open, setOpen] = useState(false)

    // ** Hook

    const [treeData, setTreeData] = useState([])
    const [expandedNodes, setExpandedNodes] = useState([])
    const [data, setData] = useState([])

    const handleSearch = e => {
        setKeyword(e)
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

    const renderTree = group => {

        return (
            <StyledTreeItem key={group.id} nodeId={group.id} labelText={group.name} labelIcon='tabler:folder'>
                {group.cameras && group.cameras.length > 0
                    ? group.cameras.map(camera => {

                        return (
                            <StyledTreeItem
                                key={camera.id}
                                nodeId={camera.id}
                                color={camera?.status == true ? '#28c76f' : ''}

                                // textDirection={camera.id === idCameraSelected ? 'underline' : ''}
                                labelText={camera.deviceName}
                                labelIcon='tabler:camera'
                                onClick={() => setCamera(camera)}
                            />
                        )
                    })
                    : null}
            </StyledTreeItem>
        )
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
                >
                    {hasChildren && renderTreeItems(treeData[node.id])}
                </StyledTreeItem>
            )

        })
    }

    return (
        <div className='customizer'>
            <Toggler className='customizer-toggler' onClick={() => setOpen(true)}>
                <Icon icon='tabler:settings' />
            </Toggler>
            <Drawer open={open} hideBackdrop anchor='right' variant='persistent'>
                <Box
                    className='customizer-header'
                    sx={{
                        position: 'relative',
                        p: theme => theme.spacing(3.5, 5),
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                        Digital map options
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Customize digital map</Typography>
                    <IconButton
                        onClick={() => setOpen(false)}
                        sx={{
                            right: 20,
                            top: '50%',
                            position: 'absolute',
                            color: 'text.secondary',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        <Icon icon='tabler:x' fontSize={20} />
                    </IconButton>
                </Box>

                <PerfectScrollbar options={{ wheelPropagation: false }}>
                    <CustomizerSpacing sx={{ py: 1 }} className='customizer-body'>
                        <Box>
                            <Typography>Camera List</Typography>
                            <CustomTextField
                                value={keyword}
                                placeholder='Search…'
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ mr: 2, display: 'flex' }}>
                                            <Icon fontSize='1.25rem' icon='tabler:search' />
                                        </Box>
                                    ),
                                    endAdornment: (
                                        <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                                            <Icon fontSize='1.25rem' icon='tabler:x' />
                                        </IconButton>
                                    )
                                }}
                                onChange={e => handleSearch(e.target.value)}
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
                            <Box sx={{
                                height: 'auto',
                                overflow: 'auto',
                                marginTop: '10px'
                            }}>
                                <TreeView
                                    sx={{ minHeight: 300 }}
                                    defaultExpanded={['root']}
                                    defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                                    defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                                >
                                    {cameraGroup.map(group => renderTree(group))}
                                </TreeView>
                            </Box>
                        </Box>
                    </CustomizerSpacing>

                    <Divider sx={{ m: '0 !important' }} />

                    <CustomizerSpacing sx={{ py: 1, minHeight: '350px' }} className='customizer-body'>
                        <Box>
                            <Typography>Area List</Typography>
                            <CustomTextField
                                value={keyword1}
                                placeholder='Search…'
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ mr: 2, display: 'flex' }}>
                                            <Icon fontSize='1.25rem' icon='tabler:search' />
                                        </Box>
                                    ),
                                    endAdornment: (
                                        <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                                            <Icon fontSize='1.25rem' icon='tabler:x' />
                                        </IconButton>
                                    )
                                }}
                                onChange={e => handleSearch(e.target.value)}
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
                            <Box sx={{
                                height: 'auto',
                                overflow: 'auto',
                                marginTop: '10px'
                            }}>
                                <TreeView
                                    aria-label='file system navigator'
                                    expanded={expandedNodes}
                                    defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                                    defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                                    sx={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}
                                >
                                    {renderTreeItems(areaGroup)}
                                </TreeView>
                            </Box>
                        </Box>
                    </CustomizerSpacing>

                    <Divider sx={{ m: '0 !important' }} />
                </PerfectScrollbar>
            </Drawer>
        </div>
    )
}

export default Option
