import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';

import { Icon } from '@/components';
import { Table as DzhTable, Empty } from '@/components/antd';
import Pagination from '@/components/Pagination';
import { RankItem } from '@/pages/area/areaEconomy/modules/areaRank/api';
import { mapOrder, useCtx } from '@/pages/area/areaEconomy/modules/areaRank/provider';
import { IRootState } from '@/store';
import { highlight } from '@/utils/dom';
import { windowOpen } from '@/utils/download';
import { emptyFilter, getExternalLink } from '@/utils/format';

import { useTable } from '../../hooks/useTable';
import S from './styles.module.less';

const pageSize = 50;
const Table = () => {
  const {
    state: {
      rankList,
      rankCount,
      screenCondition,
      scrollTargetRef,
      wholeModuleWrapperRef,
      categoryLoading,
      fullLoading,
    },
    update,
  } = useCtx();
  const havePay = useSelector((store: IRootState) => store.user.info).havePay;
  const history = useHistory();
  const handleClick = useMemoizedFn((o) => {
    update((d) => {
      d.detailModalVisible = true;
      d.activeDetailInfo = o;
    });
  });
  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${Number(screenCondition.skip) + 50}`.length * 14, 44),
        align: 'center',
        className: 'pdd-8',
      },
      {
        title: '公告日期',
        dataIndex: 'announcementDate',
        sorter: true,
        width: '96px',
        align: 'center',
      },
      {
        title: '榜单名称',
        dataIndex: 'name',
        width: '23%',
        align: 'left',
        render: (name: string, o: RankItem) => {
          return (
            <div className={S.rankName}>
              <div
                onClick={() => {
                  handleClick(o);
                }}
              >
                <span title={name}>
                  {screenCondition.keyWord ? highlight(name as string, screenCondition.keyWord) : name}
                  {o?.isHotList === '1' ? (
                    <Icon
                      style={{ width: 14, height: 14, marginLeft: 4, verticalAlign: 'text-top' }}
                      image={require('../../images/hot.svg')}
                    />
                  ) : null}
                </span>
              </div>
              {o.url ? (
                <div
                  onClick={() => {
                    if (o.url) {
                      const ret = getExternalLink(o.url);
                      if (typeof ret === 'string') {
                        windowOpen(o.url);
                      } else {
                        history.push(ret);
                      }
                    }
                  }}
                >
                  <Icon symbol={'iconHTML'} />
                </div>
              ) : null}
            </div>
          );
        },
      },
      {
        title: '榜单类型',
        dataIndex: 'category',
        sorter: true,
        align: 'left',
        render: (item: string, o: RankItem) => {
          return <div>{o.type}</div>;
        },
      },
      {
        title: '年度',
        dataIndex: 'year',
        sorter: true,
        width: 62,
        render: (item: string) => {
          return <div>{emptyFilter(item, '-')}</div>;
        },
      },
      {
        title: '发布单位',
        dataIndex: 'department',
        width: '21.6%',
        align: 'left',
        render: (item: string) => {
          return <div>{emptyFilter(item, '-')}</div>;
        },
      },
      {
        title: '数据来源',
        dataIndex: 'dataSource',
        width: '21.6%',
        align: 'left',
        render: (item: string) => {
          return <div>{emptyFilter(item, '-')}</div>;
        },
      },
    ];
  }, [handleClick, history, screenCondition.keyWord, screenCondition.skip]);
  const { loading, isSortOrPageRef } = useTable();

  /** 切换页数 */
  const handlePageChange = useMemoizedFn((p) => {
    if (!havePay && p > 5) {
      update((d) => {
        d.permissionModalVisible = true;
      });
      return;
    }
    scrollTargetRef?.scrollIntoView();
    update((d) => {
      d.screenCondition.skip = (p - 1) * pageSize;
    });
    isSortOrPageRef.current = true;
  });
  /** 排序变化 */
  const handleSortChange = useMemoizedFn((p, f, sorter) => {
    // scrollTargetRef?.scrollIntoView();
    isSortOrPageRef.current = true;

    update((d) => {
      d.screenCondition.skip = 0;
      d.screenCondition.sortKey = sorter.field;
      d.screenCondition.sortRule = mapOrder(sorter.order);
    });
  });

  const loadingTips = useMemo(() => {
    return (
      <span className={S.loadingTips}>
        <Icon
          style={{ width: 24, height: 24, marginTop: 20, zIndex: 1 }}
          image={require('@/assets/images/common/loading.gif')}
        />
        <span className={S.loadingText}>加载中</span>
      </span>
    );
  }, []);
  return rankList?.length ? (
    <div>
      <DzhTable
        dataSource={rankList}
        columns={columns}
        onChange={handleSortChange}
        className={S.tableStyleWrapper}
        type={'stickyTable'}
        sticky={{
          offsetHeader: 114,
          getContainer: () => wholeModuleWrapperRef || document.body,
        }}
        scroll={{ x: '100%' }}
        showSorterTooltip={false}
        loading={
          !categoryLoading && !fullLoading && loading
            ? {
                wrapperClassName: cn(S.tableLoadingWrapper, { [S.isSortOrPage]: isSortOrPageRef.current }),
                tip: '',
                indicator: loadingTips,
              }
            : false
        }
      />
      {rankCount && rankCount > 50 ? (
        <Pagination
          current={screenCondition.skip ? Number(screenCondition.skip) / 50 + 1 : 1}
          pageSize={50}
          total={rankCount}
          onChange={handlePageChange}
          style={{ padding: '8px 0px 0px', position: 'relative', left: '9px' }}
          align={'left'}
        />
      ) : null}
    </div>
  ) : (
    <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
  );
};
export default Table;

// const EmptyWrap = styled(Empty)`
//   .ant-empty-image {
//     width: 248px !important;
//     margin-top: 90px;
//   }
//   .ant-empty-description {
//     font-size: 13px !important;
//     color: #999999 !important;
//   }
// `;
