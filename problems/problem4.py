def minimize_loss(prices):
    indexed_prices = [(price, year) for year, price in enumerate(prices)]
    indexed_prices.sort()
    min_loss = float('inf')
    buy_year = sell_year = -1
    
    for i in range(len(prices) - 1, 0, -1):
        for j in range(i - 1, -1, -1):
            loss = prices[i] - prices[j]
            if loss < 0 and abs(loss) < min_loss and i > j:
                min_loss = abs(loss)
                buy_year = j + 1
                sell_year = i + 1
    return buy_year, sell_year, min_loss

# Example
prices = [20, 15, 7, 2, 13]
buy, sell, loss = minimize_loss(prices)
print(f"Buy Year: {buy}, Sell Year: {sell}, Loss: {loss}")
