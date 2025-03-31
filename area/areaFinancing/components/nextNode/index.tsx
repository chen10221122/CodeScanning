import useNodeManage from '@pages/area/areaFinancing/hooks/useNodeManage';

import S from '@pages/area/areaFinancing/style.module.less';

export default function NextNode() {
  const { nextNode, handleNext } = useNodeManage();
  return nextNode ? (
    <div className={S.next}>
      <span>点击切换至</span>
      <span className={S.detail} onClick={handleNext}>
        {nextNode.parentName + '-' + nextNode.title}
      </span>
    </div>
  ) : null;
}
