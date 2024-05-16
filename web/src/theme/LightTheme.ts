import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const LIGHT_THEME: ThemeTypes = {
  name: 'LIGHT_THEME',
  dark: false,
  variables: {
    'border-color': '#e5eaef',
    shadow:
      '0px 6px 40px 0px rgba(21, 83, 79, 0.20),0px 6px 30px 0px rgba(24, 138, 131, 0.05)',
    g1: '85, 227, 204',
    'g-2': '79, 126, 196',
    gradient:
      'radial-gradient(circle,rgba(85, 227, 204, 1) 0%, rgba(61, 139, 253, 1) 150%)',
    gradient_2:
      'linear-gradient(124deg, rgba(23, 175, 166, 1) 0%, rgba(23, 175, 166, 1) 50%, rgba(61, 139, 253, 1) 100%);',
  },
  colors: {
    primary: '#17AFA6',
    primary20: '#D4F5F4',
    primary30: '#9AE2DE',
    primary50: '#00848C',
    primary40: '#17AFA6',
    primary60: '#02555A',
    secondary: '#3D8BFD',
    secondary20: '#CFE2FF',
    secondary30: '#9EC5FE',
    secondary50: '#0D6EFD',
    secondary60: '#0A58CA',

    info: '#17A2B8',
    success: '#28A745',
    accent: '#FFAB91',
    warning: '#FFC107',
    error: '#DC3545',

    grey: '#7D8A95',
    greyDark: '#54595E',
    greyLight: '#A9B3BD',

    textPrimary: '#212529',
    textSecondary: '#343A40',
    textSecondaryLight: '#6C757D',
    textDisable: '#DEE2E6',
    textDisable1: '#F9F9F9',

    borderColor: '#DEE2E659',
    inputBorder: '#DFE5EF',
    containerBg: '#ffffff',
    background: '#ffffff',
    bg: '#f9f9f9',
    hoverColor: '#f6f9fc',
    surface: '#fff',
    white: '#fff',
    black: '#000',
    'on-surface': '#212529',
    'on-surface-variant': '#fff',
  },
};
export { LIGHT_THEME };
