import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { portfolio } from "@/services/api"
import themeMap from "@/themes/themeMap"
import { mapPortfolioToThemeContent } from "@/themes/mapPortfolioToThemeContent"
import type { ThemeContent } from "@/themes/themeContent"

const PortfolioPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState<ThemeContent | null>(null)
  const [theme, setTheme] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPortfolio() {
      if (!slug) return

      try {
        setLoading(true)
        const res = await portfolio.get(slug)

        const mapped = mapPortfolioToThemeContent(res)
        if (!mapped) {
          setError("Portfolio data could not be loaded.")
          return
        }

        setContent(mapped)
        setTheme(res.theme || "minimal-light")
      } catch (err: any) {
        if (err.message?.includes("not found")) {
          setError("Portfolio not found.")
        } else {
          setError("Failed to load portfolio.")
        }
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/60">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <p className="text-4xl">😕</p>
          <h1 className="text-xl font-bold">{error}</h1>
          <p className="text-sm text-white/60">The portfolio you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  if (!content) return null

  const ThemeComponent = themeMap[theme]

  if (!ThemeComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-2">
          <p className="text-xl font-bold">Theme not found</p>
          <p className="text-sm text-white/60">Theme "{theme}" is not available.</p>
        </div>
      </div>
    )
  }

  return <ThemeComponent content={content} />
}

export default PortfolioPage