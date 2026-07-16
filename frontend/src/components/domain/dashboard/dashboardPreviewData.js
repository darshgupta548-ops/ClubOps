export const dashboardPreviewData = {
  timelineEvent: {
    title: 'Star Night 2026',
    date: 'Friday, 14 February · 7:30 PM',
    venue: 'Rooftop Observatory',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    steps: [
      { label: 'Event plan', detail: 'Run of show is ready', state: 'complete' },
      { label: 'Budget review', detail: 'Two items need approval', state: 'current' },
      { label: 'Resources', detail: 'Allocation opens next', state: 'pending' },
      { label: 'Event day', detail: '14 February', state: 'pending' },
      { label: 'Post event', detail: 'Report and archive', state: 'pending' },
    ],
  },
  modules: [
    { id: 'plan', title: 'Plan Event', eyebrow: 'Create & organise', tone: 'brass', floatDelay: 0.2, preview: { draftEvent: 'Star Night 2026', planningPhase: 'Budget Review', nextAction: 'Approve venue booking', draftSaved: true } },
    { id: 'active', title: 'Active Event', eyebrow: 'In progress', tone: 'blue', floatDelay: 1.7, preview: { event: 'Star Night 2026', phase: 'Budget review', date: '14 Feb', pendingTasks: 3 } },
    { id: 'budget', title: 'Budget', eyebrow: 'Finance', tone: 'neutral', floatDelay: 0.8, preview: { allocated: '₹5,000', spent: '₹2,750', remaining: '₹2,250', progress: 55, nextExpense: 'Venue deposit ₹1,500', budgetHealth: 'On track' } },
    { id: 'resources', title: 'Resources', eyebrow: 'Operations', tone: 'neutral', floatDelay: 2.4, preview: { available: '12', reserved: '8', requests: '2', recentReservations: [{ name: 'PA System', status: 'confirmed' }, { name: 'Projector', status: 'confirmed' }], awaitingApproval: [{ name: 'Lighting kit', status: 'pending' }] } },
    { id: 'documentation', title: 'Documentation', eyebrow: 'Post-event', tone: 'blue', floatDelay: 1.2, preview: { pendingReports: '2', lastReport: 'Nebula Nights', recentActivity: ['Tech report submitted', 'Photo archive updated'], reviewQueue: '3 reports awaiting review', exportHistory: 'Last export: 2 days ago' } },
    { id: 'gallery', title: 'Image Gallery', eyebrow: 'Visual archive', tone: 'brass', floatDelay: 2.9, preview: { albums: [{ title: 'Star Night 2026', photos: 128, videos: 6, date: '14 Feb 2026', art: 'aurora' }, { title: 'Deep Sky Session', photos: 42, videos: 0, date: '8 Mar 2026', art: 'deep-sky' }, { title: 'Nebula Nights', photos: 73, videos: 3, date: '22 Jan 2026', art: 'nebula' }, { title: 'Telescope Workshop', photos: 31, videos: 2, date: '15 Feb 2026', art: 'telescope' }, { title: 'Galaxy Watch', photos: 58, videos: 4, date: '10 Dec 2025', art: 'galaxy' }] } },
  ],
};
