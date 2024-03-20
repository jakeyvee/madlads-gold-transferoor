import { AccountInfo, Connection, ParsedAccountData, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { programs } from '@metaplex/js';

export const conn: Connection = new Connection(
    process.env.REACT_APP_RPC_URL ? process.env.REACT_APP_RPC_URL : clusterApiUrl('mainnet-beta')
);

interface MetadataInterface {
    imageUrl: string;
    name: string;
    staked: boolean;
    goldAmount: number;
}

export async function filterAvailAccount(
    accountInfoList: {
        account: AccountInfo<ParsedAccountData>;
        pubkey: PublicKey;
    }[]
) {
    const responses = await Promise.all(
        accountInfoList.map((row) => conn.getTokenAccountBalance(row.pubkey, 'confirmed'))
    );
    return accountInfoList.filter((_, i) => responses[i].value.uiAmount === 1 && responses[i].value.decimals === 0);
}

async function getMetadataImgUrl(url: string): Promise<string> {
    return fetch(url)
        .then(
            (response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json() as Promise<{ image: string }>;
            },
            () => {
                return { image: '' };
            }
        )
        .then((data) => {
            return data.image;
        });
}

async function getMintMetadata(mintPubkey: PublicKey, owner: PublicKey, stakeApi: any) {
    try {
        const tokenmetaPubkey = await programs.metadata.Metadata.getPDA(mintPubkey);
        const tokenmeta = await programs.metadata.Metadata.load(conn, tokenmetaPubkey);
        const resp: string = await getMetadataImgUrl(tokenmeta.data.data.uri);
        const isStaked = await stakeApi.isStaked({
            user: owner,
            nft: { mintAddress: mintPubkey, metadataAddress: tokenmetaPubkey },
        });

        const goldAmount = await stakeApi.readGoldPoints({
            user: owner,
            nft: { mintAddress: mintPubkey, metadataAddress: tokenmetaPubkey },
        });
        return { imageUrl: resp, name: tokenmeta.data.data.name, staked: isStaked, goldAmount: goldAmount };
    } catch (error) {
        console.log(error);
        return { imageUrl: '', name: '', staked: false, goldAmount: 0 };
    }
}

export async function getMintsMetadata(mintsList: PublicKey[], owner: PublicKey, stakeApi: any) {
    const metadataList: MetadataInterface[] = await Promise.all(
        mintsList.map((mintPubKey) => getMintMetadata(mintPubKey, owner, stakeApi))
    );

    return metadataList;
}

const url = `https://mainnet.helius-rpc.com/?api-key=${
    process.env.REACT_APP_HELIUS_API_KEY ? process.env.REACT_APP_HELIUS_API_KEY : ''
}`;

export const searchLads = async (ownerAddress) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'searchAssets',
            params: {
                ownerAddress,
                grouping: ['collection', 'J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w'],
            },
        }),
    });
    const { result } = await response.json();
    return result;
};

export const getLadStakedInfo = async (owner, ladList, stakeApi: any) => {
    const stakedLadsList = await Promise.all(
        ladList.items.map(async (item, index) => {
            const mintPubKey = item.id;
            const tokenPubKey = item.token_info.associated_token_address;
            const tokenmetaPubkey = await programs.metadata.Metadata.getPDA(mintPubKey);
            const isStaked = await stakeApi.isStaked({
                user: new PublicKey(owner),
                nft: { mintAddress: new PublicKey(mintPubKey), metadataAddress: tokenmetaPubkey },
            });

            const goldAmount = await stakeApi.readGoldPoints({
                user: new PublicKey(owner),
                nft: { mintAddress: new PublicKey(mintPubKey), metadataAddress: tokenmetaPubkey },
            });
            return {
                mintPubKey,
                tokenPubKey,
                imageUrl: item.content.links.image,
                name: item.content.metadata.name,
                staked: isStaked,
                goldAmount: goldAmount,
            };
        })
    );
    return stakedLadsList;
};
