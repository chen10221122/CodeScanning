import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBoolean } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import IndexSvg from '@/assets/images/area/index.svg';
import { Empty, Popover, Row, Spin, Table } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Icon from '@/components/icon';
import { Options, Screen } from '@/components/screen';
import { ScreenType } from '@/components/screen/items/types';
import SkeletonScreen from '@/components/skeletonScreen';
import { AREA_IS_CHANGE_STATUS } from '@/configs/localstorage';
import LgEmpty from '@/pages/area/areaEconomy/components/LgEmpty';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import * as S from '@/pages/area/areaEconomy/style';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import { useImmer } from '@/utils/hooks';

import useChangeTabError from '../../useChangeTabError';
import Chart from './chart';
import QuotaModal from './quotaModal';
import styles from './styles.module.less';
import useSocialFinanceData from './useSocialFinanceData';
import { formatThreeNumber } from './utils';

// 筛选项，直接写死，value是中台需要的参数值
const screenOption = [
  {
    name: '一季度',
    value: '03',
  },
  {
    name: '上半年',
    value: '06',
  },
  {
    name: '三季度',
    value: '09',
  },
  {
    name: '年度',
    value: '12',
  },
];

// 中台获取指标数据需要的id，直接写死
const initEDBTreeID = '10001050,10001082,10001114,10001146,10001178,10001210,10001242,10001274,10001306';

// 根据当前时间判断默认值：0-2展示年度 3-5没过完第二季度展示第一季度
const DEFAULTSCREENINDEX = ~~(new Date().getMonth() / 3) ? ~~(new Date().getMonth() / 3) - 1 : 3;

const SocialFinance: FC<any> = () => {
  // 弹窗可见性
  const [modalVisible, { setTrue: setModalVisibleOpen, setFalse: setModalVisibleClose }] = useBoolean();
  // 弹窗数据
  const [modalData, setModalData] = useState<any>();
  // 当前是不是省份
  const [currentIsNotProvince, setCurrentIsNotProvince] = useState<boolean>(false);
  // 当前是否是手动筛选
  const isHandleChangeRef = useRef<boolean>(false);
  // 筛选是否自动变化，防止一直无数据一直loading
  const screenHasChange = useRef<boolean>(false);
  const {
    // @ts-ignore: 忽略areaInfo类型报错
    state: { code, areaInfo, provinceCode },
  } = useCtx();

  // 请求的参数
  const [params, updateParams] = useImmer({
    EDBTreeID: initEDBTreeID,
    regionCode: '',
    dateSuffix: screenOption[DEFAULTSCREENINDEX].value,
  });
  // 记录筛选项
  const [screenIndex, setScreenIndex] = useState(screenOption[DEFAULTSCREENINDEX]);

  // 获取数据
  const {
    run,
    data: formattedData,
    originData,
    loading,
    error,
    defaultScreenChanged,
    screenNotMoreChange,
    setScreenChange,
  } = useSocialFinanceData(params, DEFAULTSCREENINDEX, isHandleChangeRef.current);
  const skeletonLoading = useLoading(loading);
  useAnchor(skeletonLoading);
  // 切换tab的error
  const changeTabError = useChangeTabError([error]);

  // 防止刚刚到达某个季度没有数据，需要往前推一个筛选项再次请求
  useEffect(() => {
    if (defaultScreenChanged !== DEFAULTSCREENINDEX) {
      screenHasChange.current = true;
      updateParams((d) => ({
        ...d,
        dateSuffix: screenOption[defaultScreenChanged].value,
      }));
      setScreenIndex(screenOption[defaultScreenChanged]);
    }
    // 循环一圈还没有数据就显示默认值
    if (defaultScreenChanged === DEFAULTSCREENINDEX && screenHasChange.current) {
      setScreenChange(true);
    }
  }, [defaultScreenChanged, updateParams, setScreenChange]);

  // 地区变化
  useEffect(() => {
    if (code) {
      // 不是省就显示无数据
      setCurrentIsNotProvince(code !== provinceCode);
      // 参数变化用作导出
      updateParams((d) => ({
        ...d,
        regionCode: code,
      }));
    }
  }, [code, provinceCode, updateParams]);

  useEffect(() => {
    const container = document.getElementById('area_economy_container');
    if (loading && container) {
      (container as HTMLDivElement).style.overflow = 'hidden';
    } else {
      (container as HTMLDivElement).style.overflow = '';
    }
  }, [loading]);

  // 切换年份
  const handleScreenChange = useCallback(
    (current: any) => {
      // 表示当前筛选是手动筛选
      isHandleChangeRef.current = true;
      updateParams((d) => ({
        ...d,
        dateSuffix: current?.[0]?.value,
      }));
      setScreenIndex(current?.[0]);
    },
    [updateParams],
  );

  // 打开弹窗
  const handleOpenModal = useCallback(
    (msg) => {
      if (areaInfo) {
        const regionName = areaInfo?.regionInfo[0]?.regionName || '';
        setModalVisibleOpen();
        setModalData({
          value: msg,
          title: regionName + '地区社融详情',
        });
      }
    },
    [areaInfo, setModalVisibleOpen],
  );

  // 导出的参数
  const exportOption = useMemo(
    () => ({
      ...params,
      regionalName: areaInfo?.regionInfo[0]?.regionName,
      startDate: '20130101',
      endDate: dayjs(new Date()).format('YYYYMMDD'),
    }),
    [params, areaInfo],
  );

  const columns = useMemo(() => {
    if (formattedData?.columnsData) {
      return [
        {
          title: '指标',
          dataIndex: 'quota',
          align: 'left',
          width: 236,
          fixed: true,
          render(record: any, msg: any) {
            return (
              <div
                onClick={() => (record?.isTitle ? null : handleOpenModal(msg))}
                className={record?.isTitle ? styles['table-quota-title'] : ''}
              >
                <span>{record?.value}</span>
                {record?.isTitle ? null : (
                  <img style={{ cursor: 'pointer', marginLeft: 8, width: 12, height: 12 }} src={IndexSvg} alt="" />
                )}
              </div>
            );
          },
        },
        ...(formattedData?.columnsData?.map((col: any) => {
          return {
            title: col,
            dataIndex: col,
            align: 'right',
            // width: 119,
            render(record: any, msg: any) {
              return <>{msg?.quota?.isTitle ? record : formatThreeNumber(record) || '-'}</>;
            },
          };
        }) || []),
      ];
    }
  }, [formattedData?.columnsData, handleOpenModal]);

  // 表格滚动
  const scrollWidth = useMemo(() => {
    return 236 + (formattedData?.columnsData?.length || 0) * 106;
  }, [formattedData?.columnsData]);

  const menuConfig: Options[] = useMemo(() => {
    return [
      {
        title: '年份',
        option: {
          type: ScreenType.SINGLE,
          children: screenOption,
          default: screenOption[defaultScreenChanged],
          cancelable: false,
        },
      },
    ];
  }, [defaultScreenChanged]);

  // 筛选
  const filter = useMemo(() => {
    return <Screen values={[[screenIndex]]} options={menuConfig} onChange={handleScreenChange} />;
  }, [screenIndex, menuConfig, handleScreenChange]);

  return (
    <>
      {!screenNotMoreChange || (skeletonLoading && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1') ? (
        <div style={{ height: 'calc(100vh - 264px)' }}>
          <SkeletonScreen num={2} firstStyle={{ paddingTop: '36px' }} otherStyle={{ paddingTop: '22px' }} />
        </div>
      ) : (
        <Container>
          <S.Container id="socialFinanceContainer">
            {
              // 切换tab加载失败
              changeTabError ? (
                <Empty
                  type={Empty.LOAD_FAIL}
                  onClick={() => run({ ...params })}
                  style={{ paddingTop: '30vh', background: 'white' }}
                />
              ) : (
                <>
                  <div className="sticky-top" />
                  <div className="screen-wrap custom-area-economy-screen-wrap">
                    <Row className="select-wrap">
                      <div className="card-title">{filter}</div>
                      <div className="select-right">
                        <Popover
                          content={() => {
                            return (
                              <div className={styles['social-finance-help-text']}>
                                <div>
                                  1.
                                  地区社会融资规模增量同比：央行官网未直接披露同比值，财汇根据央行官网披露的增量值进行相应计算。
                                </div>
                                <div>
                                  2.其他融资：根据央行调查统计司文件，社会融资规模=人民币贷款+外币贷款（折合人民币）+委托贷款+信托贷款+未贴现的银行承兑汇票+企业债券+非金融企业境内股票融资+保险公司赔偿+投资性房地产+其他。
                                </div>
                                <div>其他主要为保险公司赔偿、投资性房地产、其他项的合计值。</div>
                              </div>
                            );
                          }}
                          overlayClassName={styles['social-finance-help-popover']}
                          placement="rightTop"
                          arrowPointAtCenter
                        >
                          <Icon style={{ marginTop: '-1px' }} unicode="&#xe704;" className={styles['question-icon']} />
                          <span style={{ fontSize: 13, lineHeight: '20px', color: '#111', display: 'inline-block' }}>
                            帮助说明
                          </span>
                        </Popover>
                        <div style={{ marginLeft: '24px', transform: 'translateY(2px)' }}>
                          <ExportDoc
                            condition={{
                              ...exportOption,
                              module_type: 'web_society_finance_scale',
                            }}
                            filename={`地区社融${dayjs(new Date()).format('YYYYMMDD')}`}
                          />
                        </div>
                      </div>
                    </Row>
                  </div>
                  <div className="sticky-bottom" />
                  {!currentIsNotProvince ? (
                    <>
                      {
                        // 模块内部加载失败，地区社融没有权限问题，不需要额外做判断
                        // error && ![202, 203, 204, 100].includes((error as any)?.returncode) ? (
                        error ? (
                          <Empty
                            type={Empty.MODULE_LOAD_FAIL}
                            onClick={() => run({ ...params })}
                            style={{ paddingTop: '30vh', background: 'white' }}
                          />
                        ) : // 空数据判断
                        originData?.length ? (
                          <div className={styles['social-finance-module-loading']}>
                            <Spin
                              type="square"
                              spinning={loading && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1'}
                            >
                              <div className={styles['social-finance-chart-wrapper']}>
                                <Chart data={formattedData} />
                              </div>
                              <div className={styles['social-finance-table-wrapper']}>
                                <Table
                                  sticky={{
                                    offsetHeader: 114,
                                    getContainer: () => document.getElementById('socialFinanceContainer'),
                                  }}
                                  scroll={{
                                    // x: 1180,
                                    // x: 'max-content'
                                    x: scrollWidth,
                                  }}
                                  type="stickyTable"
                                  columns={columns}
                                  dataSource={formattedData?.resourceData}
                                />
                              </div>
                            </Spin>
                          </div>
                        ) : (
                          <LgEmpty show={!loading} type={Empty.NO_DATA_LG} />
                        )
                      }
                    </>
                  ) : (
                    <>
                      {params.dateSuffix === screenOption[DEFAULTSCREENINDEX].value ? (
                        <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
                      ) : (
                        <Empty
                          type={Empty.NO_DATA_IN_FILTER_CONDITION}
                          className="noNewRelatedData"
                          onClick={() => handleScreenChange([screenOption[DEFAULTSCREENINDEX]])}
                        />
                      )}
                    </>
                  )}
                </>
              )
            }

            {modalVisible ? (
              <QuotaModal modalData={modalData} show={modalVisible} onClose={setModalVisibleClose} />
            ) : null}
          </S.Container>
        </Container>
      )}
    </>
  );
};

export default memo(SocialFinance);

const Container = styled.div`
  .card-title {
    padding-left: 0px;
    font-weight: 400 !important;
    &::before {
      display: none;
    }
  }
`;
