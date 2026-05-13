# PressClass — Pricing & Unit Economics

Snapshot of the live, in-database pricing as of 2026-05-13. All numbers are seeded from migration `10_credits_and_profile_extension.sql` — edit them in `credit_packages` / `credit_package_prices` / `generation_costs` to change live pricing without redeploying.

---

## 1. Credit packages (live in DB)

| Code     | Pack name | Base credits | Bonus | **Total** |
|----------|-----------|-------------:|------:|----------:|
| `taste`  | Taste     | 50           | 5     | **55**    |
| `starter`| Starter   | 150          | 25    | **175**   |
| `popular`| Popular   | 500          | 100   | **600**   |
| `bulk`   | Power     | 1500         | 400   | **1900**  |

Bonus credits scale with pack size — pushes teachers toward the bigger packs (more revenue, lower processing-fee drag per credit).

---

## 2. Per-currency pricing (live in DB)

Stored in **minor units** (cedis-pesewas, naira-kobo, shilling-cents, USD-cents). Divide by 100 to get the headline price.

| Pack    | GHS         | NGN          | KES         | USD       |
|---------|------------:|-------------:|------------:|----------:|
| Taste   | **₵5.00**   | **₦500**     | **KSh 65**  | **$0.50** |
| Starter | **₵15.00**  | **₦1,500**   | **KSh 195** | **$1.50** |
| Popular | **₵45.00**  | **₦4,500**   | **KSh 585** | **$4.50** |
| Power   | **₵120.00** | **₦12,000**  | **KSh 1,560** | **$12.00** |

> **Currency presented**: server-side IP detection on `/pricing`, then the user's profile `currency` after signup (set from their onboarding country).

---

## 3. Generation costs (live in DB)

| Output       | Credits to generate |
|--------------|--------------------:|
| Notes        | **3**               |
| Assessment   | **4**               |
| Lesson plan  | **5**               |

So 1 credit ≈ 1/4 of a generation on average (call it ~4 credits per output).

---

## 4. Signup bonus

**25 free credits** on completed onboarding. Practical capacity:

- ~8 sets of notes, **or**
- ~6 assessments, **or**
- ~5 lesson plans

Designed to be enough for a teacher to feel the product, not enough to run a whole term off the freebie.

Anti-abuse: granted only after `signup_fingerprints` (normalized email + salted IP hash + device hash) clears as a fresh identity. Idempotent on `user_id` reference so a re-run can never double-grant.

---

## 5. Effective price per credit

| Pack    | USD price | Total credits | **$/credit** |
|---------|----------:|--------------:|-------------:|
| Taste   | $0.50     | 55            | **$0.00909** |
| Starter | $1.50     | 175           | **$0.00857** |
| Popular | $4.50     | 600           | **$0.00750** |
| Power   | $12.00    | 1,900         | **$0.00632** |

The Power pack is ~30% cheaper per credit than Taste — that's your bulk discount.

---

## 6. Effective price per output (Popular pack, $0.0075/credit)

| Output       | Credits | Cost to teacher (USD) | Cost (GHS) | Cost (NGN) | Cost (KES) |
|--------------|--------:|---------------------:|-----------:|-----------:|-----------:|
| Notes        | 3       | **$0.023**           | ₵0.23      | ₦22.50     | KSh 2.93   |
| Assessment   | 4       | **$0.030**           | ₵0.30      | ₦30.00     | KSh 3.90   |
| Lesson plan  | 5       | **$0.038**           | ₵0.38      | ₦37.50     | KSh 4.88   |

For comparison: a 30-minute hand-drafted lesson plan costs the teacher ~$5–$10 worth of their time. PressClass is **roughly 100–250× cheaper than the labour it replaces**.

---

## 7. Operating cost per generation (best estimate)

Today the app uses **Groq `gpt-oss-120b`** for all three generators (see `lib/AI_API_Switch.ts`). Cost components:

| Component                | Per-generation $ (rough) | Notes |
|--------------------------|-------------------------:|-------|
| Groq tokens (in + out)   | **$0.0005 – $0.0020**    | gpt-oss-120b is ≈$0.15/M input + $0.60/M output. Average lesson plan ≈ 800 input + 1500 output tokens. |
| Supabase (DB + auth)     | < $0.0001                | Falls under free tier until ~1M MAUs |
| Vercel hosting           | < $0.0001                | Hobby tier free; Pro is $20/mo flat |
| Payment processor fee    | depends on pack — see §8 | Paystack ≈ 1.5–1.95% (GH/NG); Flutterwave similar; Stripe 2.9% + $0.30 |

**Take-home: a single generation costs PressClass on the order of $0.001 – $0.003 in variable cost.**

Compare to revenue per generation in §6: $0.023 – $0.038. **Gross margin is ~90–95% before payment fees.**

---

## 8. Payment-processor drag per pack

Using Paystack (≈1.95% local + a fixed fee that's negligible at these tiers):

| Pack    | USD | Processor fee (~) | Net revenue |
|---------|----:|------------------:|------------:|
| Taste   | $0.50 | $0.010 | $0.490 |
| Starter | $1.50 | $0.029 | $1.471 |
| Popular | $4.50 | $0.088 | $4.412 |
| Power   | $12.00 | $0.234 | $11.766 |

Net-revenue-per-credit stays in the $0.0061–$0.0089 range — minimal impact.

---

## 9. Signup-bonus dilution

Each new user is granted 25 free credits.

- At Popular-pack effective rate ($0.0075/credit), 25 credits = **$0.188 of "give-away value"**
- At AI cost (assume $0.001/credit ≈ $0.003 per generation × 6 generations possible = $0.018), the real CAC contribution is **~$0.02 per signup** — basically nothing.

Even if 100% of free-credit users churn before purchasing, you're losing ~2 cents in AI cost per signup. Sustainable indefinitely.

---

## 10. Sensitivity — what you'd need to break even on a $50 dev/month cost

Assume $50/month fixed cost (Vercel Pro + domain + email + small Supabase row growth).

| If gross margin per Popular pack is $4.36, you need ≈ **12 Popular packs sold per month** to cover fixed costs. |
| -- |

That's ~12 active teachers buying once a month. Eminently achievable in any African school district.

---

## 11. Levers for revenue growth

In rough order of impact:

1. **Lock more teachers into Power pack** (currently the cheapest per credit). Bonus credit ratio is already 26% on Power vs 10% on Taste — could push further (e.g. 33%) and still maintain margin.
2. **Convert Taste-pack buyers to Starter quickly.** A teacher who runs through 55 credits in two weeks will hit a "buy more" prompt — make sure that prompt features Starter, not Taste.
3. **Add a school plan** (e.g. 10,000 credits at a 40% bulk discount, with multi-seat admin) to capture institutional budget.
4. **Geographically tune prices.** Current pricing for GHS/NGN/KES/USD was uniform-ish. The Ghanaian teacher's purchasing power vs an American one is very different — increase USD price by 30–50% (Western teachers are still getting a steal), keep African prices unchanged.
5. **Reduce signup-bonus suppression**. If you're not seeing abuse, you can safely raise the bonus to 35–50 credits to drive activation; the AI cost is negligible.

---

## 12. Levers for cost reduction

1. **Switch easy generations to a cheaper model**. Notes (3 credits, simplest output) could route to `gpt-4o-mini` or Gemini 2.5 Flash; lesson plans stay on `gpt-oss-120b`. Tiered routing cuts notes cost ~70%.
2. **Cache assessment templates by (subject, class, strand)** — when a teacher generates "Mathematics / JHS 2 / Fractions" twice the second one's output is mostly diff-able from the first. Could reduce AI calls by 20–30% with embedding-based similarity match.
3. **Image-free PDFs** (already done) — drop html2canvas-style screenshots, no client memory hit.
4. **Push more onto edge caching** — already done in PWA service worker.

---

## 13. Suggested KPIs to track weekly

| KPI                          | Target |
|------------------------------|--------|
| Signups → completed onboarding | > 80% |
| Onboarded → first generation   | > 60% |
| Onboarded → first purchase     | > 15% (over 30 days) |
| Average revenue per paying teacher / month | $2–$5 |
| Refund-on-fail rate            | < 2% of generations |
| Generation cost ratio (AI $/total revenue) | < 10% |

If the **refund-on-fail rate** climbs above 5%, the AI provider is misbehaving — investigate the parser or switch providers.

If **AI cost ratio** climbs above 15%, the routing tier mix has shifted toward lesson plans (most expensive). Either raise the price of lesson plans or push notes harder.

---

## 14. Raw data dump (for spreadsheet analysis)

```csv
pack_code,base_credits,bonus_credits,total_credits,gh_s,ng_n,ke_s,usd
taste,50,5,55,5.00,500,65.00,0.50
starter,150,25,175,15.00,1500,195.00,1.50
popular,500,100,600,45.00,4500,585.00,4.50
bulk,1500,400,1900,120.00,12000,1560.00,12.00
```

```csv
generation,cost_credits,popular_pack_usd_cost,popular_pack_ghs_cost
notes,3,0.0225,0.225
assessment,4,0.0300,0.300
lesson_plan,5,0.0375,0.375
```

```csv
signup_bonus_credits,popular_rate_value_usd,ai_cost_estimate_usd
25,0.1875,0.018
```

---

## 15. Where the live numbers live (so you can edit without a deploy)

| Table                      | Edit to change                          |
|----------------------------|-----------------------------------------|
| `credit_packages`          | Pack name, base credits, bonus credits, active state, sort order |
| `credit_package_prices`    | Per-currency prices (minor units)       |
| `generation_costs`         | Credits charged per generation type     |
| `handle_new_user` function (migration 10) | Signup-bonus initial provisioning — currently 0 credits at trigger time, 25 granted from the app after fingerprint check |
| `actions/onboarding.ts` `SIGNUP_BONUS` | The 25-credit grant constant |

A price change is a 1-row UPDATE — no deploy.

---

*Generated 2026-05-13. Re-run an analysis after each pricing change.*
