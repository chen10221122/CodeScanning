import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { LoadingOutlined } from '@ant-design/icons';
import { useMemoizedFn, useRequest } from 'ahooks';
import dayjs from 'dayjs';

import Next from '@pages/area/areaF9/components/next';
import { useParams } from '@pages/area/areaF9/hooks';

import { Popover, Spin } from '@/components/antd';
import { EXPORT } from '@/components/exportDoc';
import { LINK_ENTERPRISE_DATA_VIEW } from '@/configs/routerMap';
import FilterTableTemplate from '@/layouts/filterTableTemplate';
import ModuleWrapper from '@/layouts/filterTableTemplate/moduleWrapper';
import { useOpenDataView } from '@/models/transmission';
import { useDispatch } from '@/pages/area/areaF9/context';
import { useImmer } from '@/utils/hooks';

import { getNewThirdAddDetail, transformCondition } from './api';
import S from './style.module.less';
import useColumns from './useColumns';
import useScreen from './useScreen';
import useTableData from './useTableData';

const loadingIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;
const linkLoadingStyle = { marginRight: 4, display: 'inline-block' };
export default function FinancingNewThird() {
  const domRef = useRef<any>(null);
  const dispatch = useDispatch();
  const havePay = useSelector((store: any) => store.user.info).havePay;
  const openDataView = useOpenDataView();
  const [condition, setCondition] = useImmer<any>({});
  // 获取地区代码
  const { regionCode } = useParams();
  const { screenConfig, handleMenuChange } = useScreen(setCondition);
  const stickyDom = domRef.current?.getDiv();

  const { loading, tableData, current, total, handleTableChange, onPageChange, loadType, error } = useTableData({
    condition,
    setCondition,
    stickyDom,
  });
  const DEFAULT_CONDITION = useMemo(() => {
    return {
      regionCode,
      listingSector: '',
      keyWord: '',
      from: 0,
      // 默认发行日期降序排
      sort: 'issueDate:desc',
      year: '',
    };
  }, [regionCode]);
  const columns = useColumns({ current, restParams: { keyWord: condition?.keyWord } });
  useEffect(
    function initCondition() {
      if (regionCode) {
        setCondition(() => Object.assign({ ...DEFAULT_CONDITION, regionCode }));
      }
    },
    [DEFAULT_CONDITION, regionCode, setCondition],
  );
  const onClear = () => {
    setCondition((d) => {
      d.keyWord = '';
    });
  };
  const handleSearch = (v: string) => {
    setCondition((d) => {
      d.keyWord = v;
    });
  };

  const { run: handleRequest1wData, loading: importLoading } = useRequest(getNewThirdAddDetail as any, {
    manual: true,
    onSuccess: (res: any) => {
      const list = res?.data?.data || [];

      openDataView(LINK_ENTERPRISE_DATA_VIEW, {
        indicators: [],
        rows: list?.map((d: any) => {
          return {
            key: d?.itCode,
            type: 'company',
            name: d?.name?.replace(/<em>(.*?)<\/em>/g, '$1'), // 去除高亮标签,
          };
        }),
      });
    },
  });
  const LinkToDataView = useMemoizedFn(() => {
    if (havePay) {
      handleRequest1wData({
        ...condition,
        skip: 0,
        pageSize: 1e4,
        moreFlag: true,
      });
    } else {
      dispatch((d: any) => {
        d.showMoreIndicDialog = true;
      });
    }
  });

  return (
    <ModuleWrapper ref={domRef} title="新三板定增明细">
      <FilterTableTemplate
        condition={condition}
        setCondition={setCondition}
        defaultCondition={DEFAULT_CONDITION}
        exportConfig={{
          condition: {
            ...transformCondition(condition),
            exportFlag: true,
          },
          usePost: false,
          filename: '新三板定增明细' + dayjs().format('YYYYMMDD'),
          type: EXPORT,
          module_type: 'regionalFinancingF9_equity_financing_newthreeboard',
        }}
        filterConfig={{
          screenConfig,
          handleMenuChange,
        }}
        customMenuRight={
          <Popover
            trigger={['hover', 'click']}
            placement="bottom"
            overlayClassName="areaCompany-filter-popover"
            arrowPointAtCenter={true}
            color="rgba(255,255,255,1)"
            getPopupContainer={() => domRef.current?.getDiv() || document.body}
            content={
              <div className="popover-content" onClick={LinkToDataView}>
                导入当前列表企业至<span>企业数据浏览器</span>支持查询更多指标
              </div>
            }
          >
            <div className={S.moreIndic} onClick={LinkToDataView}>
              {importLoading ? (
                <div style={linkLoadingStyle}>
                  <Spin indicator={loadingIcon} />
                </div>
              ) : null}
              <span>更多指标</span>
              <div className={S.vipIcon} />
            </div>
          </Popover>
        }
        error={error}
        tableConfig={{
          tableData,
          handleTableChange,
          current,
          total,
          loading,
          onPageChange,
          loadType,
          columns,
          tableScrollWidth: 1952,
          stickyDom,
        }}
        searchConfig={{ dataKey: 'areaFinancingNewThird', onClear, handleSearch }}
        headerFixConfig={{ screenTop: 0, tableTop: 40 }}
      />
      {!loading ? <Next /> : null}
    </ModuleWrapper>
  );
}
