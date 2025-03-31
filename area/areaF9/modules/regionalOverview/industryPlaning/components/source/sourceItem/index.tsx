import { FC, memo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';

import { LINK_GO_WILD } from '@/configs/routerMap';
import { getSource, SourceListProp } from '@/pages/area/areaF9/modules/regionalOverview/industryPlaning/api';
import { formatDate } from '@/utils/date';
import { getExternalLink } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { SourceItemStyle } from '../style';

const SourceItem: FC<SourceListProp> = ({ dataSource, guidInfo, time, title }) => {
  const history = useHistory();

  const { runAsync: getSourceInfo } = useRequest(getSource, {
    manual: true,
  });

  const handleSource = useMemoizedFn(async () => {
    if (guidInfo) {
      const sourceInfo = await getSourceInfo({
        guId: guidInfo,
      });

      if (sourceInfo && sourceInfo.data && sourceInfo.data.url) {
        const ret = getExternalLink(sourceInfo.data.url);
        if (typeof ret === 'string') {
          history.push(
            urlJoin(dynamicLink(LINK_GO_WILD), urlQueriesSerialize({ url: encodeURIComponent(sourceInfo.data.url) })),
          );
        }
      }
    }
  });

  return (
    <SourceItemStyle>
      <div className="source-item-title" title={title} onClick={handleSource}>
        {title}
      </div>
      <div className="source-item-tools">
        {time ? (
          <>
            <span className="source-item-time">{formatDate(time, 'YYYY-MM-DD', 'YYYY-MM-DD')}</span>
            <span className="source-item-dot">&nbsp;·&nbsp;</span>
          </>
        ) : null}
        <span className="source-item-source">{dataSource}</span>
      </div>
    </SourceItemStyle>
  );
};

export default memo(SourceItem);
