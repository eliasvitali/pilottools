def calculate_costs(cost_per_hour, total_time, time_A_PIC, time_A_safety, time_B_PIC, time_B_safety):
    # Check that PIC times do not exceed total time
    if time_A_PIC + time_B_PIC > total_time:
        raise ValueError("The sum of PIC times cannot exceed the total time.")
    
    # Check that safety time does not exceed corresponding PIC time
    if time_A_safety > time_B_PIC:
        raise ValueError("Person A's safety time cannot exceed person B's PIC time.")
    if time_B_safety > time_A_PIC:
        raise ValueError("Person B's safety time cannot exceed person A's PIC time.")
    
    # Calculate costs for person A
    cost_A = (time_A_PIC - time_B_safety) * cost_per_hour + (cost_per_hour * time_B_safety / 2)
    
    # Total costs
    total_cost = cost_per_hour * total_time
    
    # Calculate costs for person B
    cost_B = total_cost - cost_A
    
    return cost_A, cost_B

# Example usage:
if __name__ == "__main__":
    # Define the values
    cost_per_hour = 170.0  # Cost per hour to rent the airplane
    total_time = 1.7  # Total time to split
    time_A_PIC = 1.7  # Time person A was PIC
    time_A_safety = 0  # Time person A was safety pilot
    time_B_PIC = 0  # Time person B was PIC
    time_B_safety = 1.0  # Time person B was safety pilot
    
    # Calculate costs
    try:
        cost_A, cost_B = calculate_costs(cost_per_hour, total_time, time_A_PIC, time_A_safety, time_B_PIC, time_B_safety)
        
        # Calculate logged times
        logged_time_A = time_A_PIC + time_A_safety
        logged_time_B = time_B_PIC + time_B_safety
        
        # Calculate cost per hour
        cost_per_hour_A = cost_A / logged_time_A if logged_time_A != 0 else 0
        cost_per_hour_B = cost_B / logged_time_B if logged_time_B != 0 else 0
        
        # Output results
        print(f"Cost for person A: ${cost_A:.2f}")
        print(f"Cost for person B: ${cost_B:.2f}")
        print(f"Person A logged {logged_time_A:.2f} hours at a cost of ${cost_per_hour_A:.2f} per hour.")
        print(f"Person B logged {logged_time_B:.2f} hours at a cost of ${cost_per_hour_B:.2f} per hour.")
        
    except ValueError as e:
        print(f"Error: {e}")
