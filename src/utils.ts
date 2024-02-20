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
