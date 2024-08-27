// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'
import { purple } from '@mui/material/colors'

// ** Theme Config
import themeConfig from 'src/configs/themeConfig'

// ** Direction component for LTR or RTL
import Direction from 'src/layouts/components/Direction'

// ** Theme
import themeOptions from './ThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'

const ThemeComponent = props => {
  // ** Props
  const { settings, children } = props
  const whiteColor = '#FFF'
  const lightColor = '47, 43, 61'
  const darkColor = '208, 212, 241'
  const darkPaperBgColor = '#2F3349'
  const mainColor = lightColor

  // ** Pass merged ThemeOptions (of core and user) to createTheme function
  let theme = createTheme(themeOptions(settings, 'light'))

  const themes = createTheme({
    palette: {
      primary: {
        main: '#002060',
        light: '#002060',
        dark: '#002060',
        contrastText: whiteColor
      },
      secondary: {
        light: '#B2B4B8',
        main: '#A8AAAE',
        dark: '#949699',
        contrastText: whiteColor
      },
      customColors: {
        dark: darkColor,
        main: mainColor,
        light: lightColor,
        lightPaperBg: whiteColor,
        darkPaperBg: darkPaperBgColor,
        bodyBg: '#F8F7FA',
        trackBg: '#F1F0F2',
        avatarBg: '#DBDADE',
        tableHeaderBg: 'white'
      },
      error: {
        light: '#ED6F70',
        main: '#EA5455',
        dark: '#CE4A4B',
        contrastText: whiteColor
      },
      warning: {
        light: '#FFAB5A',
        main: '#FF9F43',
        dark: '#E08C3B',
        contrastText: whiteColor
      },
      info: {
        light: '#1FD5EB',
        main: '#00CFE8',
        dark: '#00B6CC',
        contrastText: whiteColor
      },
      success: {
        light: '#42CE80',
        main: '#28C76F',
        dark: '#23AF62',
        contrastText: whiteColor
      },

      grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        A100: '#F5F5F5',
        A200: '#EEEEEE',
        A400: '#BDBDBD',
        A700: '#616161'
      },
      action: {
        active: `rgba(${mainColor}, 0.54)`,
        hover: `rgba(${mainColor}, 0.04)`,
        selected: `rgba(${mainColor}, 0.06)`,
        selectedOpacity: 0.06,
        disabled: `rgba(${mainColor}, 0.26)`,
        disabledBackground: `rgba(${mainColor}, 0.12)`,
        focus: `rgba(${mainColor}, 0.12)`
      }
    },

    // primary: {
    //   light: '#8479F2',
    //   main: '#7367F0',
    //   dark: '#655BD3',
    //   contrastText: whiteColor
    // },
    // secondary: {
    //   light: '#B2B4B8',
    //   main: '#A8AAAE',
    //   dark: '#949699',
    //   contrastText: whiteColor
    // },

    divider: `rgba(${mainColor}, 0.16)`
  })

  // ** Set responsive font sizes to true
  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  return (
    <ThemeProvider theme={themes}>
      <Direction direction={settings.direction}>
        <CssBaseline />
        <GlobalStyles styles={() => GlobalStyling(theme)} />
        {children}
      </Direction>
    </ThemeProvider>
  )
}

export default ThemeComponent
