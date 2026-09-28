declare module 'vtex.device-detector' {
  export interface DeviceInfo {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
  }

  export function useDevice(): DeviceInfo
}