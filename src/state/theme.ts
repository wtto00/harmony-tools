import { reactive } from 'vue'

export const state = reactive({
  scheme: '' as ColorScheme,
  mediaQueryList: window.matchMedia('(prefers-color-scheme: dark)'),
  inited: false,
  isDark: false,
})

type ColorScheme = 'OS' | 'Dark' | 'Light'

/**
 * 每次打开都是默认的跟随系统的主题。
 * 第一次初始化，不会加载动画
 */
export function initTheme() {
  state.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  void setColorScheme('OS')
}
function isDark() {
  return document.documentElement.classList.contains('dark')
}
function isReducedMotion() {
  return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
}
function setTheme(event?: MouseEvent) {
  const originDark = isDark()
  // 浏览器不支持 或者 浏览器设置了动画缩减 或者 第一次初始化时 不加载动画
  if (!document.startViewTransition || isReducedMotion() || !state.inited) {
    toggleDark()
    return
  }

  const transition = document.startViewTransition(() => {
    toggleDark()
  })
  let x: number, y: number
  if (typeof event === 'undefined') {
    x = window.innerWidth
    y = 0
  } else {
    x = event.clientX
    y = event.clientY
  }
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  void transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: originDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 500,
        easing: 'ease-in',
        pseudoElement: originDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    )
  })
}
function toggleDark() {
  document.documentElement.classList.toggle('dark')
  state.isDark = document.documentElement.classList.contains('dark')
}
function autoSwitch() {
  setTheme()
}
function listenDark() {
  if (state.mediaQueryList.addListener) {
    state.mediaQueryList.addListener(autoSwitch)
  } else {
    state.mediaQueryList.addEventListener('change', autoSwitch)
  }
}
function unlistenDark() {
  if (state.mediaQueryList.removeListener) {
    state.mediaQueryList.removeListener(autoSwitch)
  } else {
    state.mediaQueryList.removeEventListener('change', autoSwitch)
  }
}
export async function setColorScheme(scheme: ColorScheme, event?: MouseEvent) {
  state.scheme = scheme

  const currentIsDark = isDark()

  switch (scheme) {
    case 'OS':
      // 这样写其实是优先 Light
      const willDark = state.mediaQueryList.matches
      if (willDark) {
        if (!currentIsDark) setTheme(event)
      } else {
        if (currentIsDark) setTheme(event)
      }
      // 监听系统色彩主题变化
      listenDark()
      break
    case 'Dark':
      if (!currentIsDark) setTheme(event)
      // 移除监听
      unlistenDark()
      break
    case 'Light':
      if (currentIsDark) setTheme(event)
      unlistenDark()
      break
  }
  state.inited = true
}
