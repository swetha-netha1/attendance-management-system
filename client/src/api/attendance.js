export const submitAttendance = async (data) => {
    const response = await fetch('http://localhost:5000/api/attendance', {
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
  