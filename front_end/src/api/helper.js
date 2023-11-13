export function extractIdFromUrl(url) {
    try {
        // Parse the URL using the URL constructor
        const urlObject = new URL(url);
        
        // Split the pathname by '/' and get the segment containing the ID
        const pathSegments = urlObject.pathname.split('/');
        const idSegment = pathSegments[pathSegments.indexOf('authors') + 1];
        
        return idSegment;
    } catch (error) {
        // Handle invalid URLs:  (unlikely to reach this point)
        console.error('Invalid URL:', error);
        return null;
    }
}

export function createUrlFromId(id) {
    // Base URL
    const baseUrl = 'http://127.0.0.1:8000/api/authors/';

    // Construct the complete URL by appending the ID
    const url = `${baseUrl}${id}`;

    return url;
}