# Holidaze 🏖️
A modern accommodation booking platform built for Noroff Project Exam 2. Holidaze allows users to browse and book venues, while venue managers can list and manage their own properties.

## Links 🔗
| Resource | URL |
|----------|-----|
| Live Site | _Coming soon_ |
| GitHub Repository | https://github.com/idanok/holidaze |
| Kanban Board | https://github.com/users/idanok/projects/15/views/1 |
| Figma Design | https://www.figma.com/design/qB6qMaVuEhnV99Rx80HrWc/Untitled |


## Built With 🛠️
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [Noroff API v2](https://docs.noroff.dev/docs/v2)

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/idanok/holidaze.git
```
2. Navigate into the project folder:
```bash
cd holidaze
```
3. Install dependencies:
```bash
npm install
```
4. Start the development server:

```bash
npm run dev
```
5. Open your browser and go to: http://localhost:5173


## 🏗️ Build for Production
```bash
npm run build
```
The output will be in the `dist/` folder.


## 👤 Features

### All Users
- Browse all venues
- Search for venues by name or description
- View a single venue with details and booked dates

### Customers
- Register and log in with a `stud.noroff.no` email
- Book a venue with check-in/check-out dates and guest count
- View upcoming bookings on the profile page
- Update profile avatar

### Venue Managers
- Register and log in as a venue manager
- Create, edit, and delete venues
- View all bookings made on their venues
- Update profile avatar

## 📁 Project Structure
src/
├── api/              # API calls (auth, venues, bookings)
├── components/
│   ├── layout/       # AppLayout, Header, Footer
│   └── ui/           # VenueCard and other reusable components
├── context/          # AuthContext and useAuth hook
├── pages/            # One file per route
│   └── manager/      # Venue manager pages
├── types/            # TypeScript interfaces
└── utils/            # localStorage helpers

---

## 📋 Noroff API
This project uses the [Noroff API v2](https://docs.noroff.dev/docs/v2). To register an account you must use a `stud.noroff.no` email address.

## 📝 License
This project was created as a school assignment for Noroff Front-End Development.

