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
    const baseUrl = `${process.env.REACT_APP_API_URL}/authors/`;

    // Construct the complete URL by appending the ID
    const url = `${baseUrl}${id}`;

    return url;
}

export function convertTeamOnePostToVibelyPost(team1_post) {
    let content = team1_post.content;

    if (team1_post.image) {
        content = `https://cmput-average-21-b54788720538.herokuapp.com${team1_post.image}`
    } else if (team1_post.image_link) {
        content = team1_post.image_link
    }
    return {
        "type": "post",
        "title": team1_post.title,
        "id": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}/posts/${team1_post.id}`,
        "source": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}/posts/${team1_post.id}`,
        "origin": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}/posts/${team1_post.id}`,
        "description": team1_post.description,
        "contentType": "text/plain",
        "content": content,
        "author": {
            "type": "author",
            "id": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}`,
            "host": process.env.REACT_APP_TEAM_ONE_URL,
            "displayName": team1_post.author.username,
            "url": `${process.env.REACT_APP_TEAM_ONE_URL}/authors/${team1_post.author.id}`,
            "github": team1_post.author.github,
            "profileImage": team1_post.author.image
        },
        "categories": [
            "none"
        ],
        "count": team1_post.count,
        "comments": null,
        "published": team1_post.published,
        "visibility": team1_post.visibility.toLowerCase(),
        "unlisted": team1_post.unlisted
    }
}

export function convertVibelyPostToTeamOnePost(post, team_one_author) {
    return {
        "type": "post",
        "title": post.title,
        "id": getIdFromUrl(post.id),
        "source": post.source,
        "origin": post.origin,
        "description": post.description,
        "contentType": "text/plain",
        "content": post.content,
        "author": team_one_author,
        "categories": [
            "none"
        ],
        "count": post.count,
        "comments": null,
        "published": post.published,
        "visibility": post.visibility.toLowerCase(),
        "unlisted": false
    }
}

function getIdFromUrl(url) {
    // Split the URL by '/'
    const urlParts = url.split('/');

    // Get the last part of the URL
    return urlParts[urlParts.length - 1];
}