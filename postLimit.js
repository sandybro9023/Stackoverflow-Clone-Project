import { findById } from "../models/User";

export default async function (req, res, next) {
  const user = await findById(req.user.id);
  const today = new Date().toDateString();

  if (!user.friends.length)
    return res.status(403).json({ msg: "Add friends to post" });

  if (user.lastPostDate?.toDateString() !== today) {
    user.postCountToday = 0;
  }

  let limit = 1;
  if (user.friends.length === 2) limit = 2;
  if (user.friends.length > 10) limit = Infinity;

  if (user.postCountToday >= limit)
    return res.status(403).json({ msg: "Daily limit reached" });

  next();
};
