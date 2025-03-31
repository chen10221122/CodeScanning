import PopoverArrow from '@/pages/area/areaCompany/components/tableCpns/popoverArrow';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';

const hasTipList = ['吊销，已注销', '吊销', '注销'];
const contentStyle = { display: 'inline-flex' };
/** 黑名单-登记状态 */
export default (row: Record<string, any>) => {
  const { dxDate, zxDate, registrationStatus } = row || {};
  return registrationStatus ? (
    <div style={contentStyle}>
      <TextWrap>{registrationStatus}</TextWrap>
      {(dxDate || zxDate) && hasTipList.includes(registrationStatus) ? (
        <PopoverArrow
          dontNeedMount
          classname="blacklist-detail-arrow-popover"
          container={document.getElementById('area-company-index-container')}
          data={() => (
            <div className="statusPopoverContainer">
              <div className="statusPopoverContent">
                {dxDate ? (
                  <div>
                    吊销时间<span>{dxDate}</span>
                  </div>
                ) : null}

                {zxDate ? (
                  <div className="statusMoreText">
                    注销时间<span>{zxDate}</span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        />
      ) : null}
    </div>
  ) : (
    '-'
  );
};
