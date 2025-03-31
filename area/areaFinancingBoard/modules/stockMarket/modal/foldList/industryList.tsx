import { Popover } from 'antd';
import styled from 'styled-components';

import moreSrc from './img/gengduo.png';
import styles from './styles.module.less';

type Props = {
  list: any;
  wrapperRef?: HTMLElement;
};

/** 赛道名称超过3个展开收缩 */
const FirmList = ({ list, wrapperRef }: Partial<Props>) => {
  return (
    <Containter>
      {list?.length > 3 ? (
        list.slice(0, 3).map((item: any, index: number) => {
          if (index === 2) {
            return (
              <div key={index} className="list-item">
                <span className="show_three" title={item}>
                  {item}
                </span>
                <Popover
                  placement="bottom"
                  content={[
                    list.map((item: any, index: number) => {
                      return (
                        <div key={index} className={styles['popover_content']}>
                          {item}
                        </div>
                      );
                    }),
                  ]}
                  trigger={'hover'}
                  overlayStyle={{ width: 163, maxHeight: 206 }}
                  overlayClassName="popover_content_classname"
                  getPopupContainer={() => wrapperRef || document.body}
                >
                  <span className="more">
                    <img className="open" src={moreSrc} alt="" />
                  </span>
                </Popover>
              </div>
            );
          } else {
            return (
              <div key={index}>
                <span className="show_all" title={item}>
                  {item}
                </span>
              </div>
            );
          }
        })
      ) : list?.length === 1 ? (
        <span>{list[0]}</span>
      ) : (
        list.map((item: any, index: number) => {
          return (
            <span key={index} className="show_all" title={item}>
              {item}
            </span>
          );
        })
      )}
    </Containter>
  );
};

export default FirmList;

const Containter = styled.div`
  .list-item {
    display: 'inline-flex';
    max-width: 96px;
    height: 17px;
  }
  color: #141414;
  .show_all {
    width: 100%;
    height: 17px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .show_three {
    max-width: 79px;
    height: 17px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* display: -webkit-box; */
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    /* margin-right:6px; */
  }

  .more {
    display: inline-block;
    margin-left: 6px;
    line-height: 17px;

    .open {
      width: 12px;
      height: 12px;
      display: inline-block;
      transform: rotate(180deg);
      cursor: pointer;

      :hover {
        transform: rotate(0deg);
      }
    }
  }
`;
