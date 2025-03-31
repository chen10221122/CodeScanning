import useNodeManage from '@pages/area/areaFinancing/hooks/useNodeManage';

import S from '@pages/area/areaFinanceResource/style.module.less';

export default function NextNode() {
  const { nextNode, handleNext } = useNodeManage();
  return nextNode ? (
    <div className={S.next}>
      <span>点击切换至</span>
      <span className={S.detail} onClick={handleNext}>
        {nextNode.title}
      </span>
    </div>
  ) : null;
}
