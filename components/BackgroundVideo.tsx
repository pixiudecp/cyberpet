"use client"

import { useState } from 'react'

const videos = [
  '/video/1.mp4',
  '/video/3.mp4',
  '/video/2.webm',
  '/video/4.webm',
]

export function BackgroundVideo() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  // 获取当前视频的文件扩展名
  const getVideoType = (videoPath: string) => {
    const extension = videoPath.split('.').pop()?.toLowerCase()
    return extension === 'webm' ? 'video/webm' : 'video/mp4'
  }

  return (
    <div className="fixed inset-0 -z-10">
      <video
        key={videos[currentVideoIndex]}
        autoPlay
        muted
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={() => setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)}
      >
        <source 
          src={videos[currentVideoIndex]} 
          type={getVideoType(videos[currentVideoIndex])} 
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm" />
    </div>
  )
} 