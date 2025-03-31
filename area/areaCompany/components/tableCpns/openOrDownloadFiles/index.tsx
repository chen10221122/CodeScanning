import { FC, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';

import { downloadFile, windowOpen } from '@/utils/download';
import { getExternalLink } from '@/utils/format';
import { transformUrl } from '@/utils/url';

import { Icon } from './fileIcon';

enum DownloadFlieType {
  'docx' = 'docx',
  'doc' = 'doc',
  'xls' = 'xls',
  'xlsx' = 'xlsx',
  'jpg' = 'jpg',
  'png' = 'png',
  'jpeg' = 'jpeg',
  'zip' = 'zip',
  'rar' = 'rar',
  'tif' = 'tif',
  'wps' = 'wps',
  'tiff' = 'tiff',
  'csv' = 'csv',
  'et' = 'et',
  'txt' = 'txt',
  'xlsm' = 'xlsm',
  'bmp' = 'bmp',
  'docm' = 'docm',
  'ceb' = 'ceb',
  'gif' = 'gif',
}
/**
 * originalText
 */
export const LinkToFile: FC<{
  originalText: string;
  fileName?: string;
  height?: number;
  suffix?: string | React.ReactNode;
}> = memo(({ originalText, fileName, height, suffix }) => {
  const fileType = (url: string) => url?.split('.').pop() as string;

  const linkToShowPage = getExternalLink(originalText, originalText?.includes('pdf') || originalText?.includes('PDF'));

  const handleDownload = useCallback(() => {
    const type = fileType(originalText)?.toLowerCase();
    const name = (fileName ?? new Date()) + '.' + type;
    downloadFile(name, originalText, type);
  }, [originalText, fileName]);

  const handlePic = useMemoizedFn(() => {
    windowOpen(originalText);
  });

  const handleDownloadFiles = useMemoizedFn((addr) => {
    windowOpen(transformUrl(addr)!, '_parent');
  });

  const theFileType: string = fileType(originalText)?.toLowerCase();

  const shouldDownloadTheFileOrOpenInNewTab = (fileType: string): React.ReactNode => {
    let node: React.ReactNode | undefined;
    switch (fileType?.toLowerCase()) {
      case DownloadFlieType.doc:
      case DownloadFlieType.docx:
      case DownloadFlieType.xls:
      case DownloadFlieType.xlsx:
        node = (
          <span onClick={handleDownload}>
            {suffix ?? ''}
            <Icon iconType={theFileType} height={height ?? 14} />
          </span>
        );
        break;
      case DownloadFlieType.jpg:
      case DownloadFlieType.png:
      case DownloadFlieType.jpeg:
        node = (
          <span onClick={handlePic}>
            {suffix ?? ''}
            <Icon iconType={theFileType} height={height ?? 14} />
          </span>
        );
        break;
      case DownloadFlieType.zip:
      case DownloadFlieType.rar:
      case DownloadFlieType.tif:
      case DownloadFlieType.wps:
      case DownloadFlieType.tiff:
      case DownloadFlieType.csv:
      case DownloadFlieType.et:
      case DownloadFlieType.txt:
      case DownloadFlieType.xlsm:
      case DownloadFlieType.bmp:
      case DownloadFlieType.docm:
      case DownloadFlieType.ceb:
      case DownloadFlieType.gif:
        node = (
          <span onClick={() => handleDownloadFiles(originalText)}>
            {suffix ?? ''}
            <Icon iconType={theFileType} height={height ?? 14} />
          </span>
        );
        break;
      default:
        node = (
          <Link to={linkToShowPage}>
            {suffix ?? ''}
            <Icon iconType={theFileType} height={height ?? 14} style={{ width: '14px' }} />
          </Link>
        );
        break;
    }
    if (!originalText) {
      node = <>-</>;
    }
    return node;
  };
  return <>{shouldDownloadTheFileOrOpenInNewTab(theFileType)}</>;
});
