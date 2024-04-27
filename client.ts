import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { NftProgram } from "../target/types/nft_program";

// Configure the client to use the local cluster
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.NftProgram as anchor.Program<NftProgram>;


const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  // const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const mintKeypair: anchor.web3.PublicKey = new anchor.web3.PublicKey(
    "51kVaJaEU1qs4NwfTAH6b7GWprVCBYWtLSHNKQxY4B1"
  );
  const tokenAddress = await anchor.utils.token.associatedAddress({
    mint: mintKeypair,
    owner: program.provider.publicKey,
  });
  console.log(`New token: ${mintKeypair}`);

  // Derive the metadata and master edition addresses

  const metadataAddress = (
    anchor.web3.PublicKey.findProgramAddressSync(
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
    await program.methods
      .createSingleNft(
        new BN(1),
        "Prochna-Sofia-nft",
        "PNFT",
        "https://run.mocky.io/v3/9586fda8-b711-42a7-9dae-6b774d207bc4",
        0.01,
        new BN(1)
      )
      .accounts({
        tokenAccount: tokenAddress,
        mint: new anchor.web3.PublicKey(
          "51kVaJaEU1qs4NwfTAH6b7GWprVCBYWtLSHNKQxY4B1"
        ),
        rent: program.provider.wallet.payer,
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
      .signers([program.provider.wallet.payer])
      .rpc();
  } catch (e) {
    console.log(e);
  }