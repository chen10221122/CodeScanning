// 回答内容

import { useRef, useState } from 'react';

import { Popover, Modal, Input, message } from '@dzh/components';
import { MoreLightOutlined } from '@dzh/icons';
import emoji from 'emoji-regex';
import styled from 'styled-components';

import { getInputLength } from '@/utils/share';

export default function Title({
  title,
  onModifyTitle,
  onDelete,
}: {
  title: string;
  onModifyTitle?: (title: string) => void;
  onDelete?: () => void;
}) {
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(title);
  const handlePopoverVisibilityChange = (visible: boolean) => {
    setPopoverVisible(visible);
  };

  const handleEditClick = () => {
    setPopoverVisible(false);
    setValue(title);
    setEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setPopoverVisible(false);
    setDeleteModalOpen(true);
  };

  const handleModifyTitle = () => {
    // 如果标题为空，则不修改
    if (!value) return message.error('标题不能为空');
    // value 只小于是15个汉字或者30个字符 一个汉字等于两个字符
    const valueLen = getInputLength(value);
    // 判断value是否包含表情
    if (emoji().exec(value)) return message.error('不能保存表情符号');
    if (valueLen > 30) return message.error('最多15个汉字或30个字符!');
    onModifyTitle?.(value);
    setEditModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleDelete = () => {
    onDelete?.();
    setDeleteModalOpen(false);
  };
  return (
    <Container ref={containerRef}>
      <Popover
        placement="bottomLeft"
        content={
          <ul className="popover-content">
            <li onClick={handleEditClick}>修改名称</li>
            <li onClick={handleDeleteClick}>删除对话</li>
          </ul>
        }
        trigger="click"
        onVisibleChange={handlePopoverVisibilityChange}
        visible={isPopoverVisible}
        getPopupContainer={() => containerRef.current || document.body}
      >
        <div className="title-container">
          <span className="title">{title}</span>
          <MoreLightOutlined
            style={{
              transform: isPopoverVisible ? 'rotate(-90deg)' : 'rotate(90deg)',
              color: '#0171f6',
              marginLeft: '4px',
            }}
          />
        </div>
      </Popover>
      <Modal.Info
        type="warning"
        title="确定要删除此对话吗？"
        visible={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
        cancelText="再想想"
      />
      <Modal.Content
        title="修改名称"
        visible={isEditModalOpen}
        onOk={handleModifyTitle}
        onCancel={() => setEditModalOpen(false)}
        width={438}
        okText="保存"
        okType="primary"
        okButtonProps={{
          disabled: !value,
        }}
        getContainer={() => containerRef.current || document.body}
      >
        <div className="modify-title">
          对话名称： <Input placeholder="输入你的问题" value={value} onChange={handleChange} />
        </div>
      </Modal.Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .title-container {
    cursor: pointer;
    margin: 11px 0 11px;
    max-width: calc(100% - 40px);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    line-height: 20px;
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #000000;
      line-height: 18px;
      font-size: 13px;
      font-weight: 500;
    }
  }
  .popover-content {
    width: 198px;
    padding: 8px 0;
    margin: 0 -8px;
    li {
      padding: 0 15px;
      height: 30px;
      font-size: 13px;
      color: #14141;
      cursor: pointer;
      line-height: 30px;
      &:hover {
        background: #f5faff;
        color: #0171f6;
      }
    }
  }
  .dzh-popover-no-title .ant-popover-inner-content {
    padding: 0;
  }
  .dzh-popover-no-title .ant-popover-inner-content .ant-popover-inner-content-body {
    padding: 0;
  }
  .modify-title {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    padding: 38px 0;
  }
`;
