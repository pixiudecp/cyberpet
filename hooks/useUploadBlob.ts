import { useState } from 'react';

// 定义上传后的 Blob 信息接口
export interface UploadedBlobInfo {
    blobId: string;      // Blob 的唯一标识符
    endEpoch: number;    // Blob 的结束周期
    suiRef: string;      // Sui 区块链上的引用
    status: string;      // Blob 的状态（'Already certified' 或 'Newly created'）
}

// 定义上传 Blob 的配置接口
export interface UploadBlobConfig {
    initialEpochs?: string;         // 初始周期数
    initialPublisherUrl?: string;   // 发布者 URL
    initialAggregatorUrl?: string;  // 聚合器 URL
    proxyUrl?: string;              // 代理服务器 URL
}

// 默认配置值，使用环境变量或后备值
const DEFAULT_CONFIG: Required<UploadBlobConfig> = {
    initialEpochs: process.env.NEXT_PUBLIC_INITIAL_EPOCHS || '10',
    initialPublisherUrl: process.env.NEXT_PUBLIC_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space',
    initialAggregatorUrl: process.env.NEXT_PUBLIC_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space',
    proxyUrl: process.env.NEXT_PUBLIC_PROXY_URL || ''
};

// 自定义 Hook：用于处理 Blob 的上传功能
export function useUploadBlob(config: UploadBlobConfig = {}) {
    // 合并用户配置和默认配置
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    // 状态管理
    const [epochs, setEpochs] = useState(finalConfig.initialEpochs);           // 周期数
    const [uploading, setUploading] = useState(false);                         // 上传状态
    const [uploadedBlobs, setUploadedBlobs] = useState<UploadedBlobInfo[]>([]); // 已上传的 Blobs
    const [publisherUrl, setPublisherUrl] = useState(finalConfig.initialPublisherUrl);     // 发布者 URL
    const [aggregatorUrl, setAggregatorUrl] = useState(finalConfig.initialAggregatorUrl);  // 聚合器 URL

    // 存储 Blob 的核心函数
    const storeBlob = async (fileOrUrl: File | string) => {
        setUploading(true);
        try {
            let body: File | Blob;
            // 如果输入是 URL，通过代理服务器获取内容
            if (typeof fileOrUrl === 'string') {
                const response = await fetch(finalConfig.proxyUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: fileOrUrl }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                body = await response.blob();
            } else {
                // 如果输入是文件，直接使用
                body = fileOrUrl;
            }

            // 向发布者 API 发送存储请求
            const response = await fetch(`${publisherUrl}/v1/store?epochs=${epochs}`, {
                method: 'PUT',
                body: body,
            });

            if (!response.ok) {
                throw new Error('Something went wrong when storing the blob!');
            }

            const info = await response.json();
            
            console.log('info', info)   
            let blobInfo: UploadedBlobInfo;

            // 处理响应数据，区分已认证和新创建的情况
            if ('alreadyCertified' in info) {
                blobInfo = {
                    status: 'Already certified',
                    blobId: info.alreadyCertified.blobId,
                    endEpoch: info.alreadyCertified.endEpoch,
                    // suiRef: info.alreadyCertified.event.txDigest,
                    suiRef: '',
                };
            } else if ('newlyCreated' in info) {
                blobInfo = {
                    status: 'Newly created',
                    blobId: info.newlyCreated.blobObject.blobId,
                    endEpoch: info.newlyCreated.blobObject.storage.endEpoch,
                    suiRef: info.newlyCreated.blobObject.id,
                };
            } else {
                throw new Error('Unexpected response format');
            }

            // 更新已上传的 Blobs 列表
            setUploadedBlobs(prev => [blobInfo, ...prev]);
            return blobInfo;
        } catch (error) {
            console.error('Error in storeBlob:', error);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    // 返回 Hook 的状态和方法
    return {
        epochs,
        setEpochs,
        uploading,
        uploadedBlobs,
        publisherUrl,
        setPublisherUrl,
        aggregatorUrl,
        setAggregatorUrl,
        storeBlob
    };
} 