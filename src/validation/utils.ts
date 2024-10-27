export function isFile(input: any): input is File {
  return input instanceof File;
}
