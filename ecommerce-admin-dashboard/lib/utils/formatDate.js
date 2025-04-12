export function formatDateWithOrdinal(dateString) {
    const date = new Date(dateString);
    
    // Use UTC methods to ensure consistency
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
  
    // Get ordinal suffix (consistent between server and client)
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };
  
    return `${day}${getOrdinal(day)} ${month} ${year}`;
  }