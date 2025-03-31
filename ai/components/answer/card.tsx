import { Button } from '@dzh/components';
import { MoreLightOutlined } from '@dzh/icons';
import cn from 'classnames';
import { isString } from 'lodash';
import styled from 'styled-components';

import MsgIcon from '../../images/svg/msg.svg?react';
export default function Card({ data }: { data: any }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const dealData = data[1] && isString(data[1]) ? JSON.parse(data[1]) : data[1];
  const dataKey = Object.keys(dealData || {});
  const dataList = dataKey.map((item: any) => {
    return {
      type: 'content',
      title: item,
      content: dealData[item],
    };
  });
  return (
    <Container>
      <div className="card-header">
        <MsgIcon />
        <span>根据您的描述，小通为您找到以下内容：</span>
      </div>
      <ul className="card-list">
        {dataList.map((item: any, index: number) => {
          const isFirst = index === 0;
          return (
            <li className={cn('card-item', { 'is-first': isFirst })} key={index}>
              <div className="card-item-title">
                {isFirst ? (
                  <Button type="primary" shape="circle" size="22" className="float-right">
                    前往查看
                    <MoreLightOutlined style={{ fontSize: 8, width: 6, height: 6, verticalAlign: '0.025em' }} />
                  </Button>
                ) : (
                  <MoreLightOutlined
                    style={{ fontSize: 8, width: 6, height: 6, marginTop: 6 }}
                    className="float-right"
                  />
                )}

                <span className="card-item-title-text" title={item.title}>
                  {item.title}
                </span>
              </div>
              <div className="card-item-content" title={item.content}>
                {item.content}
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    span {
      font-size: 13px;
      color: #272727;
      line-height: 20px;
      font-weight: 500;
      margin-left: 3px;
    }
  }
  .card-list {
    display: flex;
    gap: 8px;
    li {
      padding: 12px 8px;
      height: 87px;
      background: linear-gradient(180deg, #e3eeff 0%, #ffffff);
      border: 1px solid #f1f5ff;
      border-radius: 8px;
      flex: 1;
      cursor: pointer;
      .card-item-title {
        display: inline-block;
        color: #0171f6;
        .card-item-title-text {
          line-height: 22px;
          font-size: 13px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          flex: 1;
          margin-right: 3px;
        }
      }
      &.is-first {
        flex: none;
        width: 273px;
        justify-content: space-between;
      }
      .float-right {
        float: right;
        margin-left: 3px;
      }
      /* &:hover {
        flex: none;
        width: 273px;
        .dzh-button {
          display: block;
        }
        .card-item-title-text svg {
          display: none;
        }
      } */
      /* .dzh-button {
        display: none;
      } */
      .ant-btn.dzh-button-22 {
        font-size: 10px;
        width: 67px;
      }
    }
    .card-item-content {
      margin-top: 5px;
      font-size: 12px;
      color: #757575;
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
`;
