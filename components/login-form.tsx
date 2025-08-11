'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, Upload, Mail, Lock } from 'lucide-react'
import WebcamCapture from './wecam'
interface LoginFormProps {
  onSuccess: (userData: any) => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
}
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [faceImage, setFaceImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [captuTag,setCapture] = useState(false) 


  const setx = () => {
    setCapture(prev => !prev)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


function dataURLtoFile(dataUrl: string, fileName: string): File {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}



  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFaceImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (!faceImage) {
      setMessage('Please upload a face image for verification')
      setIsLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('face_image', faceImage)

      const response = await fetch('/api/login', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess(result.user)
      } else {
        setMessage(result.error || 'Login failed')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Face Verification</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {captuTag ? <WebcamCapture setx = {setx} setImagePreview = {setImagePreview} dataURLtoFile = {dataURLtoFile} setFaceImage = {setFaceImage} /> : imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Face verification"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
              <Button
                type="button"
                variant="outline"
                onClick={setx}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Camera className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload your face image for verification
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={setx}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Login with Face Verification'}
      </Button>
    </form>
  
 
  
  </div>
  
   





  
  )
}



