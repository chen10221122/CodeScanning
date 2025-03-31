import { FC, memo } from 'react';

import { Icon } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';

import { endDate, ENDDATE_SUFFIX, startDate, STARTDATE_SUFFIX } from '@/components/publicSentimentModal/constant';
import { useNewsDetail } from '@/globalComponent/newsDetail';
import {
  TextOverWithMoreStyle,
  TextOverWithMoreProps,
} from '@/pages/publicOpinionPages/monitoring/components/table/textOverflow';
import MoreIcon from '@/pages/publicOpinionPages/monitoring/modules/overview/images/more.svg';
import { formatDate } from '@/utils/date';
import { redirectToRisk } from '@/utils/redirectToRiskGlobal';

// 表格 重要负面列 的组件
const TextOverWithMore: FC<TextOverWithMoreProps> = (props) => {
  const openModal = useNewsDetail(
    'detail_enterprise_overview_newsNotice',
    [
      {
        ...props.row.negativeInfo,
        related: [
          {
            code: props.row.negativeInfo,
            type: 'company',
            lastLevel: props.row.negativeInfo.lastLevel,
          },
        ],
      },
    ],
    {
      code: props.row.itCode2,
      type: 'riskMonitor_news',
      skip: 0,
      size: 30,
      startDate: startDate + STARTDATE_SUFFIX,
      endDate: endDate + ENDDATE_SUFFIX,
      negative: -1,
      importance: 1,
      f9Below: true,
      scene: 'negativeNews',
      relatedData: '0',
    },
  );

  const { text, row } = props;

  // 跳转打开弹窗
  const handleToNegativeModal = useMemoizedFn(() => {
    if (row.negativeInfo) {
      redirectToRisk(row.negativeInfo.code, row.companyName, row.negativeInfo.count, 'company', 'negativeNews');
    }
  });

  const clickFunc = useMemoizedFn(() => openModal(props.row.negativeInfo, 0));

  return (
    <TextOverWithMoreStyle>
      <div className={cn('text-over-text', { 'monitoring-table-link': text })} title={text} onClick={clickFunc}>
        {text || '-'}
      </div>
      <div className="text-over-tools">
        {row.negativeInfo.date ? <span className="text-over-date">{formatDate(row.negativeInfo.date)}</span> : null}
        {text ? (
          <span className="text-over-more" onClick={handleToNegativeModal}>
            <span>更多</span>
            <Icon size={6} image={MoreIcon} />
          </span>
        ) : null}
      </div>
    </TextOverWithMoreStyle>
  );
};

export default memo(TextOverWithMore);
