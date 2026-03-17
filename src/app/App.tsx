import { useState } from "react";

type CommodityKey = "steel" | "aluminium" | "cement" | "fertiliser";

interface CommodityData {
  label: string;
  defaultFactor: number;
  primaryFactor: number;
}

const cbamData: Record<CommodityKey, CommodityData> = {
  steel: { label: "Iron and Steel", defaultFactor: 2.5, primaryFactor: 1.8 },
  aluminium: { label: "Aluminium", defaultFactor: 9.0, primaryFactor: 6.5 },
  cement: { label: "Cement", defaultFactor: 1.1, primaryFactor: 0.8 },
  fertiliser: { label: "Fertilisers", defaultFactor: 3.5, primaryFactor: 2.2 },
};

const CARBON_PRICE = 85; // GBP per tonne (UK ETS fixed)

function formatGBP(value: number): string {
  return value.toLocaleString("en-GB");
}

export default function App() {
  const [commodity, setCommodity] = useState<CommodityKey>("steel");
  const [volume, setVolume] = useState("1000");
  const [results, setResults] = useState<{
    defaultExposure: number;
    primaryExposure: number;
    totalSavings: number;
  } | null>(null);

  const handleCalculate = () => {
    const vol = parseFloat(volume.replace(/,/g, "")) || 0;
    const factors = cbamData[commodity];
    const defaultExposure = vol * factors.defaultFactor * CARBON_PRICE;
    const primaryExposure = vol * factors.primaryFactor * CARBON_PRICE;
    const totalSavings = defaultExposure - primaryExposure;
    setResults({ defaultExposure, primaryExposure, totalSavings });
  };

  return (
    <div className="size-full flex items-center justify-center bg-[#0a1128]">
      <div className="w-full max-w-[960px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[480px]">
        {/* Left Half - Input Parameters */}
        <div className="flex-1 p-10 flex flex-col justify-center border-r border-gray-100">
          <h2 className="text-[#0a1128] tracking-tight mb-2">
            Financial Exposure Calculator
          </h2>
          <p className="text-gray-400 mb-8" style={{ fontSize: "0.8rem" }}>
            UK ETS Carbon Price: £{CARBON_PRICE}/tonne
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-[#0a1128] mb-2">
                Select Commodity
              </label>
              <select
                value={commodity}
                onChange={(e) => {
                  setCommodity(e.target.value as CommodityKey);
                  setResults(null);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-[#0a1128] focus:outline-none focus:border-[#0a1128] focus:ring-1 focus:ring-[#0a1128] transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
              >
                {(Object.keys(cbamData) as CommodityKey[]).map((key) => (
                  <option key={key} value={key}>
                    {cbamData[key].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#0a1128] mb-2">
                Import Volume{" "}
                <span className="text-gray-400">(Tonnes)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={volume}
                onChange={(e) => {
                  setVolume(e.target.value);
                  setResults(null);
                }}
                placeholder="e.g. 1000"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-[#0a1128] placeholder-gray-300 focus:outline-none focus:border-[#0a1128] focus:ring-1 focus:ring-[#0a1128] transition-colors"
              />
            </div>

            {/* Factor reference */}
            <div className="bg-gray-50 rounded-md px-4 py-3 border border-gray-100">
              <p className="text-gray-400 mb-1" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {cbamData[commodity].label} — Emission Factors (tCO₂/t)
              </p>
              <div className="flex gap-6">
                <span className="text-[#0a1128]" style={{ fontSize: "0.85rem" }}>
                  Default: <strong>{cbamData[commodity].defaultFactor}</strong>
                </span>
                <span className="text-[#0a1128]" style={{ fontSize: "0.85rem" }}>
                  Primary: <strong>{cbamData[commodity].primaryFactor}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full mt-2 px-6 py-3.5 bg-[#0a1128] text-white rounded-md hover:bg-[#162040] active:bg-[#0d1730] transition-colors cursor-pointer"
            >
              Calculate Tax Savings
            </button>
          </div>
        </div>

        {/* Right Half - Results */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h2 className="text-[#0a1128] tracking-tight mb-8">
            Financial Exposure Delta
          </h2>

          <div className="space-y-8">
            {/* Default Tax Exposure */}
            <div>
              <p className="text-gray-400 mb-1 tracking-wide" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Default Tax Exposure
              </p>
              <p
                className={`text-[#dc2626] transition-opacity duration-500 ${
                  results ? "opacity-100" : "opacity-20"
                }`}
                style={{ fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.1 }}
              >
                £{results ? formatGBP(results.defaultExposure) : "0"}
              </p>
            </div>

            {/* Primary Data Exposure */}
            <div>
              <p className="text-gray-400 mb-1 tracking-wide" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Verified Primary Data Exposure
              </p>
              <p
                className={`text-[#64748b] transition-opacity duration-500 ${
                  results ? "opacity-100" : "opacity-20"
                }`}
                style={{ fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.1 }}
              >
                £{results ? formatGBP(results.primaryExposure) : "0"}
              </p>
            </div>

            {/* Total Savings */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-400 mb-1 tracking-wide" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Potential Tax Saving
              </p>
              <p
                className={`text-[#22c55e] transition-opacity duration-500 ${
                  results ? "opacity-100" : "opacity-20"
                }`}
                style={{ fontSize: "3.25rem", fontWeight: 700, lineHeight: 1.1 }}
              >
                £{results ? formatGBP(results.totalSavings) : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}