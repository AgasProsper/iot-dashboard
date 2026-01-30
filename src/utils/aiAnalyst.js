
/**
 * Analyzes boat telemetry to provide "Edge AI" insights.
 */
export function analyzeTelemetry(boat) {
    const sensors = boat.sensors || {}; // Handle flat schema (Prototype)
    const env = boat.environment || {}; // Handle nested schema (Sim)

    // Normalize Data
    const temp = sensors.temperature ?? env.ambient_temp ?? 0;
    const humidity = sensors.humidity ?? 0;
    const rainStatus = sensors.rain_status ?? env.rain_status ?? "UNKNOWN";
    const voltage = sensors.battery?.voltage ?? 0;
    const accelZ = sensors.motion?.accel_z ?? 0;

    const insights = [];
    let safetyScore = 100;
    let anomalyCount = 0;

    // 1. Moisture / Leak Analysis
    if (humidity > 85) {
        insights.push("CRITICAL: High internal moisture (Possible Leak!)");
        safetyScore -= 30;
        anomalyCount++;
    } else if (humidity > 70) {
        insights.push("Warning: High humidity levels.");
        safetyScore -= 10;
    }

    // 2. Battery Health
    if (voltage > 0 && voltage < 3.3) {
        insights.push("Low Battery Voltage - Recharge Required.");
        safetyScore -= 5;
    }

    // 3. Stability (Accelerometer Z should be ~1g ie ~9.8m/s2 or ~1.0 depending on scale)
    // Prototype sends ~ -0.7g to 1g. Let's assume outlier detection.
    if (Math.abs(accelZ) > 1.5) {
        insights.push("Rough seas or instability detected.");
        safetyScore -= 15;
    }

    // 4. Rain Correlation
    if (rainStatus !== "NO WATER" && rainStatus !== "DRY") {
        insights.push("Rain detected on-board.");
    }

    return {
        insights,
        safetyCode: safetyScore > 80 ? "SAFE" : (safetyScore > 50 ? "WARNING" : "CRITICAL"),
        safetyScore,
        anomalyCount,
        maintenance: anomalyCount > 0 ? "Required" : "Good"
    };
}
