import { Modal } from '@/components/antd';

import S from './styles.module.less';

const HelpIntro = ({ visible, setVisible }: any) => {
  return (
    <Modal
      type="titleWidthBgAndMaskScroll"
      title={'帮助说明'}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnClose={true}
      width={680}
      wrapClassName={S.helpWrapper}
      centered
    >
      <div>
        <div className={S.content}>
          地区榜单来自外部第三方机构榜单和财汇榜单，其中财汇榜单基于公开数据生成，不参杂任何观点，仅供参考。
        </div>
        <p className={S.disclaimer}>
          免责申明：所有数据是大智慧财汇基于公开数据的收集、整理和加工，仅作为参考使用。对本模块有任何意见和建议，请与我们联系，线上反馈或拨打客服热线021-20219912。
        </p>
      </div>
    </Modal>
  );
};

export default HelpIntro;
