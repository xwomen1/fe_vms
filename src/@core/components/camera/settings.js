// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports
import Radio from '@mui/material/Radio'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import { TreeItem, TreeView } from '@mui/lab'
import Pagination from '@mui/material/Pagination'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import select from 'src/@core/theme/overrides/select'
import { shouldForwardProp } from '@mui/system'
import { Button, Grid } from '@mui/material'

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

const Customizer = ({ page, onSetPage, onSetSelectIndex, selectIndex, cameraList, sizeScreen, setSizeScreen }) => {
  // ** State
  const [open, setOpen] = useState(false)

  // ** Hook
  const { settings, saveSettings } = useSettings()
  const [expanded, setExpanded] = useState(['0'])
  const [totalPage, setTotalPage] = useState(1)
  const [totalPage1, setTotalPage1] = useState(1)
  const [pageList, setPageList] = useState([])
  const [page1, setPage1] = useState(0)
  const [selectedButton, setSelectedButton] = useState(1);
  useEffect(() => {
    if (cameraList[selectIndex]?.cameras?.length > 0) {
      setTotalPage(
        Math.ceil(cameraList[selectIndex].cameras.length / (sizeScreen.split('x')[0] * sizeScreen.split('x')[1]))
      )
    }
  }, [cameraList, sizeScreen])

  // ** Vars
  const {
    mode,
    skin,
    appBar,
    footer,
    layout,
    navHidden,
    direction,
    appBarBlur,
    themeColor,
    navCollapsed,
    contentWidth,
    verticalNavToggleType
  } = settings

  const StyledTreeItem = props => {
    // ** Props
    const { labelText, labelIcon, labelInfo, color, ...other } = props

    return (
      <StyledTreeItemRoot
        {...other}
        label={
          <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
            <Icon icon={labelIcon} color={color} />
            <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 500 }}>
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

  const handleNodeToggle = (event, nodeIds) => {
    onSetSelectIndex(nodeIds[0])
    setExpanded([nodeIds[0]])

    // onSetPage(1)
  }

  // useEffect(() => {
  //   onSetPage(1)
  // }, [totalPage])

  useEffect(() => {
    const list = []
    for (let i = 1; i < totalPage + 1; i++) {
      list.push(i)
    }
    setTotalPage1(Math.ceil(list?.length / 9))
    setPageList(list)
  }, [totalPage])

  const onSetPage1 = (newPage) => {
    setPage1(newPage);
    setSelectedButton(0);
  };

  const handleButtonClick = (index, page) => {
    onSetPage(page)
    setSelectedButton(index);
    console.log('index', index);
  };

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
            Hiển thị cctv
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tùy chỉnh hiển thị cctv</Typography>
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

        {/* <Icon fontSize='1.625rem' icon='tabler:layout-grid-add' /> */}
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <CustomizerSpacing sx={{ py: 1 }} className='customizer-body'>
            {/* Skin */}
            <Box sx={{ mb: 5 }}>
              <Typography>Lưới</Typography>
              <RadioGroup
                value={sizeScreen}
                row
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => setSizeScreen(e.target.value)}
              >
                <FormControlLabel value='1x1' label='1x1' control={<Radio />} />
                <FormControlLabel value='2x2' label='2x2' control={<Radio />} />
                <FormControlLabel value='3x3' label='3x3' control={<Radio />} />
                <FormControlLabel value='3x2' label='3x2' control={<Radio />} />
                <FormControlLabel value='4x3' label='4x3' control={<Radio />} />
                <FormControlLabel value='4x4' label='4x4' control={<Radio />} />
                <FormControlLabel value='6x4' label='6x4' control={<Radio />} />
                <FormControlLabel value='12x8' label='12x8' control={<Radio />} />
              </RadioGroup>
            </Box>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />
          <CustomizerSpacing sx={{ py: 1 }} className='customizer-body'>
            <Box sx={{ mb: 5 }}>
              <Typography>Nhóm Camera hiển thị</Typography>
              <TreeView
                expanded={expanded}
                onNodeToggle={handleNodeToggle}
                defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
              >
                {cameraList.length > 0 &&
                  cameraList.map((group, index) => {
                    return (
                      <StyledTreeItem
                        key={index}
                        labelText={`(${group.cameras?.length}) ${group.name} `}
                        nodeId={index + ''}
                        labelIcon='tabler:folder'
                        disabled={group.cameras?.length == 0}
                      >
                        {group.cameras && group.cameras?.length > 0
                          ? group.cameras.map((camera, idx) => {
                            // const matchedEvent = eventsData.find(event => event.id === camera.id)
                            // const status = matchedEvent?.status

                            return (
                              <StyledTreeItem
                                disabled={true}
                                key={camera?.id}
                                nodeId={camera?.id}
                                labelText={camera?.deviceName}
                                labelIcon='tabler:camera'

                              // onClick={() => handleItemClick(camera.id, camera.deviceName)}
                              />
                            )
                          })
                          : null}
                      </StyledTreeItem>
                    )
                  })}
              </TreeView>
            </Box>
          </CustomizerSpacing>
          <Divider sx={{ m: '0 !important' }} />
          <CustomizerSpacing>
            <Box sx={{ mb: 5 }}>
              <Typography>Trang </Typography>
              <Grid container spacing={2} sx={{ marginTop: '5px' }}>
                {page1 > 1
                  ? pageList?.slice((page1 - 1) * 9, page1 * 9).map((page, index) => (
                    <Grid item xs={4} key={index}>
                      <Button variant='contained'
                        onClick={() => handleButtonClick(index, page)}
                        sx={{
                          backgroundColor:
                            selectedButton === index ? 'success.main' : 'primary.main',
                        }}
                      >
                        {page}
                      </Button>
                    </Grid>
                  ))
                  : pageList?.slice(0, 9).map((page, index) => (
                    <Grid item xs={4} key={index}>
                      <Button variant='contained'
                        onClick={() => handleButtonClick(index, page)}
                        sx={{
                          backgroundColor:
                            selectedButton === index ? 'success.main' : 'primary.main',
                        }}
                      >
                        {page}
                      </Button>
                    </Grid>
                  ))}
              </Grid>

              <Pagination
                count={totalPage1}
                page={page1}
                onChange={(event, page) => onSetPage1(page)}
                color='primary'
                sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}
              />
            </Box>
          </CustomizerSpacing>
          <Divider sx={{ m: '0 !important' }} />
          <CustomizerSpacing className='customizer-body'>
            {/* Menu Layout */}
            <Box sx={{ mb: layout === 'horizontal' && appBar === 'hidden' ? {} : 5 }}>
              <Typography>Menu Layout</Typography>
              <RadioGroup
                row
                value={layout}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => {
                  saveSettings({
                    ...settings,
                    layout: e.target.value,
                    lastLayout: e.target.value
                  })
                }}
              >
                <FormControlLabel value='vertical' label='Chiều Dọc' control={<Radio />} />
                <FormControlLabel value='horizontal' label='Chiều ngang' control={<Radio />} />
              </RadioGroup>
            </Box>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />
        </PerfectScrollbar>
      </Drawer>
    </div>
  )
}

export default Customizer
