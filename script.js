const express = require("express");
const { connectDb } = require("./config/db");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDb();

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, bio, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      bio,
      gender,
    });

    await user.save();
    res.send("User added succesfully " + user);
  } catch (err) {
    res.status(400).send("Cannot add User " + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // If user is not presented
    if (!user) {
      res.status(400).send("User Not Found");
    }

    // Password Validation
    const isPassswordValid = await user.validatePassword(password);
    if (isPassswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("User Logged In with JWT Token");
    } else {
      res.send("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Cannot add User " + err);
  }
});

app.get("/users", userAuth, async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Cannot get" + err);
  }
});

app.delete("/delete/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting user: " + err.message);
  }
});

app.patch("/update/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully:\n" + updatedUser);
  } catch (err) {
    res.status(400).send("Error updating user: " + err.message);
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
