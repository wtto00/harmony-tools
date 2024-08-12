import { reactive } from "vue";

export const state = reactive({
  scheme: "" as ColorScheme,
  mediaQueryList: {} as MediaQueryList,
  inited: false,
});

type ColorScheme = "OS" | "Dark" | "Light";

/**
 * 判断主题设置是否合法
 */
function isColorScheme(color: string): color is ColorScheme {
  return color === "OS" || color === "Dark" || color === "Light";
}

export function initTheme() {
  const localColorScheme = localStorage.getItem("colorScheme") ?? "OS";
  const colorScheme = isColorScheme(localColorScheme) ? localColorScheme : "OS";
  state.mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

  void setColorScheme(colorScheme);
}
function isDark() {
  return document.documentElement.classList.contains("dark");
}
function isReducedMotion() {
  return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
}
function setTheme(event?: MouseEvent) {
  const dark = !isDark();
  // 浏览器不支持 或者 浏览器设置了动画缩减 或者 第一次初始化时 不加载动画
  if (!document.startViewTransition || isReducedMotion() || !state.inited) {
    toggleDark();
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const transition = document.startViewTransition(() => {
    toggleDark();
  });
  let x: number, y: number;
  if (typeof event === "undefined") {
    x = window.innerWidth;
    y = 0;
  } else {
    x = event.clientX;
    y = event.clientY;
  }
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  void transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: dark ? clipPath : [...clipPath].reverse(),
      },
      {
        duration: 500,
        easing: "ease-in",
        pseudoElement: dark ? "::view-transition-new(root)" : "::view-transition-old(root)",
      }
    );
  });
}
function toggleDark() {
  document.documentElement.classList.toggle("dark");
}
function autoSwitch() {
  setTheme();
}
function listenDark() {
  if (state.mediaQueryList.addListener) {
    state.mediaQueryList.addListener(autoSwitch);
  } else {
    state.mediaQueryList.addEventListener("change", autoSwitch);
  }
}
function unlistenDark() {
  if (state.mediaQueryList.removeListener) {
    state.mediaQueryList.removeListener(autoSwitch);
  } else {
    state.mediaQueryList.removeEventListener("change", autoSwitch);
  }
}
async function setColorScheme(scheme: ColorScheme, event?: MouseEvent) {
  localStorage.setItem("colorScheme", scheme);
  state.scheme = scheme;

  let willDark: boolean;
  const currentIsDark = isDark();

  switch (scheme) {
    case "OS":
      // 这样写其实是优先 Light
      willDark = state.mediaQueryList.matches;
      if (willDark) {
        if (!currentIsDark) setTheme(event);
      } else {
        if (currentIsDark) setTheme(event);
      }
      // 监听系统色彩主题变化
      listenDark();
      break;
    case "Dark":
      willDark = true;
      if (!currentIsDark) setTheme(event);
      // 移除监听
      unlistenDark();
      break;
    case "Light":
      willDark = false;
      if (currentIsDark) setTheme(event);
      unlistenDark();
      break;
  }
  state.inited = true;
}
