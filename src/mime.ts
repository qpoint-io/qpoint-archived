
export const mimeCategory = (contentType: string): string => {
  // truncate the content/type to just the type, not encoding etc
  contentType = contentType.split(';')[0];

  if (isApp(contentType))
    return 'app';

  if (isCss(contentType))
    return 'css';

  if (isJs(contentType))
    return 'js';

  if (isFont(contentType))
    return 'font';

  if (isImage(contentType))
    return 'image';

  if (isMedia(contentType))
    return 'media';

  return 'other';
}

const isApp = (contentType: string) => (
  ['text/html', 'application/json', 'application/grpc', 'text/xml', 'application/xml'].includes(contentType)
)

const isCss = (contentType: string) => (
  contentType == 'text/css'
)

const isJs = (contentType: string) => (
  contentType == 'text/javascript'
)

const isFont = (contentType: string) => (
  contentType.startsWith('font')
)

const isImage = (contentType: string) => (
  contentType.startsWith('image')
)

const isMedia = (contentType: string) => (
  contentType.startsWith('audio') || contentType.startsWith('video')
)