"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import brownieBunny from "@/../public/assets/brownie-cup-bunny.png";
import dollarBunny from "@/../public/assets/dollar-bunny.jpg";

export default function Loyalty() {
  const router = useRouter();
  return (
    <div className="bg-rose-50 rounded-2xl shadow-sm border border-pink-100 p-8 text-center">
      <h2 className="text-2xl font-bold mb-2 text-rose-700">
        Our Rewards Program
      </h2>
      <p className="mb-6 text-rose-600">Earn BrowniePoints, Get Brownies!</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100 flex flex-col items-center text-center">
          <h3 className="text-xl font-semibold text-rose-700 mb-2">Join</h3>
          <p className="text-rose-600 mb-10">
            Sign up for free and start collecting BrowniePoints today!
          </p>
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
            onClick={() => router.push("/auth")}
          >
            Sign Up
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100 flex flex-col items-center text-center">
          <h3 className="text-xl font-semibold text-rose-700 mb-2">Earn</h3>
          <p className="text-rose-600 mb-5">
            1 BrowniePoint for every Rp10,000 you spend
          </p>
            <Image
            src={dollarBunny}
            alt="Dollar Bunny"
            width={80}
            height={80}
            className="mx-auto"
            priority
          />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100 flex flex-col items-center text-center">
          <h3 className="text-xl font-semibold text-rose-700 mb-2">Redeem</h3>
          <p className="text-rose-600 mb-5">
            Trade 100 BrowniePoints for a FREE Brownie Cup
          </p>
          <Image
            src={brownieBunny}
            alt="Brownie Bunny"
            width={70}
            height={70}
            className="mx-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
