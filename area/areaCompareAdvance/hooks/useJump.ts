import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';
import { intersection, isEmpty } from 'lodash';

import { renderMessage } from '@/pages/area/areaCompareAdvance/config';
import { useCtx, LIMIT_SELECT } from '@/pages/area/areaCompareAdvance/context';
import useAreaOperate from '@/pages/area/areaCompareAdvance/hooks/useAreaOperate';

const useJump = () => {
  const {
    state: { indexIds, areaSelectCode },
    update,
  } = useCtx();

  const havePay = useSelector((store: any) => store.user.info).havePay || false;
  const { addArea } = useAreaOperate();

  /** 其他页面多个地区跳转到专题的地区处理 */
  const handleJump = useMemoizedFn((areaCodes: string[]) => {
    /** 上限 */
    const selectLimit = havePay ? LIMIT_SELECT.VIP : LIMIT_SELECT.NORMAL;
    const selectedList = areaSelectCode?.length ? areaSelectCode.split(',') : [];
    /** 去重后的地区code */
    const uniqCodes = Array.from(new Set(selectedList.concat(areaCodes)));
    const newCodes = uniqCodes.slice(0, selectLimit);
    /** 可添加的地区个数 */
    const restLen = selectLimit - selectedList.length;
    /** 是否已达上限 */
    const isToLimit = uniqCodes.length - newCodes.length;
    /** 是否有相同地区 */
    const sameCodes = intersection(areaCodes, selectedList);

    // 添加地区
    if (restLen > 0 || !isToLimit) {
      /** 可添加的新地区个数 */
      const addNum = newCodes.length - selectedList.length;
      if (isToLimit > 0) {
        const textSuffix = havePay ? '更多权益可联系客服定制' : '您可升级VIP，获得更多权益';
        renderMessage(`地区添加达上限，已添加 ${addNum} 个新地区，${textSuffix}`, true);
      } else if (!isEmpty(sameCodes)) renderMessage('地区已存在!');
      update((d) => {
        d.areaSelectCode = newCodes.join(',');
      });
    } else {
      // 地区已达上限
      if (havePay) {
        // 会员的上限提示
        update((d) => {
          d.showPayLimit = true;
        });
      }
      // 非会员的上限提示
      else renderMessage('地区添加已达上限，您可删除后添加，或者升级VIP，获得更多权益', true);
    }
    // 页面跳转需要调地区接口
    indexIds?.length && addArea(newCodes);
  });

  return {
    handleJump,
  };
};

export default useJump;
