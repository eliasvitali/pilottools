function calculateCosts(costPerHour, totalTime, timeAPIC, timeASafety, timeBPIC, timeBSafety) {
    if (timeAPIC + timeBPIC > totalTime) {
        throw new Error("The sum of PIC times cannot exceed the total time.");
    }
    if (timeASafety > timeBPIC) {
        throw new Error("Person A's safety time cannot exceed person B's PIC time.");
    }
    if (timeBSafety > timeAPIC) {
        throw new Error("Person B's safety time cannot exceed person A's PIC time.");
    }

    const costA = (timeAPIC - timeBSafety) * costPerHour + (costPerHour * timeBSafety / 2);
    const totalCost = costPerHour * totalTime;
    const costB = totalCost - costA;

    const loggedTimeA = timeAPIC + timeASafety;
    const loggedTimeB = timeBPIC + timeBSafety;

    const costPerHourA = loggedTimeA !== 0 ? costA / loggedTimeA : 0;
    const costPerHourB = loggedTimeB !== 0 ? costB / loggedTimeB : 0;

    return {
        costA,
        costB,
        loggedTimeA,
        costPerHourA,
        loggedTimeB,
        costPerHourB
    };
}
