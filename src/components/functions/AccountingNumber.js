const accountingNumber = (number) => {
    // var parts = x.toString().split(".");
    // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // return parts.join(",");

    if(isNaN(number)){
      number = 0
    }
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'decimal', // Style can be 'decimal', 'currency', 'percent'
      minimumFractionDigits: 2, // Minimum number of decimal places
      maximumFractionDigits: 2, // Maximum number of decimal places
    }).format(number);
  
    return formattedNumber;
  }

  export default accountingNumber