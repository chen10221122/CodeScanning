import { FC, Fragment, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';

import { downloadFile, windowOpen } from '@/utils/download';
import { getExternalLink } from '@/utils/format';

import { Icon } from '../fileIcon/iconFont';
import styles from './style.module.less';

enum DownloadFlieType {
  'docx' = 'docx',
  'doc' = 'doc',
  'xls' = 'xls',
  'xlsx' = 'xlsx',
}

export const LinkToFile: FC<{ originalText: string; fileName?: string }> = memo(({ originalText, fileName }) => {
  const fileType = (url: string) => url.split('.').pop() as string;

  const linkToShowPage = getExternalLink(originalText, originalText.includes('pdf'));

  const handleDownload = useCallback(() => {
    const type = fileType(originalText);
    const name = (fileName ?? new Date()) + '.' + type;
    downloadFile(name, originalText, type);
  }, [originalText, fileName]);

  const handlePic = useMemoizedFn(() => {
    windowOpen(originalText);
  });

  const theFileType: string = fileType(originalText);

  const shouldDownloadTheFileOrOpenInNewTab = (fileType: string): React.ReactNode => {
    let node: React.ReactNode | undefined;
    switch (fileType.toLowerCase()) {
      case DownloadFlieType.doc:
      case DownloadFlieType.docx:
      case DownloadFlieType.xls:
      case DownloadFlieType.xlsx:
        node = (
          <span onClick={handleDownload}>
            <span className={styles.item}>查看</span>
            <Icon iconType={theFileType} height={14} />
          </span>
        );
        break;
      case 'jpg':
      case 'png':
      case 'jpeg':
        node = (
          <span onClick={handlePic}>
            <span className={styles.item}>查看</span>
            <Icon iconType={theFileType} height={14} />
          </span>
        );
        break;
      default:
        node = (
          <Link to={linkToShowPage}>
            <span className={styles.item}>查看</span>
            <Icon iconType={theFileType} height={14} style={{ width: '14px', height: '14px' }} />
          </Link>
        );
        break;
    }
    return node;
  };

  return <Fragment>{shouldDownloadTheFileOrOpenInNewTab(theFileType)}</Fragment>;
});
