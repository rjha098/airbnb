const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLogedIn, isOwner, valdateListing } = require("../middleware.js");

const listingControler = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// create route
// index route
router
  .route("/")
  .get(wrapAsync(listingControler.index))
  .post(
    isLogedIn,
    upload.single("listing[image]"),
    valdateListing,
    wrapAsync(listingControler.createListing)
  );

// new route
router.get("/new", isLogedIn, listingControler.renderNewForm);

// delete route
// show route
// update route
router
  .route("/:id")
  .put(
    isLogedIn,
    isOwner,
    upload.single("listing[image]"),
    valdateListing,
    wrapAsync(listingControler.updateListing)
  )
  .get(wrapAsync(listingControler.showListings))
  .delete(isLogedIn, isOwner, wrapAsync(listingControler.destroyListing));

// edit route

router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  wrapAsync(listingControler.renderEditForm)
);

module.exports = router;
