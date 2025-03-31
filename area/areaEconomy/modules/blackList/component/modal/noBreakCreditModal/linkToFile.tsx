import { FC, Fragment, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import Icon from '@/components/icon';
import { downloadFile } from '@/utils/download';
import { getExternalLink } from '@/utils/format';

import { file, html, pdf, png, ppt, txt, word, zip, jpg, tif, exc } from './images';

enum OpenFileType {
  'html' = 'html',
  'zlib' = 'zlib',
  'pdf' = 'pdf',
}

interface LinkToFileProps {
  originFileUri: string;
  size?: number;
  pdfSymbol?: boolean;
  pdfDownLoad?: boolean;
  text?: string;
}

const filtTypeMap = new Map([
  ['pdf', pdf],
  ['zip', zip],
  ['zlib', zip],
  ['rar', zip],
  ['txt', txt],
  ['htm', html],
  ['html', html],
  ['png', png],
  ['jpg', jpg],
  ['jpeg', jpg],
  ['tif', tif],
  ['bmp', png],
  ['ppt', ppt],
  ['wps', word],
  ['docx', word],
  ['doc', word],
  ['xls', exc],
  ['xlsx', exc],
  ['shtml', html],
]);

export const LinkToFile: FC<LinkToFileProps> = memo(({ originFileUri, size = 14, pdfSymbol, pdfDownLoad, text }) => {
  const fileType = (url: string): string => url.split('.').pop() as string;

  const linkToShowPage = getExternalLink(originFileUri, false);

  const handleDownload = useCallback(() => {
    downloadFile(String(Date.now()) as unknown as string, originFileUri, fileType(originFileUri));
  }, [originFileUri]);

  const theFileType: string = fileType(originFileUri);

  const shouldDownloadTheFileOrOpenInNewTab = (fileType: string): React.ReactNode => {
    let node: React.ReactNode | undefined;
    const fileImage = filtTypeMap.get(fileType) || file;
    switch (fileType) {
      case OpenFileType.html:
      case OpenFileType.zlib:
        node = (
          <Link to={linkToShowPage}>
            <Icon image={fileImage} size={size} />
            {text ? <span className="text">{text}</span> : ''}
          </Link>
        );
        break;
      case OpenFileType.pdf: {
        // cdn的pdf直接打开，外链的pdf下载
        const isCDN = originFileUri.includes('finchina.com');
        if (isCDN && !pdfDownLoad) {
          node = (
            <Link to={linkToShowPage}>
              {pdfSymbol ? <Icon symbol="iconicon_mxpdf_normal" /> : <Icon image={fileImage} size={size} />}
              {text ? <span className="text">{text}</span> : ''}
            </Link>
          );
        } else {
          node = (
            <span onClick={handleDownload} style={{ cursor: 'pointer' }}>
              {pdfSymbol ? <Icon symbol="iconicon_mxpdf_normal" /> : <Icon image={fileImage} size={size} />}
              {text ? <span className="text">{text}</span> : ''}
            </span>
          );
        }
        break;
      }
      default:
        node = (
          <span onClick={handleDownload} style={{ cursor: 'pointer' }}>
            <Icon image={fileImage} size={size} />
            {text ? <span className="text">{text}</span> : ''}
          </span>
        );
        break;
    }
    return node;
  };

  return <Fragment>{shouldDownloadTheFileOrOpenInNewTab(theFileType)}</Fragment>;
});
