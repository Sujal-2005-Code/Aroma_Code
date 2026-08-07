"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeCustomization, ThemeName } from "@/types/portfolio";
import { motion } from "framer-motion";

interface ThemeCustomizerProps {
  theme: string;
  customization?: ThemeCustomization;
  onChange: (field: string, value: any) => void;
}

const themes: { value: ThemeName; label: string; gradient: string; description: string }[] = [
  { value: "modern-dark", label: "Modern Dark", gradient: "from-slate-900 via-purple-950/40 to-slate-900", description: "Sleek dark with vibrant accents" },
  { value: "minimal", label: "Minimal", gradient: "from-gray-50 to-gray-200", description: "Clean and distraction-free" },
  { value: "glassmorphism", label: "Glassmorphism", gradient: "from-purple-400/50 via-pink-400/50 to-blue-400/50", description: "Trendy frosted glass effects" },
  { value: "cyberpunk", label: "Cyberpunk", gradient: "from-black via-cyan-500/30 to-purple-600/30", description: "Neon futuristic aesthetic" },
  { value: "developer", label: "Developer", gradient: "from-gray-900 via-green-500/20 to-gray-900", description: "Code-focused dark theme" },
  { value: "creative", label: "Creative", gradient: "from-orange-500 via-red-500 to-pink-500", description: "Bold and expressive" },
  { value: "gradient", label: "Gradient", gradient: "from-indigo-600 via-purple-600 to-pink-600", description: "Vibrant rainbow gradient" },
  { value: "apple", label: "Apple Style", gradient: "from-gray-50 via-white to-gray-100", description: "Clean Apple-inspired design" },
  { value: "github", label: "GitHub Style", gradient: "from-gray-900 to-gray-800", description: "Developer-friendly look" },
  { value: "framer", label: "Framer Style", gradient: "from-black via-violet-500/30 to-black", description: "Modern animation-focused" },
];

export function ThemeCustomizer({ theme, customization, onChange }: ThemeCustomizerProps) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 border border-white/10 p-6 backdrop-blur">
        <h3 className="text-xl font-bold text-text-primary">Portfolio Theme</h3>
        <p className="text-sm text-text-muted">Choose a theme that represents your style</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-text-primary">Choose Your Theme</CardTitle>
          <CardDescription>Click any theme to apply it instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {themes.map((t, i) => (
              <motion.div
                key={t.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onChange("theme", t.value)}
                className={`cursor-pointer rounded-xl overflow-hidden transition-all hover:scale-105 ${
                  theme === t.value ? "ring-2 ring-brand-orange shadow-lg shadow-brand-orange/30" : "hover:ring-2 hover:ring-white/20"
                }`}
              >
                <div className={`aspect-video bg-gradient-to-br ${t.gradient} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {theme === t.value && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-brand-orange flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-2.5 bg-white/5">
                  <p className="text-sm font-semibold text-text-primary truncate">{t.label}</p>
                  <p className="text-xs text-text-muted truncate">{t.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-text-primary">Customization</CardTitle>
          <CardDescription>Fine-tune your portfolio appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-text-primary/80">Animation Speed</Label>
            <Select value={customization?.animationSpeed || "normal"} onValueChange={(value) => onChange("animationSpeed", value)}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">🐢 Slow & Elegant</SelectItem>
                <SelectItem value="normal">✨ Normal</SelectItem>
                <SelectItem value="fast">⚡ Fast & Snappy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-text-primary/80">Border Radius</Label>
            <Select value={customization?.borderRadius || "medium"} onValueChange={(value) => onChange("borderRadius", value)}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sharp</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large & Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
