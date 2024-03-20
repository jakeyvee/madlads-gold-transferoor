import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import UnstakeNFT from './UnstakeNFT';
import MovePoints from './MovePoints';
import * as anchor from '@coral-xyz/anchor';
import { useRpcStore } from './store';
import { createStakeApi } from './stakeApi';

export interface NFTInterface {
    mintPubKey: PublicKey;
    tokenPubKey: PublicKey;
    imageUrl: string;
    name: string;
    staked: boolean;
    goldAmount: number;
}

interface cardNFTInterface {
    nft: NFTInterface;
    wallet: AnchorWallet | undefined;
    pointsFromLadMint: PublicKey | undefined;
    setPointsFromLadMint: React.Dispatch<React.SetStateAction<PublicKey | undefined>>;
    setOverallStates: (walletPubKey: PublicKey) => Promise<void>;
}

const Card = ({
    nft,
    wallet,
    setOverallStates,
    pointsFromLadMint,
    setPointsFromLadMint,
}: cardNFTInterface) => {
    const { imageUrl, name, staked, goldAmount } = nft;
    const [imgLoading, setImgLoading] = useState<boolean>(true);

    const provider = new anchor.AnchorProvider(useRpcStore.getState().rpcConnection, wallet as any, {
        commitment: 'confirmed',
    });

    const stakeApi = createStakeApi(provider);

    return (
        <div className="shadow-xl bg-slate-800 rounded-lg col-span-12 lg:col-span-3 flex flex-col">
            {imageUrl === 'loading' && (
                <div className="w-full bg-slate-600 animate-pulse rounded-t-lg">
                    <div style={{ marginTop: '100%' }}></div>
                </div>
            )}
            {imageUrl !== 'loading' && (
                <div
                    className="flex flex-col relative justify-center h-0"
                    style={{ paddingBottom: '50%', paddingTop: '50%' }}
                >
                    <img
                        className={`rounded-t-lg absolute inset-0 h-full w-full ${imgLoading ? 'hidden' : ''}`}
                        alt="example"
                        src={
                            imageUrl === ''
                                ? 'https://user-images.githubusercontent.com/47315479/81145216-7fbd8700-8f7e-11ea-9d49-bd5fb4a888f1.png'
                                : imageUrl
                        }
                        onLoad={() => setImgLoading(false)}
                    />
                    <div className={`w-full bg-slate-600 animate-pulse rounded-t-lg ${imgLoading ? '' : 'hidden'}`}>
                        <div style={{ marginTop: '100%' }}></div>
                    </div>
                </div>
            )}
            <div className="px-3 py-5 text-gray-200 flex flex-col gap-y-1">
                {name === 'loading' || name === '' ? (
                    <div className="w-1/2 py-3 bg-slate-600 rounded animate-pulse"></div>
                ) : (
                    <div>{name}</div>
                )}
                {name === 'loading' ? (
                    <div className="w-1/2 py-3 bg-slate-600 rounded animate-pulse"></div>
                ) : (
                    <div>{goldAmount} Points</div>
                )}
                {name === 'loading' && <div className="w-full py-4 bg-slate-600 rounded animate-pulse"></div>}
                {name != 'loading' && (
                    <div className="flex w-full gap-x-2">
                        <UnstakeNFT nft={nft} wallet={wallet} setOverallStates={setOverallStates} stakeApi={stakeApi} />
                        <MovePoints
                            nft={nft}
                            wallet={wallet}
                            setOverallStates={setOverallStates}
                            stakeApi={stakeApi}
                            pointsFromLadMint={pointsFromLadMint}
                            setPointsFromLadMint={setPointsFromLadMint}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
