export function generateRandomUser(seed: any = 1): {
    firstName: string;
    lastName: string;
    fullName: string;
    image: string;
  } {
    const firstNames = [
      "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry", "Ivy",
      "Jack", "Kelly", "Liam", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Ryan",
      "Sophia", "Thomas", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zane",
    ];
    const lastNames = [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
      "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson",
      "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez",
      "Thompson", "White", "Harris", "Sanchez", "Clark",
    ];
    const profilePicUrls = [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAJEkJQ1WumU0hXNpXdgBt9NUKc0QDVIiaw&s",
      "https://wallpapers.com/images/hd/cool-profile-picture-ld8f4n1qemczkrig.jpg",
      "https://w0.peakpx.com/wallpaper/35/34/HD-wallpaper-cool-profile-purple-astronaut.jpg",
      "https://wallpapers.com/images/hd/cool-profile-picture-87h46gcobjl5e4xu.jpg",
      "https://mrwallpaper.com/images/hd/cool-profile-pictures-panda-man-gsl2ntkjj3hrk84s.jpg",
      "https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
      "https://i.pinimg.com/236x/c8/d0/9d/c8d09dccfb7518fc483caa701bf4e248.jpg",
      "https://i.pinimg.com/736x/d7/f3/ac/d7f3ac53a20111f8d4e0726af6a6361a.jpg",
      "https://mrwallpaper.com/images/hd/cool-profile-pictures-rick-8o5nmkicyeiq0brq.jpg",
      "https://wallpapers.com/images/featured/dope-profile-pictures-spz3j1d2sx4sreog.jpg",
    ];
  
    // Simple deterministic pseudo-random number generator (PRNG)
    function seededRandom(seed: number): number {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }
  
    // Use seed to select elements deterministically
    const firstNameIndex = Math.floor(seededRandom(seed) * firstNames.length);
    const lastNameIndex = Math.floor(seededRandom(seed + 1) * lastNames.length);
    const profilePicIndex = Math.floor(seededRandom(seed + 2) * profilePicUrls.length);
  
    return {
      firstName: firstNames[firstNameIndex],
      lastName: lastNames[lastNameIndex],
      fullName: `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`,
      image: profilePicUrls[profilePicIndex],
    };
  }