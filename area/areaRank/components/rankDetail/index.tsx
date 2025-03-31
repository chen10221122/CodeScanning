import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';

import { getRankDetail, RankDetailApiData, RankDetailItem } from '@pages/area/areaRank/api';

import { Icon } from '@/components';
import { Modal, Spin, Table as DzhTable } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { LINK_AREA_F9 } from '@/configs/routerMap';
import { dateFilter } from '@/utils/date';
import { windowOpen } from '@/utils/download';
import { formatNumber, getExternalLink } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { transformUrl, urlJoin, urlQueriesSerialize } from '@/utils/url';

import { useCtx } from '../../provider/index';
import S from './styles.module.less';
const WithTitleSpan = ({ title }: { title: string }) => {
  return <span title={title}>{title}</span>;
};
// 有效可跳转的地区代码 （不包括香港、澳门）
const isCorrectArea = (code?: string) => {
  return code && code.length === 6 && !['810000', '820000'].includes(code);
};
export default function RankDetail() {
  const {
    state: { detailModalVisible, activeDetailInfo, wholeModuleWrapperRef },
    update,
  } = useCtx();
  const history = useHistory();
  const wrapperRef = useRef(null);
  const [data, setData] = useState<RankDetailApiData>({} as RankDetailApiData);
  const [pageNum, setPageNum] = useState(1);
  const { loading, run } = useRequest(getRankDetail, {
    manual: true,
    onSuccess({ data }: { data: RankDetailApiData }) {
      if (data) {
        data.itemList.forEach((o, i) => {
          o['key'] = 50 * (pageNum - 1) + i + 1;
        });
        setData(data);
      }
    },
  });
  const columns = useMemo(() => {
    let defaultColumns: any = [
      {
        title: '排名',
        dataIndex: 'rank',
        width: data.hasRanking === '1' && data.hasIndicators === '1' ? 200 : 374,
        render: (v: string | number) => {
          return (
            <div className={S.rankWrap}>
              {Number(v) < 4 ? <span className={cn(S.rankIcon, [S[`top${v}`]])} /> : null}
              {v > 3 ? <span className={S.rankText}>{v}</span> : null}
            </div>
          );
        },
      },
      {
        title: '地区',
        dataIndex: 'areaName',
        render: (v: string, item: RankDetailItem) => {
          return (
            <div
              onClick={() => {
                if (isCorrectArea(item.areaCode)) {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: item.areaCode }),
                      urlQueriesSerialize({
                        code: item.areaCode,
                      }),
                    ),
                  );
                }
              }}
              className={isCorrectArea(item.areaCode) ? S.link : ''}
            >
              {v}
            </div>
          );
        },
      },
    ];
    const indexColumn = {
      title: '序号',
      dataIndex: 'key',
      width: Math.max(`${pageNum * 50}`.length * 14, 44),
      className: 'pdd-8',
    };
    if (data.hasRanking === '0') {
      defaultColumns.splice(0, 1, indexColumn);
    }
    if (data.hasIndicators === '1') {
      defaultColumns.push({
        title: data.indexName,
        dataIndex: 'value',
        width: 366,
        render(o: string) {
          return <div>{o ? formatNumber(o, 2) : '-'}</div>;
        },
      });
    }
    return defaultColumns;
  }, [pageNum, data.hasIndicators, data.hasRanking, data.indexName, history]);
  const handleChange = useMemoizedFn((config) => {
    setPageNum(config.current);
    run({ tagCode: activeDetailInfo.code, skip: (config.current - 1) * config.pageSize, pageSize: config.pageSize });
  });
  useEffect(() => {
    if (detailModalVisible) {
      setPageNum(1);
      run({ tagCode: activeDetailInfo.code, skip: 0, pageSize: 50 });
    }
  }, [activeDetailInfo, detailModalVisible, run]);
  return (
    <Modal
      type="helpUpdateRemindModal"
      width={1000}
      footer={null}
      wrapClassName={S.modalWrapper}
      visible={detailModalVisible}
      onCancel={() => {
        update((d) => {
          d.detailModalVisible = false;
        });
      }}
      getContainer={() => wholeModuleWrapperRef}
      forceRender
    >
      <div ref={wrapperRef} className={S.wrapper}>
        <div className={S.stickyWrapper}>
          <div className={S.wrapTitle}>
            {activeDetailInfo.name}
            {activeDetailInfo.url ? (
              <span
                onClick={() => {
                  const ret = getExternalLink(activeDetailInfo.url);
                  if (typeof ret === 'string') {
                    windowOpen(transformUrl(activeDetailInfo.url));
                  } else {
                    history.push(ret);
                  }
                }}
              >
                <Icon symbol={'iconHTML'} />
              </span>
            ) : null}
          </div>
          <div className={S.briefInfo}>
            <dl>
              <dt>发布单位</dt>
              <dd>
                <WithTitleSpan title={activeDetailInfo.department} />
              </dd>
              <dt>数据来源</dt>
              <dd>
                <WithTitleSpan title={activeDetailInfo.dataSource} />
              </dd>
              <dt>公告日期</dt>
              <dd>{activeDetailInfo.announcementDate ? dateFilter(activeDetailInfo.announcementDate) : '-'}</dd>
            </dl>
            <div className={S.tableInfo}>
              <div className={S.count}>
                共<span> {formatNumber(data.total, 0)} </span>条
              </div>
              <div className={S.exportArea}>
                <ExportDoc
                  condition={{
                    module_type: 'region_list_detail',
                    tagCode: activeDetailInfo.code,
                    sheetNames: { 0: '地区榜单明细' },
                  }}
                  filename={`地区榜单明细${dayjs().format('YYYYMMDD')}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Spin wrapperClassName={S.spinningWrapper} type={'thunder'} spinning={loading} translucent useTag>
            {loading ? null : (
              <DzhTable
                dataSource={data.itemList}
                columns={columns}
                type={'stickyTable'}
                onChange={handleChange}
                pagination={{
                  size: 'small',
                  current: pageNum,
                  pageSize: 50,
                  total: data.total,
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                }}
                sticky={{ offsetHeader: 102, getContainer: () => wrapperRef.current }}
              />
            )}
          </Spin>
        </div>
      </div>
      <div className={S.bottomFixed}></div>
    </Modal>
  );
}
