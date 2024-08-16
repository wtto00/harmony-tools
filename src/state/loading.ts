import { reactive } from "vue";

export const state = reactive({
  loading: false,
  text: "",
});

export function showLoading(text?: string) {
  Object.assign(state, {
    loading: true,
    text,
  });
}

export function hideLoading() {
  state.loading = false;
}
