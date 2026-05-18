import { CheckCircle, Clock3, Search } from "lucide-react";
import { useState } from "react";

const transactions = [
  {
    hash: "0x81a7f3db91ab7281fcab98172aa91f7e3c0d8b2f",
    from: "0x91ab...72fa",
    to:   "0x71ca...91bc",
    gas:  "0.002 ETH",
    block: "#20495",
    status: "Confirmed",
    time: "2 mins ago",
  },
  {
    hash: "0x72ca91ab83fa7281fca98172bb11a23e4d9c1a7f",
    from: "0x18fa...99bc",
    to:   "0x72ab...11aa",
    gas:  "0.001 ETH",
    block: "#20491",
    status: "Pending",
    time: "5 mins ago",
  },
  {
    hash: "0x99bc72ab81ff7281fca98172bbcc2219f3d0e8c1",
    from: "0x88aa...18bc",
    to:   "0x71ca...11ab",
    gas:  "0.003 ETH",
    block: "#20480",
    status: "Confirmed",
    time: "15 mins ago",
  },
];

export default function BlockchainExplorer() {
  const [query, setQuery] = useState("");

  const filtered = transactions.filter((tx) =>
    tx.hash.includes(query) || tx.block.includes(query) || tx.from.includes(query)
  );

  return (
    <div>
      <h1 className="text-2xl font-medium mb-1">Blockchain Explorer</h1>
      <p className="text-[#555] text-sm mb-6">Track identity transactions on-chain</p>

      {/* SEARCH */}
      <div className="card flex items-center gap-3 px-4 py-3 mb-6">
        <Search size={16} className="text-[#444] shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by tx hash, block, or address..."
          className="bg-transparent outline-none text-sm flex-1 placeholder-[#444] text-[#e8e0cc]"
        />
      </div>

      {/* TX LIST */}
      <div className="space-y-3">
        {filtered.map((tx, i) => (
          <div key={i} className="card p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              {/* LEFT */}
              <div className="space-y-2 min-w-0">
                <p className="section-label">Transaction Hash</p>
                <p className="mono text-xs break-all">{tx.hash}</p>

                <div className="flex gap-6 flex-wrap mt-2">
                  <div>
                    <p className="section-label">From</p>
                    <p className="text-sm text-[#aaa] mt-0.5">{tx.from}</p>
                  </div>
                  <div>
                    <p className="section-label">To</p>
                    <p className="text-sm text-[#aaa] mt-0.5">{tx.to}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex lg:flex-col items-start lg:items-end gap-3 shrink-0">
                <span className={tx.status === "Confirmed" ? "badge-verified" : "badge-pending"}>
                  {tx.status === "Confirmed"
                    ? <><CheckCircle size={11} className="inline mr-1" />Confirmed</>
                    : <><Clock3 size={11} className="inline mr-1" />Pending</>
                  }
                </span>
                <div className="text-right">
                  <p className="section-label">Block</p>
                  <p className="text-sm text-[#e8e0cc] mt-0.5">{tx.block}</p>
                </div>
                <div className="text-right">
                  <p className="section-label">Gas</p>
                  <p className="text-sm text-[#e8e0cc] mt-0.5">{tx.gas}</p>
                </div>
                <div className="text-right">
                  <p className="section-label">Time</p>
                  <p className="text-sm text-[#555] mt-0.5">{tx.time}</p>
                </div>
              </div>

            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-10 text-center text-[#444]">No results found.</div>
        )}
      </div>
    </div>
  );
}