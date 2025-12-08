const auth = require('../auth')
const bcrypt = require('bcryptjs')
const { createDatabaseManager } = require('../db/create-Database-Manager'); 
const dbManager = createDatabaseManager();

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await dbManager.getUserById(userId);

        if (!loggedInUser) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "User not found"
            })
        }

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        })
    } catch (error) {
        console.log("error: " + error);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                errorMessage: "Please enter all required fields." 
            });
        }

        const existingUser = await dbManager.getUserByEmail(email); 
        if (!existingUser) {
            return res.status(401).json({
                errorMessage: "Wrong email or password provided."
            })
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res.status(401).json({
                errorMessage: "Wrong email or password provided."
            })
        }

        // LOGIN THE USER
        let userId;
        if (existingUser._id) {
            userId = existingUser._id;
        } else if (existingUser.id) {
            userId = existingUser.id;
        } else {
            throw new Error("Could not find user ID");
        }
        
        const token = auth.signToken(userId);
        console.log("Token created successfully");

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                email: existingUser.email              
            }
        })

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    try {
        const { userName, email, password, passwordVerify, avatar } = req.body;
        console.log("create user: " + userName + " " + email + " " + password + " " + passwordVerify);
        if (!userNameName || !email || !password || !passwordVerify || !avatar) {
            return res.status(400).json({ 
                errorMessage: "Please enter all required fields." 
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                errorMessage: "Please enter a password of at least 8 characters."
            });
        }
        if (password !== passwordVerify) {
            return res.status(400).json({
                errorMessage: "Please enter the same password twice."
            })
        }
        const existingUser = await dbManager.getUserByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        if (!avatar.startsWith('data:image/')) {
            return res.status(400).json({
                errorMessage: "Invalid avatar format. Please upload an image."
            });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await dbManager.createUser({userName, email, passwordHash, avatar});
        console.log("new user saved:", newUser);

        // LOGIN THE USER
        let userId;
        if (newUser._id) {
            userId = newUser._id;
        } else if (newUser.id) {
            userId = newUser.id;
        } else {
            throw new Error("Could not find user ID in new user");
        }

        const token = auth.signToken(userId);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: newUser.userName,   
                email: newUser.email,
                avatar: newUser.avatar          
            }
        });


    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

updateUser = async (req, res) => {
    try {
        const { userName, password, passwordVerify, avatar } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                errorMessage: "Unauthorized"
            });
        }

        const user = await dbManager.getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                errorMessage: "The user was not found"
            });
        }

        if (userName !== undefined) {
            if (!userName.trim()) {
                return res.status(400).json({
                    errorMessage: "The username cannot be empty"
                });
            }
            user.userName = userName;
        }

        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    errorMessage: "The password must be at least 8 characters long"
                });
            }

            if (password !== passwordVerify) {
                return res.status(400).json({
                    errorMessage: "The passwords do not match"
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(password, salt);
        }

        if (avatar) {
            if (!avatar.startsWith('data:image/')) {
                return res.status(400).json({
                    errorMessage: "Invalid avatar data format"
                });
            } 
            user.avatar = avatar;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            user: {
                userName: user.userName,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error("There was an error updating the user: ", error);
        res.status(500).json({
            success: false,
            errorMessage: "Internal server error"
        });
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    updateUser
}