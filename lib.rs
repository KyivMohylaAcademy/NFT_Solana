use anchor_lang::prelude::*;

declare_id!("G3piUu1C8rYH6EZQd3Sw7AesW3xB8mLNDc4tdPzQ3Cp2");

#[program]
pub mod nft_sydorov {
    use super::*;
    pub fn create_nft(ctx: Context<CreateNft>, title: String, image_url: String) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        nft.title = title;
        nft.image_url = image_url;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateNft<'info> {
    #[account(init, payer = user, space = 8 + 256)]
    pub nft: Account<'info, Nft>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Nft {
    pub title: String,
    pub image_url: String,
}
