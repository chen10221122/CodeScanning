import { useCallback, useContext, useRef, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useInViewport, useMemoizedFn } from 'ahooks';
import { Rate } from 'antd';
import classNames from 'classnames';

import { Tooltip } from '@/components/antd';
import Icon from '@/components/icon';
import { Image } from '@/components/layout';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { getIndicAndUnit } from '@/pages/area/areaDebt/components/updateTip/formatData';
import { specialIndicList } from '@/pages/area/areaDebt/components/updateTip/specialConf';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { scrollLimit } from '../../';
import { removeSpecialChar } from '../../common';
import { useCtx, AreaContext } from '../../context';
import ElipsisText from '../ElipsisText';
import { CardStyle, IndicatorList, ViewPort } from './style';

const DragList = ({ setShowPowerDialog, selectYear, openModal }) => {
  const history = useHistory();
  const { update } = useCtx();
  const openNewTab = useCallback(
    (url) => {
      if (!url) return;
      history.push(url);
    },
    [history],
  );

  const havePay = useSelector((store) => store.user.info).havePay;

  const {
    indicators,
    areaData,
    setAreaData,
    setSearchAreaData,
    setAreas,
    setVisible,
    scrollTop,
    openSource,
    hoverIdx,
    setHoverIdx,
  } = useContext(AreaContext);

  const addAreaMainrRef = useRef(null);
  const [isDrag, setDrag] = useState(false);
  const [inViewport] = useInViewport(addAreaMainrRef, { threshold: 0.2 });

  useEffect(() => {
    update((d) => {
      d.inViewport = inViewport;
    });
  }, [inViewport, update]);

  /*const clearAreaData = useCallback(() => {
    setAreaData((arr) => (arr = []));
    setSearchAreaData((arr) => (arr = []));
  }, [setAreaData, setSearchAreaData]);

  const showConfirm = useCallback(() => {
    Modal.confirm({
      title: '提示',
      icon: (
        <Icon
          symbol="iconClose-Circle-Fill2x"
          style={{ float: 'left', width: '21px', height: '21px', margin: '0 16px 40px 0' }}
        />
      ),
      content: '确定要一键清空所有地区数据吗，是否确认删除？',
      onOk() {
        clearAreaData();
      },
      onCancel() {},
    });
  }, [clearAreaData]);*/

  const onDragEnd = (result) => {
    setDrag(false);
    if (!result.destination) return;
    setAreaData((arr) => {
      let [d] = arr.splice(result.source.index, 1);
      arr.splice(result.destination.index, 0, d);
    });

    setSearchAreaData((arr) => {
      let [d] = arr.splice(result.source.index, 1);
      arr.splice(result.destination.index, 0, d);
    });
  };

  const onDragStart = useMemoizedFn(() => {
    setDrag(true);
  });

  const removeCard = (card) => {
    const idx = areaData.indexOf(card);

    // const areaHistoryData = areaData.map((o) => {
    //   return {
    //     name: o.name,
    //     subName: o.subName,
    //     isSelfLevel: o.isSelfLevel,
    //     value: o.value,
    //   };
    // });

    setAreaData((arr) => {
      arr.splice(idx, 1);
    });
    setSearchAreaData((arr) => {
      arr.splice(idx, 1);
    });
  };

  const mouseEnter = useCallback((i) => setHoverIdx(i), [setHoverIdx]);
  const mouseLeave = useCallback(() => setHoverIdx(-1), [setHoverIdx]);

  const getListStyle = (isDraggingOver) => ({
    // background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    height: '100%',
    // flex: areaData.length,
  });

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // background: isDragging ? 'lightgreen' : 'grey',
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getHandleStyle = (isDragging) => {
    let top = scrollTop - scrollLimit;
    return {
      position: isDragging ? (top > 0 ? 'fixed' : 'relative') : 'sticky',
      width: '126px',
      top: isDragging && top > 0 ? top + 54 : 0,
    };
  };

  const getColHtml = useCallback(
    (col, isEmpty, isFixed = false) => {
      const { indicators, name: regionName, value: regionCode } = col;
      // console.log("indicatorsindicators", indicators);
      return (
        <IndicatorList className={'indicatorList'} isScroll={scrollTop - scrollLimit > 0}>
          {indicators.map((o, i) => {
            let idx = i * 1000000;
            // 判断是否是最后一列的第一行
            const isLastFirstLine = isFixed && !i;
            /* eslint-disable */
            return (
              <dl
                key={o.name}
                className={removeSpecialChar(o.name)}
                style={{ overflow: isLastFirstLine ? 'visible' : 'hidden' }}
              >
                <dt
                  onMouseEnter={() => {
                    mouseEnter(idx);
                  }}
                  onMouseLeave={() => {
                    mouseLeave();
                  }}
                  className={classNames([`line_${o.line}`, { hover: hoverIdx === idx, 'first-line': !i }])}
                >
                  {/* {isFixed && !i ? (
                    <ExportDoc
                      style={{ position: 'absolute', right: '18px', width: '110px' }}
                      condition={{ ...condition, module_type: 'web_area_compare', exportFlag: true }}
                      filename={`地区比较${dayjs(new Date()).format('YYYYMMDD')}`}
                    />
                  ) : null} */}
                </dt>

                {o.list.map((d, j) => {
                  let index = idx + (j + 1) * 10000;
                  const { indicName: unUnitName, unit } = getIndicAndUnit(d.label);
                  // 判断是不是计算指标
                  const isSpecial = specialIndicList.includes(unUnitName);
                  // 判断要不要飘蓝
                  const isBlue = !isEmpty && openSource && (d.guId || isSpecial);
                  return (
                    <dd
                      onClick={(e) => {
                        if (!isEmpty && openSource) {
                          if (d.guId) {
                            openNewTab(urlJoin(LINK_INFORMATION_TRACE, urlQueriesSerialize({ guId: d.guId })));
                          } else if (isSpecial) {
                            openModal(
                              {
                                title: `${regionName}_${unUnitName}_${unit}`,
                                regionCode: String(regionCode) || '',
                                indicName: unUnitName,
                                unit,
                                year: selectYear,
                                pageCode: 'regionalEconomyCompareTool',
                                regionName,
                              },
                              true,
                            );
                          }
                        }
                      }}
                      className={classNames([
                        `line_${d.line}`,
                        {
                          link: isBlue,
                          hover: hoverIdx === index,
                          max: d.isMax,
                          min: d.isMin,
                          equal: d.isEqual,
                        },
                      ])}
                      key={d.label}
                      onMouseEnter={() => {
                        mouseEnter(index);
                      }}
                      onMouseLeave={() => {
                        mouseLeave();
                      }}
                    >
                      {isEmpty ? (
                        '　'
                      ) : d.value === '无权限' ? (
                        <Icon image={require('../../imgs/lock.png')} size={14} />
                      ) : d.indexId === 'REGION_10000014' ? (
                        <span>
                          <Rate className="rate-start" allowHalf value={4} disabled />
                          {d.showVal}
                        </span>
                      ) : (
                        d.showVal || '-'
                      )}
                    </dd>
                  );
                })}

                {o.children.map((t, i) => {
                  let tIdx = idx + (i + 1) * 100;

                  return (
                    <dd className="third" key={t.name}>
                      <dl className={removeSpecialChar(t.name)}>
                        <dt
                          className={classNames([`line_${t.line}`, { hover: hoverIdx === tIdx }])}
                          onMouseEnter={() => {
                            mouseEnter(tIdx);
                          }}
                          onMouseLeave={() => {
                            mouseLeave(tIdx);
                          }}
                        ></dt>

                        {t.list.map((d, j) => {
                          let fIdx = tIdx + j + 1;
                          const { indicName: unUnitName, unit } = getIndicAndUnit(d.label);
                          // 判断是不是计算指标
                          const isSpecial = specialIndicList.includes(unUnitName);
                          // 判断要不要飘蓝
                          const isBlue = !isEmpty && openSource && (d.guId || isSpecial);

                          return (
                            <dd
                              key={d.label}
                              onMouseEnter={() => {
                                mouseEnter(fIdx);
                              }}
                              onMouseLeave={() => {
                                mouseLeave(fIdx);
                              }}
                              onClick={(e) => {
                                if (!isEmpty && openSource) {
                                  if (d.guId) {
                                    openNewTab(urlJoin(LINK_INFORMATION_TRACE, urlQueriesSerialize({ guId: d.guId })));
                                  } else if (isSpecial) {
                                    openModal(
                                      {
                                        title: `${regionName}_${unUnitName}_${unit}`,
                                        regionCode: String(regionCode) || '',
                                        indicName: unUnitName,
                                        unit,
                                        year: selectYear,
                                        pageCode: 'regionalEconomyCompareTool',
                                        regionName,
                                      },
                                      true,
                                    );
                                  }
                                }
                              }}
                              className={classNames([
                                `line_${d.line}`,
                                {
                                  link: isBlue,
                                  hover: hoverIdx === fIdx,
                                  max: d.isMax,
                                  min: d.isMin,
                                  equal: d.isEqual,
                                },
                              ])}
                            >
                              {isEmpty ? (
                                '　'
                              ) : d.value === '无权限' ? (
                                <Icon image={require('../../imgs/lock.png')} size={14} />
                              ) : d.indexId === 'REGION_10000014' ? (
                                <Rate className="rate-start" allowHalf value={4} disabled />
                              ) : (
                                d.showVal || '-'
                              )}
                            </dd>
                          );
                        })}
                      </dl>
                    </dd>
                  );
                })}
              </dl>
            );
            /* eslint-enable */
          })}
        </IndicatorList>
      );
    },
    [scrollTop, hoverIdx, mouseEnter, mouseLeave, openSource, openNewTab, selectYear, openModal],
  );

  const PatchEmpty = useCallback(
    (isFixed) => {
      let len = 8 - areaData.length;
      if (!indicators || (isFixed && len === 8)) return null;

      const isScrollFixed = { marginTop: scrollTop - scrollLimit > 0 ? '-90px' : '0px' };

      let style = isFixed
        ? { flex: 'none', minWidth: 0, ...isScrollFixed }
        : {
            flex: len,
            minWidth: 0,
            ...isScrollFixed,
          };

      return (
        <>
          {len > 0 || isFixed ? (
            <div className={'right-empty-filling'} style={style}>
              <div
                className="patch-head"
                style={{
                  zIndex: 1,
                  height: '90px',
                  background: '#fff',
                  position: 'sticky',
                  top: 0,
                }}
              />

              {getColHtml({ indicators }, true, isFixed)}
            </div>
          ) : null}
        </>
      );
    },
    [areaData.length, indicators, scrollTop, getColHtml],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
            {areaData.map((item, index) => (
              <Draggable key={item.name} draggableId={item.name} index={index}>
                {(provided, snapshot) => (
                  <CardStyle
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <div
                      className={classNames(['handler', { fixed: scrollTop > scrollLimit }])}
                      style={getHandleStyle(snapshot.isDragging)}
                      {...provided.dragHandleProps}
                    >
                      <div className="card-title">
                        <Tooltip placement="topRight" arrowPointAtCenter={true} title="点击删除，拖拽可进行排序">
                          <a
                            className="remove"
                            href="##"
                            onClick={(e) => {
                              e.preventDefault();
                              havePay ? removeCard(item) : setShowPowerDialog(true);
                            }}
                          >
                            <Icon
                              symbol="iconicon_diqushanchu"
                              style={{
                                width: '16px',
                                height: '16px',
                                // boxShadow: '0px 2px 6px 0px rgba(232,232,232,0.5)',
                              }}
                            />
                          </a>
                        </Tooltip>
                        {index === areaData.length - 1 && index !== 7 && !snapshot.isDragging ? (
                          <>
                            <Tooltip placement="topRight" arrowPointAtCenter={true} title="最多可添加八个地区">
                              <a
                                ref={addAreaMainrRef}
                                href="##"
                                className={classNames(['add', { isLast: index === 7 }])}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!havePay) {
                                    setShowPowerDialog(true);
                                    return;
                                  }

                                  if (index === 7) return;
                                  update((d) => {
                                    d.areaChangeIndex = -1;
                                  });
                                  setVisible(true);
                                  setAreas((o) => (o = []));
                                }}
                              >
                                <Image src={require('../../imgs/add.png')} w={14} h={14} style={{ marginRight: 6 }} />
                                添加地区
                              </a>
                            </Tooltip>
                          </>
                        ) : null}

                        <div className="inner">
                          <div className="name">
                            <ElipsisText text={item.subName} hasHoverStyle maxWidth={102} code={item.value} />
                            <ElipsisText text={item.name} hasHoverStyle maxWidth={102} code={item.value} />
                          </div>
                        </div>

                        <div className="btn-container">
                          <a
                            href="##"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!havePay) {
                                setShowPowerDialog(true);
                                return;
                              }
                              update((d) => {
                                d.areaChangeIndex = index;
                              });
                              // setAreas((o) => (o = item.sourceList));
                              setVisible(true);
                            }}
                          >
                            <>
                              <Icon image={require('../../imgs/replace.svg')} size={8} />
                              <span className="replace-text">替换</span>
                            </>
                          </a>
                        </div>
                      </div>
                    </div>

                    {getColHtml(item)}
                  </CardStyle>
                )}
              </Draggable>
            ))}
            {inViewport || isDrag ? null : (
              <ViewPort
                className="add-fix"
                onClick={(e) => {
                  e.preventDefault();
                  if (!havePay) {
                    setShowPowerDialog(true);
                    return;
                  }
                  update((d) => {
                    d.areaChangeIndex = -1;
                  });
                  setVisible(true);
                  setAreas((o) => (o = []));
                }}
              >
                <Icon image={require('../../imgs/add.svg')} size={14} />
                <span>添加地区</span>
              </ViewPort>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {PatchEmpty()}
      {PatchEmpty(true)}
    </DragDropContext>
  );
};

export default DragList;
