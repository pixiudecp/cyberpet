"use client"

import { useState, useEffect } from 'react'

const Footer = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // let timeoutId: NodeJS.Timeout;
    const isMobile = !window.matchMedia('(hover: hover)').matches;

    // 如果是移动设备，直接显示footer
    if (isMobile) {
      setIsVisible(true);
      return; // 直接返回，不添加鼠标事件监听
    }
    const handleMouseMove = (e: MouseEvent) => {
      // 获取视窗高度
      const windowHeight = window.innerHeight;
      // 获取鼠标Y坐标
      const mouseY = e.clientY;
      
      // 如果鼠标在距离底部100px的范围内
      if (windowHeight - mouseY < 100) {
        setIsVisible(true);
      } else {
        // 永远显示，需要隐藏改为false即可

          setIsVisible(true);

      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      

    };
  }, []);

  return (
    <footer 
      className={`fixed bottom-0 left-0 right-0 transition-all duration-200 ease-in-out z-50 overflow-hidden ${
        isVisible ? 'h-18' : 'h-0'
      }`}
    >
      <div className="h-full     border-orange-500/50 text-purple-200 flex items-center justify-center">
        <div className="container mx-auto px-2 py-6">
          <div className="flex flex-col bg-blur items-center justify-between bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200  ">
            <div className=" tracking-widest  text-xl  ">
              
              <a href="#" className="hover:text-white/50 hover:font-bold font-semibold transition-colors ">© 2024 Created by Michael.</a>
            </div>
            <div className="flex space-x-4 md:space-x-16   mt-4">
              <a href="https://www.walrus.xyz" className="hover:text-white/50 hover:font-bold transition-colors">Walrus</a>
              <a href="https://www.mystenlabs.com" className="hover:text-white/50 hover:font-bold transition-colors">Mysten Labs</a>
              <a href="https://x.com/0xHOH" className="hover:text-white/50 hover:font-bold transition-colors">HOH</a>
              <a href="https://github.com/move-cn/letsmove" className="hover:text-white/50 hover:font-bold transition-colors">Let&#39;s Move</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 