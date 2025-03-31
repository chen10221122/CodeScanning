import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import { IRootState } from '@/store';

import { CONTAINS, DEFAULT_EXPORT_INDEXES } from '../platforms';
interface IProps {
  tableParams: any;
  total: number | string;
  currentRadio: string;
}

const Export = (props: IProps) => {
  const uInfo = useSelector((store: IRootState) => store.user.info);
  const getUserFromReduxState = useMemoizedFn(() => uInfo?.basic_info?.user);
  const { tableParams, total, currentRadio } = props;
  const filename = `城投平台${currentRadio === CONTAINS ? '' : '(本级)'}`;
  return (
    <Wrap>
      <div className="total">
        共<span>{total}</span>条
      </div>
      <ExportDoc
        condition={{
          ...tableParams,
          user_replace: getUserFromReduxState(),
          indexes: DEFAULT_EXPORT_INDEXES,
          module_type: 'city_invest_platform_export',
          sheetNames: { 0: filename },
        }}
        filename={`${filename}${dayjs(new Date()).format('YYYYMMDD')}`}
      />
    </Wrap>
  );
};

export default Export;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  .total {
    margin-right: 24px;
    color: #333;
    font-size: 13px;
    span {
      padding: 0 4px;
      color: #ff9347;
    }
  }
`;
