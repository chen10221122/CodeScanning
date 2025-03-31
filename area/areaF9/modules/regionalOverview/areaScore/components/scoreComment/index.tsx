import { memo, useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import rightArrow from '@/pages/area/areaF9/assets/right_arrow.png';
// import BgImg from '@/pages/area/areaF9/modules/regionalOverview/areaScore/imgs/bg.png';
import {
  // calculateMultilineTextHeight,
  calculateRealTextHeight,
} from '@/pages/area/areaF9/utils';

interface scProps {
  list: string[];
  initList: string[];
  handleShowMoreClick: Function;
  noData: boolean;
}
// 实际盒子的最高高度
const initBoxHeight = 418;

const ScoreComment = (params: scProps) => {
  const { list, initList, handleShowMoreClick, noData } = params;
  // console.log('list改变', list.length, initList.length, noData);
  const commentRef = useRef(null);

  const cloneList = cloneDeep(list);

  // const size = useSize(commentRef);
  // console.log('size', size);

  // const boxHeight = useMemo(() => {
  //   let tempBoxHeight = size?.height || 0;
  //   return tempBoxHeight <= initBoxHeight ? tempBoxHeight : initBoxHeight;
  // }, [size?.height]);

  const calcData = useMemo(() => {
    let calcHeight = 0;
    let index = -1;
    let lastCalcHeight = 0;
    let showMore = false;
    let MarginTop = 0;
    let lineClampNum = 0;
    let lastLines = 0;
    const width = 222; // 设置宽度限制
    const lineHeight = 21;

    for (let i = 0; i < initList.length; i++) {
      const text = initList[i];
      // let { height } = calculateMultilineTextHeight(text, width, lineHeight, '13px PingFangSC');
      let { height } = calculateRealTextHeight(text, width, lineHeight, 13);
      // console.log('height, lines', height, lines);
      if (i !== 0) height += 10;

      lastCalcHeight = calcHeight;
      calcHeight += height;
      // console.log('height:', i, ',', height, ',', 'calcHeight===', calcHeight);
      if (calcHeight + 31 >= initBoxHeight) {
        index = i;
        break;
      }
    }
    let showList = [];
    if (index >= 0) {
      showMore = true;
      showList = cloneList.slice(0, index + 1);
    } else {
      showMore = false;
      showList = cloneList;
    }
    // console.log('showList', showList, lastLines);

    // console.log('index', index, 'lastCalcHeight', lastCalcHeight);

    showList[showList.length - 1] =
      `<span class="expand-btn ${showMore ? 'show' : 'hide'}" id="expand-btn">更多 <img src='${rightArrow}'></span>` +
      showList[showList.length - 1];

    let hasHeight = initBoxHeight - lastCalcHeight - 10 - 10;
    let restHeight = hasHeight % lineHeight;
    // console.log('hasHeight', hasHeight);

    lastLines = Math.ceil(hasHeight / lineHeight);
    if (restHeight === 0) {
      lineClampNum = lastLines;
    } else {
      lineClampNum = lastLines >= 5 ? lastLines - 1 : lastLines;
    }
    MarginTop = (lineClampNum - 1) * lineHeight;

    // console.log('lineClampNum', lineClampNum, 'MarginTop', MarginTop, restHeight);

    return {
      showList,
      MarginTop,
      lineClampNum,
      showMore,
    };
  }, [initList, cloneList]);

  const handleMoreClick = useMemoizedFn(() => {
    // console.log('被点击了222');
    handleShowMoreClick();
  });

  return (
    <ScoreCommentBox MarginTop={calcData.MarginTop} lineClampNum={calcData.lineClampNum} id="score-comment-box">
      <div className="score-head">
        <div className="head-left">
          <span>评分点评</span>
        </div>
      </div>
      {noData ? (
        <div className="no-score-data">该板块暂无数据</div>
      ) : (
        <div className="comment-content">
          <div className="list-ul" ref={commentRef}>
            {calcData.showList.map((item, i) => (
              <>
                <div
                  key={`${item}${i}`}
                  className={cn('list', { lastlist: i === calcData.showList.length - 1 })}
                  dangerouslySetInnerHTML={{ __html: item }}
                ></div>
              </>
            ))}
          </div>
          {calcData.showMore ? <div className="click-area" onClick={handleMoreClick}></div> : null}
        </div>
      )}
    </ScoreCommentBox>
  );
};

export default memo(ScoreComment);

const ScoreCommentBox = styled.div<{ MarginTop: number; lineClampNum: number }>`
  height: 100%;
  .no-score-data {
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #cccccc;
    padding-left: 8px;
  }
  .comment-content {
    // overflow-y: auto;
    position: relative;
    height: calc(100% - 32px);
    padding: 8px 9px;
    background: url(${require('../../imgs/bg.png')}) 0 0/62px 31px no-repeat,
      linear-gradient(15deg, #ffffff 11%, #f7fbff 95%);
    border: 1px solid #ebf4ff;
    max-height: 436px;
    // overflow: hidden;

    .click-area {
      width: 80px;
      height: 60px;
      z-index: 2;
      position: absolute;
      bottom: 0;
      right: 0;
      cursor: pointer;
    }

    .list-ul {
      height: 100%;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 19; /* 定义文本的行数 */
      // overflow: hidden;
      // text-overflow: ellipsis;
    }
    .list {
      font-size: 13px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #262626;
      line-height: 21px;
      em {
        font-style: normal;
        // font-family: PingFangSC, PingFangSC-Medium;
        // font-weight: 600;
      }
      &.lastlist {
        display: -webkit-box;
        -webkit-line-clamp: ${({ lineClampNum }) => lineClampNum};
        -webkit-box-orient: vertical;
        overflow: hidden;

        &::before {
          content: '';
          float: right;
          width: 0;
          height: ${({ MarginTop }) => MarginTop + 'px'};
        }

        > span {
          display: inline-flex;
          align-items: baseline;
          color: #0171f6;
          cursor: pointer;
          user-select: none;
          > img {
            width: 5px;
            height: 9px;
            margin-left: 2px;
            margin-top: -2px;
          }
        }

        .expand-btn {
          float: right;
          clear: both;
          display: none;
          &.show {
            display: block;
          }
          &.hide {
            display: none;
          }
        }
      }
    }
    .list ~ .list {
      margin-top: 10px;
    }
  }

  // .comment-box-detail-modal {
  //   top: 50%;
  //   margin-top: -232px;
  //   .ant-modal-content .ant-modal-close {
  //     top: 0;
  //   }
  //   .ant-modal-close {
  //     .ant-modal-close-x {
  //       height: 32px;
  //       line-height: 32px;
  //     }
  //   }
  //   .ant-modal-header {
  //     padding: 0 24px;
  //     border-bottom: 1px solid #f0f0f0;
  //     .process-title {
  //       padding: 0;
  //       align-items: center;
  //       border: none;
  //       min-height: 31px;
  //       .logo {
  //         margin-top: 0;
  //       }
  //     }
  //   }
  //   .ant-modal-body {
  //     padding: 0 6px;
  //   }
  // }
`;
