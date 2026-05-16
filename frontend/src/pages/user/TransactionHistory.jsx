const transactions = [
  {
    hash: "0x81a7f3db91ab",
    status: "Success",
    block: 20491,
  },
  {
    hash: "0x72ff1ab28ac",
    status: "Pending",
    block: 20495,
  },
];

export default function TransactionHistory() {

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Blockchain Transactions
      </h1>

      <div className="space-y-4">

        {
          transactions.map((tx, index) => (

            <div
              key={index}
              className="glass rounded-2xl p-6"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-400">
                    Transaction Hash
                  </p>

                  <p className="mt-2 break-all">
                    {tx.hash}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-secondary">
                    {tx.status}
                  </p>

                  <p className="text-gray-400 mt-2">
                    Block #{tx.block}
                  </p>

                </div>

              </div>

            </div>

          ))
        }

      </div>

    </div>
  );
}