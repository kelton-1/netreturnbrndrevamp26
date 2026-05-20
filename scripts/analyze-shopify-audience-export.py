#!/usr/bin/env python3
import json
import math
import statistics
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


LAUNCH_MONITOR_TERMS = (
    "launch monitor",
    "flightscope",
    "mevo",
    "foresight",
    "gc3",
    "gcquad",
    "full swing",
    "uneekor",
    "eye mini",
    "garmin",
    "approach r10",
    "skytrak",
    "golf joy",
)

SIMULATOR_TERMS = (
    "simulator",
    "sim bay",
    "sim-bay",
    "sim package",
    "screen",
    "projector",
    "enclosure",
)

NET_TERMS = (
    "net",
    "pro series",
    "home series",
    "mini pro",
    "junior",
    "large 8",
    "large 9",
    "large 10",
)

ACCESSORY_TERMS = (
    "turf",
    "mat",
    "side barrier",
    "no fly",
    "target",
    "cover",
    "duffel",
    "replacement",
    "accessory",
)


def money_amount(value):
    if not value:
        return 0.0
    try:
        return float(value.get("shopMoney", {}).get("amount") or 0)
    except (TypeError, ValueError):
        return 0.0


def customer_spent(customer):
    if not customer:
        return 0.0
    try:
        return float(customer.get("amountSpent", {}).get("amount") or 0)
    except (TypeError, ValueError):
        return 0.0


def classify_line_item(item):
    product = item.get("product") or {}
    collections = " ".join(
        edge.get("node", {}).get("handle", "") + " " + edge.get("node", {}).get("title", "")
        for edge in (product.get("collections") or {}).get("edges", [])
    )
    text = " ".join(
        str(part or "")
        for part in (
            item.get("title"),
            item.get("sku"),
            product.get("handle"),
            product.get("productType"),
            product.get("vendor"),
            " ".join(product.get("tags") or []),
            collections,
        )
    ).lower()

    if any(term in text for term in LAUNCH_MONITOR_TERMS):
        return "launch_monitor"
    if any(term in text for term in SIMULATOR_TERMS):
        return "simulator"
    if any(term in text for term in NET_TERMS):
        return "net"
    if any(term in text for term in ACCESSORY_TERMS):
        return "accessory"
    return "other"


def percentile(values, pct):
    if not values:
        return None
    values = sorted(values)
    k = (len(values) - 1) * pct
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return values[int(k)]
    return values[f] * (c - k) + values[c] * (k - f)


def parse_bulk(path):
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


def summarize(orders):
    customers = {}
    customer_orders = defaultdict(list)
    category_orders = Counter()
    category_revenue = Counter()
    product_orders = Counter()
    product_revenue = Counter()
    geo_orders = Counter()
    geo_revenue = Counter()
    source_orders = Counter()
    source_revenue = Counter()
    days = []

    for order in orders:
        customer = order.get("customer") or {}
        customer_id = customer.get("id")
        if customer_id:
            customers[customer_id] = customer
            customer_orders[customer_id].append(order)

        revenue = money_amount(order.get("currentTotalPriceSet"))
        address = order.get("shippingAddress") or customer.get("defaultAddress") or {}
        geo = ", ".join(part for part in (address.get("province"), address.get("country")) if part) or "Unknown"
        geo_orders[geo] += 1
        geo_revenue[geo] += revenue

        journey = order.get("customerJourneySummary") or {}
        if journey.get("daysToConversion") is not None:
            days.append(journey["daysToConversion"])
        first_visit = journey.get("firstVisit") or {}
        source = first_visit.get("source") or "Unknown"
        source_orders[source] += 1
        source_revenue[source] += revenue

        order_categories = set()
        for item in order.get("_lineItems") or []:
            category = classify_line_item(item)
            order_categories.add(category)
            product = item.get("product") or {}
            product_label = product.get("handle") or item.get("title") or "Unknown"
            product_orders[product_label] += 1
            product_revenue[product_label] += revenue

        for category in order_categories:
            category_orders[category] += 1
            category_revenue[category] += revenue

    customer_category_sets = defaultdict(set)
    for customer_id, orders_for_customer in customer_orders.items():
        for order in orders_for_customer:
            for item in order.get("_lineItems") or []:
                customer_category_sets[customer_id].add(classify_line_item(item))

    category_customers = Counter()
    for categories in customer_category_sets.values():
        for category in categories:
            category_customers[category] += 1

    repeat_customers = {
        cid
        for cid, customer in customers.items()
        if int(customer.get("numberOfOrders") or len(customer_orders.get(cid, [])) or 0) > 1
    }
    launch_monitor_customers = {
        cid for cid, categories in customer_category_sets.items() if "launch_monitor" in categories
    }
    simulator_customers = {
        cid for cid, categories in customer_category_sets.items() if "simulator" in categories
    }
    net_customers = {cid for cid, categories in customer_category_sets.items() if "net" in categories}
    sim_or_launch_monitor_customers = simulator_customers | launch_monitor_customers
    standalone_net_customers = net_customers - sim_or_launch_monitor_customers
    total_revenue = sum(money_amount(order.get("currentTotalPriceSet")) for order in orders)

    category_ltv = {}
    for category in sorted(category_customers):
        cids = [cid for cid, cats in customer_category_sets.items() if category in cats]
        spends = [customer_spent(customers.get(cid)) for cid in cids]
        category_ltv[category] = {
            "customers": len(cids),
            "avg_ltv": sum(spends) / len(spends) if spends else 0,
            "repeat_rate": sum(1 for cid in cids if cid in repeat_customers) / len(cids) if cids else 0,
        }

    return {
        "orders_exported": len(orders),
        "customers_exported": len(customers),
        "total_revenue": total_revenue,
        "average_order_value": total_revenue / len(orders) if orders else 0,
        "repeat_customers": len(repeat_customers),
        "repeat_rate": len(repeat_customers) / len(customers) if customers else 0,
        "launch_monitor_customers": len(launch_monitor_customers),
        "simulator_customers": len(simulator_customers),
        "simulator_or_launch_monitor_customers": len(sim_or_launch_monitor_customers),
        "net_customers": len(net_customers),
        "standalone_net_customers": len(standalone_net_customers),
        "launch_monitor_customer_rate": len(launch_monitor_customers) / len(customers) if customers else 0,
        "simulator_or_launch_monitor_customer_rate": len(sim_or_launch_monitor_customers) / len(customers) if customers else 0,
        "standalone_net_customer_rate": len(standalone_net_customers) / len(customers) if customers else 0,
        "category_customers": dict(category_customers),
        "category_ltv": category_ltv,
        "top_geographies_by_orders": geo_orders.most_common(20),
        "top_geographies_by_revenue": geo_revenue.most_common(20),
        "top_sources_by_orders": source_orders.most_common(20),
        "top_sources_by_revenue": source_revenue.most_common(20),
        "top_products_by_orders": product_orders.most_common(25),
        "top_products_by_revenue": product_revenue.most_common(25),
        "days_to_conversion": {
            "count": len(days),
            "average": statistics.mean(days) if days else None,
            "median": statistics.median(days) if days else None,
            "p75": percentile(days, 0.75),
            "p90": percentile(days, 0.90),
        },
    }


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: analyze-shopify-audience-export.py INPUT.jsonl OUTPUT.json")
    orders = parse_bulk(sys.argv[1])
    summary = summarize(orders)
    Path(sys.argv[2]).write_text(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
