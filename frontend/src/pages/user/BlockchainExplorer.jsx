import {
  CheckCircle,
  Clock3,
} from "lucide-react";

const transactions = [
  {
    hash: "0x81a7f3db91ab7281fcab98172aa91f7",
    from: "0x91ab...72fa",
    to: "0x71ca...91bc",
    gas: "0.002 ETH",
    block: "#20495",
    status: "Confirmed",
    time: "2 mins ago",
  },

  {
    hash: "0x72ca91ab83fa7281fca98172bb11a2",
    from: "0x18fa...99bc",
    to: "0x72ab...11aa",
    gas: "0.001 ETH",
    block: "#20491",
    status: "Pending",
    time: "5 mins ago",
  },

  {
    hash: "0x99bc72ab81ff7281fca98172bbcc22",
    from: "0x88aa...18bc",
    to: "0x71ca...11ab",
    gas: "0.003 ETH",
    block: "#20480",
    status: "Confirmed",
    time: "15 mins ago",
  },
];

export default function BlockchainExplorer() {

  return (

    <div>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Blockchain Explorer
        </h1>

        <p className="text-gray-400 mt-2">
          Track blockchain transactions and identity records
        </p>

      </div>

      {/* SEARCH */}

      <div className="glass rounded-3xl p-6 mb-8">

        <input
          type="text"
          placeholder="Search by transaction hash, wallet address, or block..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none"
        />

      </div>

      {/* TRANSACTIONS */}

      <div className="space-y-6">

        {
          transactions.map((tx, index) => (

            <div
              key={index}
              className="glass rounded-3xl p-6"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* LEFT */}

                <div className="space-y-3">

                  <div>

                    <p className="text-gray-400 text-sm">
                      Transaction Hash
                    </p>

                    <h2 className="font-semibold break-all">
                      {tx.hash}
                    </h2>

                  </div>

                  <div className="flex gap-10 flex-wrap">

                    <div>

                      <p className="text-gray-400 text-sm">
                        From
                      </p>

                      <p>
                        {tx.from}
                      </p>

                    </div>

                    <div>

                      <p className="text-gray-400 text-sm">
                        To
                      </p>

                      <p>
                        {tx.to}
                      </p>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="flex flex-col items-start lg:items-end gap-3">

                  <div
                    className={`
                      px-4 py-2 rounded-xl text-sm flex items-center gap-2
                      ${
                        tx.status === "Confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    `}
                  >

                    {
                      tx.status === "Confirmed"
                        ? <CheckCircle size={18} />
                        : <Clock3 size={18} />
                    }

                    {tx.status}

                  </div>

                  <div className="text-right">

                    <p className="text-gray-400 text-sm">
                      Gas Fee
                    </p>

                    <p>
                      {tx.gas}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-400 text-sm">
                      Block
                    </p>

                    <p>
                      {tx.block}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-400 text-sm">
                      Time
                    </p>

                    <p>
                      {tx.time}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          ))
        }

      </div>

    </div>
  );
}