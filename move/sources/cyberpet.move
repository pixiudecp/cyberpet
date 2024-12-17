module cyberpet::cyberpet {

    use std::string::{String, utf8};
    use sui::package::{Self, Publisher};
    use sui::display::{Self, Display};
    use sui::table::{Self, Table};
    use sui::url::{Self, Url};
    use sui::vec_map::{Self, VecMap};
    use sui::transfer_policy::{ Self };
    use sui::event;


    public struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url:Url,
        url: Url, 
        // attributes: VecMap<String, String>, //attributes of this nft
        creator: address,

    }



    public struct NFTMinted has copy, drop {
        nft_id: ID,
        name: String,
        creator: address,
    }


    public struct NFTBurned has copy, drop {
        nft_id: ID,
        name: String,
        destroyer: address,
    }

    public struct CYBERPET has drop {}

    fun init(otw: CYBERPET, ctx: &mut TxContext) {


        let publisher = package::claim(otw, ctx);
 

        let nft_display = create_display(&publisher, ctx);


        new_transfer_policy(&publisher, ctx);

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(nft_display, ctx.sender());

    }

    #[allow(lint(share_owned, self_transfer))]
    fun new_transfer_policy(
        publisher: &Publisher,
        ctx: &mut TxContext
    ) {
        let (
            transfer_policy,
            transfer_policy_cap
        ) = transfer_policy::new<NFT>(publisher, ctx);

        transfer::public_share_object(transfer_policy);
        transfer::public_transfer(transfer_policy_cap, ctx.sender());
    }


    public entry fun mint(
        name: String,
        description: String,
        image_url: Url,
        recipient: address,
        ctx: &mut TxContext
    ) {

             let mut nft = NFT {
                id: object::new(ctx),
                name,
                description,
                image_url,
                creator: ctx.sender(),
            };

            event::emit(
                NFTMinted {
                    nft_id: object::id(&nft),
                    // collection: nft.collection,
                    name: nft.name,
                    index: nft.index,
                    creator: ctx.sender(),
                }
            );

            transfer::public_transfer(nft, recipient);



    }

    public entry fun burn(
        nft: NFT,
        ctx: &mut TxContext
    ) {
        let NFT {
            id,      
            name: _,
            description: _,
            image_url: _,
            url: _,
            creator: _,
        } = nft;
         object::delete(id);
        event::emit(
            NFTBurned {
                nft_id,
                destroyer: ctx.sender(),
            }
        );
    }

    fun create_display(
        publisher: &Publisher,
        ctx: &mut TxContext
    ): (Display<NFT>) {
        let nft_keys = vector[

            utf8(b"name"),
            utf8(b"description"),
            utf8(b"image_url"),
            utf8(b"animation_url"),
            utf8(b"attributes"),

        ];
        let nft_values = vector[

            utf8(b"{name}"),
            utf8(b"{description}"),
            utf8(b"{image_url}"),
            utf8(b"{animation_url}"),
            utf8(b"{attributes}"),

        ];


        let mut nft_display = display::new_with_fields<NFT>(
            publisher, nft_keys, nft_values, ctx
        );
        display::update_version(&mut nft_display);


        nft_display
    }

}
