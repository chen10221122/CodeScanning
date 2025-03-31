import { Flex } from '@/components/layout';
import Label from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal/label';

import style from '../../style.module.less';
import { RenderMode } from '../../useCommonColumn';

const newThirdAddColumn = [
  {
    title: '企业名称',
    dataIndex: 'name',
    width: 260,
    align: 'left',
    fixed: 'left',
    renderMode: RenderMode.LinkText,
  },
  {
    title: '股票代码',
    dataIndex: 'stockCode',
    width: 140,
    align: 'left',
    render: (text: string, row: Record<string, any>) => {
      let labelText = row.stockCodeLabel;
      return (
        <Flex>
          <div
            className={style.overflow}
            style={{
              textAlign: 'left',
              flex: 1,
              maxWidth: labelText ? 'calc(100% - 44px)' : '100%',
              whiteSpace: 'normal',
            }}
            title={text}
          >
            {text}
          </div>
          {labelText ? <Label labelText={labelText} /> : null}
        </Flex>
      );
    },
  },
  {
    title: '发行日期',
    dataIndex: 'issueDate',
    className: 'no-padding',
    width: 92,
  },
  {
    title: '市场分层',
    dataIndex: 'listingSector',
    width: 90,
  },
  {
    title: '募资总额(万元)',
    dataIndex: 'fundAmount',
    width: 124,
    align: 'right',
  },
  {
    title: '增发股份上市日',
    dataIndex: 'addIssueListingDate',
    width: 136,
    align: 'center',
  },
  {
    title: '增发价格(元)',
    dataIndex: 'addIssuePrice',
    width: 112,
    align: 'right',
  },
  {
    title: '增发数量(万股)',
    dataIndex: 'addIssueNumber',
    width: 124,
    align: 'right',
  },
  {
    title: '发行对象',
    dataIndex: 'issuerName',
    width: 250,
    sorter: false,
    align: 'left',
  },
  {
    title: '注册资本',
    dataIndex: 'registeredCapital',
    width: 114,
    align: 'right',
  },
  {
    title: '成立日期',
    dataIndex: 'foundData',
    className: 'no-padding',
    width: 92,
  },
  {
    title: '证监会行业',
    dataIndex: 'industryName',
    width: 192,
    align: 'left',
  },
  {
    title: '所属地区',
    dataIndex: 'regionName',
    width: 190,
    sorter: false,
    align: 'left',
  },
].map((o) => ({ ...o, resizable: true }));
export default newThirdAddColumn;
