// ** React Imports
import { useState } from 'react'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

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

const ColorBox = styled(Box)(({ theme }) => ({
  width: 45,
  height: 45,
  cursor: 'pointer',
  margin: theme.spacing(2.5, 1.75, 1.75),
  borderRadius: theme.shape.borderRadius,
  transition: 'margin .25s ease-in-out, width .25s ease-in-out, height .25s ease-in-out, box-shadow .25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}))

const Customizer = ({ sizeScreen, setSizeScreen }) => {
  // ** State
  const [open, setOpen] = useState(false)

  // ** Hook
  const { settings, saveSettings } = useSettings()

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

  const handleChange = (field, value) => {
    saveSettings({ ...settings, [field]: value })
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
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <CustomizerSpacing className='customizer-body'>
            {/* Skin */}
            <Box sx={{ mb: 5 }}>
              <Typography>Trang</Typography>
              <RadioGroup
                value={sizeScreen}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => setSizeScreen(e.target.value)}
              >
                <FormControlLabel value='1' label='1x1' control={<Radio />} />
                <FormControlLabel value='2' label='2x2' control={<Radio />} />
                <FormControlLabel value='3' label='3x3' control={<Radio />} />
                <FormControlLabel value='4' label='4x4' control={<Radio />} />
                <FormControlLabel value='6' label='6x6' control={<Radio />} />
              </RadioGroup>
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
