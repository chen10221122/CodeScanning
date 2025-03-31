// import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';

// import { useModal } from '@/app/components/modal/NoPayNotice';
// import exampleImg from '@/pages/area/areaDebt/components/updateTip/example.png';
// import { IRootState } from '@/store';
import { useImmer } from '@/utils/hooks';

import { Info } from '../modal';

const initInfo = {
  title: '',
  regionCode: '',
  indicName: '',
  year: '',
  pageCode: '',
};

export interface UpdateModalInfo {
  visible: boolean;
  /** 弹窗内的请求参数和标题信息 */
  info: Info;
  /** 更新数据 - 就是需要在表格里加色块的数据 */
  data: any[];
}

export default () => {
  // const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  // const [modal, contetHolder] = useModal();

  const [modalInfo, setModalInfo] = useImmer<UpdateModalInfo>({
    visible: false,
    info: initInfo,
    data: [],
  });

  const openModal = useMemoizedFn((info: Info, data?: any[]) => {
    // if (!hasPay) {
    //   modal.open({
    //     permission: {
    //       exampleImageUrl: exampleImg,
    //     },
    //   });
    //   return;
    // }
    setModalInfo((oldInfo: UpdateModalInfo) => {
      oldInfo.visible = true;
      oldInfo.info = info;
      oldInfo.data = data || [];
    });
  });

  const closeModal = useMemoizedFn(() => {
    setModalInfo((oldInfo: UpdateModalInfo) => {
      oldInfo.visible = false;
      oldInfo.info = initInfo;
      oldInfo.data = [];
    });
  });
  return { modalInfo, openModal, closeModal };
};
