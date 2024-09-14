import { reactive } from 'vue'

export const state = reactive({
  loading: false,
  text: '',
})

export function showLoading(text: string = '加载中...') {
  Object.assign(state, {
    loading: true,
    text,
  })
}

export function hideLoading() {
  state.loading = false
}
