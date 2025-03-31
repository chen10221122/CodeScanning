import { FC, memo } from 'react';

import { ProTableNews } from '@dzh/pro-components';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';

import ExportDoc from '@/components/exportDoc';
import { ProductListProp } from '@/pages/area/areaF9/modules/regionalOverview/industryPlaning/api';
import { SubTitleStyle } from '@/pages/area/areaF9/style';

import TableParagraph from './paragraph';
import { ContentStyle } from './style';

const sticky = { offsetHeader: 42 };

interface ContentProps {
  data: ProductListProp[];
  params: Record<string, any>;
  regionName: string;
}

const columns = [
  {
    title: '序号',
    dataIndex: 'idx',
    key: 'idx',
    width: 42,
    className: 'pd-8',
    align: 'center',
    fixed: 'left',
  },
  {
    title: '类型',
    dataIndex: 'industryTypeName',
    key: 'industryTypeName',
    width: 118,
    align: 'left',
    fixed: 'left',
    resizable: true,
  },
  {
    title: '产业规划',
    dataIndex: 'industryDetail',
    key: 'industryDetail',
    // ellipsis: false,
    render(text: string, record: ProductListProp) {
      return <TableParagraph text={text} recordValue={record} />;
    },
  },
] as ColumnsType<Record<string, any>>;

const Content: FC<ContentProps> = ({ data, params, regionName }) => {
  return (
    <ContentStyle>
      <SubTitleStyle>
        产业规划
        <div className="sub-export">
          <ExportDoc
            condition={{
              module_type: 'industryPlanList',
              exportFlag: true,
              isPost: true,
              ...params,
            }}
            filename={`${regionName}-产业规划-${dayjs().format('YYYYMMDD')}`}
          />
        </div>
      </SubTitleStyle>
      <ProTableNews dataSource={data} columns={columns} pagination={false} sticky={sticky} />
    </ContentStyle>
  );
};

export default memo(Content);
