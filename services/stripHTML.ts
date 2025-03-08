function stripHtml(html: string): string {
    if (!html) {
      return "";
    }
  
    // Remove HTML tags using a regular expression.
    const strippedText = html.replace(/<[^>]*>/g, "");
  
    // Remove HTML entities.
    const decodedText = strippedText.replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#(\d+);/gi, function(match, dec) {
        return String.fromCharCode(dec);
      });
  
    return decodedText.trim();
  }

  
  export default stripHtml