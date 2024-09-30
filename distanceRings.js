function generateDistanceRing(icao, radius) {
    const points = [];
    const numPoints = 36; // One point every 10 degrees
    for (let i = 0; i <= numPoints; i++) { // Start at 0 for the full circle
        const heading = (i * 10).toString().padStart(3, '0'); // Heading in 3 digits
        const distance = radius.toFixed(0).padStart(3, '0'); // Distance with 3 digits
        points.push(`${icao}${heading}${distance}`);
    }
    return points.join(' ');
}