import React, { useState } from 'react';
import { NFTInterface } from './Card';
import { AnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { programs } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import { useRpcStore } from './store';

interface unstakeLadInterface {
    nft: NFTInterface;
    wallet: AnchorWallet | undefined;
    setOverallStates: (walletPubKey: PublicKey) => Promise<void>;
    stakeApi: any;
}

const UnstakeNFT = ({ nft, wallet, setOverallStates, stakeApi }: unstakeLadInterface) => {
    const { sendTransaction } = useWallet();
    const { mintPubKey, staked } = nft;
    const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
    const [wsSubscriptionId, setWsSubscribtionId] = useState<number>();

    const removeListener = async () => {
        if (wsSubscriptionId) await useRpcStore.getState().rpcConnection.removeAccountChangeListener(wsSubscriptionId);
    };
    const onClickStake = async () => {
        if (wallet && mintPubKey) {
            setIsTxLoading(true);
            try {
                const tokenmetaPubkey = await programs.metadata.Metadata.getPDA(mintPubKey);
                const stakeEntry = await stakeApi.stakeEntryAddress({
                    user: wallet.publicKey,
                    nft: {
                        mintAddress: mintPubKey,
                        metadataAddress: tokenmetaPubkey,
                    },
                });

                const tx = staked
                    ? await stakeApi.unstake({
                          user: wallet.publicKey,
                          nft: {
                              mintAddress: mintPubKey,
                              metadataAddress: tokenmetaPubkey,
                          },
                      })
                    : await stakeApi.stake({
                          user: wallet.publicKey,
                          nft: {
                              mintAddress: mintPubKey,
                              metadataAddress: tokenmetaPubkey,
                          },
                      });

                const txSig = await sendTransaction(tx, useRpcStore.getState().rpcConnection);

                console.log('Submitted tx:', txSig);

                const wsSubscriptionId = useRpcStore.getState().rpcConnection.onAccountChange(
                    stakeEntry,
                    async () => {
                        await removeListener();
                        await setOverallStates(wallet.publicKey);
                        setIsTxLoading(false);
                    },
                    'finalized'
                );
                setWsSubscribtionId(wsSubscriptionId);
            } catch (err) {
                setIsTxLoading(false);
                console.log(err);
            }
        }
    };

    return (
        <div className="w-max flex flex-row mt-2 space-x-1.5 justify-between">
            <button
                onClick={onClickStake}
                className={
                    nft.staked
                        ? `w-full inline-block flex justify-center items-center rounded bg-red-500 py-1.5 px-2 text-sm font-semibold text-slate-900 hover:bg-red-400 active:bg-red-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/50`
                        : `w-full inline-block flex justify-center items-center rounded bg-green-500 py-1.5 px-2 text-sm font-semibold text-slate-900 hover:bg-green-400 active:bg-green-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500/50`
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
                ) : nft.staked ? (
                    'Unstake'
                ) : (
                    'Stake'
                )}
            </button>
        </div>
    );
};

export default UnstakeNFT;
