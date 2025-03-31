import GreenArrow from '@/pages/area/areaF9/assets/green_arrow.png';
import GreenArrowHover from '@/pages/area/areaF9/assets/green_hover.png';
import LittleOrangeArrow from '@/pages/area/areaF9/assets/little_orange_arrow.png';
import LittleOrangeArrowHover from '@/pages/area/areaF9/assets/little_orange_hover.png';
import LittleRedArrow from '@/pages/area/areaF9/assets/little_red_arrow.png';
import LittleRedArrowHover from '@/pages/area/areaF9/assets/little_red_hover.png';
import OrangeArrow from '@/pages/area/areaF9/assets/orange_arrow.png';
import OrangeArrowHover from '@/pages/area/areaF9/assets/orange_hover.png';
import RedArrow from '@/pages/area/areaF9/assets/red_arrow.png';
import RedArrowHover from '@/pages/area/areaF9/assets/red_hover.png';
import YellowArrow from '@/pages/area/areaF9/assets/yellow_arrow.png';
import YellowArrowHover from '@/pages/area/areaF9/assets/yellow_hover.png';
export interface Props {
  code: any;
  getPopupContainer: () => HTMLElement;
}

export interface DataType {
  riskLevelDetail: string;
  guid: string;
  originalSummary: string;
  riskLevel: string;
}
interface StyleMap {
  [key: string]: {
    borderColor: string;
    textColor: string;
    arrow: any;
    arrowHover: any;
  };
}
export const styleMap: StyleMap = {
  '101': { borderColor: '#FE3A2F33', textColor: '#FE3A2F', arrow: RedArrow, arrowHover: RedArrowHover },
  '102': { borderColor: '#FE3A2F33', textColor: '#FF6960', arrow: LittleRedArrow, arrowHover: LittleRedArrowHover },
  '103': { borderColor: '#FE3A2F33', textColor: '#FF6960', arrow: LittleRedArrow, arrowHover: LittleRedArrowHover },
  '104': { borderColor: '#FF750033', textColor: '#FF7500', arrow: OrangeArrow, arrowHover: OrangeArrowHover },
  '105': {
    borderColor: '#FF750033',
    textColor: '#FF9347',
    arrow: LittleOrangeArrow,
    arrowHover: LittleOrangeArrowHover,
  },
  '106': {
    borderColor: '#FF750033',
    textColor: '#FF9347',
    arrow: LittleOrangeArrow,
    arrowHover: LittleOrangeArrowHover,
  },
  '107': { borderColor: '#D6962E33', textColor: '#DEAC00', arrow: YellowArrow, arrowHover: YellowArrowHover },
  '108': { borderColor: '#23BFB133', textColor: '#23BFB1', arrow: GreenArrow, arrowHover: GreenArrowHover },
};
