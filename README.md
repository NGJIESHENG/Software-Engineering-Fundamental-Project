# VEMS System: University Venue & Event Management System (VEMS)

## Project Overview
The VEMS System is a full-stack web application designed to streamline the booking and management of university venues. It addresses the challenges of inefficient space utilization and double-bookings by providing a centralized platform with real-time conflict detection.

### Key Features
* **Proactive Venue Explorer**: Search for venues by date, time, type, and capacity.
* **ScheduleEngine**: A custom backend logic that prevents overlapping bookings using interval analysis.
* **Administrative Dashboard**: Comprehensive tools for approving/rejecting requests, managing users, and viewing system usage analytics.
* **JWT Security**: Secure authentication and role-based access control for Students, Organizers, Lecturers, and Admins.

---

## Technical Stack
- **Frontend**: React.js, Axios, Recharts (for analytics)
- **Backend**: Python Flask, Flask-SQLAlchemy, Flask-JWT-Extended
- **Database**: SQLite3
- **Version Control**: Git/GitHub

---

## Installation & Setup Guide

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)

### 2. Backend Setup
Navigate to the `vems-backend` directory:
```bash
cd vems-backend
pip install -r all requirement.txt
python app.py
