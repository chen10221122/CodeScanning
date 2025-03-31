import Spin from '@/components/antd/spin';

// 模块Loading，用于F9页面模块加载
const ModuleLoading = () => {
  return (
    <div className="container">
      <div style={{ overflow: 'hidden' }}>
        <Spin type="fullThunder" style={{ marginTop: -200 }} />
      </div>
    </div>
  );
};

export default ModuleLoading;
