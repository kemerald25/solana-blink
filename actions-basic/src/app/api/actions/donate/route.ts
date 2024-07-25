import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionError, ActionGetRequest, ActionPostRequest, createPostResponse, ActionPostResponse } from "@solana/actions";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { url } from "inspector";

export const GET = async (req: Request) => {

    const payload: ActionGetResponse = {
        icon: new URL("/dev-banner.jpeg", new URL(req.url).origin).toString(),
        label: "Buy me a coffee",
        description: "Buyb me a coffeee with SOL using this super sweet blink of mine :)",
        title: "Dev Royale - Buy Me a Coffee",
        links: {
            actions: [
                {
                    href: "/api/actions/donate?amount=0.1",
                    label: "0.1 SOL ",
                },
                {
                    href: "/api/actions/donate?amount=0.5",
                    label: "0.5 SOL",
                },
                {
                    href: "/api/actions/donate?amount=1.0",
                    label: "1.0 SOL",
                },
                {
                    href: "/api/actions/donate?amount={amount}",
                    label: "Send SOL",
                    parameters: [
                        {
                            name: "amount",
                            label: "Enter a SOL amount"
                        }
                    ]
                }
            ]
        }
    }

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS
    });
}


export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {

        const url = new URL(req.url);

        const body: ActionPostRequest = await req.json();

        let account: PublicKey;
        try {
            account = new PublicKey(body.account)

        } catch (err) {
            throw "Invalid 'account' provided. Its not a realy PubKey "
        }

        let amount: number = 0.1;

        if (url.searchParams.has("amount")) {

            try {
                amount = parseFloat(url.searchParams.get("amount") || "0.1");
           } catch (err) {
                throw "Invalid 'amount' input";
            }
        }

        const connection = new Connection(clusterApiUrl("devnet"));

        const TO_PUBKEY = new PublicKey("2UryUoykQuFjXSq22yEPCQAUPHoDZCtkBSA6LxjFmZmK")
        const transaction = new Transaction(

        ).add(
            SystemProgram.transfer({
                fromPubkey: account,
                lamports: amount * LAMPORTS_PER_SOL,
                toPubkey: TO_PUBKEY,
            })
        );
        transaction.feePayer = account;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;


        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: "Thanks for the Coffee fren :)"
            }
        })
        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS
        });

    } catch (err) {
        let message = "An unkown error occurred";
        if (typeof err == "string") message = err

        return Response.json(
            {
                message
            },
            {
                headers: ACTIONS_CORS_HEADERS
            },
        );
    }
}