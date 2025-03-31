import styled from 'styled-components';

// import { Empty as OriginEmpty } from '@/components/antd';

const Empty = () => {
  return (
    <Wrapper className="empty-classname">
      {/* <OriginEmpty type={OriginEmpty.NO_DATA_NEW} /> */}
      <span className="title">暂无数据</span>
    </Wrapper>
  );
};

export default Empty;

const Wrapper = styled.div`
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    font-size: 13px;
    text-align: center;
    color: #999999;
    line-height: 18px;
  }
`;
