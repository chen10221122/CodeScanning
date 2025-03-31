import { useEffect, useMemo, useRef } from 'react';

import cn from 'classnames';
import { has, omit } from 'lodash';
import styled from 'styled-components';

import { Modal, Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import FinanceTable from '@/components/tableFinance';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { getTextWidth } from '@/utils/share';

import { loadingTips } from './style';
import S from './style.module.less';

import '@/assets/styles/less/popover.less';

// 公共弹窗
export default function DetailModal({
  name,
  moduleType,
  skip,
  title,
  visible,
  setVisible,
  condition,
  info,
  columns,
  firstLoading,
  handlePageChange,
}: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [showScroll] = useImmer(true);
  const [noPage, setNoPage] = useImmer(false);

  const exportCondition = useMemo(() => {
    if (has(condition, 'pledgorITCode')) {
      return {
        pledgorITCodeString: `${condition.pledgorITCode[0].code}-company`,
        ...omit(condition, 'pledgorITCode'),
      };
    } else if (has(condition, 'pledgeeITCode')) {
      return {
        pledgeeITCodeString: `${condition.pledgeeITCode[0].code}-company`,
        ...omit(condition, 'pledgeeITCode'),
      };
    }
    return condition;
  }, [condition]);

  useEffect(() => {
    if (info.total <= 50) {
      setNoPage((d) => (d = true));
    } else {
      setNoPage((d) => (d = false));
    }
  }, [info.total, setNoPage]);

  // 计算弹窗标题的名称长度
  const titleWidth = useMemo(() => {
    return Math.ceil(getTextWidth(title, '18px Arial, san-serif'));
  }, [title]);

  return (
    <ModalStyle
      multiLine={titleWidth}
      style={{ top: 21 }}
      visible={visible}
      title={
        <div className="flexTitle">
          <div title={title}>{title}</div>
          <div className="headerRight">
            <div className="num">
              共 <span>{formatNumber(info.total, 0)}</span> 条
            </div>
            <div>
              <ExportDoc
                usePost={true}
                condition={{ ...exportCondition, module_type: moduleType, sheetNames: { 0: title.replace(/\//g, '') } }}
                filename={name}
              />
            </div>
          </div>
        </div>
      }
      width={1000}
      footer={null}
      onCancel={() => {
        setVisible();
      }}
      destroyOnClose
      getContainer={() => document.querySelector('.main-container') as HTMLElement}
    >
      <div className={cn('content', { noPageHeight: noPage })} ref={ref} style={{ paddingRight: showScroll ? 12 : 24 }}>
        {firstLoading ? (
          <SpinWrapper>
            <Spin spinning={firstLoading} type={'thunder'} tip="加载中" />
          </SpinWrapper>
        ) : (
          <>
            {
              // @ts-ignore
              <FinanceTable
                className={S.modalTable}
                columns={columns}
                dataSource={info.data}
                stripe={true}
                scroll={{ x: 935 }}
                sticky={{
                  offsetHeader: 0,
                  getContainer: () => ref.current,
                }}
                loading={
                  info.sortLoading
                    ? {
                        wrapperClassName: cn(S.modalTableLoadingWrapper, {
                          [S.isSortOrPage]: info.sortLoading,
                        }),
                        tip: '',
                        indicator: loadingTips,
                      }
                    : false
                }
              />
            }
          </>
        )}
      </div>
      <div className={cn({ pageWrap: info.sortLoading })}>
        <Pagination
          current={skip / 50 + 1 || 1}
          pageSize={50}
          total={info.total}
          style={{
            padding: '8px 32px 0px',
            position: 'relative',
            marginBottom: 0,
            justifyContent: 'flex-end',
            right: '-6px',
            opacity: 0.9,
            background: '#fff',
          }}
          onChange={handlePageChange}
          align="right"
        />
      </div>
    </ModalStyle>
  );
}

const SpinWrapper = styled.div`
  /* 解决加载icon不居中 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-spin-container {
    height: 100%;
  }
`;

const ModalStyle = styled(Modal)<{ multiLine: number }>`
  .ant-modal-content {
    .ant-modal-close-x {
      position: absolute;
      top: 22px;
      right: -10px;
    }
    .ant-modal-close-x {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      -webkit-box-align: center;
      align-items: center;

      -webkit-box-pack: center;
      justify-content: center;
      background: rgb(255, 255, 255);
      box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 9px 2px, rgba(0, 0, 0, 0.16) 0px 1px 2px -2px;
    }
  }
  .ant-modal-header {
    padding: 24px 32px 0;
    border-bottom: none;
    box-sizing: content-box;
    height: ${(props) => (props.multiLine > 752 ? '54px' : '27px')};
    .ant-modal-title {
      line-height: 27px;
    }
  }
  .ant-modal-body {
    height: calc((100vh - 74px) - 47px);
    padding: 12px 6px 24px 32px;
  }
  .content {
    overflow-y: auto;
    overflow-y: overlay;
    height: calc((100vh - 74px) - 66px - 16px - 24px - 8px);
  }
  .noPageHeight {
    height: calc((100vh - 74px) - 66px - 13px - 8px);
  }
  .num {
    font-weight: 400;
    line-height: 20px;
    color: #8c8c8c;
    font-size: 13px;
    margin-right: 24px;
    span {
      color: #ff7500;
    }
  }
  .ant-modal-title {
    max-height: 54px;
  }
  .flexTitle {
    color: #141414;
    display: flex;
    align-items: stretch;
    font-size: 18px;
    font-weight: 500;
    height: 27px;
    justify-content: space-between;
    line-height: 27px;
  }
  .headerRight {
    display: flex;
    align-items: baseline;
    margin-left: 40px;
    flex: 0 0 auto;
  }
  .pageWrap {
    position: relative;
    &::before {
      content: ''; /* 伪元素的内容为空 */
      position: absolute; /* 使伪元素脱离文档流并相对于容器定位 */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      opacity: 0.9;
      z-index: 1; /* 确保蒙层在内容之上 */
      pointer-events: none; /* 防止蒙层阻止用户与内容交互 */
    }
  }
`;
