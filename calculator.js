function calculateCosts(totalTime, timeA_PIC, timeB_safety, timeB_PIC, timeA_safety, rentalHourlyRate) {
    if (timeA_PIC + timeB_PIC > totalTime) {
        throw new Error("The sum of PIC times cannot exceed the total time.");
    }
    if (timeA_safety > timeB_PIC) {
        throw new Error("Person A's safety time cannot exceed person B's PIC time.");
    }
    if (timeB_safety > timeA_PIC) {
        throw new Error("Person B's safety time cannot exceed person A's PIC time.");
    }

    const costA = ((timeA_PIC - timeB_safety) * rentalHourlyRate) + (timeB_safety * rentalHourlyRate / 2) + (timeA_safety * rentalHourlyRate / 2);
    const costB = (timeB_safety * rentalHourlyRate / 2) + ((timeB_PIC - timeA_safety) * rentalHourlyRate) + (timeA_safety * rentalHourlyRate / 2);

    const loggedTimeA = timeA_PIC + timeA_safety;
    const loggedTimeB = timeB_PIC + timeB_safety;

    const costPerHourA = loggedTimeA !== 0 ? costA / loggedTimeA : 0;
    const costPerHourB = loggedTimeB !== 0 ? costB / loggedTimeB : 0;
    const flightCost = rentalHourlyRate * totalTime;

    return {
        costA,
        costB,
        loggedTimeA,
        costPerHourA,
        loggedTimeB,
        costPerHourB,
        flightCost
    };
}
