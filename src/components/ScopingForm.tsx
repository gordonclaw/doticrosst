import { useState } from "react";

const STEPS = ["Your Business", "Current Setup", "What You Need", "Your Details"];

export default function ScopingForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    // Step 1: Business
    business_type: "",
    business_name: "",
    industry: "",
    locations: "1",
    years_in_business: "",

    // Step 2: Current setup
    has_website: "",
    website_url: "",
    website_platform: "",
    has_google_business: "",
    instagram: "",
    facebook: "",
    google_maps_url: "",

    // Step 3: What you need
    project_type: "",
    pages_needed: "",
    needs_booking: "",
    needs_gallery: "",
    needs_blog: "",
    needs_seo: "",
    budget_range: "",
    timeline: "",
    anything_else: "",

    // Step 4: Contact
    name: "",
    email: "",
    phone: "",
  });

  const update = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 0) return data.business_name !== "" && data.industry !== "";
    if (step === 1) return data.has_website !== "";
    if (step === 2) return data.project_type !== "" && data.budget_range !== "";
    if (step === 3) return data.name !== "" && data.email !== "";
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: Record<string, string> = {
        "form-name": "website-scoping",
        ...data,
      };
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      });
    } catch (err) {
      console.error("Submit failed:", err);
    }
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  const optionBtn = (selected: boolean) =>
    `flex-1 min-w-0 rounded-lg border-2 px-3 py-3 text-center text-sm font-medium transition-all duration-200 cursor-pointer ${
      selected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
    }`;

  const yesNo = (field: string, value: string) => (
    <div className="flex gap-3">
      <button type="button" onClick={() => update(field, "yes")} className={optionBtn(value === "yes")}>Yes</button>
      <button type="button" onClick={() => update(field, "no")} className={optionBtn(value === "no")}>No</button>
    </div>
  );

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">Got it</h3>
        <p className="mt-2 text-sm text-gray-500">
          We'll review your answers and come back to you within one working day with a clear scope and quote. No surprises.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${i <= step ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                {i < step ? (
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                ) : i + 1}
              </div>
              <span className={`mt-2 hidden text-xs font-medium sm:block ${i <= step ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-3 h-1 rounded-full bg-gray-100">
          <div className="absolute left-0 top-0 h-1 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Step 1: Business */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Business name</label>
            <input type="text" value={data.business_name} onChange={(e) => update("business_name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-900">What industry are you in?</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["Barber", "Hairdresser", "Salon", "Trades", "Hospitality", "Other"].map((opt) => (
                <button key={opt} type="button" onClick={() => update("industry", opt.toLowerCase())} className={optionBtn(data.industry === opt.toLowerCase())}>{opt}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Locations</label>
              <input type="number" min="1" value={data.locations} onChange={(e) => update("locations", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Years trading</label>
              <div className="grid grid-cols-3 gap-2">
                {["< 1", "1-5", "5+"].map((opt) => (
                  <button key={opt} type="button" onClick={() => update("years_in_business", opt)} className={optionBtn(data.years_in_business === opt)}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Current setup */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-900">Do you have a website?</label>
            {yesNo("has_website", data.has_website)}
          </div>
          {data.has_website === "yes" && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900">Website URL</label>
                <input type="url" value={data.website_url} onChange={(e) => update("website_url", e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className="mb-3 block text-sm font-semibold text-gray-900">What's it built on?</label>
                <div className="grid grid-cols-3 gap-3">
                  {["WordPress", "Wix", "Squarespace", "Shopify", "Don't know", "Other"].map((opt) => (
                    <button key={opt} type="button" onClick={() => update("website_platform", opt.toLowerCase())} className={optionBtn(data.website_platform === opt.toLowerCase())}>{opt}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-900">Do you have a Google Business Profile?</label>
            {yesNo("has_google_business", data.has_google_business)}
          </div>
          {data.has_google_business === "yes" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Google Maps link</label>
              <input type="text" value={data.google_maps_url} onChange={(e) => update("google_maps_url", e.target.value)} placeholder="Paste your Google Maps link" className={inputClass} />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Instagram handle</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">@</span>
              <input type="text" value={data.instagram} onChange={(e) => update("instagram", e.target.value)} className={`${inputClass} pl-8`} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Facebook page</label>
            <input type="text" value={data.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="Page name or URL" className={inputClass} />
          </div>
        </div>
      )}

      {/* Step 3: What you need */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-900">What do you need?</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "new", label: "New website" },
                { value: "rebuild", label: "Rebuild existing" },
                { value: "seo-only", label: "SEO only" },
                { value: "not-sure", label: "Not sure yet" },
              ].map((opt) => (
                <button key={opt.value} type="button" onClick={() => update("project_type", opt.value)} className={optionBtn(data.project_type === opt.value)}>{opt.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-900">Roughly how many pages?</label>
            <div className="grid grid-cols-4 gap-3">
              {["1-3", "4-7", "8-12", "12+"].map((opt) => (
                <button key={opt} type="button" onClick={() => update("pages_needed", opt)} className={optionBtn(data.pages_needed === opt)}>{opt}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Need booking integration?</label>
              {yesNo("needs_booking", data.needs_booking)}
            </div>
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Need a gallery?</label>
              {yesNo("needs_gallery", data.needs_gallery)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Need a blog?</label>
              {yesNo("needs_blog", data.needs_blog)}
            </div>
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Need SEO work?</label>
              {yesNo("needs_seo", data.needs_seo)}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-900">Budget range</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["Under £500", "£500-£1k", "£1k-£2k", "£2k+"].map((opt) => (
                <button key={opt} type="button" onClick={() => update("budget_range", opt)} className={optionBtn(data.budget_range === opt)}>{opt}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-900">When do you need it?</label>
            <div className="grid grid-cols-3 gap-3">
              {["ASAP", "1-2 months", "No rush"].map((opt) => (
                <button key={opt} type="button" onClick={() => update("timeline", opt)} className={optionBtn(data.timeline === opt)}>{opt}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Anything else we should know?</label>
            <textarea value={data.anything_else} onChange={(e) => update("anything_else", e.target.value)} rows={3} placeholder="Specific features, design preferences, examples of sites you like..." className={`${inputClass} resize-y`} />
          </div>
        </div>
      )}

      {/* Step 4: Contact */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">Last step. We'll come back to you within one working day.</p>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Your name</label>
            <input type="text" value={data.name} onChange={(e) => update("name", e.target.value)} required className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Email</label>
              <input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Phone (optional)</label>
              <input type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500/20" />
              <span>
                I consent to doticrosst storing my details to provide a quote and contact me about my project.
                See our <a href="/privacy/" className="font-medium text-blue-600 hover:underline">privacy policy</a>.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            Back
          </button>
        ) : <div />}
        {step < 3 ? (
          <button onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()} className="rounded-lg bg-blue-500 px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600 disabled:opacity-40">Continue</button>
        ) : (
          <button onClick={handleSubmit} disabled={!canProceed() || loading} className="rounded-lg bg-blue-500 px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600 disabled:opacity-40">
            {loading ? "Sending..." : "Get My Quote"}
          </button>
        )}
      </div>
    </div>
  );
}
