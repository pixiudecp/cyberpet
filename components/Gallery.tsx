import React, { useState, useEffect, useRef } from "react";
import { useCurrentAccount,useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import Image from "next/image";

import { CategorizedObjects} from '@/utils/assetsHelpers'
import { getUserProfile } from '@/contracts/query'
import { useNetworkVariable } from "@/config/networkConfig";
import { Transaction } from "@mysten/sui/transactions";

interface GalleryProps {
    mintTrigger?: number;
    onDelete?: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ mintTrigger = 0 }) => {


    const [showDropdown, setShowDropdown] = useState(false); // 控制下拉框显示状态
    const dropdownRef = useRef<HTMLDivElement>(null); // 下拉框的 ref
    const buttonRef = useRef<HTMLButtonElement>(null); // 连接按钮的 ref
    const account = useCurrentAccount(); // 当前连接的账户

    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);

    const myPackageId = useNetworkVariable("myPackageId"); // 获取包ID

    const [deleteId, setDeleteId] = useState<string | null>(null); // 要删除的 NFT id
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [delTrigger, setDelTrigger] = useState(0);
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    const deleteNFT = async (nftId: string) => {
        // if (!currentAccount?.address) {
        //   alert("Please connect your wallet");
        //   return;
        // }

        try {
            //   setLoading(true);

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            tx.moveCall({
                arguments: [
                    tx.object(nftId), // NFT ID
                    // tx.pure.address(currentAccount.address),
                ],
                target: `${myPackageId}::cyberpet::burn`,
            });

            const result = await signAndExecute({ transaction: tx });

            if (result) {
                setDelTrigger(prev => prev + 1); // 触发 Gallery 重新加载
                alert("NFT Burn Success");

            }
            //   setDelTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Burn NFT Failed:", error);
            alert("Burn NFT Failed");
        } finally {
            //   setLoading(false);
        }
    };





    useEffect(() => {
        const fetchUserProfile = async () => {
            if (account?.address) {
                try {
                    const profile = await getUserProfile(account.address);
                    setUserObjects(profile);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };
        fetchUserProfile();
    }, [account, mintTrigger, delTrigger]);




    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // 判断点击是否发生在按钮或下拉框外部
            if (
                buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        // 添加事件监听
        document.addEventListener("click", handleClickOutside);

        // 清理事件监听
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // 处理删除确认
    const handleDelete = () => {
        if (deleteId) {
            deleteNFT(deleteId);
            setShowDeleteDialog(false);
            setDeleteId(null);
        }
    };

    // 打开删除确认框
    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡
        setDeleteId(id);
        setShowDeleteDialog(true);
    };

    if (account) {
        // 已连接状态
        return (
            <div className="relative">

                <button
                    ref={buttonRef}
                    className="text-white bg-orange-600/0 px-4 py-2 rounded-lg hover:font-bold transition "
                    onClick={() => setShowDropdown((prev) => !prev)} // 切换下拉框显示状态
                >
                    My Pets

                </button>


                {/* 下拉框 */}
                {showDropdown && (
                    <div ref={dropdownRef}
                        className="absolute right-0 mt-4 w-32 bg-orange-500/60 text-white rounded-lg shadow-lg z-9 p-4 max-h-[400px] overflow-y-auto 
                        scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200/20 hover:scrollbar-thumb-orange-500
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-orange-200/20
                        [&::-webkit-scrollbar-thumb]:bg-orange-400
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-track]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-orange-500">

                        {userObjects && (
                            <div className="space-y-2">
                                {Object.entries(userObjects.objects).some(([objectType, objects]) =>
                                    objectType === (myPackageId + '::cyberpet::NFT') && objects.length > 0
                                ) ? (
                                    Object.entries(userObjects.objects).map(([objectType, objects]) => (
                                        objectType === (myPackageId + '::cyberpet::NFT') &&
                                        objects.map((object, index) => (
                                            <div key={index} id={object?.data?.objectId}
                                                className="relative w-24 h-24 bg-orange-400/50 rounded hover:bg-orange-500/50 cursor-pointer overflow-hidden group">
                                                <button
                                                    onClick={(e) => handleDeleteClick(String(object?.data?.objectId), e)}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                    aria-label="Delete NFT"
                                                >
                                                    ×
                                                </button>
                                                <Image
                                                    className="w-full h-full object-cover"
                                                    src={
                                                        (object?.data?.content?.dataType === 'moveObject' &&
                                                            (object?.data?.content?.fields as { image_url?: string })?.image_url) || '/img/lg128.png'
                                                    }
                                                    alt="pet"
                                                    width={96}
                                                    height={96}

                                                />
                                            </div>
                                        ))
                                    ))
                                ) : (
                                    <div className="text-center py-2 text-white/80">
                                        EMPTY
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 添加删除确认对话框 */}
                {showDeleteDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete NFT</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this NFT?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowDeleteDialog(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 未连接状态
    // return (
    //     <button
    //         className="text-white bg-orange-600/0 px-4 py-2 rounded-lg hover:font-bold transition "
    //         onClick={handleConnectWallet}
    //     >
    //         Connect Wallet
    //     </button>
    // );
};

export default Gallery;