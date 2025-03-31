import { useCallback, useContext } from 'react';

import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';

import { AreaCompare } from '@/apis/area/type.define';
import Icon from '@/components/icon';

import { removeSpecialChar } from './common';
import { AreaContext, useCtx } from './context';

import './custom.less';

type propType = {
  toggleIndicator: (a: string) => void;
};

const Title = ({ toggleIndicator }: propType) => {
  const { indicators, hoverIdx, setHoverIdx } = useContext(AreaContext);
  const { update } = useCtx();

  const mouseEnter = (i: number) => setHoverIdx(i);
  const mouseLeave = () => setHoverIdx(-1);

  const getTitleDom = useCallback(
    (i: number, o: AreaCompare.indicator) => {
      return (
        <>
          <span>{o.name}</span>
          <a
            href="##"
            onClick={(e) => {
              e.preventDefault();
              toggleIndicator(o.name);
            }}
          >
            <Icon image={require('./imgs/expand.png')} size={10} style={{ position: 'relative', top: '-3px' }} />
          </a>
        </>
      );
    },
    [toggleIndicator],
  );

  const TitleWithChartVip = useMemoizedFn((text, isChart, isVip) => {
    return (
      <div className="title-chart-vip">
        <div className="text-label">{text}</div>
        {isChart && (
          <div
            className="icon-wrap"
            onClick={() => {
              update((draft) => {
                draft.chartModalVisible = true;
              });
            }}
          >
            <Icon image={require('./imgs/chart.png')} size={12} />
          </div>
        )}
        {isVip && <Icon image={require('./imgs/vip.png')} size={12} />}
      </div>
    );
  });

  return (
    <div className="title area-compare-title">
      {indicators?.map((o, i) => {
        let idx = i * 1000000;

        return (
          <dl key={o.name} className={removeSpecialChar(o.name)}>
            <dt
              id={o.name}
              onMouseEnter={() => {
                mouseEnter(idx);
              }}
              onMouseLeave={() => {
                mouseLeave();
              }}
              className={classNames([`line_${o.line}`, 'level1', { hover: hoverIdx === idx, 'first-line': !i }])}
            >
              {getTitleDom(i, o)}
            </dt>
            {o.list.map((d, j) => {
              let index = idx + (j + 1) * 10000;
              // console.log('ddd', d);

              return (
                <dd
                  key={d.label}
                  onMouseEnter={() => {
                    mouseEnter(index);
                  }}
                  onMouseLeave={() => {
                    mouseLeave();
                  }}
                  title={d.label}
                  className={classNames([`line_${d.line}`, 'level2', { equal: d.isEqual, hover: hoverIdx === index }])}
                >
                  {TitleWithChartVip(d.label, true, false)}
                </dd>
              );
            })}
            {o.children.map((t, i) => {
              let tIdx = idx + (i + 1) * 100;

              return (
                <dd className="third" key={t.name}>
                  <dl className={removeSpecialChar(t.name)}>
                    <dt
                      className={classNames([`line_${t.line}`, 'level3', { hover: hoverIdx === tIdx }])}
                      onMouseEnter={() => {
                        mouseEnter(tIdx);
                      }}
                      onMouseLeave={() => {
                        mouseLeave();
                      }}
                    >
                      <span>{t.name}</span>
                      <a
                        href="##"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleIndicator(t.name);
                        }}
                      >
                        <Icon
                          image={require('./imgs/expand2.png')}
                          size={10}
                          style={{ position: 'relative', top: '-3px' }}
                        />
                      </a>
                    </dt>

                    {t.list.map((d, j) => {
                      let fIdx = tIdx + j + 1;

                      return (
                        <dd
                          key={d.label}
                          onMouseEnter={() => {
                            mouseEnter(fIdx);
                          }}
                          onMouseLeave={() => {
                            mouseLeave();
                          }}
                          title={d.label}
                          className={classNames([
                            `line_${d.line}`,
                            'level4',
                            { hover: hoverIdx === fIdx, equal: d.isEqual },
                          ])}
                        >
                          {TitleWithChartVip(d.label, false, true)}
                        </dd>
                      );
                    })}
                  </dl>
                </dd>
              );
            })}
          </dl>
        );
      })}
    </div>
  );
};

export default Title;
