export interface DetailModalProps {
  visible?: boolean;
  onClose?: () => void;
  title?: string;
  getContainer?: string | HTMLElement | (() => HTMLElement) | false;
  params?: Record<string, any>;
  extraProperties?: Record<string, any>;
}

export interface PaginationType {
  total: number;
  pageSize: number;
  current: number;
}
