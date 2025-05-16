export const submitAttendance = async (data) => {
    const response = await fetch('https://attendance-management-system-xxgc.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit attendance');
    }
  
    return await response.json();
  };
  
