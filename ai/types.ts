/**
 * 思考步骤状态枚举
 * 0: 回答完成
 * 1：思考步骤
 */
export enum THINK_STEP_STATUS {
  FINISH = '0',
  THINKING = '1',
}

/**
 * 反馈状态
 */
export enum FEEDBACK_STATUS {
  LIKE = '1',
  DISLIKE = '-1',
  NONE = '0',
}

/**
 * 问答类型
 * 1 企业问答
 * 2 功能问答
 */
export enum QUESTION_TYPE {
  COMPANY = '1',
  FUNCTION = '2',
}
