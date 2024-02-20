import React, { useState } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { NFTInterface } from './Card';
import { AnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { conn } from './utils';
import { programs } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';

interface unstakeLadInterface {
    nft: NFTInterface;
    wallet: AnchorWallet | undefined;
    pointsFromLadMint: PublicKey | undefined;
    setPointsFromLadMint: React.Dispatch<React.SetStateAction<PublicKey | undefined>>;
    setOverallStates: (walletPubKey: PublicKey) => Promise<void>;
    stakeApi: any;
}

const MovePoints = ({
    nft,
    wallet,
    setOverallStates,
    stakeApi,
    pointsFromLadMint,
    setPointsFromLadMint,
}: unstakeLadInterface) => {
    const { sendTransaction } = useWallet();
    const { mintPubKey, staked } = nft;
    const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
    const [wsSubscriptionId, setWsSubscribtionId] = useState<number>();

    const removeListener = async () => {
        if (wsSubscriptionId) await conn.removeAccountChangeListener(wsSubscriptionId);
    };
    const onClickMove = async () => {
        if (wallet && mintPubKey) {
            if (pointsFromLadMint && pointsFromLadMint != mintPubKey) {
                setIsTxLoading(true);
                try {
                    const fromNftMint = pointsFromLadMint;
                    const toNftMint = mintPubKey;
                    const fromNftMeta = await programs.metadata.Metadata.getPDA(fromNftMint);
                    const toNftMeta = await programs.metadata.Metadata.getPDA(toNftMint);
                    const goldPointsAddress = await stakeApi.goldPointsAddress({
                        user: wallet.publicKey,
                        nft: {
                            mintAddress: fromNftMint,
                            metadataAddress: fromNftMeta,
                        },
                    });

                    const tx = await stakeApi.transferRewards({
                        fromUser: wallet.publicKey,
                        fromNft: {
                            mintAddress: fromNftMint,
                            metadataAddress: fromNftMeta,
                        },
                        toNft: {
                            mintAddress: toNftMint,
                            metadataAddress: toNftMeta,
                        },
                    });

                    const txSig = await sendTransaction(tx, conn);

                    console.log('Submitted tx:', txSig);

                    const wsSubscriptionId = conn.onAccountChange(
                        goldPointsAddress,
                        async () => {
                            await removeListener();
                            await setOverallStates(wallet.publicKey);
                            setPointsFromLadMint(undefined);
                            setIsTxLoading(false);
                        },
                        'finalized'
                    );
                    setWsSubscribtionId(wsSubscriptionId);
                } catch (err) {
                    setIsTxLoading(false);
                    console.log(err);
                }
            } else if (pointsFromLadMint && pointsFromLadMint == mintPubKey) {
                setPointsFromLadMint(undefined);
            } else {
                setPointsFromLadMint(nft.mintPubKey);
            }
        }
    };

    return (
        <div className="w-full flex flex-row mt-2 space-x-1.5 justify-between">
            <button
                onClick={onClickMove}
                className={
                    !pointsFromLadMint
                        ? `w-full inline-block flex justify-center items-center rounded bg-cyan-500 py-1.5 px-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400 active:bg-cyan-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500/50`
                        : pointsFromLadMint == nft.mintPubKey
                        ? `w-full inline-block flex justify-center items-center rounded bg-orange-500 py-1.5 px-2 text-sm font-semibold text-slate-900 hover:bg-orange-400 active:bg-orange-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/50`
                        : `w-full inline-block flex justify-center items-center rounded bg-violet-500 py-1.5 px-2 text-sm font-semibold text-slate-900 hover:bg-violet-400 active:bg-violet-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500/50`
                }
            >
                {isTxLoading ? (
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                ) : pointsFromLadMint ? (
                    pointsFromLadMint == nft.mintPubKey ? (
                        'Cancel Transfer From'
                    ) : (
                        'Transfer Points To'
                    )
                ) : (
                    'Transfer Points From'
                )}
            </button>
        </div>
    );
};

export default MovePoints;
