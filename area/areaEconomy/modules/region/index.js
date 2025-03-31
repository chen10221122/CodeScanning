import { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import cn from 'classnames';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import IndexSvg from '@/assets/images/area/index.svg';
import { Empty, Row, Table, Spin } from '@/components/antd';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import useMainTop from '@/pages/area/areaEconomy/components/mainTop/useMainTop';
import TraceBtn from '@/pages/area/areaEconomy/components/traceBtn';
import ChartLayOutContainer from '@/pages/area/areaEconomy/modules/ChartLayOutContainer';
import InfoModal from '@/pages/area/areaEconomy/modules/region/infoModal';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import * as S from '../../style';
import useRegion from './useRegion';

const currentYear = new Date().getFullYear().toString();

export default function Region() {
  const history = useHistory();
  /** 隐藏空行 */
  const [hiddenChecked, setHiddenChecked] = useState(true);
  // data & hooks call
  const { loading, tableData, handleChangeData, traceType, hasData } = useRegion(hiddenChecked);
  const { mainTopData, areaDataInfo, hasGdpYear, pending } = useMainTop();
  const [modal, setModal] = useState({
    show: false,
    title: '',
    data: '',
  });
  const [skeletonLoading, setSkeletonLoading] = useState(false);

  const { state } = useCtx();

  const isLoading = useLoading(pending);
  useAnchor(isLoading);

  // 无数据时不显示滚动条
  useEffect(() => {
    const wrap = document.getElementById('tabsWrapper');
    if (wrap) {
      wrap.style.overflow = !hasData ? 'hidden' : '';
    }
    return () => {
      if (wrap) wrap.style.overflow = '';
    };
  }, [hasData]);

  useEffect(() => {
    let timer;
    // 加载时禁止滚动
    const wrap = document.getElementById('area_economy_container');
    if (wrap) {
      wrap.style.overflow = isLoading ? 'hidden' : '';
    }
    setTimeout(() => {
      setSkeletonLoading(isLoading);
    }, 500);
    return () => clearTimeout(timer);
  }, [isLoading]);

  /** 隐藏空行 */
  const handleChangeHidden = useCallback(() => {
    setHiddenChecked((base) => !base);
  }, []);

  //弹窗
  const handleShowModal = useCallback(
    (name, data) => {
      const regionName = state?.areaInfo?.regionInfo[0]?.regionName || '';
      const unUnitName = name?.lastIndexOf('(') ? name.slice(0, name.lastIndexOf('(')) : name;

      setModal({
        show: true,
        title: regionName + unUnitName,
        name,
        data,
      });
    },
    [state],
  );

  const handleClose = useCallback(() => {
    setModal((base) => {
      return { ...base, show: false };
    });
  }, []);

  // TODO: prevent repeatedly compute.
  const columns = [
    {
      title: '指标',
      align: 'left',
      width: 234,
      className: 'padding-left24 align-left',
      dataIndex: 'paramName',
      render: (text, row) => {
        const dataobj = cloneDeep(row.paramDetailArr) || {};
        /** 不展示预期目标列数据 */
        if (Object.keys(dataobj).includes(currentYear)) {
          delete dataobj[currentYear];
        }
        const hasHisitoryData = Object.keys(dataobj).length > 0;

        if (row.specialTitle) {
          return <span className="orange-title">{row.specialTitle}</span>;
        }
        return (
          <span
            onClick={() => {
              hasHisitoryData && handleShowModal(text, dataobj);
            }}
          >
            {text}
            {hasHisitoryData && (
              <img style={{ cursor: 'pointer', marginLeft: 8, width: 12, height: 12 }} src={IndexSvg} alt="" />
            )}
          </span>
        );
      },
    },
  ];

  // TODO: prevent repeatedly compute.
  tableData?.colKey?.length &&
    tableData.colKey.forEach((o, i) => {
      /** 是否是预期目标列 */
      const isExpectCol = i === 0;
      columns.push({
        title: isExpectCol ? tableData.colKey[i] + '年经济预期目标' : tableData.colKey[i] + '年',
        width: 158,
        className: i !== tableData?.colKey?.length - 1 ? 'padding-10 align-right' : 'align-right',
        align: 'right',
        dataIndex: tableData.colKey[i],
        render: (text, row) => {
          if (row.specialTitle) return null;
          return row[tableData.colKey[i] + 'guId'] && traceType ? (
            <span
              title={text}
              className={cn('trace-link-span', { 'clamp-col': isExpectCol })}
              onClick={() => {
                history.push(
                  urlJoin(LINK_INFORMATION_TRACE, urlQueriesSerialize({ guId: row[tableData.colKey[i] + 'guId'] })),
                );
              }}
            >
              {text || '-'}
            </span>
          ) : (
            <span className={cn({ 'clamp-col': isExpectCol })} title={text}>
              {text || '-'}
            </span>
          );
        },
      });
    });

  const hasTable = tableData?.data?.length;

  /*
    模块内部的全局加载，因为请求写在了外面，切换tab时外部的全局加载不会触发，只能在内部加一个全局加载
  */
  if (isLoading) return null;

  // 如果服务请求完成后 hasGdpYear 无数据，那么表明当前城市是无数据的
  if (!hasGdpYear) return <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />;

  return (
    <>
      <ChartLayOutContainer mainTopData={mainTopData} areaDataInfo={areaDataInfo} hasGdpYear={hasGdpYear} />
      {skeletonLoading ? (
        <SpinContainer>
          <Spin spinning={true} type="thunder"></Spin>
        </SpinContainer>
      ) : (
        <S.Container>
          {modal.show ? <InfoModal {...modal} onClose={handleClose} /> : null}
          <div className="sticky-top" />
          <div className="screen-wrap custom-area-economy-screen-wrap">
            <Row className="select-wrap">
              <div className="card-title">主要指标</div>
              <div className="select-right">
                {hasTable ? (
                  <TraceBtn
                    title="区域经济"
                    code={state?.areaInfo?.regionInfo?.[0]?.regionCode}
                    year={tableData.colKey[tableData.colKey.length - 1]}
                    onChange={handleChangeData}
                    checked={traceType}
                    isHiddenColumn={true}
                    hideExport={false}
                    hiddenChecked={hiddenChecked}
                    onChangeHidden={handleChangeHidden}
                  />
                ) : null}
              </div>
            </Row>
          </div>
          <div className="sticky-bottom" />
          <div className="area-economy-table-wrap">
            {hasData ? (
              <Table
                sticky={{
                  offsetHeader: 114,
                  getContainer: () => document.getElementById('tabsWrapper'),
                }}
                type="stickyTable"
                columns={columns}
                dataSource={tableData?.data}
              />
            ) : null}

            {!loading && !hasData ? <Empty type={Empty.NO_RELATED_DATA} /> : null}
          </div>
        </S.Container>
      )}
    </>
  );
}

const SpinContainer = styled.div`
  .loading-container {
    padding: 62px 0;
  }
`;
