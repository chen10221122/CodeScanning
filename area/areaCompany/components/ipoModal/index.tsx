/**相关公告 */
import { useCallback, useEffect, useMemo, useState, memo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { getStockAnnounceModal } from '@/apis/finance/stockIssuance';
import { LINK_ANNOUNCEMENT_DETAIL } from '@/configs/routerMap';
import { StockTableModal, EllipsisText, StockText } from '@/pages/finance/stockIssuance/components';
import useRequest from '@/utils/ahooks/useRequest';
import { dynamicLink, useHistory } from '@/utils/router';

import Style from '@/pages/detail/modules/enterprise/securitiesIssue/style.module.less';

const RelatedAnnouncements: React.FC<any> = ({ queryParams, visible, setVisible }) => {
  const history = useHistory();

  const [pager, setPager] = useState({
    current: 1,
    total: 0,
    pageSize: 50,
  });

  const [tableData, setTableData] = useState<any>([]);

  const { run, loading } = useRequest(getStockAnnounceModal, {
    manual: true,
    onSuccess(res) {
      if (res?.data) {
        setTableData(res.data);
        setPager((base) => {
          return { ...base, total: res.data.length };
        });
      }
    },
  });

  useEffect(() => {
    run({ ...queryParams });
  }, [queryParams, run]);

  //去公告详情页
  const toAnnouncementDetail = useMemoizedFn((obj) => {
    history.push(
      dynamicLink(LINK_ANNOUNCEMENT_DETAIL, {
        noticeType: obj.type,
        noticeId: obj.id,
        type: 'company',
        code: obj?.code,
      }),
    );
  });

  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${(pager.current - 1) * pager.pageSize}`.length * 8 + 22, 42),
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => {
          return <span>{(pager.current - 1) * pager.pageSize + i + 1}</span>;
        },
      },
      {
        title: '文件名称',
        dataIndex: 'title',
        width: 630,
        align: 'left',
        render: (text: string, obj: any) => {
          return obj?.type && obj?.id ? (
            <div
              className={Style.tableF9Link}
              onClick={() => {
                toAnnouncementDetail(obj);
              }}
            >
              <EllipsisText text={text} clamp={3} showTitle={true} />
            </div>
          ) : (
            <EllipsisText text={text} clamp={3} showTitle={true} />
          );
        },
      },
      {
        title: '日期',
        dataIndex: 'publishDate',
        width: 128,
        render: (text: string) => <StockText text={text} />,
      },
    ];
  }, [pager, toAnnouncementDetail]);

  const handleChangePage = useCallback((pager) => {
    setPager((base) => {
      return { ...base, current: pager.current };
    });
  }, []);

  return (
    <StockTableModal
      title="相关公告"
      visible={visible}
      setVisible={setVisible}
      columns={columns}
      dataSource={tableData}
      pager={pager}
      handleChangePage={handleChangePage}
      loading={loading}
    ></StockTableModal>
  );
};

export default memo(RelatedAnnouncements);
