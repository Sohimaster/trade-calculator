# Crypto Trade Position Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A responsive single-page web application for calculating cryptocurrency trade positions with risk management features.

## Features

- 📈 Position size calculation based on account balance and risk parameters
- ⚖️ Risk assessment with leverage and exposure warnings
- 🛑 Stop-loss and take-profit price calculations
- 💰 Multiple risk input modes (percentage or fixed amount)
- 🔄 Real-time calculations with instant feedback
- 🎨 Mobile-friendly responsive design

## Installation & Usage

```bash
git clone https://github.com/yourusername/crypto-trade-calculator.git
cd crypto-trade-calculator
xdg-open index.html  # Or open in your browser
```

## Input Parameters

| Parameter            | Description                                  |
|----------------------|----------------------------------------------|
| Account Balance      | Total trading capital available              |
| Risk Percentage      | % of capital to risk (1-2% recommended)      |
| Fixed Risk           | Alternative fixed dollar amount to risk      |
| Entry Price          | Price at which position will be opened       |
| Reward:Risk Ratio    | Profit target ratio (e.g., 2 for 2:1)        |
| Leverage             | Position size multiplier (optional)          |
| Use Full Notional    | Calculate using maximum available margin     |

## Calculation Details

The tool calculates:
- Position size in asset units
- Stop-loss and take-profit prices
- Dollar risk amount
- Potential profit based on R:R ratio
- Effective leverage used
- Risk assessment with color-coded warnings

## Risk Assessment Criteria

- 🔴 **Extreme Risk**: Leverage >25x or risk >5% of capital
- 🟠 **High Risk**: Leverage >10x or risk >3% 
- 🟡 **Moderate Risk**: Leverage >5x or risk >2%
- 🟢 **Conservative**: Within safe trading parameters

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
