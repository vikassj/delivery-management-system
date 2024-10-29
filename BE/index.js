const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

// Create an Express app
const app = express();
const port = 4000;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection URL (Replace <username> and <password> with your Atlas credentials)
const url =
  "mongodb+srv://vikassangwan652:vikas12@cluster0.tsjn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);

// Database Name
const dbName = "vehicleDb";

let db;

// Connect to MongoDB Atlas and run the server
async function main() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas");

    db = client.db(dbName);
    const userCollection = db.collection("users");

    // Start the Express server
    // app.listen(port, () => {
    //   console.log(`Server running at http://localhost:${port}`);
    // });
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);

// Create an HTTP server 
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Create the create_component endpoint
app.post("/api/create_component", async (req, res) => {
  const { name, newPrice, repairPrice } = req.body;
   
    
  // Validate input
  if (!name || newPrice == null || repairPrice == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create a new component object
    const newComponent = {
      name,
      newPrice,
      repairPrice,
      createdAt: new Date(),
    };

    // Insert the new component into the components collection
    const result = await db.collection("components").insertOne(newComponent);

    // Return the newly created component ID and details
    res.status(201).json({ id: result.insertedId, ...newComponent });
  } catch (error) {
    console.error("Error creating component:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch All Components API
app.get("/api/components", async (req, res) => {
    try {
        // Fetch all components from the collection
        const components = await db.collection("components").find({}).toArray();

        // Map to return only the desired fields
        const formattedComponents = components.map(({ name, newPrice, repairPrice }) => ({
            name,
            newPrice,
            repairPrice,
        }));

        // Return the components
        res.json(formattedComponents);
    } catch (error) {
        console.error("Error fetching components:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create Issue API
app.post("/api/create_issue", async (req, res) => {
    const { vehicleModel, componentName, issueType, quantity, unitPrice } = req.body;

    // Check if all fields are provided
    if (!vehicleModel || !componentName || !issueType || quantity === undefined || unitPrice === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Calculate total price
    const totalPrice = quantity * unitPrice;

    try {
        // Create issue object
        const newIssue = {
            vehicleModel,
            componentName,
            issueType,
            quantity,
            unitPrice,
            totalPrice,
        };

        // Insert the new issue into the MongoDB collection
        const result = await db.collection("issues").insertOne(newIssue);

        // Return success message and the created issue
        res.json({
            message: "Issue created successfully",
            issue: {
                ...newIssue,
                _id: result.insertedId, // include the MongoDB generated ID
            },
        });
    } catch (error) {
        console.error("Error creating issue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch Issues API
app.get("/api/get_issues", async (req, res) => {
    try {
        // Retrieve all issues from the MongoDB collection
        const issues = await db.collection("issues").find({}).toArray();

        // Map the issues to the desired format
        const formattedIssues = issues.map(issue => ({
            vehicleModel: issue.vehicleModel,
            componentName: issue.componentName,
            issueType: issue.issueType,
            quantity: issue.quantity,
            unitPrice: issue.unitPrice
        }));

        // Return the formatted issues
        res.json(formattedIssues);
    } catch (error) {
        console.error("Error fetching issues:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API to store vehicle details
app.post("/api/store_vehicle", async (req, res) => {
    const { vehicleNumber, repairDescription } = req.body;

    // Validate the request body
    if (!vehicleNumber || !repairDescription) {
        return res.status(400).json({ error: "Both vehicle number and repair description are required" });
    }

    try {
        // Create a new vehicle object
        const newVehicle = {
            vehicleNumber,
            repairDescription,
            createdAt: new Date()  // Optional: track when the record was created
        };

        // Insert the new vehicle into the MongoDB collection
        const result = await db.collection("vehicles").insertOne(newVehicle);

        // Return the newly created vehicle ID and details
        res.status(201).json({ id: result.insertedId, ...newVehicle });
    } catch (error) {
        console.error("Error storing vehicle:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API to fetch all vehicles
app.get("/api/get_vehicles", async (req, res) => {
    try {
        // Fetch all vehicles from the MongoDB collection
        const vehicles = await db.collection("vehicles").find({}).toArray();

        // Map the vehicles to the desired format
        const formattedVehicles = vehicles.map(vehicle => ({
            vehicleNumber: vehicle.vehicleNumber,
            repairDescription: vehicle.repairDescription
        }));

        // Return the formatted vehicles
        res.json(formattedVehicles);
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// API to fetch user data/ create User data
app.post("/api/login", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    // Check if the user already exists in the collection
    const user = await db.collection("users").findOne({ name });

    if (user) {
      // If user exists, return the user ID and name
      res.json({ id: user._id, name: user.name });
    } else {
      // If user doesn't exist, create a new user with a unique ID
      const newUser = {
        name,
        createdAt: new Date(),
      };

      const result = await db.collection("users").insertOne(newUser);

      // Return the newly created user ID and name
      res.json({ id: result.insertedId, name: newUser.name });
    }
  } catch (error) {
    console.error("Error fetching or creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to fetch all users' names
app.get("/api/users", async (req, res) => {
  try {
    // Fetch all users and project only the "name" field
    const users = await db
      .collection("users")
      .find({}, { projection: { name: 1, _id: 1 } })
      .toArray();
    //   const userNames = users.map(user => user.name);
    // Return the list of names
    res.json(users);
  } catch (error) {
    console.error("Error fetching user names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// HTTP route for health check
app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});


