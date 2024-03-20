import * as anchor from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import Card, { NFTInterface } from './Card';
import WalletOverview from './WalletOverview';

import { PublicKey } from '@solana/web3.js';
import { conn, getLadStakedInfo, searchLads } from './utils';
import { createStakeApi } from './stakeApi';

const Main = () => {
    const wallet = useAnchorWallet();
    const [ladsAmount, setLadsAmount] = useState<number>(0);
    const [stakedLadsAmount, setStakedLadsAmount] = useState<number>(0);
    const [ladsInfo, setLadsInfo] = useState<NFTInterface[]>();
    const [pointsFromLadMint, setPointsFromLadMint] = useState<PublicKey>();
    const provider = new anchor.AnchorProvider(conn, wallet as any, {
        commitment: 'confirmed',
    });

    const stakeApi = createStakeApi(provider);

    const setWalletStates = async (walletPubKey: PublicKey) => {
        const ladsList = await searchLads(walletPubKey.toBase58());
        if (ladsList) {
            setLadsAmount(ladsList.total);

            setLadsInfo(
                ladsList.items.map((item, index) => {
                    return {
                        mintPubKey: new PublicKey(item.id),
                        tokenPubKey: new PublicKey(item.token_info.associated_token_address),
                        imageUrl: item.content.links.image,
                        name: item.content.metadata.name,
                        staked: false,
                        goldAmount: 0,
                    };
                })
            );

            const stakedLadsInfo = await getLadStakedInfo(walletPubKey.toBase58(), ladsList, stakeApi);
            setStakedLadsAmount(stakedLadsInfo.filter((val) => val.staked === true).length);
            setLadsInfo(stakedLadsInfo);
        }
    };

    useEffect(() => {
        (async () => {
            if (wallet) {
                await setWalletStates(wallet.publicKey);
            }
        })();
    }, [wallet]);

    return (
        <div className="mx-auto min-h-screen max-w-screen-xl flex overflow-hidden pt-16">
            <div className="opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>
            <div id="main-content" className="w-full flex flex-col bg-slate-850 relative overflow-y-auto">
                <div className="mb-auto text-gray-200">
                    <main>
                        <div className="flex flex-col pt-6 px-6 lg:px-0">
                            <WalletOverview
                                walletPubKey={wallet?.publicKey}
                                stakedLads={stakedLadsAmount}
                                totalLads={ladsAmount}
                            />
                            <div className="grid grid-cols-12 gap-6">
                                {ladsInfo?.map((cardInfoNFT, index) => (
                                    <Card
                                        nft={cardInfoNFT}
                                        wallet={wallet}
                                        pointsFromLadMint={pointsFromLadMint}
                                        setPointsFromLadMint={setPointsFromLadMint}
                                        setOverallStates={setWalletStates}
                                        stakeApi={stakeApi}
                                        key={index}
                                    />
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
                <p className="text-center text-sm text-gray-400 my-10">
                    &copy; 2024{' '}
                    <a href="https://metacamp.so" className="hover:underline">
                        Metacamp
                    </a>
                    . No rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Main;
