"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Link } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'

// 模拟上传到Walrus存储的函数


export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const uploadToWalrus = async (file: File): Promise<string> => {
    // 这里应该是实际的上传逻辑
    // 为了演示，我们只是返回一个模拟的URL
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟上传延迟
    return `https://walrus-rpc.example.com/ipfs/${file.name}`
  }
  
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadToWalrus(file)
      setUploadedUrl(url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gradient-to-br from-purple-900/80 to-indigo-900/80 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url("/img/bg.jpg")',
        }}
      >
        <div className="min-h-screen backdrop-blur-sm">
          <main className="pt-16 pb-16 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8 space-y-4">
              <h1 className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-purple-200 max-w-4xl leading-tight">
                Store Your Valuable Data On The Most Advanced Decentralized Storage
              </h1>
              <p className="text-xl md:text-2xl text-purple-200">
                Trustless • Resilient • Rapid • Uncensorable
              </p>
            </div>
            
            <Card className="w-full max-w-md bg-black/80 backdrop-blur-lg border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Walrus Web3 Storage</CardTitle>
                <CardDescription className="text-purple-200">Upload your file to decentralized storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file" className="text-sm font-medium text-purple-200">
                      Choose a file
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="bg-purple-900/50 border-purple-500/50 text-purple-100"
                    />
                  </div>
                  {uploadedUrl && (
                    <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-md">
                      <Label className="text-sm font-medium text-green-200">Uploaded File URL:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Link className="w-4 h-4 text-green-300" />
                        <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-green-300 hover:text-green-100 break-all">
                          {uploadedUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {uploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload to Walrus
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>


          </main>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  )
}

