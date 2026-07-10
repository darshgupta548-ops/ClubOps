export const dashboardPreviewData = {
  clubName: 'Astronomy Club',
  greeting: 'What needs you right now',
  tasks: [
    { id: 'booking', label: 'Confirm observatory booking for Star Night', meta: 'Due 2:00 PM', priority: true },
    { id: 'budget', label: 'Review budget request from Outreach team', meta: 'Due 4:30 PM' },
    { id: 'rsvp', label: 'Send RSVP reminder to 42 members', meta: 'Due today' },
    { id: 'volunteers', label: 'Approve volunteer shift schedule', meta: 'Done 11:10 AM', done: true },
  ],
  quickActions: ['New Event', 'Draft Report', 'Invite Member', 'Announcement'],
  continueWorking: [
    { title: 'Star Night 2026 — Run of Show', meta: 'Event plan · edited 12m ago' },
    { title: 'Semester Impact Report', meta: 'Draft · edited 1h ago' },
    { title: 'Telescope Workshop Budget', meta: 'Spreadsheet · edited yesterday' },
  ],
  upcomingEvents: [
    { day: '14', month: 'Feb', title: 'Star Night 2026', time: '7:30 PM', venue: 'Rooftop Observatory', attendees: 128 },
    { day: '21', month: 'Feb', title: 'Telescope Building Workshop', time: '4:00 PM', venue: 'Lab 204', attendees: 40 },
    { day: '02', month: 'Mar', title: 'Guest Lecture — Deep Field Imaging', time: '6:00 PM', venue: 'Auditorium A', attendees: 210 },
  ],
  pendingReports: [
    { title: 'Post-Event Report — Nebula Nights', meta: 'Overdue by 1 day', status: 'overdue' },
    { title: 'Monthly Attendance Summary', meta: 'Due in 2 days', status: 'draft' },
    { title: 'Grant Utilization Report', meta: 'Due in 5 days', status: 'draft' },
  ],
};
