export type ConfigProps = {
  Sidebar_drawer: boolean | null;
  Customizer_drawer: boolean;
  mini_sidebar: boolean;
  setHorizontalLayout: boolean;
  setRTLLayout: boolean;
  actTheme: string;
  inputBg: string;
  boxed: boolean;
  setBorderCard: boolean;
};

const config: ConfigProps = {
  Sidebar_drawer: null,
  Customizer_drawer: false,
  mini_sidebar: false,
  setHorizontalLayout: false, // Horizontal layout
  setRTLLayout: false, // RTL layout
  actTheme: 'LIGHT_THEME',
  inputBg: 'LIGHT_THEME',
  boxed: true,
  setBorderCard: false,
};

export default config;
