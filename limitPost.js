import User from "../models/auth.js";

const checkPostingLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.userid); // Assuming middleware sets req.userId
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date().toDateString();

    // Reset count if it's a new day
    if (user.lastPostDate && user.lastPostDate.toDateString() !== today) {
      user.postCountToday = 0;
    }

    const friendCount = user.friends ? user.friends.length : 0;
    let allowedPosts = 0;

    if (friendCount === 0) allowedPosts = 0;
    else if (friendCount === 1) allowedPosts = 1;
    else if (friendCount === 2) allowedPosts = 2;
    // user said "more than 10 friend they can post multiple time a day" -> unlimited
    // "if they do not have any friends they cannot post anything" -> handled 0 case
    // What about 3-10? User request says: "if the user have 2 friend they can post 2 times a day and if they have more than 10 friend they can post multiple time a day."
    // It skips 3-10 explicitly but implies constraints.
    // The previous plan/prompt interpretation:
    // 0 -> 0
    // 1 -> 1
    // 2 -> 2
    // 3-10 -> 2 (implied fallback or "multiple" meaning unlimited is only >10)
    // >10 -> unlimited
    // Let's stick to strict interpretation of prompt + plan.
    // Plan said: 3-10 -> 2.
    else if (friendCount > 10) allowedPosts = Infinity;
    else allowedPosts = 2; // For 2 to 10 friends (excluding >10 case which is infinity)

    if (user.postCountToday >= allowedPosts) {
        return res.status(403).json({ message: `Daily post limit reached. You have ${friendCount} friends and can post ${allowedPosts === Infinity ? 'unlimited' : allowedPosts} times today.` });
    }

    // Attach user to req to avoid refetching if needed (optional)
    req.userObject = user; 
    next();
  } catch (error) {
    console.error("Error in checkPostingLimit:", error);
    res.status(500).json({ message: "Internal Server Error during limit check" });
  }
};

export default checkPostingLimit;
