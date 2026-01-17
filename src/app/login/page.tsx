'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-6xl font-light tracking-tight text-black mb-2">
            EUFORICA
          </h1>
          <p className="text-neutral-600 text-sm uppercase tracking-wider">
            Command Center
          </p>
        </div>

        {/* Card de Login */}
        <Card className="bg-white border-neutral-200 shadow-lg">
          <CardHeader className="border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-black" />
              <CardTitle className="text-black font-bold">Iniciar Sesión</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-900 font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-50 border-neutral-300 text-black focus:border-black"
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-900 font-semibold">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-50 border-neutral-300 text-black focus:border-black"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-6"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Info adicional */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-xs text-neutral-500 text-center">
                Solo usuarios autorizados pueden acceder al sistema.
                <br />
                Contacta al administrador si necesitas credenciales.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
