import { FormEvent } from "react";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseAbi } from "viem";

export function WriteContract() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tokenId = formData.get("tokenId") as string;
    writeContract({
      address: "0xb730B520882237168d578d97815CFc620104dAB4",
      abi: parseAbi(["function safeMint(uint256 tokenId)"]),
      functionName: "safeMint",
      args: [BigInt(tokenId)],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="container">
      <div className="stack">
        <form className="set" onSubmit={submit}>
          <input name="tokenId" placeholder="Token ID" required />
          <button disabled={isPending} type="submit">
            {isPending ? "Confirming..." : "Mint"}
          </button>
        </form>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    </div>
  );
}
