import classNames from 'classnames';
import styled from 'styled-components';

// import { base } from '@/assets/styles/colors';
import deleteIcon from '@/pages/area/areaDebt/images/delete.png';
import searchIcon from '@/pages/area/areaDebt/images/search_icon.png';
import { getTextWidth } from '@/utils/share';

const Item = (props) => {
  const onItemClearClick = (e) => {
    // 阻止合成事件的冒泡
    e.stopPropagation();
    // 阻止与原生事件的冒泡
    e.nativeEvent.stopImmediatePropagation();
    props.onItemClearClick();
  };
  // 获取当前文本的宽度，若超过一行，则改变icon的位置
  const width = getTextWidth(props.value);
  return (
    <li
      className={classNames({ active: props.index === props.activeIndex, multiLine: width > 272 })}
      onClick={props.onClick}
    >
      <i className={classNames({ multiLineIcon: width > 272 }, 'prefix-icon iconfont')}></i>
      <span className="option-text">{props.value}</span>
      <span className="single-clear" onClick={(e) => onItemClearClick(e)}></span>
    </li>
  );
};
const OptionList = (props) => {
  const { data, visible, activeIndex } = props;

  const itemList =
    data && data.length
      ? data.map((item, index) => {
          return (
            <Item
              key={index}
              index={index}
              activeIndex={activeIndex}
              value={item?.label}
              onClick={() => props.onClick(item)}
              onItemClearClick={() => props.onItemClearClick(index)}
            />
          );
        })
      : '';
  return (
    <>
      {visible ? (
        <DropdownListWrapper customPrefix={props.prefix}>
          <div className="option-title">
            历史记录
            <i className="primary-hover iconfont iconico_zixuan_piliangshanchu" onClick={props.onClearBtnClick}></i>
          </div>
          <ul>{itemList}</ul>
        </DropdownListWrapper>
      ) : null}
    </>
  );
};
OptionList.defaultProps = {
  activeIndex: -1,
  data: [],
  visible: false,
};
export default OptionList;

const DropdownListWrapper = styled.div`
  background: #fff;
  position: absolute;
  //width: 100%;
  width: 360px;
  z-index: 99;
  top: ${(props) => (props.customPrefix ? '38px' : '')};
  transition: 0.3s ease-in-out;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.03), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 6px 16px -8px rgba(0, 0, 0, 0.08);
  .option-title {
    font-size: 13px;
    color: #262626;
    line-height: 18px;
    margin: 10px 0 6px 16px;
    display: flex;
    align-items: center;
    i {
      cursor: pointer;
      margin-left: 6px;
    }
  }
  ul {
    max-height: 254px;
    overflow-y: auto;
    margin-bottom: 10px;
    &::-webkit-scrollbar-thumb {
      visibility: hidden;
    }
    &:hover {
      &::-webkit-scrollbar {
        width: 8px;
        color: #cfcfcf;
      }
      &::-webkit-scrollbar-thumb {
        visibility: visible;
      }
    }
    li {
      position: relative;
      height: 32px;
      padding: 6px 16px 6px 36px;
      &.active {
        background: rgba(0, 120, 255, 0.02);
      }
      &.multiLine {
        height: 52px;
        .option-text {
          line-height: 20px;
          height: 40px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
        }
        .single-clear {
          top: 20px;
        }
      }
      .prefix-icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        top: ${(props) => (props.prefix ? '-2px' : '9px')};
        text-align: center;
        position: absolute;
        left: 16px;
        background-image: url(${searchIcon});
        background-size: contain;
      }
      .multiLineIcon {
        top: 19px;
      }
      .special-icon {
        top: -2px;
      }
      .option-text {
        width: 100%;
        display: block;
        max-width: 272px;
        line-height: 20px;
      }
      .single-clear {
        display: none;
        position: absolute;
        right: 16px;
        width: 12px;
        height: 12px;
        top: 9px;
        text-align: center;
        //background: #55a532;
        background-image: url(${deleteIcon});
        background-size: contain;
      }
      :hover {
        cursor: pointer;
        background: rgba(1, 113, 246, 0.04);
        .option-text {
          color: #0171f6 !important;
          transition: color 0.3s;
          cursor: pointer;
          line-height: 20px;
        }
        .single-clear {
          display: inline-block;
        }
      }
      span {
        width: 122px;
        height: 18px;
        font-size: 13px;
        font-weight: 400;
        color: rgba(38, 38, 38, 1);
        line-height: 18px;
      }
    }
  }
`;
