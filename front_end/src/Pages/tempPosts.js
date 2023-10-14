import Dog from '../Images/dog.png'
import Profile from '../Images/profile.png'

export const tempPosts = [
    {
        contentType: "image",
        displayName: 'Selena Gomez',
        profileImage: Profile, 
        content: 'https://i.imgur.com/evIcJu4.jpeg',
        title: 'My new Puppy! 🐶',
        categories: ["pets"],
        visibility: 'public', 
        count: 67
    },
    {
        contentType: "text",
        displayName: 'Drake',
        profileImage: 'https://i.imgur.com/FlTdToH.jpeg', 
        content: 'Hey everyone! 👋🎃 Im so excited for Halloween! Can you help me decide on a costume? 🤔💭 Drop your suggestions below!🦇 #HalloweenCostumeIdeas',
        title: 'Halloween!',
        categories: ["halloween","spooky"],
        visibility: 'friends',
        count: 12
    },
    {
        contentType: "image",
        displayName: 'Harry Styles',
        profileImage: 'https://i.imgur.com/ULC0KUq.jpeg', 
        content: 'https://i.imgur.com/TrwuNH2.jpeg',
        title: 'The Rock',
        categories: ["hi"],
        visibility: 'private',
        count: 14
    },
  ];