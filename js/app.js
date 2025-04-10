document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const inputs = document.querySelectorAll('input');
    
    // Add event listeners
    calculateBtn.addEventListener('click', calculatePosition);
    inputs.forEach(input => input.addEventListener('input', clearErrors));
});

function calculatePosition() {
    clearErrors();
    
    // Get and validate inputs
    const inputs = {
        capital: getValidatedInput('capital', value => value > 0, 'Account balance must be positive'),
        riskPercentage: getValidatedInput('riskPercentage', value => value >= 0 && value <= 100, 'Risk % must be between 0-100'),
        riskFixed: getValidatedInput('riskFixed', value => value >= 0, 'Fixed risk cannot be negative'),
        entryPrice: getValidatedInput('entryPrice', value => value > 0, 'Invalid entry price'),
        rrRatio: getValidatedInput('rrRatio', value => value > 0, 'Invalid R:R ratio'),
        leverage: getValidatedInput('leverage', value => value >= 0, 'Leverage cannot be negative'),
        useFullNotional: document.getElementById('useFullNotional').checked,
        customNotional: getValidatedInput('customNotional', value => value >= 0, 'Invalid notional value')
    };

    // Calculate dollar risk
    const dollarRisk = inputs.riskFixed > 0 ? inputs.riskFixed : inputs.capital * (inputs.riskPercentage / 100);
    if (dollarRisk <= 0) return showError('Please specify either risk % or fixed risk amount');

    // Calculate notional value
    let notional;
    if (inputs.useFullNotional) {
        if (inputs.leverage <= 0) return showError('Leverage required for full notional');
        notional = inputs.capital * inputs.leverage;
    } else {
        if (inputs.customNotional <= 0) return showError('Please enter custom notional or enable full notional');
        notional = inputs.customNotional;
    }

    // Position calculations
    const positionSize = notional / inputs.entryPrice;
    if (!isFinite(positionSize)) return showError('Invalid position size calculation');

    // Price levels
    const stopDistance = dollarRisk / positionSize;
    const stopPrice = inputs.entryPrice - stopDistance;
    const tpDistance = (inputs.rrRatio * dollarRisk) / positionSize;
    const tpPrice = inputs.entryPrice + tpDistance;

    // Leverage calculation
    const effectiveLeverage = notional / inputs.capital;

    // Display results
    updateResult('positionSize', positionSize.toFixed(4));
    updateResult('stopPrice', `$${stopPrice.toFixed(2)}`);
    updateResult('tpPrice', `$${tpPrice.toFixed(2)}`);
    updateResult('dollarRisk', `$${dollarRisk.toFixed(2)}`);
    updateResult('potentialProfit', `$${(dollarRisk * inputs.rrRatio).toFixed(2)}`);
    updateResult('effectiveLeverage', `${effectiveLeverage.toFixed(1)}x`);
    
    // Risk assessment
    const riskMessage = getRiskAssessment(inputs, effectiveLeverage, dollarRisk);
    updateResult('riskAssessment', riskMessage.text);
    document.getElementById('riskAssessment').style.backgroundColor = riskMessage.color;
}

function getValidatedInput(elementId, validationFn, errorMsg) {
    const element = document.getElementById(elementId);
    const value = parseFloat(element.value) || 0;
    
    if (!validationFn(value)) {
        showError(errorMsg);
        element.classList.add('invalid');
        throw new Error('Validation failed');
    }
    
    element.classList.remove('invalid');
    return value;
}

function updateResult(elementId, value) {
    document.getElementById(elementId).textContent = value;
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
}

function clearErrors() {
    document.getElementById('error-message').classList.remove('visible');
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

function getRiskAssessment(inputs, leverage, riskAmount) {
    const positionSizeRatio = (inputs.customNotional || inputs.capital * inputs.leverage) / inputs.capital;
    const riskPercentageOfCapital = (riskAmount / inputs.capital) * 100;
    
    let message = '';
    let color = '#d4edda'; // Default green
    
    if (leverage > 25 || riskPercentageOfCapital > 5) {
        message = '⚠️ Extreme Risk: High leverage combined with large risk exposure';
        color = '#f8d7da';
    } else if (leverage > 10 || riskPercentageOfCapital > 3) {
        message = '🔴 High Risk: Consider reducing leverage or risk amount';
        color = '#fff3cd';
    } else if (leverage > 5 || riskPercentageOfCapital > 2) {
        message = '🟡 Moderate Risk: Within acceptable limits for experienced traders';
        color = '#d1ecf1';
    } else {
        message = '🟢 Conservative: Risk parameters are within safe limits';
    }
    
    // Add additional warnings
    if (positionSizeRatio > 0.5) {
        message += ' - Large position size relative to capital';
    }
    if (inputs.rrRatio < 1.5) {
        message += ' - Low reward-to-risk ratio';
    }
    
    return { text: message, color };
}
