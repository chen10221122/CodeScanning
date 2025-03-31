import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

import { Button, Input, Modal } from '@dzh/components';
import { ACleanupOutlined, PlusBoldOutlined, SearchOutlined } from '@dzh/icons';
import { useMemoizedFn, useSize } from 'ahooks';
import styled from 'styled-components';

import { useHistory } from '@/utils/router';

import { useChatDetail, useNewChat } from '../hooks/useChatDetail';
import { IHistoryItem } from '../hooks/useHistoryList';
import AddIcon from '../images/svg/add.svg?react';

interface IProps {
  historyList: IHistoryItem[];
  getStatus?: (isOpen: boolean) => void;
  userId: string;
  chatId: string;
  handleSearch: (keyword: string) => void;
  setHistoryList: React.Dispatch<React.SetStateAction<IHistoryItem[]>>;
}

const History: FC<IProps> = ({ getStatus, userId, chatId, historyList, handleSearch, setHistoryList }) => {
  const { deleteChat } = useChatDetail({ chatId, userId });
  const { createChat } = useNewChat();
  const domRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(domRef) || { width: 0 };
  const [showSearch, setShowSearch] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const currentId = useRef<string>('');
  const history = useHistory();

  useEffect(() => {
    getStatus?.(!!width);
  }, [width, getStatus]);

  const handleClick = useMemoizedFn((id: string) => {
    history.push(`/ai#id=${id}`);
  });
  const handleDelete = useMemoizedFn(() => {
    deleteChat(setHistoryList, currentId.current);
    setModalOpen(false);
  });
  const openModal = useMemoizedFn((e: React.MouseEvent<HTMLSpanElement>, id: string) => {
    e.stopPropagation();
    currentId.current = id;
    setModalOpen(true);
  });
  const handleChange = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  });
  return (
    <Outer ref={domRef}>
      <div className="header">
        <h1> </h1>
        {showSearch ? (
          <div className="search-box">
            <Input
              placeholder="搜索历史记录"
              size={28}
              allowClear
              circle
              prefix={<SearchOutlined />}
              onChange={handleChange}
            />
            <PlusBoldOutlined
              style={{ fontSize: 12, color: '#0171F6', cursor: 'pointer', marginLeft: 4 }}
              onClick={createChat}
            />
          </div>
        ) : (
          <>
            <Button type="primary" size="28" icon={<AddIcon />} onClick={createChat}>
              新建对话
            </Button>
            <div className="history-text">
              历史对话 <SearchOutlined style={{ fontSize: 12, color: '#0171F6' }} onClick={() => setShowSearch(true)} />
            </div>
          </>
        )}
      </div>
      <div className="history-list">
        {historyList.map((item, index) => (
          <div
            className={`history-item ${chatId === item.currentSessionId ? 'active' : ''}`}
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(item.currentSessionId);
            }}
          >
            <span className="text">{item.dialogFirstMsg}</span>
            <ACleanupOutlined onClick={(e) => openModal(e, item.currentSessionId)} />
          </div>
        ))}
      </div>
      <Modal.Info
        type="warning"
        title="确定要删除此对话吗？"
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        cancelText="再想想"
        onOk={handleDelete}
      />
    </Outer>
  );
};

export default History;

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-left: 12px;
  background: url(${require(`../images/bg.png`)}) left top / cover;
  .header {
    padding-right: 12px;
    width: 100%;
  }
  h1 {
    height: 29px;
    background: url(${require(`../images/h1.png`)}) no-repeat center center / contain;
    margin-top: 16px;
    margin-bottom: 20px;
    width: 135px;
  }
  .ant-btn-primary {
    background: linear-gradient(236deg, #0075ff 13%, #00cbff 100%);
    border-radius: 4px;
    border: none;
    width: 100%;
    svg {
      margin-right: 4px;
    }
  }
  .history-text {
    font-size: 12px;
    color: #888888;
    line-height: 18px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    svg {
      cursor: pointer;
    }
  }
  .search-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .history-list {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    padding: 0 12px 12px 0;
    margin-top: 12px;
    &::-webkit-scrollbar {
      width: 8px;
    }
    .history-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px;
      width: 100%;
      color: #262626;
      cursor: pointer;
      &:hover,
      &.active {
        background: #ebf4ff;
        border-radius: 4px;
        color: #0171f6;
      }
      &:hover {
        .dzhicon {
          display: block;
        }
      }
      .dzhicon {
        display: none;
        margin-left: 6px;
      }
      .text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;
