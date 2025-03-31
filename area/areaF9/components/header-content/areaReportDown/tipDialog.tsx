import { FC, memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import NoPowerDialog from '@/app/components/dialog/power/noPayNotice';
import { Button } from '@/components/antd';
import ToolTipDialog from '@/components/dialog/power/ToolTipDialog';
import { transformUrl } from '@/utils/url';

const HAS_PAY_OVER_LIMIT = {
  content: '功能使用已达上限，更多需求请联系客服定制！',
};

interface Props {
  noPayDialogVisible: boolean;
  limitDialogVisible: boolean;
  setNoPayDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLimitDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const TipDialog: FC<Props> = ({
  noPayDialogVisible,
  limitDialogVisible,
  setNoPayDialogVisible,
  setLimitDialogVisible,
}) => {
  const onLimitDialogClose = useMemoizedFn(() => setLimitDialogVisible(false));
  return (
    <>
      <NoPowerDialog
        visible={noPayDialogVisible}
        setVisible={setNoPayDialogVisible}
        customMsgTxt="暂不支持区域报告下载功能，成为正式用户即可下载20次/天"
      >
        <div
          style={{
            width: '586px',
            height: '174px',
            background: '#ffffff',
            borderRadius: '4px',
            padding: '7px 12px 10px',
            position: 'relative',
          }}
        >
          <div
            style={{
              backgroundImage: `url(${require('@/assets/images/power/area_report.png')})`,
              backgroundSize: '100% 100%',
              width: '562px',
              height: '120px',
              position: 'relative',
            }}
          ></div>
          <ButtonStyle
            onClick={() => window.open(transformUrl('https://cdn.finchina.com/app/h5/areaPDFAssest/areaDemo.pdf'))}
          >
            查看样例
          </ButtonStyle>
        </div>
      </NoPowerDialog>
      <ToolTipDialog visible={limitDialogVisible} onCancel={onLimitDialogClose} hasPayOverLimit={HAS_PAY_OVER_LIMIT} />
    </>
  );
};

export default memo(TipDialog);

const ButtonStyle = styled(Button)`
  position: absolute !important;
  right: 12px !important;
  bottom: 10px !important;
  font-size: 13px;
  height: 26px !important;
  line-height: 20px !important;
  color: #fff !important;
  background: #ff9347 !important;
  border-color: #ff9347 !important;
  padding: 2px 14px;
`;
