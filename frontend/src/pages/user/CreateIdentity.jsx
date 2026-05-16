import { useState } from "react";

import toast from "react-hot-toast";

import {
  Upload,
  ShieldCheck,
  User,
  Mail,
  CreditCard,
} from "lucide-react";

export default function CreateIdentity() {

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (file) {

      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setTimeout(() => {

      setLoading(false);

      toast.success(
        "Identity stored on blockchain"
      );

    }, 2000);
  };

  return (

    <div className="max-w-5xl mx-auto">

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Create Digital Identity
        </h1>

        <p className="text-gray-400 mt-3">
          Secure your identity using blockchain verification
        </p>

      </div>

      {/* MAIN CARD */}

      <div className="glass rounded-3xl p-8">

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-2 gap-10"
        >

          {/* LEFT */}

          <div>

            {/* IMAGE PREVIEW */}

            <div className="mb-8">

              <div className="w-52 h-52 rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">

                {
                  preview ? (

                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="text-center text-gray-400">

                      <Upload
                        size={40}
                        className="mx-auto mb-3"
                      />

                      Upload ID Photo

                    </div>

                  )
                }

              </div>

              <label className="mt-4 inline-block bg-secondary text-black px-6 py-3 rounded-xl cursor-pointer font-semibold">

                Upload Image

                <input
                  type="file"
                  className="hidden"
                  onChange={handleImage}
                />

              </label>

            </div>

            {/* BLOCKCHAIN STATUS */}

            <div className="glass rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-4">
                Blockchain Status
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Network
                  </span>

                  <span>
                    Ethereum
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Verification
                  </span>

                  <span className="text-green-400">
                    Secure
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Encryption
                  </span>

                  <span>
                    AES-256
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* FULL NAME */}

            <div>

              <label className="block mb-2 text-gray-400">
                Full Name
              </label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">

                <User />

                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-transparent p-4 outline-none"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="block mb-2 text-gray-400">
                Email Address
              </label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">

                <Mail />

                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-transparent p-4 outline-none"
                />

              </div>

            </div>

            {/* NATIONAL ID */}

            <div>

              <label className="block mb-2 text-gray-400">
                National ID
              </label>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4">

                <CreditCard />

                <input
                  type="text"
                  placeholder="0123456789"
                  className="w-full bg-transparent p-4 outline-none"
                />

              </div>

            </div>

            {/* HASH */}

            <div className="glass rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-4">
                Identity Hash
              </h2>

              <p className="break-all text-gray-400">
                0x81a7f3db91ab7281fcab98172aa91f7
              </p>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-black py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3"
            >

              {
                loading ? (
                  "Storing on Blockchain..."
                ) : (
                  <>
                    <ShieldCheck />
                    Verify Identity
                  </>
                )
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}