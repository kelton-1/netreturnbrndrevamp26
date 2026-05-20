# Net Return Data Questions: Shopify Findings

Date: 2026-05-14  
Source document: `/Users/kelton1/Downloads/Madin - Net Return Data Questions.pdf`  
Store checked: `the-net-return.myshopify.com`

## Executive Summary

I extracted the questions from the PDF, authenticated Shopify Admin API access, and ran a historical bulk export of orders, customers, line items, products, shipping geography, and Shopify customer journey fields.

The bulk export completed on 2026-05-14 with:

- 68,507 Shopify orders exported
- 36,929 order-linked customers exported
- $55.06M in exported order revenue
- $803.77 average order value
- 8,085 repeat customers, or 21.9% of exported order-linked customers
- 58,303 orders with Shopify `daysToConversion` journey data

The answers below separate:

- **Answered now**: information already present in the PDF or inferable from the Shopify/theme setup.
- **Shopify can answer after Admin API auth**: questions requiring order, customer, product, geography, or journey data.
- **Not answerable from Shopify alone**: questions requiring Klaviyo, ad platforms, GA4, quiz/survey/app analytics, reviews, support, reseller, or Amazon data.

Raw order/customer data was downloaded to `/tmp/thenetreturn-shopify-audience/` for local analysis only. The repo report keeps aggregate findings and does not store raw customer/order records.

Companion qualitative cross-reference:

```text
docs/loox-shopify-cross-reference-2026-05-14.md
```

## Shopify Access Status

- Theme CLI connection works: `shopify theme list --store the-net-return --json` returned the store's themes, including the live theme and the working unpublished/development themes.
- Admin API store execution is now authenticated for `the-net-return.myshopify.com`.
- Accepted read-only scopes: `read_customers`, `read_orders`, `read_all_orders`, `read_products`.
- Rejected scope: `read_marketplace_orders`. This was the only rejected scope encountered. It may affect completeness for marketplace-origin order data, but the core historical Shopify order/customer/product export succeeded without it.
- Shopify count queries returned `10000` for customers and orders, which appears to be a count cap/precision ceiling. The bulk export is more useful for analysis because it returned 68,507 orders.

## Shopify Export Findings

Important caveat: customer percentages below use the 36,929 customers linked to exported orders, not the PDF's 68,413 lifetime Shopify customer count. Product classification is based on Shopify product titles, handles, types, tags, vendors, and collections, so it should be treated as directional until product taxonomy is cleaned up.

| Metric | Shopify finding |
|---|---:|
| Orders exported | 68,507 |
| Order-linked customers exported | 36,929 |
| Exported revenue | $55.06M |
| Average order value | $803.77 |
| Repeat customers | 8,085 |
| Repeat customer rate | 21.9% |
| Launch-monitor-classified customers | 232, or 0.63% of exported order-linked customers |
| Simulator-or-launch-monitor-classified customers | 8,172, or 22.1% |
| Standalone-net-classified customers | 27,922, or 75.6% |
| Orders with days-to-conversion data | 58,303 |
| Avg / median days to conversion | 3.6 days / 1 day |
| 75th / 90th percentile days to conversion | 2 days / 12 days |

Top purchase geographies by order count:

1. California: 8,571 orders
2. Texas: 5,538
3. Florida: 4,105
4. New York: 2,862
5. Illinois: 2,828
6. North Carolina: 2,355
7. Michigan: 2,331
8. New Jersey: 2,225
9. Pennsylvania: 2,212
10. Ohio: 2,051

Top purchase geographies by exported revenue:

1. California: $6.38M
2. Texas: $4.08M
3. Florida: $3.06M
4. North Carolina: $2.74M
5. Illinois: $2.02M
6. New York: $2.00M
7. New Jersey: $1.75M
8. Michigan: $1.70M
9. Pennsylvania: $1.56M
10. Georgia: $1.47M

Top Shopify customer journey sources by order count:

1. Google: 25,396 orders
2. Direct: 23,428
3. Unknown: 10,204
4. An unknown source: 2,436
5. Bing: 1,342
6. Email: 1,311
7. Shopify.com: 640
8. Yahoo: 586
9. DuckDuckGo: 560
10. Facebook: 530

Top Shopify customer journey sources by exported revenue:

1. Google: $19.55M
2. Direct: $18.43M
3. Unknown: $10.07M
4. An unknown source: $1.80M
5. Bing: $1.05M
6. Email: $801.6K
7. Shopify.com: $516.4K
8. Facebook: $446.1K
9. Yahoo: $416.5K
10. DuckDuckGo: $405.5K

Category-level repeat/LTV signals:

| Category | Customers | Avg customer LTV | Repeat rate |
|---|---:|---:|---:|
| Accessory-classified | 561 | $14,546 | 56.3% |
| Simulator-classified | 8,006 | $3,655 | 43.9% |
| Launch-monitor-classified | 232 | $3,617 | 31.0% |
| Net-classified | 33,620 | $1,549 | 23.0% |

Top product handles/titles by order association:

1. `pro-golf-package`: 6,196 orders
2. `pro-turf-42-oz-nylon`: 5,246
3. `Pro Series V2 Golf and Multi-Sport Net`: 5,012
4. `golf-and-multi-sport-nets`: 4,478
5. `net-guardian`: 3,909
6. `pro-series-golf-net`: 3,799
7. `universal-side-barriers`: 3,420
8. `universal-side-barriers-pro-series-v2-and-home-series`: 2,750
9. `Pro Series Golf & Multi-Sport Net`: 2,482
10. `side-barriers`: 2,284

## Existing Customer Base & Segmentation

| Question | Best current answer | Shopify can answer? | What is needed next |
|---|---|---:|---|
| Who is the current Net Return customer? | PDF answer: an affluent, avid golfer who wants a high-quality portable practice setup, often for a backyard or garage, and may not want or be ready for a full simulator buildout. | Partially | Use Shopify orders to validate by AOV, products purchased, repeat purchases, geography, and simulator/launch-monitor attachment. Use survey or quiz data for intent and skill profile. |
| What percentage of customers own simulators vs. standalone nets? | PDF answer: 216 of 68,413 lifetime Shopify customers purchased a launch monitor from Net Return, or **0.32%**. Shopify export found 232 launch-monitor-classified customers, 8,172 simulator-or-launch-monitor-classified customers, and 27,922 standalone-net-classified customers among 36,929 order-linked customers. Directionally: **22.1% simulator/launch-monitor classified** and **75.6% standalone-net classified** in the exported order-linked customer set. | Partially | This only captures Shopify purchase behavior, not equipment bought elsewhere. Add a survey/quiz field for "already own launch monitor/simulator" to capture external ownership. |
| What does the purchase journey look like from discovery to conversion? | Shopify journey data shows **average 3.6 days**, **median 1 day**, **75th percentile 2 days**, and **90th percentile 12 days** from first tracked visit to conversion across 58,303 orders. Top tracked first sources are Google, direct, unknown, Bing, email, Shopify.com, Yahoo, DuckDuckGo, Facebook, and Instagram. | Partially | GA4 is needed for fuller pre-purchase paths, content sequencing, and non-converting drop-off. |
| What key phrases are most important for conversion? | PDF mentions "Trusted by Bryson" as strong messaging. | Weakly | Shopify can show converting landing pages/products, but phrase performance needs GA4, Search Console, Google Ads, Meta/TikTok/YouTube ads, site search, heatmaps, and A/B testing data. |
| What are the highest-LTV customer segments today? | Shopify directional answer: accessory-classified customers show the highest average LTV ($14,546, 56.3% repeat), followed by simulator-classified customers ($3,655, 43.9% repeat) and launch-monitor-classified customers ($3,617, 31.0% repeat). Net-classified customers average $1,549 LTV with a 23.0% repeat rate. | Yes | Clean product taxonomy and rerun the category model to separate accessories, bundles, simulator screens, packages, and replacement parts more precisely. |
| Which customers are most engaged post-purchase? | Shopify proxy answer: 8,085 exported customers are repeat purchasers, a 21.9% repeat rate. Simulator-classified and accessory-classified customers repeat at meaningfully higher rates than net-only customers. | Partially | Combine Shopify repeat purchase data with Klaviyo engagement, Academy app usage, review activity, support tickets, post-purchase survey completion, and assembly/content interactions. |
| Do we know who actively practices golf vs. buys for entertainment/family use? | No reliable answer in Shopify unless this is tagged or captured via quiz/survey. | No | Add/inspect Octane quiz, post-purchase survey, Academy onboarding, customer tags/metafields, or Klaviyo profile properties for practice intent. |
| What percentage are beginners, intermediate players, low handicaps, coaches, juniors, or aspiring competitive golfers? | Not answerable from standard Shopify order data. | No | Needs first-party survey, Academy onboarding, quiz profile fields, customer tags/metafields, or CRM enrichment. |
| What geographies over-index for engagement and purchases? | Shopify purchase leaders by orders are CA, TX, FL, NY, IL, NC, MI, NJ, PA, and OH. Revenue leaders are CA, TX, FL, NC, IL, NY, NJ, MI, PA, and GA. Engagement geography still requires Klaviyo/GA4/Academy data. | Partially | Pair Shopify purchase geography with Klaviyo/GA4/Academy engagement geography. For true "over-index," compare against traffic, population, or target-market baselines. |
| What products correlate most strongly with repeat purchases or higher retention? | Category signal: simulator-classified and accessory-classified customers have the strongest repeat/LTV profile. Top order-associated products include `pro-golf-package`, `pro-turf-42-oz-nylon`, Pro Series nets, `net-guardian`, `universal-side-barriers`, `side-barriers`, and `simulator-series`. | Yes | Use a cleaned first-product cohort model to distinguish "first purchase caused higher retention" from "high-LTV customers eventually bought this too." |

## Owned Audience & CRM Infrastructure

| Question | Best current answer | Shopify can answer? | What is needed next |
|---|---|---:|---|
| How large are email and SMS databases? | PDF answer: 46,150 active email users; 12,263 SMS subscribers; 104,809 total Klaviyo users. | No | Klaviyo is the source of truth. Shopify can provide customer email/SMS consent records, but not Klaviyo active list health. |
| Current open rates, CTRs, and conversion rates by flow? | PDF answer: email open rate 55.7%; email click rate 0.968%; SMS click rate 13.1%; email conversion 0.02%; SMS conversion 0.033%. | No | Klaviyo flow analytics by flow. |
| What existing automated flows are active? | PDF answer: Welcome, Active on Site, Add to Cart, Browse Abandonment, Quiz Dynamic, Abandoned Checkout Reminder, Post-Purchase Followup, Post-Purchase Survey. | No | Klaviyo flow inventory and status. |
| Are audiences segmented by product ownership, spend level, simulator ownership, or engagement? | PDF answer: product segmentation exists. No evidence yet for spend, simulator ownership, or engagement segmentation. | Partially | Shopify can support product/spend/order-count segmentation. Simulator ownership and engagement require tags/properties from surveys, Klaviyo, or Academy. |
| Do we have historical engagement cohorts we can reactivate? | Not answered from Shopify. | No | Klaviyo cohort/list/segment analytics, email/SMS engagement, win-back eligibility, and suppression status. |
| What percentage of audience is opted into SMS? | PDF says 15% of email. Using the raw PDF counts, SMS is **26.6% of active email** and **11.7% of total Klaviyo users**, so the denominator needs clarification. | No | Confirm denominator in Klaviyo. Shopify SMS consent can be used as a secondary check. |
| What first-party data are we currently collecting for personalization? | Shopify collects orders, products owned, spend, geography, discounts, customer contact/consent, tags, and possibly customer metafields. Shopify admin also shows useful installed sources including Klaviyo, Octane AI, HubSpot, Loox, Judge.me, Intelligems, Microsoft Clarity, Lucky Orange, Zigpoll, Snowball, Refersion, AgencyAnalytics, and Simprosys. | Partially | Audit Shopify customer tags/metafields, Klaviyo profile properties, Octane quiz fields, Zigpoll survey fields, Academy onboarding, reviews, referral/affiliate data, and support data. |
| Do we currently score customers by engagement or purchase propensity? | PDF answer: No. | Partially | Shopify does not natively provide a custom propensity score. This would need Klaviyo CDP/segments, BI modeling, or an external scoring workflow. |

## Conversion & Funnel Performance

| Question | Best current answer | Shopify can answer? | What is needed next |
|---|---|---:|---|
| Current CAC and ROAS benchmarks across Meta, Google, YouTube, TikTok? | PDF answer: $100 CAC and 10 ROAS. | No | Source this from Meta Ads, Google Ads/YouTube, TikTok Ads, Triple Whale/Northbeam, or Shopify marketing attribution if configured. |
| Which creative formats historically perform best? | PDF answer: UGC and Bryson content. | No | Needs ad platform creative reports and/or post-click landing-page tests. |
| What messaging historically drove strongest action? | PDF answer: "Trusted by Bryson." | Weakly | Shopify can compare landing/product conversion if campaigns are tagged. Strong answer needs ads, GA4, A/B tests, and Klaviyo campaign data. |
| What objections most commonly prevent purchase? | PDF answer: price. | No | Needs survey, support/chat transcripts, abandoned cart survey, reviews, and sales/support call notes. |
| What channels drive highest-quality vs. lowest-cost customers? | PDF answer: Google. Shopify supports this directionally: Google leads exported orders (25,396) and exported revenue ($19.55M), followed by direct (23,428 orders, $18.43M). CAC still requires ad spend. | Partially | Add ad spend from Meta, Google/YouTube, TikTok, and any attribution platform to separate "highest-quality" from "lowest-cost." |
| Average consideration window before purchase? | Shopify answer: 3.6 days average, 1 day median, 2 days at p75, 12 days at p90 across 58,303 orders with journey data. | Yes | Validate in GA4, because Shopify journey data only covers tracked journeys and may miss cross-device or blocked-tracking behavior. |
| Where do we currently lose users in the funnel? | Not answered yet. | Partially | Shopify analytics can help for checkout/cart. GA4, Search Console, heatmaps, and session recordings are needed for full site funnel. |
| What percentage of traffic is returning vs. net new? | Not answered yet. | No via Admin API | Use Shopify Analytics or GA4. Admin GraphQL is better for customers/orders than traffic-session reporting. |

## Product Adoption & Retention

| Question | Best current answer | Shopify can answer? | What is needed next |
|---|---|---:|---|
| Ideal "aha moment" for Net Return Academy? | PDF answer: limited time plus intentional practice with instructor guidance leads to improved swing mechanics. | No | Product strategy and Academy app analytics. |
| Behaviors that correlate with long-term app retention? | PDF answer: recommended training, lesson customization, rep tracking, and practice session tracking. | No | Academy app event analytics and subscription retention data. |
| What makes a customer feel they need Academy? | PDF answer: the most educational, simplest way to practice swing mechanics at home, save time, and practice on demand. | No | App onboarding tests, customer interviews, surveys, and product analytics. |
| Subscription model and retention benchmarks? | PDF answer: monthly, annual, quarterly, plus family quarterly/annual plans are planned. | No | Subscription platform or Academy billing analytics once live. |
| Current onboarding experience? | PDF answer: being designed; planned screening questions and swing filming for personalized content. | No | Academy product/app roadmap. |
| Incentives or gamification planned? | PDF answer: yes; practice reminders, milestones, weekly goals, and metric-improvement goals. | No | Academy product/app roadmap. |
| 30/60/90 day success metrics? | PDF answer: users watch content, complete drills, and return more than 2x/week to practice on their net. | No | Academy app analytics, subscription retention, and engagement cohorts. |

## Partnerships & Ecosystem

| Question | Best current answer | Shopify can answer? | What is needed next |
|---|---|---:|---|
| Existing partnerships? | PDF answer: Bryson DeChambeau, Kai Trump, Dana Dahlquist, James Nicholas, Sara Winter, Averee Dovsek; Garmin, Full Swing, Foresight, FlightScope, Uneekor, Golf Joy; 8AM Golf. | Partially | Shopify can show partner/product sales if tagged by vendor/product/collection. Partnership terms and performance require business records and ad/affiliate data. |
| Can Academy be bundled into hardware purchases? | PDF answer: yes, planned for resellers, Amazon, and DTC site. | Yes for DTC mechanics | Shopify can implement and track bundles, discounts, product metafields, and Shopify Functions/discounts. Reseller and Amazon need separate systems. |
| Appetite for affiliate/referral programs? | PDF answer: yes; resellers will have to sell an Academy bundle. | Partially | Shopify can track discount codes, referral apps, and orders. Need Refersion/Social Snowball/reseller program data for performance. |
| Coaches/academies that could white-label or recommend app? | PDF answer: Dana Dahlquist is lead instructor and has a coach network, website, and ecosystem. | No | Partnership/BD data. |
| Can PGA instructors or junior programs become acquisition channels? | PDF answer: yes; plan is to build this so coaches recommend at-home practice. | No | Partnership strategy and pilot tracking. |

## Potential Data Sources To Connect

- **Shopify Admin API**: customers, orders, line items, products, collections, customer tags/metafields, product ownership, LTV, repeat rate, geography, days to conversion where available.
- **Shopify Analytics/Reports**: traffic returning/new split, checkout funnel, online store conversion rate, sales reports.
- **Klaviyo**: email/SMS list size, flow performance, cohorts, engagement, profile properties, campaign conversion.
- **GA4**: purchase journey, traffic source, returning/new users, funnel loss, landing page and content performance.
- **Google Ads / YouTube / Meta / TikTok**: CAC, ROAS, creative format, messaging, audience quality.
- **Google Search Console**: organic key phrases and landing pages.
- **Octane.ai / quiz provider**: player skill level, simulator ownership, use case, practice intent.
- **Post-purchase survey**: purchase motivation, objections, skill level, intended setup, discovery channel.
- **Academy app analytics**: onboarding completion, lessons watched, drill completion, practice frequency, 30/60/90-day retention.
- **Subscription platform**: plan mix, retention, churn, family plans, cohort performance.
- **Reviews platform such as Loox/Yotpo**: qualitative objections, use cases, product satisfaction, social proof.
- **Support/chat system such as Gorgias/Zendesk/Shopify Inbox**: objections, purchase blockers, product confusion, setup questions.
- **Referral/affiliate apps such as Refersion/Social Snowball**: partner-driven sales, referrals, ambassador/coaches performance.
- **Amazon/reseller data**: external hardware/Academy bundle adoption, channel performance, non-DTC customer behavior.

## Shopify Pulls Run

Admin API auth completed with:

```bash
shopify store auth --store the-net-return.myshopify.com --scopes read_customers,read_orders,read_all_orders,read_products
```

The bulk export query used for this analysis is saved at:

```text
scripts/export-orders-for-audience-analysis.graphql
```

The aggregate parser used for this analysis is saved at:

```text
scripts/analyze-shopify-audience-export.py
```

Raw export file, local only:

```text
/tmp/thenetreturn-shopify-audience/bulk-5194161225821.jsonl
```

Aggregate summary file, local only:

```text
/tmp/thenetreturn-shopify-audience/audience-summary.json
```

## Recommended Next Steps

1. Clean up product taxonomy for a more precise product/category cohort model. The current classification is directionally useful but keyword-based.
2. Pull Klaviyo flow/list/segment exports to answer CRM engagement questions that Shopify cannot answer.
3. Pull GA4 and ad-platform data to validate Shopify journey findings and answer CAC, ROAS, returning/new traffic, funnel loss, creative format, and key-message questions.
4. Audit Octane AI, Zigpoll, HubSpot, reviews, support/chat, Snowball, and Refersion for first-party intent, skill level, simulator ownership, objections, affiliate, and post-purchase engagement data.
