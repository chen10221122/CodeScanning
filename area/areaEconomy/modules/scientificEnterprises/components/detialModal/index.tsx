import { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import NoPowerDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { /**Spin,**/ Table } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import useRequest from '@/utils/ahooks/useRequest';
import { getExternalLink } from '@/utils/format';
import { HasPayOverLimitType, HasPayOverLimitListener } from '@/utils/hooks/useHasPayOverLimit';

import { getModalData } from '../../api';
import PdfImg from '../../image/pdfIcon.webp';
import StarImg from '../../image/star.webp';
import FullModal from '../fullModal';
import EnterpriseTags from './enterpriseTag';
import CoName from './linkToF9';

const PAGE_SIZE = 50;

export const DetialModal: FC<any> = ({ visible, setVisible, mountedId, currentInfo }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const havePay = useSelector((store: any) => store.user.info).havePay;
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const { loading, data, run } = useRequest(getModalData, {
    manual: true,
  });
  const pageChange = useMemoizedFn((page: number) => {
    // normal user 5 pages
    if (!havePay && page > 5) {
      setLimitModalVisible(true);
      return;
    }
    if (page > 200) {
      PubSub.publish(HasPayOverLimitListener, HasPayOverLimitType.DATA_QUERY);
      return;
    }
    setCurrentPage(page);
  });

  useEffect(() => {
    if (visible && currentInfo?.TagCode_S) {
      run({ tagCode_s: currentInfo?.TagCode_S, skip: (currentPage - 1) * PAGE_SIZE });
    }
  }, [visible, currentInfo?.TagCode_S, run, currentPage]);

  const modalTitle = useMemo(() => {
    if (loading) {
      return null;
    }
    return (
      <ModalTitle>
        <div className="title">
          <span className="icon" /> <span className="text">新增榜单-{currentInfo?.title}</span>
        </div>
        <div className="detialInfo" id={'tech-enterprise--detail-modal-sticky'}>
          <div>
            <span className="item">
              <span className="text-lable">认定单位</span>
              <span className="text-content">{currentInfo?.issueUnit ?? '-'}</span>
            </span>

            <span className="item">
              <span className="text-lable">公布日期</span>
              <span className="text-content">{currentInfo?.declareDate ?? '-'}</span>
            </span>
            {data?.data?.originalTextUrl ? (
              <Link className="item" to={getExternalLink(data?.data?.originalTextUrl)}>
                <span className="original">查看原文</span>
                <span className="original-icon" />
              </Link>
            ) : null}
          </div>
          <div className="export-area">
            <span className="counter">
              共<span className="count-number">&nbsp;{data?.data?.totalSize ?? '0'}&nbsp;</span>条
            </span>
            <ExportDoc
              condition={{
                sortRule: 'desc',
                sortKey: 'CR0001_005_yuan',
                tagCode_s: currentInfo?.TagCode_S,
                skip: 0,
                pageSize: '10000',
                techType: '1',
                module_type: 'high_tech_enterprise_cancel_web',
                sheetNames: { 0: `${currentInfo?.title}` },
              }}
              filename={currentInfo?.title}
            />
          </div>
        </div>
      </ModalTitle>
    );
  }, [currentInfo, loading, data]);

  const col = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        width: currentPage > 1 ? 24 + (currentPage * PAGE_SIZE + '').length * 8 : 48,
        align: 'center',
        fixed: 'left',
        render: (text: string, row: any, index: number) => {
          return (currentPage - 1) * PAGE_SIZE + index + 1;
        },
      },
      {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        width: 289,
        fixed: 'left',
        align: 'left',
        render: (text: string, row: any) => {
          return (
            <>
              {text ? <CoName name={text} code={row?.enterpriseCode} /> : '-'}
              <EnterpriseTags coTags={row?.enterpriseNature} />
            </>
          );
        },
      },
      {
        title: '法定代表人',
        dataIndex: 'legalRepresentative',
        width: 91,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          if (!text) {
            return '-';
          } else if (text?.includes('(')) {
            return text.split('(')?.[0];
          } else if (text?.includes('（')) {
            return text.split('（')?.[0];
          } else {
            return text;
          }
        },
      },
      {
        title: '成立日期',
        dataIndex: 'establishmentTime',
        width: 92,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
      {
        title: '注册资本',
        dataIndex: 'registeredCapital',
        width: 102,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return row.registeredCapital ? row.registeredCapital : '-';
        },
      },
      {
        title: '国标行业门类',
        dataIndex: 'industryCodeLevel1',
        width: 193,
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
      {
        title: '国标行业大类',
        dataIndex: 'industryCodeLevel2',
        width: 193,
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
      {
        title: '国标行业中类',
        dataIndex: 'industryCodeLevel3',
        width: 193,
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
      {
        title: '国标行业细类',
        dataIndex: 'industryCodeLevel4',
        width: 193,
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
      {
        title: '所属省',
        dataIndex: 'province',
        width: 75,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
      {
        title: '所属市',
        dataIndex: 'city',
        width: 75,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
      {
        title: '所属区县',
        dataIndex: 'country',
        width: 88,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
      {
        title: '称号',
        dataIndex: 'title',
        width: 156,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return text ?? '-';
        },
      },
    ];
  }, [currentPage]);

  const modalContent = useMemo(() => {
    return (
      <TableWapper id="techEnterpriseDetialModalMountedNode">
        <NoPowerDialog
          visible={limitModalVisible}
          setVisible={setLimitModalVisible}
          type="cloud_total_count_limit"
          key={123}
        />
        {loading ? null : (
          <Table
            dataSource={data?.data?.list}
            columns={col}
            size="small"
            type="stickyTable"
            scroll={{ x: 1600 }}
            rowKey={(_: any) => JSON.stringify(_)}
            sticky={{
              offsetHeader: 0,
              getContainer: () => document.getElementById('techEnterpriseDetialModalMountedNode') || document.body,
            }}
            pagination={{
              total: data?.data?.totalSize,
              pageSize: 10,
              style: { padding: '12px 0 8px 0', position: 'relative', left: '9px' },
              align: 'left',
              onChange: pageChange,
              showSizeChanger: false,
              current: currentPage,
            }}
          />
        )}
      </TableWapper>
    );
  }, [col, currentPage, data?.data?.list, data?.data?.totalSize, limitModalVisible, loading, pageChange]);

  return (
    <FullModal
      title={[modalTitle]}
      visible={visible}
      setVisible={setVisible}
      pending={loading}
      content={modalContent}
      container={document.getElementById('tech_enterprise_common_header_loop_text') as HTMLElement}
      resetPage={setCurrentPage}
    />
  );
};

const TableWapper = styled.div`
  height: calc(100vh - 170px);
  @media screen and (max-width: 1279px) {
    & {
      height: calc(100vh - 185px);
    }
  }
  overflow-y: scroll;
  white-space: normal;
  .reportDate {
    white-space: nowrap !important;
  }
  padding-right: 22px;
  padding-left: 32px;

  .ant-table.ant-table-small .ant-table-tbody > :not(:first-child) > td {
    padding: 6px 12px !important;
  }
  .ant-table.ant-table-small .ant-table-thead > tr > th {
    padding: 6px 12px !important;
  }
`;

const ModalTitle = styled.div`
  height: 50px !important;
  .title {
    .icon {
      width: 17px;
      height: 18px;
      display: inline-block;
      background: url('${StarImg}') no-repeat;
      background-size: 100% 100%;
    }
    .text {
      font-size: 18px;
      font-weight: 500;
      text-align: left;
      color: #141414;
      line-height: 27px;
    }
  }
  .detialInfo {
    width: 100%;
    height: 20px;
    padding-left: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    color: #8c8c8c;
    line-height: 18px;
    margin-top: 6px;
    .text-content {
      color: #262626;
      margin-left: 16px;
    }
    .item {
      padding-right: 23px;
    }
    & > :first-child > :not(:first-child) {
      padding-left: 23px;
      border-left: 1px solid #ededed;
    }

    & > :first-child > :nth-child(3) {
      cursor: pointer;
    }

    .pointer {
      cursor: pointer;
    }

    .original {
      color: #0171f6;
    }
    .original-icon {
      width: 14px;
      height: 14px;
      display: inline-block;
      background: url('${PdfImg}') no-repeat;
      background-size: 100% 100%;
      position: relative;
      top: 3px;
      left: 4px;
    }

    .export-area {
      display: flex;
      justify-content: flex-end;
      & > span {
        display: block;
      }
      .counter {
        padding-right: 24px;
        color: #333333;
        .count-number {
          color: #ff9347;
        }
      }
    }
  }
  width: 100%;
  height: 27px;
`;
