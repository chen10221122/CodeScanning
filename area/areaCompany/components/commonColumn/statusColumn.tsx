import PopoverArrow from '@/pages/area/areaCompany/components/tableCpns/popoverArrow';
import { TextWrap } from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { isNull } from '@/pages/area/areaCompany/utils/formatColumns';

const statusArray = ['注销', '吊销', '吊销未注销'];
const statusMap = new Map([
  ['注销', '注销'],
  ['吊销', '吊销'],
  ['吊销未注销', '吊销'],
]);
const contentStyle = { display: 'inline-flex' };

/** 企业状态列 */
export const StatusColumn = (row: Record<string, any>, key = 'status') => {
  return row?.[key] ? (
    <div style={contentStyle}>
      <TextWrap>{row[key]}</TextWrap>
      {row?.cancelReason || row?.revokeReason ? (
        <PopoverArrow
          dontNeedMount
          classname="revoke-arrow-popover"
          container={document.getElementById('area-company-index-container')}
          data={() => {
            if (statusArray.includes(row?.status)) {
              return (
                <div className="statusPopoverContainer">
                  <div className="statusPopoverContent">
                    <div>
                      <span className="left-title">{statusMap.get(row?.status)}日期</span>
                      <span className="right-txt">{row.cancelDate || row.revokeDate}</span>
                    </div>
                    <div className="statusMoreText">
                      <span className="left-title">{statusMap.get(row?.status)}原因</span>
                      <span className="right-txt">{row?.cancelReason || row?.revokeReason}</span>
                    </div>
                  </div>
                </div>
              );
            }
            if (row?.status === '吊销且注销') {
              return (
                <>
                  <div className="statusPopoverContent">
                    <div>
                      <span className="left-title">吊销日期</span>
                      <span className="right-txt">{isNull(row.revokeDate)}</span>
                    </div>
                    <div className="statusMoreText">
                      <span className="left-title">吊销原因</span>
                      <span className="right-txt">{isNull(row.revokeReason)}</span>
                    </div>
                    <div>
                      <span className="left-title">注销日期</span>
                      <span className="right-txt">{isNull(row.cancelDate)}</span>
                    </div>
                    <div className="statusMoreText">
                      <span className="left-title">注销原因</span>
                      <span className="right-txt">{isNull(row.cancelReason)}</span>
                    </div>
                  </div>
                </>
              );
            }
          }}
        />
      ) : null}
    </div>
  ) : (
    '-'
  );
};
