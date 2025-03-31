import { FC, memo } from 'react';
import { useHistory } from 'react-router-dom';

import { Icon, Typography } from '@dzh/components';
import { useMemoizedFn, useReactive, useRequest } from 'ahooks';
import { message } from 'antd';
import { ParagraphProps } from 'antd/es/typography/Paragraph';

import { LINK_GO_WILD } from '@/configs/routerMap';
import { getSource, ProductListProp } from '@/pages/area/areaF9/modules/regionalOverview/industryPlaning/api';
import { getExternalLink } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import CopyIcon from './copy.svg';

const { Paragraph } = Typography;

type CopyConfig = Pick<ParagraphProps, 'copyable'>['copyable'];

interface Props {
  text: string;
  recordValue?: ProductListProp;
  rows?: number;
}

const CopyComponent: FC = () => {
  return (
    <>
      <Icon size={11} image={CopyIcon} />
      <span className="hover-no-bg">复制</span>
    </>
  );
};

const copyConfig: CopyConfig = {
  tooltips: false,
  icon: [<CopyComponent />, <CopyComponent />],
  onCopy: () => {
    message.success('复制成功');
  },
};

const TableParagraph: FC<Props> = ({ text, rows = 2, recordValue }) => {
  const copyableState = useReactive<{ current: CopyConfig }>({ current: copyConfig });
  const isEllipsis = useReactive<{ current: CopyConfig }>({ current: false });
  const history = useHistory();

  const { runAsync: getSourceInfo } = useRequest(getSource, {
    manual: true,
  });
  const closeCopy = useMemoizedFn(() => {
    isEllipsis.current = true;
    copyableState.current = false;
  });

  const addCopy = useMemoizedFn((event: any) => {
    event.stopPropagation();
    isEllipsis.current = false;
    copyableState.current = copyConfig;
  });
  const goToOriginUrl = useMemoizedFn(async () => {
    if (recordValue?.guid) {
      const sourceInfo = await getSourceInfo({
        guId: recordValue.guid,
      });

      if (sourceInfo?.data?.url) {
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
    <Paragraph
      ellipsis={{
        rows,
        expandable: true,
        onEllipsis: closeCopy,
        onExpand: (event: any) => {
          addCopy(event);
        },
      }}
      title={text}
      copyable={
        typeof copyableState.current === 'object'
          ? {
              ...copyableState.current,
              text,
            }
          : copyableState.current
      }
      onClick={goToOriginUrl}
    >
      {isEllipsis.current ? text : <span>{text}</span>}
    </Paragraph>
  );
};

export default memo(TableParagraph);
