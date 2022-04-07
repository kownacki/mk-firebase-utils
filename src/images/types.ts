export type ImageData = Blob | File;
export type ImageName = string;
export type DownloadUrl = string;

export interface Image {
  name: ImageName,
  url: DownloadUrl,
}
