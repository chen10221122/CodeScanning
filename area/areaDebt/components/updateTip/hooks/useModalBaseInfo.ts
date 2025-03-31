import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';

import { useModal } from '@/app/components/modal/NoPayNotice';
import { IRootState } from '@/store';
import { useImmer } from '@/utils/hooks';

import exampleImg from '../example.png';
import { Info } from '../modal';

const initInfo = {
  title: '',
  regionCode: '',
  indicName: '',
  year: '',
  pageCode: '',
};

export interface UpdateModalInfo {
  /** 是否是计算指标 */
  isCalculateIndic?: boolean;
  visible: boolean;
  /** 弹窗内的请求参数和标题信息 */
  info: Info;
  /** 更新数据 - 就是需要在表格里加色块的数据 */
  data: any[];
}

export default () => {
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const [modal, contetHolder] = useModal();

  const [modalInfo, setModalInfo] = useImmer<UpdateModalInfo>({
    visible: false,
    info: initInfo,
    isCalculateIndic: false,
    data: [],
  });

  const openModal = useMemoizedFn((info: Info, isCalculateIndic?: boolean, data?: any[]) => {
    if (!hasPay && isCalculateIndic) {
      modal.open({
        permission: {
          exampleImageUrl: exampleImg,
        },
      });
      return;
    }
    setModalInfo((oldInfo: UpdateModalInfo) => {
      oldInfo.visible = true;
      oldInfo.info = info;
      oldInfo.isCalculateIndic = !!isCalculateIndic;
      oldInfo.data = data || [];
    });
  });

  const closeModal = useMemoizedFn(() => {
    setModalInfo((oldInfo: UpdateModalInfo) => {
      oldInfo.visible = false;
      oldInfo.info = initInfo;
      oldInfo.isCalculateIndic = false;
      oldInfo.data = [];
    });
  });

  return { modalInfo, openModal, closeModal, contetHolder };
};
