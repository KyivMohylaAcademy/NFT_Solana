// Client

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  
  //const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const mintKeypair: anchor.web3.PublicKey = new anchor.web3.PublicKey(
    "6C4Xu2bjCEsWD6Zw9midT5vEuPxUYnudR3TAtCWa5bsA"
  );
  const tokenAddress = await anchor.utils.token.associatedAddress({
    mint: mintKeypair,
    owner: pg.wallet.publicKey,
  });
  console.log(`New token: ${mintKeypair}`);
  
  // Derive the metadata and master edition addresses
  
  const metadataAddress = (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
  console.log("Metadata initialized");
  const masterEditionAddress = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
  console.log("Master edition metadata initialized");
  
  try {
    await pg.program.methods
      .createSingleNft(
        new BN(0),
        "Smetaniuk_KMA",
        "SKMA",
        "https://run.mocky.io/v3/078eb6bd-7406-4906-9844-096bb059d194",
        0.01,
        new BN(1)
      )
      .accounts({
        tokenAccount: tokenAddress,
        mint: new anchor.web3.PublicKey(
          "6C4Xu2bjCEsWD6Zw9midT5vEuPxUYnudR3TAtCWa5bsA"
        ),
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
  