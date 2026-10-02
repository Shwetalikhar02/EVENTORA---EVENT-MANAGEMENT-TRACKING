const Event = require('../models/Event');

// Knowledge base topics and response templates
const KNOWLEDGE_BASE = {
    onboarding: {
        keywords: ['fresher', 'new', 'start', 'begin', 'overview', 'what is eventora', 'how it works', 'guide', 'welcome', 'first time'],
        title: '👋 Welcome to Eventora! Here is your Fresher Starter Guide:',
        answer: `**Eventora** is an all-in-one Event Booking & Management Platform built for seamless event discovery, ticket reservations, and management.

Here is how you can get started as a new visitor:
1. 📝 **Create an Account**: Click **Sign Up** to create your profile. You will receive an OTP in your email to activate your account.
2. 🔍 **Browse Events**: Explore Tech Conferences, Music Concerts, Workshops, Sports, and more on the Home page.
3. 🎟️ **Book Tickets**: Choose an event and request tickets! Booking requires a mandatory 2FA OTP sent to your email for security.
4. 📊 **Track Status**: Check your **User Dashboard** to track your booking requests (Pending ⏳, Confirmed ✅, or Cancelled ❌).
5. 🛡️ **Role-Based Access**: Admins handle event creation, ticket verification, and payment confirmation.

Need quick navigation? Choose an option below!`,
        actions: [
            { text: '🚀 Sign Up Now', path: '/register' },
            { text: '📅 Browse Events', path: '/' },
            { text: '🔑 Login to Account', path: '/login' }
        ]
    },
    registration: {
        keywords: ['register', 'signup', 'create account', 'otp', 'verification', '2fa', 'email code', 'sign up'],
        title: '🔑 Registration & 2FA OTP Verification',
        answer: `Registration on Eventora is quick and secure:

- **Step 1**: Go to the **Sign Up** page and enter your Name, Email, and Password.
- **Step 2**: An automated 6-digit **OTP (One-Time Password)** will be sent to your registered Gmail.
- **Step 3**: Enter the OTP on the verification screen to activate your account.
- **2FA Security**: Note that when booking tickets for any event, Eventora also requires a mandatory 2FA OTP verification step to ensure authentic registrations!`,
        actions: [
            { text: 'Go to Sign Up', path: '/register' },
            { text: 'Go to Login', path: '/login' }
        ]
    },
    booking: {
        keywords: ['book', 'ticket', 'reserve', 'buy', 'how to book', 'seat', 'booking process'],
        title: '🎟️ How to Book Tickets on Eventora',
        answer: `Follow these simple steps to reserve your ticket for any event:

1. Browse the **Events** page and click **View Details & Book** on the event you want to attend.
2. Click the **Book Ticket** button.
3. Check your registered email for a 6-digit **Security OTP**.
4. Enter the OTP into the popup modal to authorize your ticket request.
5. Your booking is placed in **Pending** status while the Event Admin verifies seating and payment (for paid events).
6. Once approved, your status updates to **Confirmed** and you receive a confirmation email!`,
        actions: [
            { text: 'Browse Events Now', path: '/' },
            { text: 'View My Bookings', path: '/dashboard' }
        ]
    },
    roles: {
        keywords: ['role', 'admin', 'user', 'manager', 'permissions', 'organizer', 'who can create', 'privilege'],
        title: '🛡️ Eventora User Roles & Permissions',
        answer: `Eventora features two main roles:

- 👤 **Student / Regular User**:
  - Browse all active public events.
  - Request free and paid event tickets using 2FA OTP.
  - View personal booking history & statuses on User Dashboard.
  - Cancel pending/confirmed bookings if needed.

- 👑 **Event Admin / Organizer**:
  - Create new events with custom pricing, capacity, category, image, and dates.
  - Edit or delete existing events.
  - View live analytics (Total Revenue, Pending Requests, Confirmed Attendees).
  - Review incoming booking requests and mark them as 'Paid' or 'Confirmed'.`,
        actions: [
            { text: 'View Dashboard', path: '/dashboard' },
            { text: 'Admin Panel', path: '/admin' }
        ]
    },
    payment: {
        keywords: ['payment', 'price', 'paid', 'cost', 'fee', 'charge', 'money', 'free', 'how to pay'],
        title: '💳 Event Pricing & Payment Verification',
        answer: `Here is how payments work on Eventora:

- **Free Events**: You can request tickets instantly without any fee. Requests enter Pending queue for admin verification.
- **Paid Events**: Ticket prices are displayed on the event card. When you request a ticket with OTP, your booking enters the **Pending** queue.
- **Verification**: The event organizer/admin confirms receipt of payment and updates your booking status to **Confirmed (Paid)**.
- **Receipt Notification**: As soon as payment is marked confirmed, you receive an automated confirmation email!`,
        actions: [
            { text: 'Check Pending Bookings', path: '/dashboard' }
        ]
    },
    troubleshooting: {
        keywords: ['problem', 'issue', 'otp not', 'error', 'support', 'contact', 'forgot', 'not receiving', 'help'],
        title: '🆘 Troubleshooting & FAQs',
        answer: `Common solutions for quick fixes:

- 📧 **Didn't receive OTP?** Check your Spam / Junk folder in Gmail. Make sure your email address was spelled correctly.
- 🔒 **Login Issues?** If your account was registered but unverified, attempting to log in will prompt you for OTP verification again.
- ⏳ **Booking Pending too long?** Event admins manually verify ticket requests and payments. Contact the event organizer for urgent access.
- ❌ **Need to cancel?** Navigate to your **User Dashboard** and click 'Cancel Booking'. Seating capacity will automatically update!`,
        actions: [
            { text: 'Go to My Dashboard', path: '/dashboard' }
        ]
    }
};

// Handle Chatbot Queries
exports.askChatbot = async (req, res) => {
    try {
        const { message, user } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Please provide a prompt or question.' });
        }

        const query = message.toLowerCase().trim();

        // 1. Check for live events lookup queries
        const isEventQuery = ['event', 'events', 'workshop', 'show', 'concert', 'schedule', 'available', 'upcoming', 'tech', 'music', 'sports', 'business', 'arts', 'happen', 'what events'].some(w => query.includes(w));

        if (isEventQuery && !query.includes('how to book') && !query.includes('how does booking work')) {
            // Extract potential category filter
            let categoryFilter = null;
            const categories = ['tech', 'music', 'sports', 'workshop', 'business', 'arts'];
            categories.forEach(cat => {
                if (query.includes(cat)) categoryFilter = cat;
            });

            const dbFilter = {};
            if (categoryFilter) {
                dbFilter.category = { $regex: categoryFilter, $options: 'i' };
            }

            const events = await Event.find(dbFilter).limit(5).select('title description category ticketPrice availableSeats totalSeats date location image');

            if (events && events.length > 0) {
                const eventCards = events.map(e => ({
                    id: e._id,
                    title: e.title,
                    category: e.category,
                    price: e.ticketPrice === 0 ? 'Free' : `₹${e.ticketPrice}`,
                    seats: `${e.availableSeats}/${e.totalSeats} seats left`,
                    date: e.date ? new Date(e.date).toLocaleDateString() : 'TBA',
                    location: e.location || 'Campus Main Hall',
                    image: e.image
                }));

                return res.json({
                    reply: `📅 Here are the upcoming events matching your request (${events.length} found):`,
                    events: eventCards,
                    actions: [
                        { text: '🔍 View All Events', path: '/' },
                        { text: '🎟️ How to Book Tickets', path: '#faq-booking' }
                    ]
                });
            } else {
                return res.json({
                    reply: categoryFilter 
                        ? `I searched for **${categoryFilter.toUpperCase()}** events, but there are currently no active events in this category. Would you like to view all public events?`
                        : `There are currently no active events listed in the database. Event Admins can add new events anytime from the Admin Dashboard!`,
                    actions: [
                        { text: '📅 View All Events', path: '/' },
                        { text: '👑 Admin Panel', path: '/admin' }
                    ]
                });
            }
        }

        // 2. Check predefined knowledge base matching
        for (const key in KNOWLEDGE_BASE) {
            const topic = KNOWLEDGE_BASE[key];
            const hasMatch = topic.keywords.some(kw => query.includes(kw));

            if (hasMatch) {
                let personalizedGreeting = '';
                if (user && user.name) {
                    personalizedGreeting = `Hi **${user.name}**! `;
                }

                return res.json({
                    reply: personalizedGreeting + topic.title + '\n\n' + topic.answer,
                    actions: topic.actions
                });
            }
        }

        // 3. Optional: AI LLM Provider Hook (if GEMINI_API_KEY or OPENAI_API_KEY is configured in env)
        if (process.env.GEMINI_API_KEY) {
            try {
                const responseText = await callGeminiAPI(message, user);
                if (responseText) {
                    return res.json({
                        reply: responseText,
                        actions: [
                            { text: '📅 Browse Events', path: '/' },
                            { text: '🚀 Sign Up', path: '/register' }
                        ]
                    });
                }
            } catch (err) {
                console.warn('Gemini API call failed, using smart fallback logic:', err.message);
            }
        }

        // 4. Smart Default Onboarding Fallback for general questions
        return res.json({
            reply: `I'm your **Eventora AI Helper**! I'm here to assist freshers and visitors with navigating Eventora.

You can ask me questions such as:
- 🚀 *"How do I register as a fresher?"*
- 🎟️ *"How do ticket bookings and 2FA OTP work?"*
- 📅 *"What active events are scheduled?"*
- 💳 *"How do payments and admin approvals work?"*
- 🛡️ *"What is the difference between User and Admin roles?"*

What would you like assistance with?`,
            actions: [
                { text: '🚀 Onboarding Guide', path: '#faq-onboarding' },
                { text: '📅 View Live Events', path: '/' },
                { text: '🎟️ Booking Process', path: '#faq-booking' }
            ]
        });

    } catch (error) {
        console.error('Error in chatbot controller:', error);
        res.status(500).json({
            reply: 'Sorry, I ran into an error processing your query. Please try again or explore the platform using the menu options.',
            actions: [{ text: 'Go to Home', path: '/' }]
        });
    }
};

// Helper function to invoke Google Gemini if API Key exists
async function callGeminiAPI(prompt, user) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are the AI Assistant for Eventora, a full-stack event management and ticket booking web app.
Key app facts:
- Registration requires Email OTP 2FA.
- Ticket booking requires mandatory Email OTP 2FA verification.
- Roles: Users (browse, book with OTP, track status in dashboard, cancel) & Admins (create/edit/delete events, confirm/reject bookings, mark paid, view revenue analytics).
- User name: ${user ? user.name : 'Visitor / Fresher'}.
Respond concisely, politely, and helpfully with markdown formatting.`;

    const result = await model.generateContent([systemPrompt, prompt]);
    return result.response.text();
}
