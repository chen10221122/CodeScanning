import { useMemo } from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import { mappingChinese, mappingModuleType } from '@/pages/full/financingInstitution/common/dictionary';

import { TabsMap } from '../config/tabsConfig';

const mapC = mappingChinese as { [key: string]: string };
const mapMT = mappingModuleType as { [key: string]: string };
interface IProps {
  requestParams: any;
  currTabkey: string;
  total: number | string;
  regionName?: string;
}

const Export = (props: IProps) => {
  const { requestParams, currTabkey, regionName, total } = props;
  const filename = String(mapC[currTabkey] || '');
  const params = useMemo(() => {
    let data: any = { ...requestParams };
    // 基金请求参数需要特殊处理
    if (TabsMap.JJ === currTabkey) {
      data.intelligentSort = data.intelligentSort ?? 'FD0016_006';
      if (data.areas) {
        data.regionCode = data.areas;
      }
    } else {
      data.companyType = currTabkey;
    }
    return data;
  }, [requestParams, currTabkey]);
  return (
    <Wrap>
      <div className="total">
        共<span>{total}</span>条
      </div>
      <ExportDoc
        condition={{ ...params, module_type: mapMT[currTabkey] }}
        filename={`${regionName || ''}${filename}${dayjs(new Date()).format('YYYYMMDD')}`}
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
