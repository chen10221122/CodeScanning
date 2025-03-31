import { useMemo, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { compact, pick } from 'lodash';

import { useImmer } from '@/utils/hooks';

import { postPledgorDetails, postPledgeeList } from '../api';
import CompanyEllipsis from '../common/companyEllipsis';
import { EllipseWrap } from '../common/style';
import { ContentDetection, validateAndReturnText } from '../config';

dayjs.extend(quarterOfYear);

export enum modalType {
  // 新增应收账款融资事件弹窗
  EVENT = 'event',
  // 质权人/受让人数量弹窗
  PLEDGEE = 'pledgee',
}

// 弹框相关
export default function useModal({ condition }: any) {
  const [type, setType] = useState<modalType>();
  const [tableInfo, setTableInfo] = useImmer<{ data: any[]; total: number; sortLoading?: boolean }>({
    data: [],
    total: 0,
    sortLoading: false,
  });
  const [firstLoading, setFirstLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCondition, setModalCondition] = useImmer<any>({
    from: 0,
    size: 50,
  });
  const [skip, setSkip] = useState(0);
  // 弹窗导出的module_type
  const [moduleType, setModuleType] = useState('');
  // 弹窗表格导出名称
  const [exportName, setExportName] = useState('');

  const modalColumn = useMemo(() => {
    let arr;
    switch (type) {
      case modalType.EVENT:
        arr = [
          {
            title: '序号',
            width: Math.max(`${Number(modalCondition.from)}`.length * 10 + 22, 42),
            dataIndex: 'index',
            align: 'center',
            className: 'pdd-8',
            fixed: 'left',
          },
          {
            title: '登记起始日',
            width: 95,
            dataIndex: 'registerStartDate',
            align: 'left',
            fixed: 'left',
          },
          {
            title: '融资企业',
            width: 299,
            dataIndex: 'name',
            align: 'left',
            fixed: 'left',
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              return <CompanyEllipsis data={row.pledgorList} rowLimit={2} textLimitwidth={274} showTag={false} />;
            },
          },
          {
            title: '质权人/受让人',
            width: 267,
            dataIndex: 'name',
            align: 'left',
            render: (text: string, row: any) => {
              return <CompanyEllipsis data={row.pledgeeList} rowLimit={2} textLimitwidth={242} />;
            },
          },
          {
            title: '融资类型',
            width: 109,
            dataIndex: 'financingType',
            align: 'center',
            render: (text: string) => {
              return ContentDetection(text);
            },
          },
          {
            title: '融资额(万元)',
            width: 99,
            dataIndex: 'financingAmount',
            align: 'right',
            render: (text: string) => {
              return validateAndReturnText(text);
            },
          },
          {
            title: '期限',
            width: 102,
            dataIndex: 'timeLimit',
            align: 'center',
            render: (text: string) => {
              return ContentDetection(text);
            },
          },
          {
            title: '登记到期日',
            width: 95,
            dataIndex: 'registerEndDate',
            align: 'center',
            render: (text: string) => {
              return ContentDetection(text);
            },
          },
          {
            title: '最新登记状态',
            width: 113,
            dataIndex: 'lastedRegisterStatus',
            align: 'center',
            render: (text: string) => {
              return ContentDetection(text);
            },
          },
          {
            title: '质押/转让财产价值(万元)',
            width: 181,
            dataIndex: 'pledgedProperty',
            align: 'right',
            render: (text: string) => {
              return validateAndReturnText(text);
            },
          },
          {
            title: '质押/转让财产描述',
            width: 240,
            dataIndex: 'pledgedPropertyDesc',
            align: 'left',
            render: (text: string) => {
              return (
                <EllipseWrap row={2} title={text}>
                  {text ?? '-'}
                </EllipseWrap>
              );
            },
          },
        ];
        break;
      case modalType.PLEDGEE:
        arr = [
          {
            title: '序号',
            width: Math.max(`${Number(modalCondition.from)}`.length * 10 + 22, 42),
            dataIndex: 'index',
            align: 'center',
            className: 'pdd-8',
            fixed: 'left',
          },
          {
            title: '质权人/受让人',
            width: 232,
            dataIndex: 'name',
            align: 'left',
            fixed: 'left',
            resizable: true,
            wrapLine: true,
            render: (text: string, row: any) => {
              const data = [
                {
                  code: row?.itcode,
                  name: row?.name,
                  enterpriseTag: row?.tags,
                },
              ];
              return <>{data.length && <CompanyEllipsis data={data} rowLimit={2} textLimitwidth={207} />}</>;
            },
          },
          {
            title: '新增应收账款融资事件',
            width: 153,
            dataIndex: 'financingEventCount',
            align: 'right',
            render: (text: string) => {
              return ContentDetection(text);
            },
          },
          {
            title: '融资额(万元)',
            width: 146,
            dataIndex: 'financingAmount',
            align: 'right',
            render: (text: string) => {
              return validateAndReturnText(text);
            },
          },
          {
            title: '融资企业数量',
            width: 135,
            dataIndex: 'financingEnterpriseCount',
            align: 'right',
            render: (text: string) => {
              return ContentDetection(text);
            },
          },
          {
            title: '注册资本',
            width: 146,
            dataIndex: 'registeredCapital',
            align: 'right',
            render: (text: string) => {
              return ContentDetection(text);
            },
          },
          {
            title: '所属地区',
            width: 145,
            dataIndex: 'primaryGBIndustry',
            align: 'left',
            render: (text: string, row: any) => {
              const array = compact([row.provinceName, row.cityName, row.countyName]);
              return array.join('-');
            },
          },
        ];
    }
    return arr;
  }, [modalCondition.from, type]);

  const openModal = useMemoizedFn((title: string, type: modalType, module_type, name, itCode) => {
    setTitle(title);
    setModalVisible(true);
    if (type === modalType.EVENT) {
      setModalCondition((draft) => ({
        from: 0,
        size: 50,
        ...pick(condition, [
          'registerLimit',
          'pledgorGBIndustryPrimaryCode',
          'pledgorGBIndustrySecondCode',
          'pledgorBusinessType',
          'registerType',
          'expireFlag',
          'registerStartDateFrom',
          'registerStartDateTo',
          'pledgorProvinceCode',
          'pledgorCityCode',
          'pledgorCountyCode',
          'isLatest',
        ]),
        pledgorITCode: [
          {
            code: itCode,
            type: 'company',
          },
        ],
      }));
    } else {
      setModalCondition((draft) => ({
        from: 0,
        size: 50,
        pledgorITCode: [
          {
            code: itCode,
            type: 'company',
          },
        ],
        ...pick(condition, [
          'registerLimit',
          'pledgorGBIndustryPrimaryCode',
          'pledgorGBIndustrySecondCode',
          'pledgorBusinessType',
          'registerType',
          'registerStartDateFrom',
          'registerStartDateTo',
          'expireFlag',
          'isLatest',
        ]),
      }));
    }

    setType(type);
    setModuleType(module_type);
    setExportName(`${name}-${dayjs().format('YYYY-MM-DD')}`);
  });

  const { loading } = useRequest(
    type === modalType.EVENT ? () => postPledgorDetails(modalCondition) : () => postPledgeeList(modalCondition),
    {
      ready: modalVisible,
      refreshDeps: [modalCondition],
      onSuccess: (data: any) => {
        if (data.data) {
          const result = data.data.data.map((item: any, index: number) => ({
            ...item,
            index: index + 1 + modalCondition.from,
          }));
          setTableInfo((draft) => ({
            data: result,
            total: data.data.total,
            sortLoading: false,
          }));
        }
        if (firstLoading) setFirstLoading(false);
      },
      onError: () => {
        if (firstLoading) setFirstLoading(false);
        setTableInfo((draft) => ({
          data: [],
          total: 0,
          sortLoading: false,
        }));
      },
    },
  );

  const handlePageChange = useMemoizedFn((cur) => {
    setModalCondition((draft) => {
      draft.from = (cur - 1) * 50;
    });
    setSkip((cur - 1) * 50);
    setTableInfo((draft) => {
      draft.sortLoading = true;
    });
  });

  const handleModalClose = useMemoizedFn(() => {
    setModalVisible(false);
    setTableInfo((draft) => ({
      data: [],
      total: 0,
      sortLoading: false,
    }));
    setFirstLoading(true);
  });

  return {
    exportName,
    moduleType,
    skip,
    modalTableInfo: tableInfo,
    title,
    modalColumn,
    modalVisible,
    modalFirstLoading: firstLoading,
    modalTableLoading: loading,
    modalCondition,
    setModalCondition,
    openModal,
    handleModalPageChange: handlePageChange,
    handleModalClose,
  };
}
