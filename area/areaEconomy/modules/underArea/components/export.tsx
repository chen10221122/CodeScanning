import dayjs from 'dayjs';
import styled from 'styled-components';

import { Switch, Tooltip } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Icon from '@/components/icon';
// import MoreBtn from '../../../components/traceBtn/moreBtn';

interface IProps {
  onChange: () => void;
  linkTo: string;
  requestParams?: any;
}

const Export = ({ requestParams, onChange }: IProps) => {
  return (
    <Wrap>
      <Tooltip title="财汇资讯新增数据溯源功能,便于用户快速査询指标数据来源。目前部分指标可溯源,更多指标溯源将陆续上线。">
        <i>
          <Icon style={{ width: 14, height: 14, position: 'relative' }} symbol="iconico_zhuanti_shiyongzhong2x" />
        </i>
      </Tooltip>
      <span className="source-text">溯源</span>
      <Switch size="small" onChange={onChange} />
      <ExportDoc
        condition={{
          ...requestParams.current,
          module_type: 'district_economy_web',
          exportFlag: true,
        }}
        filename={`辖区经济${dayjs(new Date()).format('YYYYMMDD')}`}
        style={{ marginLeft: '24px' }}
      />
      {/* <MoreBtn linkTo={linkTo} style={{ marginLeft: '24px' }} /> */}
    </Wrap>
  );
};

export default Export;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  .total {
    margin-right: 24px;
    color: #8c8c8c;
    font-size: 13px;
  }
  .source-text {
    margin: 0px 9px 0 6px;
    vertical-align: text-bottom;
  }
  .primary-hover {
    i {
      height: 22px;
    }
  }
`;
