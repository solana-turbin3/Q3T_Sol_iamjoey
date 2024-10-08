import {
  ActionError,
  ACTIONS_CORS_HEADERS,
  NextActionPostRequest,
  CompletedAction,
  ActionPostResponse,
  ActionGetResponse,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const GET = () => {
  return Response.json({ message: "Actio not supported" } as ActionError, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = () => {
  return Response.json(null, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const POST = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const body: NextActionPostRequest = await req.json();

    console.log(body);

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }

    let signature: string;
    try {
      signature = body.signature;
      if (!signature) throw "Invalid signature";
    } catch (err) {
      throw 'Invalid "signature" provided';
    }

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    try {
      let status = await connection.getSignatureStatus(signature);
      console.log("Signature status", status);
    } catch (error) {}

    const transaction = await connection.getParsedTransaction(
      signature,
      "confirmed"
    );

    console.log("transaction: ", transaction);

    const payload: CompletedAction = {
      type: "completed",
      title: "Chaining was successful!",
      icon: "https://solana-actions.vercel.app/solana_devs.jpg",
      label: "Complete!",
      description:
        `You have now completed an action chain! ` +
        `Here was the signature from the last action's transaction: ${signature} `,
    };

    // const payload: ActionGetResponse = {
    //   icon: "https://solana-actions.vercel.app/solana_devs.jpg",
    //   title: "Transfer SOL",
    //   label: "Send me something",
    //   description: "Just send me some SOL for living",
    //   links: {
    //     actions: [
    //       {
    //         href: "/api/actions/donate?amount=0.1",
    //         label: "0.2 SOL",
    //       },
    //       {
    //         href: "/api/actions/donate?amount=0.5",
    //         label: "0.2 SOL",
    //       },
    //       {
    //         href: "/api/actions/donate?amount={amount}",
    //         label: "SEND SOL",
    //         parameters: [
    //           {
    //             name: "amount",
    //             label: "Enter the SOl amount",
    //             required: true,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {}
};
