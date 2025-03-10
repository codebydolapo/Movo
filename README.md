# Movo - A Feature-Rich Social Media App with React Native/Expo and Supabase

Movo is a sophisticated social media application meticulously crafted using React Native/Expo for a seamless, cross-platform frontend experience and Supabase as a robust, scalable backend solution. This project was conceived to explore the synergistic capabilities of these cutting-edge technologies, culminating in a functional, engaging, and performant mobile application.

## Project Overview

The development journey of Movo involved navigating the intricacies of backend configuration with Supabase, which, despite being a no-code platform, underscored the inherent complexities of backend development. Conversely, the frontend development using React Native/Expo proved to be a fluid and rewarding process, highlighting the efficiency and developer-friendliness of these tools.

Movo boasts a comprehensive suite of features designed to provide a compelling user experience:

-   **Dynamic Welcome Page:** A visually captivating welcome page enriched with fluid Lottie animations, creating an engaging first impression.
-   **Secure Authentication System:** A robust user authentication system, powered by Supabase, facilitating secure sign-in and sign-up processes.
-   **Intuitive Navigation Structure:** A tab-based navigation system inspired by industry-leading social media platforms like Twitter and Instagram, implemented using Expo Router for seamless transitions and navigation.
-   **Rich Post Creation Functionality:** A feature-rich post creation module, leveraging the "React Native Rich Text Editor" for advanced text formatting and "Expo Image Picker" and "Expo Video" for seamless media uploads (images and videos).
-   **Comprehensive Profile Management:** A user-friendly profile management system enabling users to create and edit their profiles, including the ability to update profile pictures.
-   **Interactive Post Viewing Experience:** An immersive post viewing experience facilitated by modal-based displays, allowing users to interact with individual posts in a focused environment.
-   **Realtime Authentication Refresh:** Leveraging AppState to detect app activity, and refresh user auth tokens when the app returns to the foreground.

## Architectural Design and Key Implementations

* **Frontend Architecture:**
    * Movo's frontend architecture is built upon React Native/Expo, enabling rapid development and cross-platform compatibility.
    * Expo Router is employed for efficient routing and navigation, providing a seamless user experience.
    * Lottie animations are integrated to enhance the visual appeal and user engagement.
    * "React Native Rich Text Editor" facilitates rich text input, while "Expo Image Picker" and "Expo Video" enable seamless media uploads.
    * Nativewind and TailwindCSS are utilized for rapid styling and consistent UI design.
    * RNEUI components provide a rich set of pre-built UI elements.
* **Backend Architecture:**
    * Supabase serves as the backend, providing authentication, database, and storage services.
    * Authentication is handled via Supabase's auth service, simplifying user management.
    * Data storage is managed with Supabase's Postgres database, ensuring data integrity and scalability.
    * File storage is handled through Supabase storage.

## Technologies Used

-   **Frontend:**
    -   React Native/Expo
    -   Expo Router
    -   Lottie for animations
    -   React Native Rich Text Editor
    -   Expo Image Picker
    -   Expo Video
    -   Expo AV
    -   React Native Animatable
    -   React Native Vector Icons
    -   React Native Render HTML
    -   React Navigation
    -   React Native Async Storage
    -   React Native Webview
    -   Nativewind
    -   Tailwind CSS
    -   RNEUI
-   **Backend:**
    -   Supabase

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [repository_url]
    cd movo
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Install pods for iOS (if applicable):**

    ```bash
    npx pod-install
    ```

4.  **Set up Supabase:**
    -   Create a Supabase project and obtain your `supabaseUrl` and `anonKey`.
    -   Create a `.env` file in the root of your project and add the following:

        ```
        SUPABASE_URL=your_supabase_url
        SUPABASE_ANON_KEY=your_anon_key
        ```
    -   Configure your Supabase client in the project (see `Supabase Configuration` section below).

5.  **Start the development server:**

    ```bash
    npm start
    ```

6.  **Run on Android or iOS:**

    ```bash
    npm run android
    # or
    npm run ios
    ```

## Supabase Configuration

The project uses Supabase for authentication and data storage. To configure Supabase:

1.  Ensure you have created a `.env` file in the root of your project.
2.  Add your Supabase URL and anonymous key to the `.env` file:

    ```
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_anon_key
    ```

3.  Verify that your Supabase client is correctly configured. Example from the article, with environment variable integration:

```javascript
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig.extra.SUPABASE_URL;
const anonKey = Constants.expoConfig.extra.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

Add your SUPABASE_URL and SUPABASE_ANON_KEY to your app.json or app.config.js in the extra section.
<!-- end list -->

JSON

"extra": {
    "SUPABASE_URL": "your_supabase_url",
    "SUPABASE_ANON_KEY": "your_anon_key"
}
Contributing
Contributions to Movo are welcome! Please feel free to submit pull requests or open issues to contribute to the project.

License
This project is licensed under the MIT License.