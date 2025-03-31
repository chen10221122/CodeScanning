import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

import Icon from '@/components/icon';
import { downloadFile, windowOpen } from '@/utils/download';
import { getExternalLink, getFileSymbolName } from '@/utils/format';
import { transformUrl } from '@/utils/url';

export const TableTitle = ({ title }: { title: string | JSX.Element }) => {
  return <Title>{title}</Title>;
};

export const Rating = ({ text, fileUrl, rateYear }: { text?: string; fileUrl?: string; rateYear?: string }) => {
  const history = useHistory();
  const FileType = (url: string) => url.split('.').pop() || '';
  const icon = fileUrl ? (
    <Icon style={{ width: '14px', height: '14px', marginLeft: '4px' }} symbol={getFileSymbolName(fileUrl)} />
  ) : null;
  return (
    <div
      style={{ cursor: 'pointer' }}
      onClick={() => {
        if (!fileUrl) return;
        const type = FileType(fileUrl);
        const name = new Date() + '.' + type;
        if (['docx', 'doc', 'xls', 'xlsx'].includes(type)) {
          downloadFile(name, fileUrl, type);
        } else {
          const ret = getExternalLink(fileUrl);
          if (typeof ret === 'string') {
            windowOpen(transformUrl(fileUrl)!, '_parent');
          } else {
            history.push(ret);
          }
        }
      }}
    >
      <>
        <span>{text || '-'}</span>
        {rateYear ? (
          <span style={{ marginLeft: '4px' }}>
            ({rateYear}
            {icon})
          </span>
        ) : (
          icon
        )}
      </>
    </div>
  );
};

const Title = styled.div`
  text-align: center;
`;

export const TextOverflow = styled.span<{ row: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.row}; //行数
  -webkit-box-orient: vertical;
  /* span {
    color: #025cdc;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  } */
`;

export const PopoverWrapper = styled.span`
  display: flex !important;
  align-items: center;
  .update-help-img {
    margin-left: 4px;
  }
`;
