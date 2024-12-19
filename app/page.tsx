"use client"


import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Link, Sparkles } from 'lucide-react'
// import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BackgroundVideo } from '@/components/BackgroundVideo'

import Image from 'next/image'
import { Wallet, Cat } from 'lucide-react'

// import { ConnectButton } from '@mysten/dapp-kit'
// import { getUserProfile } from '@/contracts/query'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
// import { CategorizedObjects, calculateTotalBalance, formatBalance } from '@/utils/assetsHelpers'

import CustomConnectWallet from "@/components/CustomConnectWallet"

import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/config/networkConfig";
// import { TESTNET_GAS_AMOUNTS } from "@/config/constants";

import Gallery from "@/components/Gallery"

import { useUploadBlob } from "@/hooks/useUploadBlob";


// 模拟上传到Walrus存储的函数


export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const account = useCurrentAccount();
  // const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);

  const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
 
  const myPackageId = useNetworkVariable("myPackageId"); // 获取包ID
  // console.log("myPackageId", myPackageId);


  const [, setLoading] = useState(false);

  const [mintTrigger, setMintTrigger] = useState(0);

  const [petName, setPetName] = useState('');

  const { storeBlob, uploadedBlobs } = useUploadBlob();


  const currentAccount = useCurrentAccount();

  const uploadToWalrus = async (file: File): Promise<string | null> => {
    
    try {
      // const formData = new FormData(e.currentTarget)
      // const file = formData.get('image') as File

      // 1. 上传到 Walrus
      const blobInfo = await storeBlob(file)
      
      console.log(blobInfo)

      // 2. 调用合约添加 blob
      // const tx = await addBlob(
      //     networkVariables,
      //     libraryId,
      //     blobInfo.blobId
      // )
      // await signAndExecuteTransaction({ transaction: tx }, {
      //     onSuccess: () => {
      //         onSuccess?.()
      //     }
      // })

      // onOpenChange(false)

      return blobInfo.blobId

  } catch (error) {
      console.error('Upload failed:', error)
      return null
  } finally {
      // setIsUploading(false)
  }
    
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }
  


  const handleMint = async () => {
    if (!currentAccount?.address) {
      // console.error("No connected account found.");
      alert("Please connect your wallet");
      return;
    }

    if (!petName) {
      alert("Please enter a pet name");
      return;
    }

    if (!file) {
      alert("请选择一个文件");
      return;
    }


    try {
      setUploading(true)
        // setLoading(true); // 设置加载状态

      const blobid = await uploadToWalrus(file)
      if (!blobid) {
        alert("Upload failed");
        return;
      }

      const tx = new Transaction();
      tx.setGasBudget(10000000);
      // const newCoin = await handleSplitGas(tx, currentAccount.address, TESTNET_GAS_AMOUNTS);

      tx.moveCall({
        arguments: [
          tx.pure.string(petName), //name  
          tx.pure.string(petName), //description
          tx.pure.string("https://aggregator.walrus-testnet.walrus.space/v1/"+blobid), //image_url
          tx.pure.address(currentAccount.address),
        ],
        target: `${myPackageId}::cyberpet::mint`,
      });
      
      // 执行交易并等待结果
      const result = await signAndExecute({ transaction: tx });

      // 如果交易成功，调用回调函数
      if (result && !isError) {
        // onSuccess(); // 调用成功的回调函数
        setMintTrigger(prev => prev + 1);
        alert("Pet NFT Mint Success");
        setPetName('');
        setFile(null);
        setUploadedUrl(null);
      }
    } catch (error) {
      console.error(error);
    }finally{
      setUploading(false);
    }
    // if (!file) return

    // setUploading(true)
    // try {
    //   const url = await uploadToWalrus(file)
    //   setUploadedUrl(url)
    // } catch (error) {
    //   console.error('Upload failed:', error)
    // } finally {
    //   setUploading(false)
    // }
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 opacity-95">
        <nav className="bg-orange-500/70 backdrop-blur-lg border-b border-orange-600/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src="/img/lg64.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto rounded-sm"
                />
                <span className="ml-2 text-base font-['Press_Start_2P'] tracking-wider text-white text-purple-200">CYBERPET</span>
              </div>
              <div className="flex items-center space-x-6">
                <Gallery mintTrigger={mintTrigger} /> 
                {/* <ConnectButton /> */}
                <CustomConnectWallet />
              </div>
            </div>
          </div>
        </nav>
      </div>



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
              <CardDescription className="text-purple-200 text-center">Enter Pet Name And Choose Pet Picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="petName"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    type="text" 
                    placeholder="Enter your pet's name"
                    className="bg-orange-900/70 border border-white/50 text-white placeholder:text-white/50"
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file" className={`relative inline-flex items-center justify-center w-full ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className={`w-full py-2 px-4 bg-orange-900/70 border border-white/50 text-white rounded-md ${!uploading && 'hover:bg-orange-800/70'} transition-colors flex items-center justify-center space-x-2 ${uploading ? 'opacity-50' : ''}`}>
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
                onClick={handleMint}
                disabled={!petName || !file || uploading}
                className="w-full bg-orange-500/80 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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

