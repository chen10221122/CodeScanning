import { useMemo, useRef } from 'react';

import { Popover, Switch } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
// import { Space } from 'antd';
import styled from 'styled-components';

// import { Tooltip } from '@/components/antd';
import attention_bottom from '@/assets/images/area/attention_bottom.svg';
import missVCAImg from '@/assets/images/area/missVCA.svg';
import Icon from '@/components/icon';
import { Screen, ScreenType, Options } from '@/components/screen';
import arrowIcon from '@/pages/area/areaDebt/images/icon_arrow.svg';
import { useImmer } from '@/utils/hooks';

const dateMap = new Map<number, string>([
  [7, '近一周'],
  [30, '近一月'],
]);

interface TipInfo {
  isUpdate: boolean;
  days: 30 | 7;
}

interface TblCell {
  indicName: string;
  updateType: number;
  year?: string;
  regionCode?: string;
  [key: string]: any;
}

interface CellProps {
  isUpdateItem: TblCell;
  onClick: Function;
  defaultClassName: string;
}

const optList = [
  { name: '近一周', value: 7, key: 'days' },
  { name: '近一月', value: 30, key: 'days' },
];
const dateConfig: Options[] = [
  {
    title: '',
    option: {
      type: ScreenType.SINGLE,
      children: optList,
      default: optList[1],
      cancelable: false,
    },
  },
];

/** isLastMonth: 只显示近一周 */
export default (isLastMonth: boolean) => {
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [openUpdate, setOpenUpdate] = useImmer<TipInfo>({
    isUpdate: true,
    days: 7,
  });

  /** 切换更新提示 */
  const handleTipSwitch = useMemoizedFn((isUpdate: boolean) => {
    setOpenUpdate((tipInfo: TipInfo) => {
      tipInfo.isUpdate = isUpdate;
    });
  });

  /** 切换更新时间 */
  const handleTipScreen = useMemoizedFn((info: any) => {
    setOpenUpdate((tipInfo: TipInfo) => {
      tipInfo.days = info?.[0]?.value;
    });
  });

  /** 处理表格中的色块显示 */
  const handleTblCell = useMemoizedFn(({ isUpdateItem, onClick, defaultClassName }: CellProps) => {
    let result: Record<string, any> = { className: defaultClassName };
    if (isUpdateItem && openUpdate.isUpdate) {
      const { updateType } = isUpdateItem;
      result = {
        /** 1,3是新增，其他是更新 */
        className: [1, 3].includes(Number(updateType)) ? 'first-update' : 'cell-class',
        onClick,
      };
    }
    return result;
  });

  /** 底部的提示图例 */
  const UpdateTipCref = useMemo(() => {
    const text = dateMap.get(openUpdate.days);
    // "注"的hover提示
    return (
      <UpdateTipBottom className="update-bottom-tip">
        <div className="text first-square">{text}数据首次新增</div>
        <div className="text square">{text}数据更新</div>
        <Popover
          placement="top"
          content={
            <HoverText>
              <div className="note-title">提示数据存在的特殊口径，包括如下2类：</div>
              <div>1、是否包含功能区等特殊区域；</div>
              <div>2、数据是否存在特殊的统计口径，如：市本级、市级等；</div>
            </HoverText>
          }
          getPopupContainer={() => document.querySelector('.comment-icon') as HTMLElement}
        >
          <div className="text comment-icon">
            提示数据存在的特殊口径
            <Icon
              image={require('@/pages/area/areaDebt/components/table/icon_why.svg')}
              size={12}
              className="why-icon"
            />
          </div>
        </Popover>
      </UpdateTipBottom>
    );
  }, [openUpdate.days]);

  /** 溯源旁边的筛选 */
  const UpdateTipScreenCref = useMemo(
    () => (
      <UpdateSwitchWrapper ref={filterRef} isLastMonth={isLastMonth}>
        <Switch size={`small`} onChange={handleTipSwitch} defaultChecked />
        <span className="update-text">{isLastMonth ? '更新提示-近一月' : '更新提示'}</span>
        {isLastMonth ? null : (
          <div className="update-screen">
            {openUpdate.isUpdate ? (
              <Screen
                options={dateConfig}
                onChange={handleTipScreen}
                getPopContainer={() => filterRef.current || document.body}
              />
            ) : (
              <div className="last-week">近一月</div>
            )}
          </div>
        )}
      </UpdateSwitchWrapper>
    ),
    [isLastMonth, openUpdate.isUpdate, handleTipSwitch, handleTipScreen],
  );

  /** 区域数据浏览器的更新提示样式，后面可能会用，先放着 */
  // const UpdateTipNoScreenCref = useMemo(() => (
  //   <UpdateSwitchWrapper>
  //     <SwitchStyle size={`small`} onChange={handleTipSwitch} defaultChecked />
  //     <span className="update-text">更新提示-近一月</span>
  //     <Tooltip
  //       color="#fff"
  //       placement="bottom"
  //       title={
  //         <TooltipContent style={{ padding: '6px 4px' }}>
  //           <Space direction="vertical" size={8}>
  //             <Space size={8}>
  //               <Square backgroundColor="#FFF1E5" />
  //               <span>近一月数据首次新增</span>
  //             </Space>
  //             <Space size={8}>
  //               <Square backgroundColor="#FFD6D6" />
  //               <span>近一月数据更新</span>
  //             </Space>
  //           </Space>
  //         </TooltipContent>
  //       }
  //     >
  //       <SwitcherIcon />
  //     </Tooltip>
  //   </UpdateSwitchWrapper>), [handleTipSwitch])

  return { UpdateTipCref, UpdateTipScreenCref, openUpdate, handleTblCell, handleTipSwitch };
};

// const Square = styled.div<{ backgroundColor: string }>`
//   width: 12px;
//   height: 12px;
//   background: ${({ backgroundColor }) => backgroundColor};
// `;

// const SwitcherIcon = styled.i`
//   vertical-align: middle;
//   cursor: pointer;
//   background: url(${require('@dataView/images/icon_question.png')}) no-repeat center center / contain;
//   width: 12px;
//   height: 12px;
//   display: inline-block;
//   transform: translateY(-1px);
// `;

// const TooltipContent = styled.div`
//   color: #434343;
//   font-size: 12px;
//   line-height: 16px;
//   padding: 0 8px;
// `;

const UpdateTipBottom = styled.div`
  display: flex;
  align-items: center;
  /* padding: 8px 0 16px 0; */
  width: 100%;
  /* height: 48px; */
  /* padding: 12px 0 16px 0; */
  padding-top: 9px;
  .text {
    display: inline-block;
    height: 18px;
    font-size: 12px;
    text-align: left;
    color: #5c5c5c;
    line-height: 18px;
  }
  .first-square {
    position: relative;
    margin-left: 14px;
    &::before {
      content: '';
      position: absolute;
      top: 3px;
      left: -14px;
      width: 12px;
      height: 12px;
      background-color: #ffe9d7;
    }
  }
  .square {
    position: relative;
    margin-left: 28px;
    &::before {
      content: '';
      position: absolute;
      top: 3px;
      left: -14px;
      width: 12px;
      height: 12px;
      background-color: #ffd6d6;
    }
  }
  .missVCA-img {
    margin-left: 20px;
    padding-left: 22px;
    background: left center / 14px no-repeat url(${missVCAImg});
  }
  .comment-icon {
    margin-left: 16px;
    padding-left: 17px;
    background: left center / 14px no-repeat url(${attention_bottom});
  }
  .comment-icon:hover {
    cursor: pointer;
  }
  .why-icon {
    margin-left: 3px;
    vertical-align: -2px;
  }
  .flex-text {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .star {
    width: 12px;
    height: 18px;
    text-align: center;
    font-size: 20px;
    color: #ff0000;
  }
`;

const UpdateSwitchWrapper = styled.div<{ isLastMonth: boolean }>`
  display: flex;
  align-items: center;
  margin-right: 24px;
  .update-text {
    margin-right: ${({ isLastMonth }) => (isLastMonth ? 0 : 8)}px;
    color: #262626 !important;
    font-size: 13px !important;
    font-weight: 400 !important;
  }
  .last-week {
    position: relative;
    width: 50px;
    height: 20px;
    line-height: 20px;
    font-size: 13px;
    color: #8c8c8c;
    text-align: left;
    &::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 0;
      width: 8px;
      height: 8px;
      background: url(${arrowIcon}) no-repeat center;
      background-size: contain;
    }
  }
`;
const HoverText = styled.div`
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #434343;
  line-height: 18px;
  .note-title {
    margin-left: 0px;
    margin-bottom: 4px;
  }
`;
