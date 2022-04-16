declare module 'jsonstream2' {
  interface Options {
    recurse: boolean;
  }
  
  declare function parse(): NodeJS.ReadWriteStream;
  declare function parse(pattern: any): NodeJS.ReadWriteStream;
  declare function parse(patterns: any[]): NodeJS.ReadWriteStream;
  
  declare function stringify(): NodeJS.ReadWriteStream;
  
  declare function stringify(newlineOnly: NewlineOnlyIndicator): NodeJS.ReadWriteStream;
  
  type NewlineOnlyIndicator = false
  
  declare function stringify(open: string, sep: string, close: string): NodeJS.ReadWriteStream;
  
  declare function stringifyObject(): NodeJS.ReadWriteStream;
  declare function stringifyObject(open: string, sep: string, close: string): NodeJS.ReadWriteStream;
}
