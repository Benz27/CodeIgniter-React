# CodeIgniter SQLite3 Backend with React Front-End

This repository contains a CodeIgniter backend powered by SQLite3, paired with a static single-page React application for the front-end interface. The setup is designed for simplicity and ease of use, allowing developers to quickly get started with a full-stack application.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## Features

- **Lightweight Backend**: Built with CodeIgniter for a robust and efficient backend experience.
- **SQLite3 Database**: Simple file-based database for easy data management.
- **React Front-End**: A static, single-page application built with React for a responsive user interface.

## Requirements

Before you begin, ensure you have met the following requirements:

- PHP 7.4 or higher
- Composer
- SQLite3 extension enabled in your `php.ini` file

## Installation

To set up the application, follow these steps:

1. **Install Composer**: Download and install Composer from [getcomposer.org](https://getcomposer.org/download/).

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/Benz27/CodeIgniter-React.git
   cd codeigniter_exam
3. **Install Dependencies**: Run the following command in your terminal:
   ```bash
   composer install
4. **Enable SQLite3**: Ensure the SQLite3 extension is enabled in your php.ini file. You can find this file in your PHP installation directory. Look for the line:
   ;extension=sqlite3

   Remove the semicolon (;) to uncomment it:

   extension=sqlite3

## Running the Application

To start the application, use the built-in PHP server:

1. Run the following command in your terminal:
   ```bash
   php spark serve

2. Open your web browser and navigate to:
   http://localhost:8080
