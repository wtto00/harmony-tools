import { reactive } from 'vue'

export type AlertType = 'info' | 'danger' | 'success' | 'warning' | 'dark'

export const state = reactive({
  type: 'info' as AlertType,
  message: '',
})

let alertClock: ReturnType<typeof setTimeout>

/**
 * @param type 类型
 * @param msg 消息内容
 * @param notAutoClose type为danger时默认不自动关闭，否则默认自动关闭
 */
export function alertMsg(type: AlertType, msg: string, notAutoClose?: boolean) {
  clearTimeout(alertClock)
  Object.assign(state, {
    type,
    message: msg,
  })
  if ((type === 'danger' && notAutoClose === false) || (type !== 'danger' && notAutoClose !== true)) {
    alertClock = setTimeout(() => {
      state.message = ''
    }, 2000)
  }
}
