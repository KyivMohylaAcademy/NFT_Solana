// Client
console.log("Wallet Address:", pg.wallet.publicKey.toString());
const accountBalance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`Account Balance: ${accountBalance / web3.LAMPORTS_PER_SOL} SOL`);

const METADATA_PROGRAM_KEY = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const assetMintKeypair: anchor.web3.PublicKey = new anchor.web3.PublicKey(
    "3Qpsf2HpSrG2wKaRJUkj3wvih4hnxiQEk16uBC9xoVJV"
);
const assetTokenAddress = await anchor.utils.token.associatedAddress({
    mint: assetMintKeypair,
    owner: pg.wallet.publicKey,
});
console.log(`Asset Token: ${assetMintKeypair}`);

const assetMetadataAddr = (
    await anchor.web3.PublicKey.findProgramAddress(
        [
            Buffer.from("metadata"),
            METADATA_PROGRAM_KEY.toBuffer(),
            assetMintKeypair.toBuffer(),
        ],
        METADATA_PROGRAM_KEY
    )
)[0];
console.log("Asset Metadata Configured");

const editionMetadataAddr = anchor.web3.PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        METADATA_PROGRAM_KEY.toBuffer(),
        assetMintKeypair.toBuffer(),
        Buffer.from("edition"),
    ],
    METADATA_PROGRAM_KEY
)[0];
console.log("Edition Metadata Configured");

try {
    await pg.program.methods
        .mintNFT(
            new BN(0),
            "DMYTRO PARNAK",
            "KMA-TOKEN",
            "https://amaranth-defiant-damselfly-735.mypinata.cloud/ipfs/QmbnnSkJZmvDR91vme6co3twQtZsNRcJLX3aQS1mYGQ74f",
            0.01,
            new BN(1)
        )
        .accounts({
            assetAccount: assetTokenAddress,
            mintAuthority: new anchor.web3.PublicKey(
                "3Qpsf2HpSrG2wKaRJUkj3wvih4hnxiQEk16uBC9xoVJV"
            ),
            systemProgram: pg.wallet.keypair,
            tokenHandlingProgram: new anchor.web3.PublicKey(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
            tokenAccountsProgram: new anchor.web3.PublicKey(
                "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            ),
            metadataProgram: METADATA_PROGRAM_KEY,
            masterEdition: editionMetadataAddr,
            nftData: assetMetadataAddr,
        })
        .signers([pg.wallet.keypair])
        .rpc();
} catch (error) {
    console.log(error);
}
