/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}