import { Button } from '@dzh/components';
import { MoreLightOutlined } from '@dzh/icons';
import styled from 'styled-components';

import CustomIcon from '../../images/svg/custom.svg?react';
import MsgIcon from '../../images/svg/msg.svg?react';
export default function CustomService() {
  const handleClick = (e: any) => {
    e.preventDefault();
    const btn = document.getElementById('sidebar-staff-service-btn');
    if (btn) btn.click();
  };

  return (
    <Container>
      <div className="card-header">
        <MsgIcon />
        <span>根据您的描述，小通为您找到以下内容：</span>
      </div>
      <div className="card-content">
        <div className="card-content-top">
          <div>
            <div className="card-content-item">
              <CustomIcon />
              <span className="text">企业问答</span>
              <MoreLightOutlined
                style={{
                  fontSize: 8,
                  width: 6,
                  height: 6,
                  verticalAlign: '0.125em',
                  color: '#0171f6',
                  marginTop: '-5px',
                }}
              />
            </div>
            <div className="card-content-item-desc">在线提供客户服务</div>
          </div>
          <img src={require('../../images/person.png')} alt="customService" />
        </div>
        <div className="card-content-bottom">
          <div className="card-content-bottom-item">服务时间：周一至周五 8:30-17:30</div>
          <Button type="primary" shape="circle" size="22" onClick={handleClick}>
            立即咨询
          </Button>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 8px;
  .card-header {
    display: flex;
    align-items: center;
    span {
      font-size: 13px;
      color: #272727;
      line-height: 20px;
      font-weight: 500;
      margin-left: 3px;
    }
  }
  .card-content {
    width: 264px;
    height: 90px;

    border: 1px solid #ecf4fe;
    border-radius: 8px;
    .card-content-top {
      background: #f8fcff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ecf4fe;
      padding: 0 8px 0 12px;
      img {
        width: 76px;
        height: 60px;
      }
      .card-content-item {
        display: flex;
        align-items: center;
        gap: 3px;
        .text {
          font-size: 13px;
          font-weight: 500;
          color: #0171f6;
          line-height: 22px;
        }
      }
      .card-content-item-desc {
        font-size: 12px;
        text-align: left;
        color: #757575;
        line-height: 18px;
        margin-top: 4px;
      }
    }
    .card-content-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      height: 28px;
      .card-content-bottom-item {
        font-size: 10px;
        text-align: left;
        color: #838383;
        line-height: 18px;
      }
      .ant-btn.dzh-button-22 {
        font-size: 10px;
      }
    }
  }
`;
