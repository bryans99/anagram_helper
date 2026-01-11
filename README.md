# Anagram Helper

A helper to solve anagrams for crosswords. Built with React and modern web technologies, it features a responsive, interface for managing and solving multiple anagrams simultaneously.

![Anagram Helper Screenshot](https://raw.githubusercontent.com/bryans99/anagram_helper/main/public/screenshot.png)
*(Note: Screenshot to be added)*

## Background

The inspiration is the anagram helper for the Guardian crosswords. This was available to the Everyman crossword which is published by the Observer. The Observer was sold and the Everyman crossword was reimagined but unfortunately without an anagram helper. This app was built primarily to help with that but can be used for all crosswords.

Enjoy.

## Usage Guide

1.  **Create an Anagram**: Click "New Anagram" in the sidebar.
2.  **Set Constraints**:
    - Use the slider or type in the "Available Letters" input to set the target word length.
    - Providing the pool of letters will automatically adjust the length if needed.
3.  **Lock Letters**: If you know a letter is in a specific position (e.g., starts with 'S'), click the first box and type 'S'. It will turn blue to indicate it is locked.
4.  **Shuffle**: Click the "Shuffle Letters" button to randomly arrange the remaining unknown letters into the empty slots. This helps visualize potential words.
5.  **Clear**: Use "Clear Locked" to reset all known positions while keeping your letter pool.

## Live Application

[View the Live Application](https://bryans99.github.io/anagram_helper/)

## Build/Run it Yourself

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/bryans99/anagram_helper.git
    cd anagram_helper
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm start
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## License

This project is open source.
