import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      text: string
      textMuted: string
      bg: string
      surface: string
      surfaceMuted: string
      border: string
      borderMuted: string
      primary: string
      primaryHover: string
      primaryActive: string
      primarySurface: string
      success: string
      successSurface: string
      danger: string
      dangerSurface: string
      warning: string
      warningSurface: string
      info: string
      gray50: string
      gray100: string
      gray150: string
      gray200: string
    }
    radii: {
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
      }
    }
    shadow: {
      soft: string
      focusPrimary: string
    }
  }
}

