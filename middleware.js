const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    // console.log( req.session.redirectUrl)
    req.flash("error", "you must be loged in to create listngs");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you dont have permission to delete");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.valdateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let erMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, erMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let erMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, erMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
