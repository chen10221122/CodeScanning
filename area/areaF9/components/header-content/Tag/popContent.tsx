import { FC, useState, memo } from 'react';
// import { useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';

// import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

// import { useModal } from '@/app/components/modal/NoPayNotice';
// import helpIcon from '@/assets/images/common/help.png';
// import vipIcon from '@/assets/images/power/vip.png';
// import { Icon } from '@/components';
// import { Tooltip, Switch } from '@/components/antd';
import { Switch } from '@/components/antd';
// import ExportDoc from '@/components/exportDoc';
// import { LINK_GO_WILD } from '@/configs/routerMap';
// import exampleImg from '@/pages/area/areaF9/assets/example.png';
// import linkIcon from '@/pages/area/areaF9/assets/link.svg';
import Tabs from '@/pages/area/areaF9/components/header-content/Tabs';
import ListTable from '@/pages/area/areaF9/components/header-content/Tag/listTable';
// import { IRootState } from '@/store';
// import { downloadFile } from '@/utils/download';
// import { getExternalLink } from '@/utils/format';
// import { dynamicLink } from '@/utils/router';
// import { urlJoin, urlQueriesSerialize } from '@/utils/url';

// import style from '@/pages/area/areaF9/components/header-content/Tag/style.module.less';

interface PopContentProps {
  data: any;
  /** 浮窗标题 */
  title: string;
  /** tab配置 */
  tabConfig: any;
  /** 导出参数 */
  condition: any;
  filename: string;
  /** 内外层浮窗关闭 */
  handleClose: () => void;
  /** 是否是人口规模标签 */
  isCity?: boolean;
}

// const iconStyle = { width: 12, height: 12, marginLeft: '4px', verticalAlign: '-2px' };

const PopContent: FC<PopContentProps> = ({ data, title, tabConfig, condition, filename, isCity, handleClose }) => {
  // const [traceSource, setTraceSource] = useState(false);
  // const history = useHistory();
  // const [modal, contetHolder] = useModal();
  // const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  /** 城市圈、都市圈code */
  const [code, setCode] = useState(tabConfig?.[0]?.code || '');

  // const tooltip = useMemo(
  //   () => (
  //     <Tooltip
  //       color="#fff"
  //       title={() => (
  //         <TooltipContent>
  //           财汇资讯新增数据溯源功能，便于用户快速查询指标数据来源。目前部分指标可溯源，更多指标溯源将陆续上线。
  //         </TooltipContent>
  //       )}
  //     >
  //       <img className="tips-img" src={helpIcon} alt="" />
  //     </Tooltip>
  //   ),
  //   [],
  // );

  // const handleTraceSource = useMemoizedFn((isTrace: boolean) => {
  //   if (hasPay) {
  //     setTraceSource(isTrace);
  //   } else {
  //     handleClose();
  //     modal.open({
  //       permission: {
  //         exampleImageUrl: exampleImg,
  //       },
  //     });
  //   }
  // });

  // const traceCref = useMemo(
  //   () => (
  //     <div className={style.trace}>
  //       <SwitchStyle size={`small`} checked={traceSource} disabled={false} onChange={handleTraceSource} />
  //       <span
  //         className="source-text"
  //         // style={{
  //         //   color: disabled ? '#333' : '#141414',
  //         //   opacity: disabled ? 0.7 : 1,
  //         // }}
  //       >
  //         溯源
  //       </span>
  //       {tooltip}
  //       <Icon style={iconStyle} image={vipIcon} />
  //       {contetHolder}
  //     </div>
  //   ),
  //   [contetHolder, handleTraceSource, tooltip, traceSource],
  // );

  /** 链接 */
  // const handleClickToLink = useMemoizedFn((url) => {
  //   if (!url) {
  //     return null;
  //   }
  //   handleClose();
  //   const ext = url?.split('.')?.pop()?.toLowerCase();

  //   if (['docx', 'doc', 'xls', 'xlsx', 'ppt'].includes(ext ?? '')) {
  //     downloadFile(dayjs().format('YYYY-MM-DD'), url, ext);
  //   } else {
  //     let ret = getExternalLink(url);

  //     if (typeof ret === 'string') {
  //       history.push(urlJoin(dynamicLink(LINK_GO_WILD), urlQueriesSerialize({ url: encodeURIComponent(ret) })));
  //     } else {
  //       history.push(ret);
  //     }
  //   }
  // });

  // const linkCref = useMemo(() => {
  //   return (
  //     <LinkContainer onClick={() => handleClickToLink(tipsMap?.get('超大城市')?.link)}>
  //       <img src={linkIcon} alt="" className="co" />
  //       <div>链接</div>
  //     </LinkContainer>
  //   );
  // }, [handleClickToLink]);

  // const exportCondition = useMemo(() => {
  //   if (tabConfig) {
  //     return { condition: { code, type: 'plateArea', gdpFlag: 1, module_type: 'area_circle_detail' } };
  //   } else {
  //     return condition;
  //   }
  // }, [code, condition, tabConfig]);

  return (
    <Container id="popover-table-id">
      {!tabConfig ? (
        <div className="top">
          {/* <div className="title">{!tabConfig ? title : ''}</div>*/}
          <div className="title">{title}</div>
          {/* <div className="right"> */}
          {/* {traceCref} */}
          {/* {linkCref} */}
          {/* <ExportDoc condition={exportCondition?.condition} module_type={condition?.module_type} filename={filename} /> */}
          {/* </div> */}
        </div>
      ) : null}
      {tabConfig ? (
        <Tabs
          traceSource={false}
          tabConfig={tabConfig}
          handleClose={handleClose}
          isCity={isCity}
          setCode={setCode}
          code={code}
        />
      ) : (
        <ListTable traceSource={false} data={data} handleClose={handleClose} isCity={isCity} title={title} />
      )}
    </Container>
  );
};

export default memo(PopContent);

const Container = styled.div`
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 9px;
    height: 20px;
    padding: 0 14px;
    .title {
      height: 20px;
      line-height: 20px;
      color: #141414;
      font-size: 13px;
      font-weight: 700;
    }
    .right {
      display: flex;
      align-items: center;
      > div:last-of-type {
        height: 20px;
        line-height: 20px;
      }
      .export-xls-btn {
        color: #262626;
      }
    }
  }

  .trace-link-span {
    color: #025cdc;
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const SwitchStyle = styled(Switch)`
  transform: scale(${26 / 32});
  transform-origin: left top;
`;

export const TooltipContent = styled.div`
  color: #434343;
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
`;

// const LinkContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin-right: 16px;
//   height: 20px;
//   font-size: 13px;
//   color: #262626;
//   line-height: 20px;
//   cursor: pointer;

//   > img {
//     width: 14px;
//     height: 14px;
//     margin-right: 4px;
//     cursor: pointer;
//   }
// `;
