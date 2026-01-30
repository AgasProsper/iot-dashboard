
export async function fetchWeather(lat, lon) {
    if (!lat || !lon) return null;

    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&timezone=auto`
        );
        const data = await response.json();
        return data.current;
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        return null;
    }
}
