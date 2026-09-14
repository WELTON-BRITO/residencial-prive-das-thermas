declare module '*.jsx' {
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module '*.js' {
  const value: any;
  export default value;
}

declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}
