declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*?inline' {
  const dataUrl: string
  export default dataUrl
}
