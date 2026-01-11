# Anagram Helper

A powerful, interactive web application designed to help you solve anagram puzzles with ease. Built with React and modern web technologies, it features a responsive, premium interface for managing and solving multiple anagrams simultaneously.

![Anagram Helper Screenshot](https://raw.githubusercontent.com/bryans99/anagram_helper/main/public/screenshot.png)
*(Note: Screenshot to be added)*

## Features

- **Interactive Solver**: Visualizes letter slots and available pool.
- **Smart Configuration**:
  - Automatically configured target length (1-15 characters).
  - Auto-updates anagram name based on your letter pool.
  - "Lock" known letters in specific positions by typing directly into the slots.
- **Management**: Create, delete, and switch between multiple anagram puzzles.
- **Responsive Design**: Optimized for both desktop and mobile use, with a collapsible sidebar and touch-friendly controls.
- **Persistence**: Your data is automatically saved to your browser's local storage, so you never lose your progress.
- **Premium Theme**: Modern "Ocean Blue" aesthetic with smooth animations and glassmorphism effects.

## Live Demo

[View the Live Application](https://bryans99.github.io/anagram_helper/)

## Technologies Used

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks + LocalStorage
- **Language**: TypeScript

## Getting Started

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

## Usage Guide

1.  **Create an Anagram**: Click "New Anagram" in the sidebar.
2.  **Set Constraints**:
    - Use the slider or type in the "Available Letters" input to set the target word length.
    - Providing the pool of letters will automatically adjust the length if needed.
3.  **Lock Letters**: If you know a letter is in a specific position (e.g., starts with 'S'), click the first box and type 'S'. It will turn blue to indicate it is locked.
4.  **Shuffle**: Click the "Shuffle Letters" button to randomly arrange the remaining unknown letters into the empty slots. This helps visualize potential words.
5.  **Clear**: Use "Clear Locked" to reset all known positions while keeping your letter pool.

## License

This project is open source.
