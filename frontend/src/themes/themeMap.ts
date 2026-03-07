import type { FC } from "react"
import DeveloperTheme from "./DeveloperTheme"
import MinimalTheme from "./MinimalTheme"
import CreativeTheme from "./CreativeTheme"
import type { ThemeContent } from "./themeContent"

export type ThemeComponentProps = {
  content: ThemeContent
}

const themeMap: Record<string, FC<ThemeComponentProps>> = {
  "developer-dark": DeveloperTheme,
  "minimal-light": MinimalTheme,
  "creative-gradient": CreativeTheme,
}

export default themeMap