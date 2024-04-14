const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const token_id = new BN(1);

const mintKeypair = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("mint"), token_id.toArrayLike(Buffer, "le", 8)],
  new anchor.web3.PublicKey("J5rYSjXDBV2rzvYAMWwUPAj97rx18syn8TPLbQvNdz1B")
);

const tokenAddress = await anchor.utils.token.associatedAddress({
  mint: mintKeypair[0],
  owner: pg.wallet.publicKey,
});
console.log(`New token: ${mintKeypair[0]}`);

const metadataAddress = (
  await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair[0].toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )
)[0];
console.log("Metadata initialized");
const masterEditionAddress = anchor.web3.PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mintKeypair[0].toBuffer(),
    Buffer.from("edition"),
  ],
  TOKEN_METADATA_PROGRAM_ID
)[0];
console.log("Master edition metadata initialized");

try {
  await pg.program.methods
    .createSingleNft(
      new BN(1),
      "Kriachko_KMA",
      "NAUKMA",
      "https://ipfs.io/ipfs/QmcrvzReYZAePi4WFyXe3z82aASfUA25L1j13ojBbRzoDc?filename=images.jpg"
    )
    .accounts({
      tokenAccount: tokenAddress,
      mint: mintKeypair[0],
      rent: pg.wallet.keypair,
      tokenProgram: new anchor.web3.PublicKey(
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      ),
      associatedTokenProgram: new anchor.web3.PublicKey(
        "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
      ),
      metadataProgram: TOKEN_METADATA_PROGRAM_ID,
      masterEditionAccount: masterEditionAddress,
      nftMetadata: metadataAddress,
    })
    .signers([pg.wallet.keypair])
    .rpc();
} catch (e) {
  console.log(e);
}
