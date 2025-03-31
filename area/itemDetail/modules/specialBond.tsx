import { memo, FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Empty, Table } from '@dzh/components';
import cn from 'classnames';
import { isNull } from 'lodash';

import { Card, emptyFilter } from '@pages/area/itemDetail';
import useTwoBookModal from '@pages/bond/specialBond/modules/projectSummary/hooks/useTwoBookModal';

import useAuthInfo from '@/auth/useAuthInfo';
import { Icon } from '@/components';
import { LINK_DETAIL_BOND } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface SpecialBondProps {
  bondDetail: any[];
  projectCode: string;
  projectName: string;
}
const SCROLL = { x: '100%' };
const CARD_STYLE = { marginBottom: 0 };
const SpecialBond: FC<SpecialBondProps> = ({ bondDetail, projectCode, projectName }) => {
  const history = useHistory();

  const { openTwoBookModal, noPermissionModal, bookModal } = useTwoBookModal();
  const { user } = useAuthInfo();
  const isVip = user.havePay;

  const columns = useMemo(
    () => [
      {
        title: '债券简称',
        dataIndex: 'bondName',
        width: 180,
        align: 'left',
        resizable: true,
        ellipsis: true,
        fixed: 'left',
        render: (text: any, { symbol, trCode }: { symbol: string; trCode: string }) => {
          const showText = `${emptyFilter(text)}${symbol ? `(${symbol})` : ''}`;
          return (
            <span
              className={cn({ 'link-underline': !!trCode })}
              title={showText}
              onClick={() =>
                history.push(urlJoin(dynamicLink(LINK_DETAIL_BOND), urlQueriesSerialize({ code: trCode, type: 'co' })))
              }
            >
              {showText}
            </span>
          );
        },
      },
      {
        title: '招标日期',
        width: 87,
        dataIndex: 'tenderDate',
        align: 'center',
        ellipsis: true,
        resizable: true,
        render: (text: any) => emptyFilter(text),
      },
      {
        title: '发行利率(%)',
        width: 108,
        dataIndex: 'issueRate',
        align: 'right',
        ellipsis: true,
        resizable: true,
        render: (text: any) => emptyFilter(text),
      },
      {
        title: '发行期限(年)',
        width: 108,
        dataIndex: 'bondTerm',
        align: 'right',
        ellipsis: true,
        resizable: true,
        render: (text: any) => emptyFilter(text),
      },
      {
        title: '专项债规模(亿)',
        width: 108,
        align: 'right',
        dataIndex: 'issueScale',
        ellipsis: true,
        resizable: true,
        render: (text: any) => emptyFilter(text),
      },
      {
        title: '用于项目规模(亿)',
        width: 125,
        align: 'right',
        dataIndex: 'theProjectAmount',
        ellipsis: true,
        resizable: true,
        render: (text: any) => emptyFilter(text),
      },
      {
        title: '用作资本金金额(亿)',
        width: 130,
        align: 'center',
        dataIndex: 'capitalAmount',
        ellipsis: true,
        resizable: true,
      },
      {
        title: (
          <span>
            信披文件
            <Icon
              image={require('@/components/sideMenuF9/images/VIP.svg')}
              size={12}
              style={{
                verticalAlign: '-2px',
                marginLeft: '2px',
              }}
            />
          </span>
        ),
        width: 90,
        align: 'center',
        dataIndex: 'book',
        ellipsis: true,
        resizable: true,
        render: (_: any, row: any) => {
          const hasFile = isVip ? !!row.oneCaseTwoBooks?.fileList?.length : !isNull(row.oneCaseTwoBooks);
          return (
            <span
              className={cn('ellipsis', { 'link-underline': hasFile })}
              onClick={() => hasFile && openTwoBookModal(row.oneCaseTwoBooks)}
            >
              {hasFile ? '查看' : '-'}
            </span>
          );
        },
      },
    ],
    [history, openTwoBookModal, isVip],
  );
  return (
    <Card title="专项债明细" style={CARD_STYLE}>
      {bondDetail.length ? (
        <Table rowKey="trCode" scroll={SCROLL} columns={columns as any} pagination={false} dataSource={bondDetail} />
      ) : (
        <Empty type={Empty.NO_DATA} />
      )}
      {noPermissionModal}
      {bookModal}
    </Card>
  );
};

export default memo(SpecialBond);
