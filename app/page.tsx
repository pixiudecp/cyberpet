"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Link, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BackgroundVideo } from '@/components/BackgroundVideo'

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
      <BackgroundVideo />
      <div className="min-h-screen">
        <main className="pt-0 pb-16 min-h-screen flex flex-col items-center justify-center  p-4">
          <div className="text-center mb-8 space-y-4">

          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200 max-w-4xl leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            {/* <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-purple-200 max-w-4xl leading-tight"> */}
            
            Mint NFT Of Your Cherished Pet To Keep Them Always Online With You
            </h1>


            {/* <p className="text-xl md:text-2xl text-purple-200">
              Trustless • Resilient • Rapid • Uncensorable
            </p> */}
          </div>
          
          {/* <Card className="w-full max-w-md bg-black/50 backdrop-blur-lg border-purple-500/50"> */}
          <Card className="w-full max-w-md bg-black/60 ">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white text-center font-['Press_Start_2P']">MINT YOUR CYBER PET</CardTitle>
              <CardDescription className="text-purple-200 text-center">Choose a file then press MINT</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="relative inline-flex items-center justify-center w-full cursor-pointer">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-full py-2 px-4 bg-orange-900/70 border border-white/50 text-white rounded-md hover:bg-orange-800/70 transition-colors flex items-center justify-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>{file ? file.name : 'CHOOSE YOUR PET IMAGE'}</span>
                    </div>
                  </Label>
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
              {/* <span className='text-white'>aaa</span> */}
              <Button
                onClick={handleUpload}
                // disabled={!file || uploading}
                className="w-full bg-orange-500/80 hover:bg-orange-600 text-white"
              >
                {uploading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    MINTING...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    MINT
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>


        </main>
        <Footer />
      </div>
    </>
  )
}

