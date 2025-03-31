import { useState } from 'react';
import TextLoop from 'react-text-loop';

import { useMemoizedFn } from 'ahooks';

import Icon from '@/components/icon';
import { useRankModal } from '@/pages/area/areaF9/hooks';
import HelpIntro from '@/pages/area/areaF9/modules/regionalOverview/areaRank/components/helpIntro';
import { useCtx } from '@/pages/area/areaF9/modules/regionalOverview/areaRank/provider';

import S from '../../styles.module.less';
const Header = () => {
  const {
    state: { hotRankList },
    update,
  } = useCtx();
  const [visible, setVisible] = useState(false);
  const { handleOpenModal } = useRankModal();
  const handleClick = useMemoizedFn((o) => {
    handleOpenModal(o);
    update((d) => {
      // d.detailModalVisible = true;
      d.activeDetailInfo = o;
    });
  });
  return (
    <>
      <div className={S.headerWrapper}>
        <div className={S.headerTitle}>地区榜单</div>
        <div className={S.hotTitle}>热门榜单</div>
        {hotRankList?.length ? (
          <div className={S.loopList}>
            <TextLoop interval={4000}>
              {hotRankList.map((o, index) => {
                return (
                  <span className={S.line} key={index} onClick={() => handleClick(o)}>
                    <span title={o.name}>{o.name}</span>
                    {o.announcementDate ? <span className={S.date}>{o.announcementDate}</span> : null}
                  </span>
                );
              })}
            </TextLoop>
          </div>
        ) : null}
        <div
          className={S.helpBtn}
          onClick={() => {
            setVisible(true);
          }}
        >
          <Icon unicode="&#xe704;" size={12} className={S.helpIcon} />
          帮助
        </div>
      </div>
      <HelpIntro visible={visible} setVisible={setVisible} />
    </>
  );
};
export default Header;
