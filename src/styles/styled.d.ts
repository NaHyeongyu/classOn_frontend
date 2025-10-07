import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      text: string
      textMuted: string
      textInverted: string
      bg: string
      surface: string
      surfaceAlt: string
      surfaceMuted: string
      border: string
      borderStrong: string
      borderMuted: string
      primary: string
      primaryHover: string
      primaryActive: string
      primarySurface: string
      navy: string
      mint: string
      success: string
      successSurface: string
      danger: string
      dangerHover: string
      dangerActive: string
      dangerSurface: string
      warning: string
      warningSurface: string
      info: string
      infoSurface: string
      gray50: string
      gray100: string
      gray150: string
      gray200: string
      gray300: string
      gray400: string
      gray500: string
      focusRing: string
      tableStripe: string
    }
    radii: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
    font: {
      size: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        display: string
      }
      lineHeight: {
        tight: number
        normal: number
        relaxed: number
      }
      weight: {
        regular: number
        medium: number
        semiBold: number
        bold: number
      }
    }
    shadow: {
      low: string
      medium: string
      high: string
      focusPrimary: string
    }
    spacing: {
      xxs: string
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      xxl: string
      layout: string
      section: string
      pageGap: string
    }
    motion: {
      duration: {
        short: string
        base: string
        long: string
      }
      easing: {
        standard: string
      }
    }
  }
}
