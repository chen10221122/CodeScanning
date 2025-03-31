import { memo, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';

import { Spin, Image } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import useData from '@pages/area/landTopic/modules/parcelDetail/useData';

import { useTitle } from '@/app/libs/route';
import ExportDoc from '@/components/exportDoc';
import TableF9 from '@/components/tableF9';
import { LINK_INFORMATION_TRACE /* LINK_GO_WILD */ } from '@/configs/routerMap';
/* import { downloadFile } from '@/utils/download';
import { getExternalLink } from '@/utils/format'; */
import { useWindowSize } from '@/utils/hooks';
import { shortId } from '@/utils/share';
import { urlQueriesSerialize } from '@/utils/url';

const TITLE_STYLE = { width: 128 };

const ParcelDetail = () => {
  const history = useHistory();
  const params = useParams<{ key: string }>();
  const { state }: { state?: { landName?: string; originLink?: string } } = useLocation();
  const title = state?.landName ? `地块详情-${state?.landName}` : '地块详情';
  useTitle(title);
  const landCode = state?.landName || '';
  const { loading, basicInfo, tradingInfo, contractInfo, guid } = useData(params.key, landCode);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width > 1279) {
      document.getElementById('tabsWrapper')!.style.overflowX = 'hidden';
    } else {
      document.getElementById('tabsWrapper')!.style.overflowX = 'overlay';
    }
  }, [width]);

  const handleLink = useMemoizedFn(() => {
    if (!guid) {
      return null;
    } else {
      history.push({
        pathname: LINK_INFORMATION_TRACE,
        search: urlQueriesSerialize({
          guid: guid,
        }),
        state: { title, originLink: state?.originLink || '' },
      });
    }

    /* const ext = guid?.split('.')?.pop()?.toLowerCase();

    if (['docx', 'doc', 'xls', 'xlsx', 'ppt'].includes(ext ?? '')) {
      downloadFile(dayjs().format('YYYY-MM-DD'), guid, ext);
    } else {
      let ret = getExternalLink(guid);

      if (typeof ret === 'string') {
        history.push(urlJoin(dynamicLink(LINK_GO_WILD), urlQueriesSerialize({ guid: encodeURIComponent(ret) })));
      } else {
        history.push(ret);
      }
    } */
  });

  return (
    <Container>
      {loading ? (
        <Spin type="fullThunder" spinning={loading} />
      ) : (
        <div className="inner-wrapper">
          <header>
            <span className="title ellipsis2" title={title}>
              {title}
            </span>
            <span className="check-source" onClick={handleLink}>
              <Image src={require('@/pages/area/landTopic/images/html_filled.svg')} />
              查看信源
            </span>
          </header>
          <div className="divider" />
          <div className="main">
            <div className="title flex-title">
              基本信息
              <ExportDoc
                condition={{
                  isPost: true,
                  exportFlag: true,
                  module_type: 'landDetail_web',
                  fileUrl: '/100000/area/industrialPlaning',
                  sheetNames: { '0': '宗地详情' },
                  frequency: 1,
                  mainCode: params.key,
                  downloadType: 'export',
                  fileType: 3,
                  fileId: shortId(),
                  landCode: landCode,
                }}
                filename={`地块详情_${state?.landName}_${dayjs().format('YYYYMMDD')}`}
              />
            </div>
            <TableF9 data={basicInfo} titleStyle={TITLE_STYLE} />
            <div className="title">土地交易信息</div>
            <TableF9 data={tradingInfo} titleStyle={TITLE_STYLE} />
            <div className="title">合同信息</div>
            <TableF9 data={contractInfo} titleStyle={TITLE_STYLE} />
          </div>
        </div>
      )}
    </Container>
  );
};

export default memo(ParcelDetail);

const Container = styled.div`
  min-width: 1280px;
  height: 100%;
  overflow: auto;
  background: #fafbfc;
  .inner-wrapper {
    width: 82.813%; // 1060 / 1280
    min-height: 100%;
    margin: auto;
    background: #fff;
    display: flex;
    flex-direction: column;
    header {
      height: fit-content;
      padding: 12px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 17px;
        font-weight: 500;
        color: #262626;
        line-height: 24px;
        max-width: 880px;
      }
      .check-source {
        font-size: 13px;
        color: #0171f6;
        text-decoration: none;
        cursor: pointer;
        img {
          margin-right: 4px;
        }
      }
    }
    .divider {
      height: 6px;
      background: #f6f6f6;
    }
    .main {
      flex: 1;
      min-height: 0;
      padding: 12px 32px 16px;

      .title {
        position: relative;
        margin-bottom: 8px;
        font-size: 15px;
        line-height: 23px;
        font-weight: 500;
        color: #141414;
        ::before {
          content: '';
          position: absolute;
          left: -9px;
          top: 4.5px;
          width: 3px;
          height: 14px;
          background: #ff9347;
          border-radius: 2px;
        }
        &:nth-of-type(n + 2) {
          margin-top: 16px;
        }
      }
      .flex-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      td {
        padding: 4px 10px !important;
        line-height: 19px;
      }
      .link {
        color: #0171f6;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;
