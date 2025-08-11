'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Users, Shield, Camera } from 'lucide-react'
import RegisterForm from '@/components/register-form'
import LoginForm from '@/components/login-form'
import EventDashboard from '@/components/event-dashboard'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  if (isAuthenticated) {
    return <EventDashboard user={user} onLogout={() => setIsAuthenticated(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EventSecure
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Secure Event Management with Face Recognition
          </p>
          
          {/* Features */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Event Management</h3>
                <p className="text-sm text-gray-600">Create and manage events seamlessly</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Face Recognition</h3>
                <p className="text-sm text-gray-600">Secure login with facial verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Secure Access</h3>
                <p className="text-sm text-gray-600">Advanced security for your events</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">User Management</h3>
                <p className="text-sm text-gray-600">Comprehensive attendee tracking</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Login with your credentials and face verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm 
                    onSuccess={(userData) => {
                      setUser(userData)
                      setIsAuthenticated(true)
                    }} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Register with your details and face image for secure access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
