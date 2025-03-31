import loadable from '@loadable/component';

import { useRefCtx } from '@dataView/provider';

import type { DetailModalProps } from './type';

const Modal1 = loadable(() => import('./modal1'));
const Modal2 = loadable(() => import('./modal2'));
const Modal3 = loadable(() => import('./modal3'));
const Modal4 = loadable(() => import('./modal4'));
const Modal5 = loadable(() => import('./modal5'));

interface Props {
  visible?: boolean;
  onVisibleChange?: (v: boolean) => void;
  type?: string;
  params?: Record<string, any>;
  title?: string;
  extraProperties?: Record<string, any>;
}

function ModalRender({ title, ...props }: { type?: string } & DetailModalProps) {
  switch (props.type) {
    case 'issue_windows_1':
      return <Modal1 {...props} title={title ? `${title}-债券发行明细` : undefined} />;
    case 'issue_windows_2':
      return <Modal2 {...props} title={title ? `${title}-债券偿还明细` : undefined} />;
    case 'issue_windows_3':
      return <Modal3 {...props} title={title ? `${title}-债券存量明细` : undefined} />;
    case 'issue_windows_4':
      return <Modal4 {...props} title={title ? `${title}-授信额度明细` : undefined} />;
    case 'issue_windows_5':
      return <Modal5 {...props} title={title ? `${title}-非标余额明细` : undefined} />;
    default:
      return null;
  }
}

export default function Modal({ onVisibleChange, ...props }: Props) {
  const {
    state: { wholeModuleWrapperRef },
  } = useRefCtx();

  return (
    <ModalRender
      getContainer={() => wholeModuleWrapperRef || document.body}
      onClose={() => onVisibleChange?.(false)}
      {...props}
    />
  );
}
