import { createElement } from 'react';

import styled from 'styled-components';

import Icon from '@/components/icon';
import RatioBtnSvg from '@/pages/area/areaCompany/assets/ratio_btn.png';
import PopoverArrow from '@/pages/area/areaCompany/components/tableCpns/popoverArrow';
import { highlight } from '@/utils/dom';

import { LinkToBond } from '../linkToF9';

export const isVaildText = (text: string) => {
  return text && text !== '-';
};

interface RatioItemProps {
  itName: string;
  itCode: string;
  ratio: string;
  normal?: boolean;
  [key: string]: any;
}

const renderItem = ({
  itName,
  itCode,
  ratio,
  keyword,
  isAll,
  key,
  record,
  handleOpenRatioModal,
  normal,
}: RatioItemProps) => {
  return (
    <RationItem key={key}>
      {createElement(isAll ? 'div' : OnelineTextWrap, {
        line: 1,
        title: isAll ? null : `${itName}${ratio ? `(${ratio})` : ''}`,
        children: (
          <>
            <LinkToBond name={highlight(itName, keyword)} code={itCode} type="company" />
            <span className="ratil-detail">{ratio ? `(${ratio})` : ''}</span>
          </>
        ),
      })}
      {normal || !ratio ? null : (
        <div
          className="ration-btn-or-arrow"
          onClick={() =>
            handleOpenRatioModal({
              fromItCode: itCode,
              toItCode: record?.enterpriseInfo?.itCode || '',
              bigCompanyName: itName || '',
              smallCompanyName: record?.enterpriseInfo?.itName || '',
              ratio,
            })
          }
        >
          <Icon width={46} height={18} image={RatioBtnSvg} />
        </div>
      )}
    </RationItem>
  );
};

export default (handleOpenRatioModal: Function, keyword: string, visible: boolean, normal?: boolean) => {
  return (info: RatioItemProps[], record: Record<string, any>) => {
    if (Array.isArray(info) && info.length) {
      const hasPop = info.length > 3;
      let popContent: JSX.Element[] = [];
      if (hasPop) {
        popContent = info.map((item, idx) =>
          renderItem({ ...item, keyword, record, handleOpenRatioModal, key: idx, isAll: true, normal }),
        );
      }
      const topThree = info.slice(0, 3);
      return (
        <>
          {topThree.map((item, idx) => {
            return idx === topThree.length - 1 && hasPop ? (
              <RationItem>
                <OnelineTextWrap title={`${item.itName}${item.ratio ? '(' + item.ratio + ')' : ''}`}>
                  <LinkToBond name={highlight(item.itName, keyword)} code={item.itCode} type="company" />
                  {item?.ratio ? <span className="ratil-detail">{`(${item.ratio})`}</span> : null}
                </OnelineTextWrap>
                <div className="ration-btn-or-arrow">
                  <PopoverArrow
                    data={popContent}
                    classname="ratio-popover-detail-content"
                    dontNeedMount
                    container={document.getElementById('area-company-index-container')}
                    modalIsOpen={visible}
                  />
                </div>
              </RationItem>
            ) : (
              renderItem({ ...item, keyword, record, handleOpenRatioModal, key: idx, isAll: false, normal })
            );
          })}
        </>
      );
    } else {
      return '-';
    }
  };
};

const RationItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .ration-btn-or-arrow {
    margin-left: 6px;
    flex-shrink: 0;
    cursor: pointer;
  }
`;

const OnelineTextWrap = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
