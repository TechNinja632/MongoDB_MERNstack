const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // Import CORS

// Create the express app
const app = express();

const cron = require('node-cron');
const axios = require('axios');

// Set up a cron job to ping the URL every 14 minutes
cron.schedule('*/14 * * * *', async () => {
    try {
        const response = await axios.get('https://cback-p76y.onrender.com/api/assignedcomplaints');
        console.log('Ping successful:', response.data);
    } catch (error) {
        console.error('Error pinging the URL:', error.message);
    }
});

// Middleware to enable CORS
app.use(cors()); // Allow requests from any origin
app.use(express.json()); // Middleware to parse incoming JSON requests

// MongoDB Connection
mongoose.connect('mongodb+srv://Username:Password@cluster0.av48khu.mongodb.net/complaints', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema for User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // Default role is 'user'
});

// Mongoose Model for User
const User = mongoose.model('User', userSchema);

const complaintSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: String, required: true }, // Add userId field
    assignedTo: { type: String, default: null },
    status: { type: String, default: 'pending' },
    action: { type: String, default: '' },
});

// Mongoose Model for Complaint
const Complaint = mongoose.model('Complaint', complaintSchema);

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // The user to notify
    message: { type: String, required: true }, // Notification message
    url: { type: String, required: true }, // Notification message
    date: { type: Date, default: Date.now } // Date of notification
});

const Notification = mongoose.model('Notification', notificationSchema);

// Signup API
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Log incoming data for debugging
    console.log('Received Signup Data:', req.body);

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user in the database
        await user.save();

        res.status(200).json({
            id: user._id, // or whatever your user ID field is
            email: user.email,
            name: user.name, // Assuming the user object has a name field
            role:user.role,
            message: 'Signup successful',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Login API
// Login API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Respond with user details
        res.status(200).json({
            id: user._id, // or whatever your user ID field is
            email: user.email,
            name: user.name, // Assuming the user object has a name field
            role:user.role,
            message: 'Login successful',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Complaints API
app.post('/api/complaints', async (req, res) => {
    const { name, date, description, email, userId } = req.body; // Include userId

    // Log incoming data for debugging
    console.log('Received Complaint Data:', req.body);

    try {
        // Create a new complaint
        const complaint = new Complaint({
            name,
            date,
            description,
            email,
            userId // Save userId
        });

        // Save the complaint in the database
        await complaint.save();
        const notification = new Notification({
            userId: '66fa2550e5911c9efdf4f2ad', // Assuming assignedTo is the agent's user ID
            url: `https://complaintss.vercel.app/assigncomplaint`,
            message: `New complaint has registered: ${description}`
        });
        await notification.save();

        res.status(201).json({ message: 'Complaint submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all complaints API
app.get('/api/allcomplaints', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ date: -1 });
        res.status(200).json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get all agents API
app.get('/api/agents', async (req, res) => {
    try {
        const agents = await User.find({ role: 'agent' });
        res.status(200).json(agents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Assign complaint to an agent
app.patch('/api/allcomplaints/:id', async (req, res) => {
    const { id } = req.params;
    const { assignedTo } = req.body; // Get assigned agent ID

    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { assignedTo }, // Update the assignedTo field
            { new: true } // Return the updated document
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        const notification = new Notification({
            userId: assignedTo, // Assuming assignedTo is the agent's user ID
            url: `https://complaintss.vercel.app/complaintdetails/${id}`,
            message: `You have been assigned a new complaint: ${updatedComplaint.description}`
        });
        await notification.save();

        const usernotification = new Notification({
            userId: updatedComplaint.userId, // Assuming assignedTo is the agent's user ID
            url: `https://complaintss.vercel.app/complaintdetails/${id}`,
            message: `Your complaint has been assigned to agent: ${updatedComplaint.description}`
        });
        await usernotification.save();
        sendNotification(
            'New Complaint Assigned',
            `You have been assigned a new complaint: ${updatedComplaint.description}`
        );

        res.status(200).json({ message: 'Complaint assigned successfully', complaint: updatedComplaint });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



app.get('/api/complaints/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find complaints by userId
      const complaints = await Complaint.find({ userId });
      res.status(200).json(complaints);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get assigned complaints API
app.get('/api/assignedcomplaints', async (req, res) => {
    const { assignedto } = req.query; // Get assignedto from query parameters

    if (!assignedto) {
        return res.status(400).json({ message: 'AssignedTo is required' });
    }

    try {
        // Find complaints where assignedTo matches the userId
        const complaints = await Complaint.find({ assignedTo: assignedto }).sort({ date: -1 });
        res.status(200).json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Example in Express.js
app.get('/api/complaintdetails/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const complaint = await Complaint.findById(id); // Adjust based on your database model
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.json(complaint);
    } catch (error) {
        console.error('Error fetching complaint details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


  // Create Agent API
app.post('/api/createagent', async (req, res) => {
    const { name, email, password } = req.body;

    // Log incoming data for debugging
    console.log('Received Create Agent Data:', req.body);

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        // Check if the agent already exists
        let agent = await User.findOne({ email });
        if (agent) {
            return res.status(400).json({ message: 'Agent already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new agent
        agent = new User({
            name,
            email,
            password: hashedPassword,
            role: 'agent' // Set role to 'agent'
        });

        // Save the agent in the database
        await agent.save();

        res.status(201).json({
            id: agent._id,
            email: agent.email,
            name: agent.name,
            role: agent.role,
            message: 'Agent created successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
function sendNotification(title, body) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: 'path/to/icon.png' // Optional: specify an icon for the notification
        });

        notification.onclick = () => {
            // Action to take when the notification is clicked
            console.log('Notification clicked');
            // Optionally redirect to a specific page
            window.open('https://your-app-url.com');
        };
    }
}
// Add this route to handle notifications retrieval
app.get('/api/notifications', async (req, res) => {
    const { userId } = req.query; // Get userId from query parameters

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Find notifications for the specified userId
        const notifications = await Notification.find({ userId }).sort({ date: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Express API route for updating a complaint
app.put('/api/updatecomplaint/:id', async (req, res) => {
    const { status, action } = req.body;
    const { id } = req.params;

    try {
        // Update the complaint in the database
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { status, action, updatedAt: new Date() },
            { new: true } // Return the updated document
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        const notification = new Notification({
            userId: updatedComplaint.userId, // Assuming assignedTo is the agent's user ID
            url: `https://complaintss.vercel.app/complaintdetails/${id}`,
            message: `Your complaint has been resolved: ${updatedComplaint.description}`
        });
        await notification.save();

        res.status(200).json(updatedComplaint);
    } catch (error) {
        console.error('Error updating complaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/user/complaints', async (req, res) => {
    const { userId } = req.query; // Assuming userId is passed as a query parameter

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const complaints = await Complaint.find({ userId }).sort({ date: -1 });
        res.status(200).json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const totalUsers = await User.countDocuments({role:'user'});
        const totalAgents = await User.countDocuments({role:'agent'});
        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

        res.status(200).json({
            totalComplaints,
            pendingComplaints,
            resolvedComplaints,
            totalUsers,
            totalAgents
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/agent/:userId/stats', async (req, res) => {
    const { userId } = req.params; // Get userId from URL parameters

    try {
        const totalAssigned = await Complaint.countDocuments({ assignedTo: userId });
        const resolved = await Complaint.countDocuments({ assignedTo: userId, status: 'Resolved' });

        res.status(200).json({
            totalAssigned,
            resolved
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
