#!/usr/bin/env python3
import csv
import json
import statistics
import sys
from collections import Counter, defaultdict
from pathlib import Path

import importlib.util


ANALYZER_PATH = Path(__file__).with_name("analyze-shopify-audience-export.py")
spec = importlib.util.spec_from_file_location("shopify_audience_export", ANALYZER_PATH)
shopify_audience_export = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shopify_audience_export)
classify_line_item = shopify_audience_export.classify_line_item
customer_spent = shopify_audience_export.customer_spent


def read_loox(path):
    reviews = []
    with Path(path).open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            try:
                rating = int(float(row.get("rating") or 0))
            except ValueError:
                rating = 0
            row["_rating"] = rating
            row["_email"] = (row.get("email") or "").strip().lower()
            row["_handle"] = (row.get("handle") or "").strip().lower()
            reviews.append(row)
    return reviews


def read_shopify(path):
    orders = {}
    line_items_by_parent = defaultdict(list)
    with Path(path).open() as fh:
        for line in fh:
            if not line.strip():
                continue
            row = json.loads(line)
            parent_id = row.get("__parentId")
            if parent_id:
                line_items_by_parent[parent_id].append(row)
            elif row.get("name") and row.get("createdAt"):
                orders[row["id"]] = row
    for order_id, items in line_items_by_parent.items():
        if order_id in orders:
            orders[order_id]["_lineItems"] = items
    return list(orders.values())


def median(values):
    return statistics.median(values) if values else None


def average(values):
    return sum(values) / len(values) if values else None


def summarize(loox_reviews, shopify_orders):
    shopify_customers_by_email = {}
    orders_by_email = defaultdict(list)
    product_orders = Counter()
    product_line_gross = Counter()
    product_customers = defaultdict(set)
    product_categories = defaultdict(Counter)

    for order in shopify_orders:
        customer = order.get("customer") or {}
        email = (customer.get("email") or "").strip().lower()
        if email:
            shopify_customers_by_email[email] = customer
            orders_by_email[email].append(order)
        for item in order.get("_lineItems") or []:
            product = item.get("product") or {}
            handle = (product.get("handle") or item.get("title") or "").strip().lower()
            if not handle:
                continue
            product_orders[handle] += 1
            product_customers[handle].add(email or f"order:{order.get('id')}")
            product_categories[handle][classify_line_item(item)] += 1
            try:
                qty = int(item.get("quantity") or 0)
            except ValueError:
                qty = 0
            try:
                price = float((item.get("variant") or {}).get("price") or 0)
            except ValueError:
                price = 0
            product_line_gross[handle] += price * qty

    loox_emails = {r["_email"] for r in loox_reviews if r["_email"]}
    matched_emails = loox_emails & set(shopify_customers_by_email)
    unmatched_emails = loox_emails - set(shopify_customers_by_email)

    broader_ltv = [customer_spent(c) for c in shopify_customers_by_email.values()]
    broader_orders = []
    for c in shopify_customers_by_email.values():
        try:
            broader_orders.append(int(c.get("numberOfOrders") or 0))
        except ValueError:
            broader_orders.append(0)
    matched_ltv = [customer_spent(shopify_customers_by_email[e]) for e in matched_emails]
    matched_orders = []
    for e in matched_emails:
        try:
            matched_orders.append(int(shopify_customers_by_email[e].get("numberOfOrders") or 0))
        except ValueError:
            matched_orders.append(0)

    handle_reviews = Counter()
    handle_rating_sum = Counter()
    handle_low_reviews = Counter()
    handle_image_reviews = Counter()
    handle_verified_reviews = Counter()
    for review in loox_reviews:
        handle = review["_handle"]
        if not handle:
            continue
        handle_reviews[handle] += 1
        handle_rating_sum[handle] += review["_rating"]
        if review["_rating"] and review["_rating"] <= 3:
            handle_low_reviews[handle] += 1
        if review.get("img"):
            handle_image_reviews[handle] += 1
        if (review.get("verified_purchase") or "").lower() in ("true", "1", "yes"):
            handle_verified_reviews[handle] += 1

    product_rows = []
    for handle, review_count in handle_reviews.items():
        avg_rating = handle_rating_sum[handle] / review_count if review_count else 0
        order_count = product_orders.get(handle, 0)
        customer_count = len(product_customers.get(handle, set()))
        category = product_categories.get(handle, Counter()).most_common(1)
        product_rows.append(
            {
                "handle": handle,
                "loox_reviews": review_count,
                "avg_rating": avg_rating,
                "low_review_rate": handle_low_reviews[handle] / review_count if review_count else 0,
                "image_review_rate": handle_image_reviews[handle] / review_count if review_count else 0,
                "verified_review_rate": handle_verified_reviews[handle] / review_count if review_count else 0,
                "shopify_order_associations": order_count,
                "shopify_customer_associations": customer_count,
                "estimated_line_gross": product_line_gross.get(handle, 0),
                "category": category[0][0] if category else "unmatched",
            }
        )

    product_rows_by_reviews = sorted(product_rows, key=lambda r: (-r["loox_reviews"], r["handle"]))
    product_rows_by_order_assoc = sorted(product_rows, key=lambda r: (-r["shopify_order_associations"], r["handle"]))
    low_rating_rows = sorted(
        [r for r in product_rows if r["loox_reviews"] >= 20],
        key=lambda r: (-r["low_review_rate"], -r["loox_reviews"], r["handle"]),
    )

    matched_reviewers_repeat = sum(1 for n in matched_orders if n > 1)
    broader_repeat = sum(1 for n in broader_orders if n > 1)

    return {
        "loox": {
            "reviews": len(loox_reviews),
            "unique_emails": len(loox_emails),
            "matched_shopify_customer_emails": len(matched_emails),
            "unmatched_loox_emails": len(unmatched_emails),
        },
        "reviewer_vs_customer": {
            "broader_shopify_customers_with_email": len(shopify_customers_by_email),
            "broader_avg_ltv": average(broader_ltv),
            "broader_median_ltv": median(broader_ltv),
            "broader_repeat_rate": broader_repeat / len(broader_orders) if broader_orders else 0,
            "loox_matched_avg_ltv": average(matched_ltv),
            "loox_matched_median_ltv": median(matched_ltv),
            "loox_matched_repeat_rate": matched_reviewers_repeat / len(matched_orders) if matched_orders else 0,
        },
        "top_loox_products_cross_ref": product_rows_by_reviews[:30],
        "top_shopify_products_with_loox_cross_ref": product_rows_by_order_assoc[:30],
        "lowest_rated_reviewed_products_min_20_reviews": low_rating_rows[:20],
    }


def main():
    if len(sys.argv) != 4:
        raise SystemExit("Usage: cross-reference-loox-shopify.py LOOX.csv SHOPIFY.jsonl OUTPUT.json")
    result = summarize(read_loox(sys.argv[1]), read_shopify(sys.argv[2]))
    Path(sys.argv[3]).write_text(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
