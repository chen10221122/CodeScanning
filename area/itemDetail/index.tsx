import { memo, FC, ReactNode, CSSProperties, useState } from 'react';

import { Spin, Empty } from '@dzh/components';
import { useRequest } from 'ahooks';
import dayJs from 'dayjs';

import {
  ProjectIntroduction,
  ProjectFinancing,
  ProjectGuarantee,
  ProjectParty,
  SpecialBond,
  ProjectPlan,
  YearsFinancing,
} from '@pages/area/itemDetail/modules';
import useTwoBookModal from '@pages/bond/specialBond/modules/projectSummary/hooks/useTwoBookModal';

import { getSpecialBondDetail, getProjectDetail } from '@/apis/area/areaDetail';
import { useTitle } from '@/app/libs/route';
import { Icon } from '@/components';
import ExportDoc from '@/components/exportDoc';
import { useQuery } from '@/utils/hooks';

import * as S from './style';

interface CardProps {
  title: ReactNode;
  style?: CSSProperties;
}

export const Card: FC<CardProps> = ({ title, children, style }) => {
  return (
    <S.Card style={style}>
      <div className="title">{title}</div>
      {children}
    </S.Card>
  );
};

export const emptyFilter = (val: string, unit = '') => {
  return val ? val + unit : '-';
};

const ItemDetail = () => {
  const { projectCode = '' } = useQuery();
  const [info, setInfo] = useState<any>({});
  const { openTwoBookModal, noPermissionModal, bookModal } = useTwoBookModal();

  const { loading: infoLoading } = useRequest(getProjectDetail, {
    defaultParams: [{ projectCode }],
    ready: !!projectCode,
    onSuccess: ({ data }) => {
      // console.log(data);
      setInfo(data);
    },
  });

  const { data: bondDetail, loading: bondDetailLoading } = useRequest(getSpecialBondDetail, {
    defaultParams: [{ projectCode }],
    ready: !!projectCode,
  });

  const specialBondLists = bondDetail?.data?.data || [];

  useTitle(`${info?.projectName || ''}项目详情`);

  if (infoLoading || bondDetailLoading) return <Spin spinning type="fullThunder" />;

  if (!info?.projectName) return <Empty style={{ paddingTop: '10vh' }} type={Empty.NO_DATA} />;

  return (
    <S.Container>
      <div className="content">
        <S.Title>
          <span className={'header-title-wrap'}>
            <span className={'header-title'}>{info?.projectName}—项目详情</span>
            <span className={'title-tag-wrap'}>
              {info?.projectTypeName ? <span className={'title-tag'}>{info.projectTypeName}</span> : null}
              {info?.area ? <span className={'title-tag'}>{info.area}</span> : null}
            </span>
          </span>

          <div className={'header-func'}>
            <span
              className={'book-download'}
              onClick={() => {
                const firstLists = specialBondLists.find((item: any) => !!item.oneCaseTwoBooks?.fileList?.length);
                openTwoBookModal(firstLists?.oneCaseTwoBooks || {});
              }}
            >
              最新信披文件
              <Icon
                image={require('@/components/sideMenuF9/images/VIP.svg')}
                size={12}
                style={{
                  verticalAlign: '-2px',
                  marginLeft: '2px',
                  marginRight: '16px',
                }}
              />
            </span>
            <ExportDoc
              condition={{
                module_type: 'special-bond-project-introduction',
                isPost: false,
                projectCode,
              }}
              filename={`${info?.projectName}—项目详情-${dayJs().format('YYYYMMDD')}`}
            />
          </div>
        </S.Title>
        <ProjectIntroduction projectDesc={emptyFilter(info.projectDesc)} />
        <ProjectFinancing info={info} />
        <ProjectPlan info={info} />
        <ProjectGuarantee info={info} />
        <ProjectParty info={info} />
        <YearsFinancing lists={info?.totalAmountByYear || []} />
        <SpecialBond bondDetail={specialBondLists} projectCode={projectCode} projectName={info?.projectName || '-'} />
      </div>
      {noPermissionModal}
      {bookModal}
    </S.Container>
  );
};
export default memo(ItemDetail);
