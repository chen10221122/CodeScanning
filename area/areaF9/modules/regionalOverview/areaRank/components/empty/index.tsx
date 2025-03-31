import S from './style.module.less';
export default function Empty({ onClick }: any) {
  return (
    <div className={S.emptyWrapper}>
      <div className={S.emptyImg} />
      <div className={S.emptyText}>
        此筛选条件下无结果，点击<span onClick={onClick}>清除选项</span>恢复默认
      </div>
    </div>
  );
}
